interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  rateLimitStore.forEach((entry, key) => {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  });
}, 60000); // Clean up every minute

export interface RateLimitConfig {
  maxRequests: number;  // Maximum requests allowed
  windowMs: number;     // Time window in milliseconds
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number;  // Seconds until reset
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = identifier;

  let entry = rateLimitStore.get(key);

  // If no entry or window has passed, create new entry
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);

    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetIn: Math.ceil(config.windowMs / 1000),
    };
  }

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetIn: Math.ceil((entry.resetTime - now) / 1000),
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetIn: Math.ceil((entry.resetTime - now) / 1000),
  };
}

// Helper to get client IP from request
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback for development
  return 'localhost';
}

// Predefined rate limit configs
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const RATE_LIMITS = {
  // Generate questions: 4 requests per day
  generateQuestions: {
    maxRequests: 4,
    windowMs: ONE_DAY_MS,
  },
  // Evaluate answer: 50 requests per day (allows completing ~4 sessions of 12 questions)
  evaluateAnswer: {
    maxRequests: 50,
    windowMs: ONE_DAY_MS,
  },
  // Parse resume: 10 requests per day
  parseResume: {
    maxRequests: 10,
    windowMs: ONE_DAY_MS,
  },
};
