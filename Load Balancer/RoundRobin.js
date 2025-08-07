class LoadBalancer {
    constructor() {
        this.servers = []; // saved as -> {sid: 0, curr_load: 100}
        this.max_reqs_per_server = 10;
        this.total_reqs = 0;
        this.round_robin_index = 0;

        this.add_server();

        // monitor scaling every 3 seconds
        setInterval(() => this.scale_servers(), 3 * 1000)
    }

    add_server() {
        const new_sid = this.servers.length;
        const new_server = { sid: new_sid, curr_load: 0 };
        this.servers.push(new_server);
        console.log("New Server added -> ", this.servers[this.servers.length - 1])
    };
    remove_server() {
        if (this.servers.length > 1) {
            const removed_server = this.servers.pop()
            console.log(`Server ${removed_server.sid} removed, ${this.servers.length} servers left`)
        }
    };
    handle_request(req_id) {
        // add to total reqs
        this.total_reqs += 1;
        // distribute reqs with Round Robin
        const curr_server = this.servers[this.round_robin_index];
        this.round_robin_index = (this.round_robin_index + 1) % this.servers.length;
        curr_server.curr_load += 1
        console.log(`Request ${req_id} routed to Server ${curr_server.sid} | Load: ${curr_server.curr_load}`)
        
        // Resolve reqs (with a timeout)
        setTimeout(() => {
            curr_server.curr_load -= 1;
            this.total_reqs -= 1;
            console.log(`Request ${req_id} resolved by ${curr_server.sid}`)
        }, 5000) // Lets say it takes 1100ms to resolve a request
    };
    scale_servers() {
        // get current usage
        const total_capacity = this.servers.length * this.max_reqs_per_server;
        const curr_usage =  this.total_reqs / total_capacity;

        // add or remove based on usage
        if (curr_usage > 0.75) {
            this.add_server()
        }
        else if (curr_usage < 0.25) {
            this.remove_server()
        } 

        console.log(`⚖️ Auto Scaling Complete... \nTotal Req: ${this.total_reqs}, Servers: ${this.servers.length}, Usage: ${(curr_usage * 100).toFixed(1)}%`)
    };
}



// === Simulate Incoming Traffic ===
const lb = new LoadBalancer();
let requestId = 1;


// Simulate varying traffic
setInterval(() => {
    const reqPerCycle = Math.floor(Math.random() * 5) + 1; // 1 to 5 new requests
    for (let i = 0; i < reqPerCycle; i++) {
        lb.handle_request(requestId++);
    }
}, 500);
