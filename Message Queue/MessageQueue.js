class MessageQueue {
  constructor() {
    this.queue = [];
    this.consumers = [];
  }

  // Producer sends a message
  enqueue(message) {
    this.queue.push(message);
    console.log(`📥 Enqueued: ${message}`);
    this.dispatch();
  }

  // Consumer subscribes
  subscribe(consumerFn) {
    this.consumers.push(consumerFn);
    console.log(`👤 New consumer subscribed`);
    this.dispatch();
  }

  // Try sending messages to idle consumers
  dispatch() {
    while (this.queue.length > 0 && this.consumers.length > 0) {
      const message = this.queue.shift();
      const consumer = this.consumers.shift(); // take first idle consumer
      consumer(message); // process message
      // After processing, consumer becomes idle again
      setTimeout(() => {
        this.consumers.push(consumer);
        this.dispatch(); // try to send next message
      }, 0);
    }
  }
}

// ---- DEMO ----
const mq = new MessageQueue();

// Consumers
mq.subscribe((msg) => {
  console.log(`✅ Consumer 1 processed: ${msg}`);
});
mq.subscribe((msg) => {
  console.log(`✅ Consumer 2 processed: ${msg}`);
});
mq.subscribe((msg) => {
  console.log(`✅ Consumer 3 processed: ${msg}`);
});

// Producer sends messages
mq.enqueue("Order #101");
mq.enqueue("Order #102");
mq.enqueue("Order #103");
mq.enqueue("Order #104");
mq.enqueue("Order #105");
