class DatabaseReplication {
    constructor() {
        this.primary_db = { id: "master", data: [], load: 0 };
        this.replicas = [];
        this.max_ops_per_db = 10;
        this.total_reads = 0;
        this.total_writes = 0;
        this.round_robin_index = 0;

        // we start with 1 replica
        this.add_replica();

        // check load every 3 seconds
        setInterval(() => this.scale_replicas(), 2000);
    }
    add_replica() {
        const new_replica = {
            id: "slave-" + this.replicas.length,
            data: [...this.primary_db.data], //Sync with master
            load: 0
        }
        this.replicas.push(new_replica);
        console.log(`Replica ${new_replica.id} added!`)
    };
    remove_replica() {
        if (this.replicas.length > 1) { // keeping at least 1 replica
            const removed = this.replicas.pop();
            console.log(`Replica ${removed.id} removed!`)
        }
    };
    read() {
        if (this.replicas.length === 0) {
            console.log("No replicas online, \nReading from Primary Db");
            return this.primary_db.data;
        }

        // round robin to distribute reads
        const curr_replica = this.replicas[this.round_robin_index];
        this.round_robin_index = (this.round_robin_index + 1) % this.replicas.length;

        this.total_reads += 1;
        curr_replica.load += 1;
        const replica_load = ((curr_replica.load / this.max_ops_per_db) * 100).toFixed(1)
        console.log(`Reading from ${curr_replica.id} | Load: ${replica_load}%`)

        // Simulate query resolve
        setTimeout(() => {
            this.total_reads -= 1;
            curr_replica.load -= 1;
        }, 5000) // -> Takes 1000ms to resolve 1 query
        return curr_replica.data
    };
    write(data) {
        // check if the primary db exists, promote a slave db to master
        if (!this.primary_db) {
            if (this.replicas.length >= 1) {
                this.primary_db = this.replicas.shift();
                console.log("Primary Database Failed!\n Promoting Slave 0 to Master");
            }
            else {
                console.log("Cannot write!!! Primary Database Failed\n No Replicas available for promotion");
                return
            }
        }
        // write on primary, add load
        this.primary_db.data.push(data);
        this.primary_db.load += 1;
        this.total_writes += 1;
        // resolve load
        setTimeout(() => {
            this.primary_db.load -= 1;
            this.total_writes -= 1;
        }, 500)
        // sync with replicas (with delay)
        setTimeout(() => {
            for (let reps of this.replicas) {
                reps.data = [...this.primary_db.data]
            }
        }, 1000)
    };
    scale_replicas() {
        const max_read_capacity = this.replicas.length * this.max_ops_per_db;
        const read_usage_ratio = max_read_capacity > 0 ? this.total_reads / max_read_capacity : 0;

        if (read_usage_ratio >= 0.75) {
            this.add_replica();
        }
        else if (read_usage_ratio <= 0.25) {
            this.remove_replica();
        }

        console.log(`⚖️ Scaling Check: Reads=${this.total_reads}, Replicas=${this.replicas.length}, Usage=${(read_usage_ratio * 100).toFixed(1)}%`)
    };

}

const db_cluster = new DatabaseReplication();
let write_counter = 0;

setInterval(() => {
    db_cluster.write(`Record - ${write_counter += 1}`);
}, 1500)

setInterval(() => db_cluster.read(), 500)