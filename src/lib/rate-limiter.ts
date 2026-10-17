/**
 * High-performance Sliding Window Rate Limiter
 * Tracks request counts within a specified time window per IP/Identifier.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const memoryStore = new Map<string, RateLimitRecord>();

// Clean up stale timestamps every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 60000);
      if (record.timestamps.length === 0) {
        memoryStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  limit: number;       // Max allowed requests in window
  windowMs: number;    // Window size in milliseconds
}

export function rateLimit(identifier: string, options: RateLimitOptions = { limit: 60, windowMs: 60000 }): {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
} {
  const now = Date.now();
  const windowStart = now - options.windowMs;

  let record = memoryStore.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    memoryStore.set(identifier, record);
  }

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= options.limit) {
    const oldestTimestamp = record.timestamps[0] || now;
    const reset = Math.ceil((oldestTimestamp + options.windowMs - now) / 1000);
    return {
      success: false,
      limit: options.limit,
      remaining: 0,
      reset: Math.max(1, reset),
    };
  }

  // Register current hit
  record.timestamps.push(now);

  return {
    success: true,
    limit: options.limit,
    remaining: options.limit - record.timestamps.length,
    reset: Math.ceil(options.windowMs / 1000),
  };
}
