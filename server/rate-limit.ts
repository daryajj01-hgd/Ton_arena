type RateLimitBucket = {
  timestamps: number[];
};

const buckets = new Map<string, RateLimitBucket>();

export function isRateLimited(
  key: string,
  maximumRequests: number,
  windowMs: number,
  now = Date.now()
): boolean {
  const cutoff = now - windowMs;
  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((timestamp) => timestamp > cutoff);

  if (bucket.timestamps.length >= maximumRequests) {
    buckets.set(key, bucket);
    return true;
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);

  if (buckets.size > 5_000) {
    for (const [bucketKey, value] of buckets) {
      value.timestamps = value.timestamps.filter((timestamp) => timestamp > cutoff);
      if (value.timestamps.length === 0) buckets.delete(bucketKey);
    }
  }

  return false;
}

export function clearRateLimitsForTests(): void {
  buckets.clear();
}
