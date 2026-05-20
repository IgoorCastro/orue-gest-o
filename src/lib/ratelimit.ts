import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function checkRateLimit(
    identifier: string,
    maxAttempts = 5,
    windowMs = 15 * 60 * 1000
) {
    const key = `ratelimit:${identifier}`;
    const count = await redis.incr(key);

    if (count === 1) {
        await redis.expire(key, Math.ceil(windowMs / 1000));
    }

    if (count > maxAttempts) {
        const ttl = await redis.ttl(key);
        return { success: false, remaining: 0, resetAfter: ttl || 0 };
    }

    return { success: true, remaining: maxAttempts - count };
}