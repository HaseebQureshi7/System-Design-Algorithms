// Leaking Bucket Algorithm (Rate Limiter Algo)
class LeakingBucket {
    constructor(capacity, leak_rate) {
        this.cap = capacity;
        this.leak_rate = leak_rate; // Leak Rate should be in ms
        this.bucket = [];
        this.last_leak_time = Date.now()

        setInterval(() => this.leak(), 100)
    }

    leak() {
        const cur_time = Date.now();
        const elapsed_time = cur_time - this.last_leak_time;
        const packets_to_leak = Math.floor(elapsed_time * this.leak_rate);

        for (let i = 0; i < packets_to_leak && this.bucket.length; i++) {
            const packet = this.bucket.shift(); // Pop from the front >> Queue >> FIFO
            console.log("Sending packet:", packet)
        }
        if (packets_to_leak > 0) {
            this.last_leak_time += packets_to_leak / this.leak_rate
        }
    }
    try_add(packet) {
        if (this.bucket.length == this.cap) {
            console.log("Packet dropped, Bucket full!")
        }
        else {
            this.bucket.push(packet)
        }
    }
}


const rate_limiter = new LeakingBucket(2, 0.1);

let packetId = 1;
setInterval(() => {
    const packet = { id: packetId++, time: Date.now() };
    rate_limiter.try_add(packet);
}, 10); // Try to add a packet every 50ms (20 packets/sec)