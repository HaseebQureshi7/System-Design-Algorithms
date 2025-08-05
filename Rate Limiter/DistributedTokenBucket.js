// RECOMMENDED ALGORITHM FOR RATE LIMITING

// Simulated Redis (In-Memory KV Store)
const store = new Map(); // userId -> { tokens, lastRefill }

class DistributedTokenBucket {
  constructor(capacity, refill_rate_per_second) {
    this.cap = capacity;
    this.refill_rate = refill_rate_per_second;
  }

  is_allowed(user_id) {
    const now = Date.now() / 1000; // to get seconds

    if (!store.has(user_id)) {
      store.set(user_id, {
        tokens_left: this.cap - 1,
        last_refill_time: now,
      });
      return true;
    }

    const user_data = store.get(user_id);
    const elapsed_time = now - user_data.last_refill_time;

    const refill_tokens = Math.floor(elapsed_time * this.refill_rate);
    if (refill_tokens) {
      user_data.tokens_left = Math.min(
        this.cap,
        user_data.tokens_left + refill_tokens
      );
      user_data.last_refill_time = now;
    }

    if (user_data.tokens_left > 0) {
      user_data.tokens_left -= 1;
      store.set(user_id, user_data);
      return true;
    }

    return false;
  }
}

const limiter = new DistributedTokenBucket(5, 1); // 5 tokens max, 1 token/sec

setInterval(() => {
  const allowed = limiter.is_allowed("user123");
  console.log(`${Date.now()} - ${allowed ? "✅ Allowed" : "❌ Blocked"}`);
}, 100); // Request every 200ms
