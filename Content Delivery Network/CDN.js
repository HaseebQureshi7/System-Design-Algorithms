class CDNNode {
  constructor(name) {
    this.name = name;
    this.cache = new Map();
  }

  serveRequest(contentId) {
    if (this.cache.has(contentId)) {
      console.log(`[${this.name}] ✅ Cache HIT for "${contentId}"`);
      return this.cache.get(contentId);
    } else {
      console.log(`[${this.name}] ❌ Cache MISS for "${contentId}", fetching from Origin...`);
      const content = this.fetchFromOrigin(contentId);
      this.cache.set(contentId, content);
      return content;
    }
  }

  fetchFromOrigin(contentId) {
    // Simulate origin fetch delay
    return `Content(${contentId}) from ORIGIN`;
  }
}

class CDN {
  constructor() {
    this.nodes = [
      new CDNNode("US-East"),
      new CDNNode("Europe"),
      new CDNNode("Asia")
    ];
  }

  // Very basic "nearest node" simulation based on region name
  getNearestNode(region) {
    return this.nodes.find(node => node.name === region);
  }

  requestContent(region, contentId) {
    const node = this.getNearestNode(region);
    return node.serveRequest(contentId);
  }
}

// ---- DEMO ----
const cdn = new CDN();

// First request — MISS (fetch from origin)
cdn.requestContent("US-East", "video.mp4");

// Second request (same region, same file) — HIT
cdn.requestContent("US-East", "video.mp4");

// Different region — MISS (different edge node cache)
cdn.requestContent("Europe", "video.mp4");

// Later — HIT in Europe
cdn.requestContent("Europe", "video.mp4");
