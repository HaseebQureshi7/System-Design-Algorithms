class LRUCache {
  constructor(max_size) {
    this.max_size = max_size;
    this.cache = new Map(); // Keeps insertion order
  }

  get(key) {
    if (!this.cache.has(key)) return null;

    // Move the key to the end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);

    console.log(`GET ${key} -> ${value}`);
    return value;
  }

  set(key, value) {
    // If key exists, delete first so we can re-insert at end
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // If full, evict least recently used (first item in Map)
    else if (this.cache.size >= this.max_size) {
      const oldest_key = this.cache.keys().next().value;
      this.cache.delete(oldest_key);
      console.log(`Evicted ${oldest_key}`);
    }

    this.cache.set(key, value);
    console.log(`SET ${key} -> ${value}`);
  }
}

// Example usage
const lru = new LRUCache(3);
lru.set("A", 1);
lru.set("B", 2);
lru.set("C", 3);
lru.get("A"); // A is now most recent
lru.set("D", 4); // Evicts B (least recently used)
lru.get("B"); // null
