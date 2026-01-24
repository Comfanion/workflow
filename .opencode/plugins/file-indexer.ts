import type { Plugin } from "@opencode-ai/plugin"
import path from "path"
import fs from "fs/promises"
import fsSync from "fs"

/**
 * File Indexer Plugin
 * 
 * Automatically manages semantic search indexes:
 * - On plugin load (opencode startup): freshen existing indexes
 * - On file edit: queue file for reindexing (debounced)
 * 
 * Configuration in .opencode/config.yaml:
 *   vectorizer:
 *     enabled: true       # Master switch
 *     auto_index: true    # Enable this plugin
 *     debounce_ms: 1000   # Wait time before indexing
 * 
 * Debug mode: set DEBUG=file-indexer or DEBUG=* to see logs
 */

const DEBUG = process.env.DEBUG?.includes('file-indexer') || process.env.DEBUG === '*'

let logFilePath: string | null = null

// Log to file only
function logFile(msg: string): void {
  if (logFilePath) {
    const timestamp = new Date().toISOString().slice(11, 19)
    fsSync.appendFileSync(logFilePath, `${timestamp} ${msg}\n`)
  }
}

// Log to file, console only in debug mode
function log(msg: string): void {
  if (DEBUG) console.log(`[file-indexer] ${msg}`)
  logFile(msg)
}

function debug(msg: string): void {
  if (DEBUG) log(msg)
}

// Default config (used if config.yaml is missing or invalid)
const DEFAULT_CONFIG = {
  enabled: true,
  auto_index: true,
  debounce_ms: 1000,
  indexes: {
    code: { enabled: true, extensions: ['.js', '.ts', '.jsx', '.tsx', '.py', '.go', '.rs', '.java', '.kt', '.swift', '.c', '.cpp', '.h', '.hpp', '.cs', '.rb', '.php', '.scala', '.clj'] },
    docs: { enabled: true, extensions: ['.md', '.mdx', '.txt', '.rst', '.adoc'] },
    config: { enabled: false, extensions: ['.yaml', '.yml', '.json', '.toml', '.ini', '.xml'] },
  },
  exclude: [
    // Build & deps (dot-folders like .git, .claude, .idea are already ignored by glob default)
    'node_modules', 'vendor', 'dist', 'build', 'out', '__pycache__',
  ],
}

interface VectorizerConfig {
  enabled: boolean
  auto_index: boolean
  debounce_ms: number
  indexes: Record<string, { enabled: boolean; extensions: string[] }>
  exclude: string[]
}

// Fun messages based on file count and language
const FUN_MESSAGES = {
  en: {
    indexing: (files: number) => `Indexing ${files} files...`,
    fun: (files: number, mins: number) => {
      if (files < 20) return `Quick coffee? ☕`
      if (files < 100) return `~${mins}min. Stretch break? 🧘`
      if (files < 500) return `~${mins}min. Make coffee ☕ and relax 🛋️`
      return `~${mins}min. Go touch grass 🌿 or take a nap 😴`
    },
    done: (files: number, duration: string) => {
      if (files < 20) return `Done! ${files} files in ${duration}. Fast! 🚀`
      if (files < 100) return `Indexed ${files} files in ${duration}. Let's go! 🎸`
      return `${files} files in ${duration}. Worth the wait! 🎉`
    },
    fresh: () => `Everything's fresh! Nothing to do 😎`,
    error: (msg: string) => `Oops! ${msg} 😬`
  },
  uk: {
    indexing: (files: number) => `Індексую ${files} файлів...`,
    fun: (files: number, mins: number) => {
      if (files < 20) return `Швидка кава? ☕`
      if (files < 100) return `~${mins}хв. Розімнись! 🧘`
      if (files < 500) return `~${mins}хв. Зроби каву ☕ і відпочинь 🛋️`
      return `~${mins}хв. Йди погуляй 🌿 або поспи 😴`
    },
    done: (files: number, duration: string) => {
      if (files < 20) return `Готово! ${files} файлів за ${duration}. Швидко! 🚀`
      if (files < 100) return `${files} файлів за ${duration}. Поїхали! 🎸`
      return `${files} файлів за ${duration}. Варто було чекати! 🎉`
    },
    fresh: () => `Все свіже! Нічого робити 😎`,
    error: (msg: string) => `Ой! ${msg} 😬`
  },
  ru: {
    indexing: (files: number) => `Индексирую ${files} файлов...`,
    fun: (files: number, mins: number) => {
      if (files < 20) return `Кофе? ☕`
      if (files < 100) return `~${mins}мин. Разомнись! 🧘`
      if (files < 500) return `~${mins}мин. Сделай кофе ☕ и отдохни 🛋️`
      return `~${mins}мин. Иди погуляй 🌿 или поспи 😴`
    },
    done: (files: number, duration: string) => {
      if (files < 20) return `Готово! ${files} файлов за ${duration}. Быстро! 🚀`
      if (files < 100) return `${files} файлов за ${duration}. Поехали! 🎸`
      return `${files} файлов за ${duration}. Стоило подождать! 🎉`
    },
    fresh: () => `Всё свежее! Делать нечего 😎`,
    error: (msg: string) => `Ой! ${msg} 😬`
  }
}

type Lang = keyof typeof FUN_MESSAGES

async function getLanguage(projectRoot: string): Promise<Lang> {
  try {
    const configPath = path.join(projectRoot, ".opencode", "config.yaml")
    const content = await fs.readFile(configPath, 'utf8')
    const match = content.match(/communication_language:\s*["']?(\w+)["']?/i)
    const lang = match?.[1]?.toLowerCase()
    if (lang === 'ukrainian' || lang === 'uk') return 'uk'
    if (lang === 'russian' || lang === 'ru') return 'ru'
    return 'en'
  } catch {
    return 'en'
  }
}

function estimateTime(fileCount: number): number {
  // Model loading: ~30 sec, then ~0.5 sec per file
  const modelLoadTime = 30 // seconds
  const perFileTime = 0.5 // seconds
  const totalSeconds = modelLoadTime + (fileCount * perFileTime)
  return Math.ceil(totalSeconds / 60) // minutes
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`
  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
}

const pendingFiles: Map<string, { indexName: string; timestamp: number }> = new Map()

async function loadConfig(projectRoot: string): Promise<VectorizerConfig> {
  try {
    const configPath = path.join(projectRoot, ".opencode", "config.yaml")
    const content = await fs.readFile(configPath, 'utf8')
    
    // Simple YAML parsing for vectorizer section
    const vectorizerMatch = content.match(/vectorizer:\s*\n([\s\S]*?)(?=\n[a-z_]+:|$)/i)
    if (!vectorizerMatch) {
      debug('No vectorizer section in config.yaml, using defaults')
      return DEFAULT_CONFIG
    }
    
    const section = vectorizerMatch[1]
    
    // Parse enabled
    const enabledMatch = section.match(/^\s+enabled:\s*(true|false)/m)
    const enabled = enabledMatch ? enabledMatch[1] === 'true' : DEFAULT_CONFIG.enabled
    
    // Parse auto_index
    const autoIndexMatch = section.match(/^\s+auto_index:\s*(true|false)/m)
    const auto_index = autoIndexMatch ? autoIndexMatch[1] === 'true' : DEFAULT_CONFIG.auto_index
    
    // Parse debounce_ms
    const debounceMatch = section.match(/^\s+debounce_ms:\s*(\d+)/m)
    const debounce_ms = debounceMatch ? parseInt(debounceMatch[1]) : DEFAULT_CONFIG.debounce_ms
    
    // Parse exclude array
    const excludeMatch = section.match(/exclude:\s*\n((?:\s+-\s+.+\n?)+)/m)
    let exclude = DEFAULT_CONFIG.exclude
    if (excludeMatch) {
      exclude = excludeMatch[1].match(/-\s+(.+)/g)?.map(m => m.replace(/^-\s+/, '').trim()) || DEFAULT_CONFIG.exclude
    }
    
    return { enabled, auto_index, debounce_ms, indexes: DEFAULT_CONFIG.indexes, exclude }
  } catch (e) {
    debug(`Failed to load config: ${(e as Error).message}`)
    return DEFAULT_CONFIG
  }
}

function getIndexForFile(filePath: string, config: VectorizerConfig): string | null {
  const ext = path.extname(filePath).toLowerCase()
  for (const [indexName, indexConfig] of Object.entries(config.indexes)) {
    if (indexConfig.enabled && indexConfig.extensions.includes(ext)) {
      return indexName
    }
  }
  return null
}

function isExcluded(relativePath: string, config: VectorizerConfig): boolean {
  return config.exclude.some(pattern => relativePath.startsWith(pattern))
}

async function isVectorizerInstalled(projectRoot: string): Promise<boolean> {
  try {
    await fs.access(path.join(projectRoot, ".opencode", "vectorizer", "node_modules"))
    return true
  } catch {
    return false
  }
}

async function hasIndex(projectRoot: string, indexName: string): Promise<boolean> {
  try {
    await fs.access(path.join(projectRoot, ".opencode", "vectors", indexName, "hashes.json"))
    return true
  } catch {
    return false
  }
}

interface IndexResult {
  totalFiles: number
  elapsedSeconds: number
  action: 'created' | 'rebuilt' | 'freshened' | 'skipped'
}

/**
 * Ensure index exists and is fresh on session start
 * Creates index if missing, freshens if exists
 */
async function ensureIndexOnSessionStart(
  projectRoot: string, 
  config: VectorizerConfig,
  onStart?: (totalFiles: number, estimatedMins: number) => void
): Promise<IndexResult> {
  let totalFiles = 0
  let elapsedSeconds = 0
  let action: IndexResult['action'] = 'skipped'
  
  if (!await isVectorizerInstalled(projectRoot)) {
    log(`Vectorizer not installed - run: npx @comfanion/workflow vectorizer install`)
    return { totalFiles: 0, elapsedSeconds: 0, action: 'skipped' }
  }
  
  try {
    const vectorizerModule = path.join(projectRoot, ".opencode", "vectorizer", "index.js")
    const { CodebaseIndexer } = await import(`file://${vectorizerModule}`)
    const overallStart = Date.now()
    
    // First pass - count files and check health
    let needsWork = false
    let totalExpectedFiles = 0
    
    for (const [indexName, indexConfig] of Object.entries(config.indexes)) {
      if (!indexConfig.enabled) continue
      const indexer = await new CodebaseIndexer(projectRoot, indexName).init()
      const indexExists = await hasIndex(projectRoot, indexName)
      
      if (!indexExists) {
        const health = await indexer.checkHealth(config.exclude)
        totalExpectedFiles += health.expectedCount
        needsWork = true
      } else {
        const health = await indexer.checkHealth(config.exclude)
        if (health.needsReindex) {
          totalExpectedFiles += health.expectedCount
          needsWork = true
        }
      }
      await indexer.unloadModel()
    }
    
    // Notify about work to do
    if (needsWork && onStart) {
      onStart(totalExpectedFiles, estimateTime(totalExpectedFiles))
    }
    
    // Second pass - do the actual work
    for (const [indexName, indexConfig] of Object.entries(config.indexes)) {
      if (!indexConfig.enabled) continue
      
      const indexExists = await hasIndex(projectRoot, indexName)
      const startTime = Date.now()
      
      const indexer = await new CodebaseIndexer(projectRoot, indexName).init()
      
      if (!indexExists) {
        log(`Creating "${indexName}" index...`)
        const stats = await indexer.indexAll((indexed: number, total: number, file: string) => {
          if (indexed % 10 === 0 || indexed === total) {
            logFile(`"${indexName}": ${indexed}/${total} - ${file}`)
          }
        }, config.exclude)
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
        log(`"${indexName}": done ${stats.indexed} files (${elapsed}s)`)
        totalFiles += stats.indexed
        action = 'created'
      } else {
        const health = await indexer.checkHealth(config.exclude)
        
        if (health.needsReindex) {
          log(`Rebuilding "${indexName}" (${health.reason}: ${health.currentCount} vs ${health.expectedCount} files)...`)
          const stats = await indexer.indexAll((indexed: number, total: number, file: string) => {
            if (indexed % 10 === 0 || indexed === total) {
              logFile(`"${indexName}": ${indexed}/${total} - ${file}`)
            }
          }, config.exclude)
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
          log(`"${indexName}": rebuilt ${stats.indexed} files (${elapsed}s)`)
          totalFiles += stats.indexed
          action = 'rebuilt'
        } else {
          log(`Freshening "${indexName}"...`)
          const stats = await indexer.freshen()
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
          
          if (stats.updated > 0 || stats.deleted > 0) {
            log(`"${indexName}": +${stats.updated} -${stats.deleted} (${elapsed}s)`)
            action = 'freshened'
          } else {
            log(`"${indexName}": fresh (${elapsed}s)`)
          }
        }
      }
      
      await indexer.unloadModel()
    }
    
    elapsedSeconds = (Date.now() - overallStart) / 1000
    log(`Indexes ready!`)
    return { totalFiles, elapsedSeconds, action }
  } catch (e) {
    log(`Index error: ${(e as Error).message}`)
    throw e
  }
}

async function processPendingFiles(projectRoot: string, config: VectorizerConfig): Promise<void> {
  if (pendingFiles.size === 0) return
  
  const now = Date.now()
  const filesToProcess: Map<string, string[]> = new Map()
  
  for (const [filePath, info] of pendingFiles.entries()) {
    if (now - info.timestamp >= config.debounce_ms) {
      const files = filesToProcess.get(info.indexName) || []
      files.push(filePath)
      filesToProcess.set(info.indexName, files)
      pendingFiles.delete(filePath)
    }
  }
  
  if (filesToProcess.size === 0) return
  
  debug(`Processing ${filesToProcess.size} index(es)...`)
  
  try {
    const vectorizerModule = path.join(projectRoot, ".opencode", "vectorizer", "index.js")
    const { CodebaseIndexer } = await import(`file://${vectorizerModule}`)
    
    for (const [indexName, files] of filesToProcess.entries()) {
      const indexer = await new CodebaseIndexer(projectRoot, indexName).init()
      
      for (const filePath of files) {
        try {
          const wasIndexed = await indexer.indexSingleFile(filePath)
          if (wasIndexed) {
            log(`Reindexed: ${path.relative(projectRoot, filePath)} → ${indexName}`)
          } else {
            logFile(`Skipped (unchanged): ${path.relative(projectRoot, filePath)}`)
          }
        } catch (e) {
          log(`Error reindexing ${path.relative(projectRoot, filePath)}: ${(e as Error).message}`)
        }
      }
      
      await indexer.unloadModel()
    }
  } catch (e) {
    debug(`Fatal: ${(e as Error).message}`)
  }
}

export const FileIndexerPlugin: Plugin = async ({ directory, client }) => {
  let processingTimeout: NodeJS.Timeout | null = null
  let config = await loadConfig(directory)
  
  // Toast helper
  const toast = async (message: string, variant: 'info' | 'success' | 'error' = 'info') => {
    try {
      await client?.tui?.showToast?.({ body: { message, variant } })
    } catch {}
  }
  
  // Always log plugin load
  log(`Plugin loaded for: ${path.basename(directory)}`)
  
  // Check if plugin should be active
  if (!config.enabled || !config.auto_index) {
    log(`Plugin DISABLED (enabled: ${config.enabled}, auto_index: ${config.auto_index})`)
    return {
      event: async () => {}, // No-op
    }
  }
  
  // Setup log file
  logFilePath = path.join(directory, '.opencode', 'indexer.log')
  fsSync.writeFileSync(logFilePath, '') // Clear old log
  
  log(`Plugin ACTIVE`)
  
  // Get language for fun messages
  const lang = await getLanguage(directory)
  const messages = FUN_MESSAGES[lang]
  
  // Run indexing async (non-blocking) with toast notifications
  // Small delay to let TUI initialize
  setTimeout(async () => {
    try {
      const result = await ensureIndexOnSessionStart(
        directory, 
        config,
        // onStart callback - show toasts
        async (totalFiles, estimatedMins) => {
          await toast(messages.indexing(totalFiles), 'info')
          // Only show fun message if there's actual work to do
          if (totalFiles > 0) {
            setTimeout(() => toast(messages.fun(totalFiles, estimatedMins), 'info'), 1500)
          }
        }
      )
      
      // Show result
      if (result.action === 'skipped') {
        toast(messages.fresh(), 'success')
      } else {
        const duration = formatDuration(result.elapsedSeconds)
        toast(messages.done(result.totalFiles, duration), 'success')
      }
    } catch (e: any) {
      toast(messages.error(e.message), 'error')
    }
  }, 1000)
  
  function queueFileForIndexing(filePath: string): void {
    const relativePath = path.relative(directory, filePath)
    
    // Check exclusions from config
    if (isExcluded(relativePath, config)) {
      return
    }
    
    const indexName = getIndexForFile(filePath, config)
    if (!indexName) return
    
    debug(`Queued: ${relativePath} -> ${indexName}`)
    pendingFiles.set(filePath, { indexName, timestamp: Date.now() })
    
    if (processingTimeout) {
      clearTimeout(processingTimeout)
    }
    processingTimeout = setTimeout(async () => {
      if (await isVectorizerInstalled(directory)) {
        await processPendingFiles(directory, config)
      } else {
        debug(`Vectorizer not installed`)
      }
    }, config.debounce_ms + 100)
  }

  // Event handler for file changes (if events start working in future)
  return {
    event: async ({ event }) => {
      // File edit events - queue for reindexing
      if (event.type === "file.edited" || event.type === "file.watcher.updated") {
        const props = (event as any).properties || {}
        const filePath = props.file || props.path || props.filePath
        if (filePath) {
          log(`Event: ${event.type} → ${filePath}`)
          queueFileForIndexing(filePath)
        }
      }
    },
  }
}

export default FileIndexerPlugin
