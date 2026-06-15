# Security Standards

**Project:** {{project_name}}  
**Version:** 1.0  
**Last Updated:** {{date}}

---

## Overview

Security is a first-class concern in this project. Every developer must follow these guidelines.

---

## OWASP Top 10 Mitigations

### 1. Injection (SQL, NoSQL, Command)

**Rule:** Never concatenate user input into queries.

```typescript
// ❌ BAD - SQL Injection
const query = `SELECT * FROM users WHERE id = '${userId}'`;

// ✅ GOOD - Parameterized query
const query = `SELECT * FROM users WHERE id = $1`;
await db.query(query, [userId]);
```

### 2. Broken Authentication

**Rules:**
- Use industry-standard auth (OAuth2, JWT)
- Implement rate limiting on auth endpoints
- Use secure password hashing (bcrypt, Argon2)
- Session tokens must be unpredictable

```typescript
// ✅ GOOD - Secure password hashing
import { hash, verify } from 'argon2';
const hashedPassword = await hash(password);
```

### 3. Sensitive Data Exposure

**Rules:**
- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Never log PII, passwords, tokens, or API keys
- Mask sensitive data in error messages

```typescript
// ❌ BAD - Logging sensitive data
console.log(`User login: ${email}, password: ${password}`);

// ✅ GOOD - Masked logging
console.log(`User login attempt: ${email.slice(0, 3)}***`);
```

### 4. XML External Entities (XXE)

**Rule:** Disable external entity processing in XML parsers.

### 5. Broken Access Control

**Rules:**
- Verify user owns the resource before access
- Use principle of least privilege
- Deny by default

```typescript
// ✅ GOOD - Verify ownership
async function getTask(userId: string, taskId: string) {
  const task = await db.findTask(taskId);
  if (task.ownerId !== userId) {
    throw new ForbiddenError('Access denied');
  }
  return task;
}
```

### 6. Security Misconfiguration

**Rules:**
- Remove default credentials
- Disable debug mode in production
- Keep dependencies updated
- Use security headers (CSP, HSTS, X-Frame-Options)

### 7. Cross-Site Scripting (XSS)

**Rules:**
- Escape all output
- Use Content Security Policy
- Validate and sanitize HTML input

```typescript
// ✅ GOOD - Escape output (React does this by default)
return <div>{userInput}</div>;

// ⚠️ DANGEROUS - Only if absolutely necessary
return <div dangerouslySetInnerHTML={{__html: sanitized}} />;
```

### 8. Insecure Deserialization

**Rule:** Validate deserialized data, use safe parsers.

### 9. Using Components with Known Vulnerabilities

**Rules:**
- Run `npm audit` / `snyk` regularly
- Keep dependencies updated
- Remove unused dependencies

### 10. Insufficient Logging & Monitoring

**Rules:**
- Log security events (login, logout, failed auth)
- Include timestamp, user ID, action, result
- Don't log sensitive data
- Set up alerts for suspicious activity

---

## Input Validation

### All User Input Must Be Validated

```typescript
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(1).max(100),
  age: z.number().int().min(0).max(150),
});

function createUser(input: unknown) {
  const validated = CreateUserSchema.parse(input);
  // Now safe to use
}
```

### Validate At System Boundaries

- HTTP handlers (API input)
- Message queue consumers
- File uploads
- External API responses

---

## Secrets Management

### Never Hardcode Secrets

```typescript
// ❌ BAD
const apiKey = 'sk-1234567890abcdef';

// ✅ GOOD
const apiKey = process.env.API_KEY;
```

### Environment Variables

```bash
# .env.example (commit this)
DATABASE_URL=
API_KEY=
JWT_SECRET=

# .env (NEVER commit)
DATABASE_URL=postgres://...
API_KEY=sk-...
JWT_SECRET=...
```

### Gitignore

```
# Always ignore
.env
.env.local
*.pem
*.key
secrets/
```

---

## Authentication & Authorization

### JWT Best Practices

```typescript
// ✅ GOOD JWT configuration
const token = jwt.sign(
  { userId, role },
  process.env.JWT_SECRET,
  {
    expiresIn: '1h',      // Short expiration
    algorithm: 'HS256',   // Or RS256 for asymmetric
    issuer: 'our-app',
    audience: 'our-app',
  }
);
```

### Authorization Middleware

```typescript
// ✅ GOOD - Check permissions before action
async function deleteTask(user: User, taskId: string) {
  const task = await taskRepo.find(taskId);
  
  if (!task) throw new NotFoundError();
  if (task.ownerId !== user.id && !user.isAdmin) {
    throw new ForbiddenError();
  }
  
  await taskRepo.delete(taskId);
}
```

---

## API Security

### Rate Limiting

```typescript
// Apply to auth endpoints
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
}));
```

### Security Headers

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: true,
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: true,
  dnsPrefetchControl: true,
  frameguard: true,
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: true,
  referrerPolicy: true,
  xssFilter: true,
}));
```

---

## Database Security

### Parameterized Queries

```typescript
// ✅ Always use parameterized queries
const result = await db.query(
  'SELECT * FROM users WHERE email = $1 AND active = $2',
  [email, true]
);
```

### Principle of Least Privilege

- App database user should NOT have DROP, CREATE permissions
- Use read-only replicas for reporting

---

## File Upload Security

```typescript
// ✅ GOOD - Validate uploads
const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
const maxSize = 5 * 1024 * 1024; // 5MB

function validateUpload(file: UploadedFile) {
  if (!allowedTypes.includes(file.mimetype)) {
    throw new BadRequestError('Invalid file type');
  }
  if (file.size > maxSize) {
    throw new BadRequestError('File too large');
  }
  // Generate random filename to prevent path traversal
  const safeFilename = `${uuid()}.${extension}`;
}
```

---

## Security Checklist for Code Review

- [ ] No hardcoded secrets or API keys
- [ ] All user inputs validated
- [ ] Using parameterized queries
- [ ] Authentication required on protected endpoints
- [ ] Authorization checks before data access
- [ ] Sensitive data not logged
- [ ] Error messages don't leak internal details
- [ ] Dependencies don't have known vulnerabilities
- [ ] Security headers configured
- [ ] Rate limiting on sensitive endpoints

---

## Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | {{date}} | {{author}} | Initial security standards |
