class TokenBucket {
    constructor(capacity, refill_rate) {
        this.cap = capacity;
        this.avail_tokens = capacity;
        this.refill_rate = refill_rate; // 1/100ms
        this.last_refill_time = Date.now();

        setInterval(() => this.refill(), 100)
    }

    refill() {
        const now = Date.now();
        const elapsed = (now - this.last_refill_time) / 1000;
        const token_to_refill = Math.floor(elapsed * this.refill_rate);
        if (token_to_refill > 0) {
            this.avail_tokens = Math.min(this.cap, this.avail_tokens + token_to_refill);
            this.last_refill_time = now;
        }
    }
    try_consume() {
        if (this.avail_tokens > 0) {
            this.avail_tokens--;
            console.log("Token used, Request Processed");
        }
        else {
            console.log("No tokens left, Request Failed");
        }
    }
}


const rate_limiter = new TokenBucket(3, 2);
setInterval(() => {
    rate_limiter.try_consume()
}, 50)