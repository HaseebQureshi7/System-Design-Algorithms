class ShardedDatabase {
  constructor(numShards) {
    this.shards = Array.from({ length: numShards }, () => new Map());
  }

  // Simple hash function to turn string IDs into numbers
  hashId(id) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash * 31 + id.charCodeAt(i)) >>> 0; // unsigned 32-bit
    }
    return hash;
  }

  // Get shard index from ID
  getShardIndex(userId) {
    const numericId = typeof userId === "string" ? this.hashId(userId) : userId;
    return numericId % this.shards.length;
  }

  // Insert into correct shard
  insert(userId, data) {
    const shardIndex = this.getShardIndex(userId);
    this.shards[shardIndex].set(userId, data);
    console.log(`Inserted into Shard ${shardIndex}`);
  }

  // Read from correct shard
  read(userId) {
    const shardIndex = this.getShardIndex(userId);
    return this.shards[shardIndex].get(userId);
  }
}

// Example usage
const db = new ShardedDatabase(3);

db.insert("userA", { name: "Alice" });
db.insert("userB", { name: "Bob" });
db.insert("abc123", { name: "Charlie" });

console.log(db.read("userA"));   // { name: "Alice" }
console.log(db.read("abc123"));  // { name: "Charlie" }
