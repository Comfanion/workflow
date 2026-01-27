import type { Plugin } from "@opencode-ai/plugin"
import path from "path"
import fs from "fs/promises"
import https from "https"

/**
 * Version Check Plugin
 * 
 * Checks if a newer version of @comfanion/workflow is available on npm.
 * Shows a toast notification if an update is available.
 * 
 * Configuration in .opencode/config.yaml:
 *   version_check:
 *     enabled: true       # Enable version checking
 *     check_interval: 3600000  # Check once per hour (ms)
 */

const DEBUG = process.env.DEBUG?.includes('version-check') || process.env.DEBUG === '*'
const PACKAGE_NAME = '@comfanion/workflow'
const CACHE_FILE = '.version-check-cache.json'

function log(msg: string): void {
  if (DEBUG) console.log(`[version-check] ${msg}`)
}

interface VersionCache {
  lastCheck: number
  latestVersion: string
}

async function getLocalVersion(directory: string): Promise<string | null> {
  try {
    // Try build-info.json first (created during npm publish)
    const buildInfoPath = path.join(directory, '.opencode', 'build-info.json')
    const buildInfo = JSON.parse(await fs.readFile(buildInfoPath, 'utf8'))
    if (buildInfo.version) return buildInfo.version
  } catch {}
  
  try {
    // Fallback to config.yaml version field
    const configPath = path.join(directory, '.opencode', 'config.yaml')
    const config = await fs.readFile(configPath, 'utf8')
    const match = config.match(/^version:\s*["']?([\d.]+)["']?/m)
    if (match) return match[1]
  } catch {}
  
  return null
}

async function getLatestVersion(): Promise<string | null> {
  return new Promise((resolve) => {
    let settled = false
    const done = (value: string | null) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      resolve(value)
    }

    const timeout = setTimeout(() => {
      done(null)
      req.destroy() // Destroy socket on timeout to prevent leak
    }, 5000)

    const req = https.get(`https://registry.npmjs.org/${PACKAGE_NAME}/latest`, (res) => {
      let data = ''
      res.on('data', chunk => {
        if (!settled) data += chunk // Stop accumulating after settled
      })
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          done(json.version || null)
        } catch {
          done(null)
        }
      })
    }).on('error', () => {
      done(null)
    })
  })
}

async function loadCache(directory: string): Promise<VersionCache | null> {
  try {
    const cachePath = path.join(directory, '.opencode', CACHE_FILE)
    const data = await fs.readFile(cachePath, 'utf8')
    return JSON.parse(data)
  } catch {
    return null
  }
}

async function saveCache(directory: string, cache: VersionCache): Promise<void> {
  try {
    const cachePath = path.join(directory, '.opencode', CACHE_FILE)
    await fs.writeFile(cachePath, JSON.stringify(cache))
  } catch {}
}

function compareVersions(local: string, latest: string): number {
  // Strip pre-release suffix (e.g., "4.38.1-beta.1" → "4.38.1")
  const strip = (v: string) => v.replace(/-.*$/, '')
  const localParts = strip(local).split('.').map(Number)
  const latestParts = strip(latest).split('.').map(Number)
  
  for (let i = 0; i < 3; i++) {
    const l = localParts[i] || 0
    const r = latestParts[i] || 0
    if (l < r) return -1
    if (l > r) return 1
  }
  return 0
}

// Fun update messages
const UPDATE_MESSAGES = {
  en: (local: string, latest: string) => `🚀 Update available! ${local} → ${latest}. Run: npx @comfanion/workflow update`,
  uk: (local: string, latest: string) => `🚀 Є оновлення! ${local} → ${latest}. Виконай: npx @comfanion/workflow update`,
  ru: (local: string, latest: string) => `🚀 Доступно обновление! ${local} → ${latest}. Выполни: npx @comfanion/workflow update`,
}

async function getLanguage(directory: string): Promise<'en' | 'uk' | 'ru'> {
  try {
    const configPath = path.join(directory, '.opencode', 'config.yaml')
    const config = await fs.readFile(configPath, 'utf8')
    const match = config.match(/communication_language:\s*["']?(\w+)["']?/i)
    const lang = match?.[1]?.toLowerCase()
    if (lang === 'ukrainian' || lang === 'uk') return 'uk'
    if (lang === 'russian' || lang === 'ru') return 'ru'
  } catch {}
  return 'en'
}

async function loadVersionCheckConfig(directory: string): Promise<{ enabled: boolean; checkInterval: number }> {
  try {
    const configPath = path.join(directory, '.opencode', 'config.yaml')
    const content = await fs.readFile(configPath, 'utf8')
    const section = content.match(/version_check:\s*\n([\s\S]*?)(?=\n[a-z_]+:|$)/i)
    if (!section) return { enabled: true, checkInterval: 60 * 60 * 1000 }
    const enabledMatch = section[1].match(/^\s+enabled:\s*(true|false)/m)
    const intervalMatch = section[1].match(/^\s+check_interval:\s*(\d+)/m)
    return {
      enabled: enabledMatch ? enabledMatch[1] === 'true' : true,
      checkInterval: intervalMatch ? parseInt(intervalMatch[1]) : 60 * 60 * 1000,
    }
  } catch {
    return { enabled: true, checkInterval: 60 * 60 * 1000 }
  }
}

export const VersionCheckPlugin: Plugin = async ({ directory, client }) => {
  const vcConfig = await loadVersionCheckConfig(directory)
  const CHECK_INTERVAL = vcConfig.checkInterval
  
  const toast = async (message: string, variant: 'info' | 'success' | 'error' = 'info') => {
    try {
      await client?.tui?.showToast?.({ body: { message, variant } })
    } catch {}
  }
  
  log(`Plugin loaded`)
  
  // Respect config enabled flag
  if (!vcConfig.enabled) {
    log(`Plugin DISABLED by config`)
    return {
      event: async () => {},
    }
  }
  
  // Run check after short delay (let TUI initialize)
  setTimeout(async () => {
    try {
      // Check cache first
      const cache = await loadCache(directory)
      const now = Date.now()
      
      // Skip if checked recently
      if (cache && (now - cache.lastCheck) < CHECK_INTERVAL) {
        log(`Skipping check (cached ${Math.round((now - cache.lastCheck) / 1000 / 60)}min ago)`)
        
        // But still show toast if update was available
        const localVersion = await getLocalVersion(directory)
        if (localVersion && cache.latestVersion && compareVersions(localVersion, cache.latestVersion) < 0) {
          const lang = await getLanguage(directory)
          await toast(UPDATE_MESSAGES[lang](localVersion, cache.latestVersion), 'info')
        }
        return
      }
      
      // Get versions
      const localVersion = await getLocalVersion(directory)
      if (!localVersion) {
        log(`Could not determine local version`)
        return
      }
      
      log(`Local version: ${localVersion}`)
      
      const latestVersion = await getLatestVersion()
      if (!latestVersion) {
        log(`Could not fetch latest version from npm`)
        return
      }
      
      log(`Latest version: ${latestVersion}`)
      
      // Save to cache
      await saveCache(directory, { lastCheck: now, latestVersion })
      
      // Compare and notify
      if (compareVersions(localVersion, latestVersion) < 0) {
        log(`Update available: ${localVersion} → ${latestVersion}`)
        const lang = await getLanguage(directory)
        await toast(UPDATE_MESSAGES[lang](localVersion, latestVersion), 'info')
      } else {
        log(`Up to date!`)
      }
    } catch (e) {
      log(`Error: ${(e as Error).message}`)
    }
  }, 2000)
  
  return {
    event: async () => {}, // No events needed
  }
}

export default VersionCheckPlugin
