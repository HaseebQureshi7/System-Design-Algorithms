class SlidingWindowCounter {
    constructor(req_limit, window_size,) {
        this.req_limit = req_limit;
        this.window_size = window_size;

        this.cur_win_start = Date.now();
        this.cur_count = 0;

        this.prev_win_start = this.cur_win_start - this.window_size;
        this.prev_count = 0;
    }

    try_request() {
        const now = Date.now();

        if (now - this.cur_win_start > this.window_size) {
            this.prev_count = this.cur_count;
            this.prev_win_start = this.cur_win_start;
            this.cur_win_start = now;
            this.cur_count = 0;
        }

        const time_since_window_start = now - this.cur_win_start;
        const weight = 1 - (time_since_window_start / this.window_size);
        const approx_req_count = this.prev_count * weight + this.cur_count;

        if (approx_req_count < this.req_limit) {
            this.cur_count += 1;
            console.log("Request Allowed");
        }
        else {
            console.log("Request Rejected: Status: 429");
        }
    }
}

const rate_limiter = new SlidingWindowCounter(5, 1000); // 1000 ms

setInterval(() => rate_limiter.try_request(), 100)