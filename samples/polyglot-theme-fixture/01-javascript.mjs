// JavaScript: modules, async functions, destructuring, and private fields.
export class Signal {
  #listeners = new Set();

  async emit({ name = "Ada", ...payload } = {}) {
    const event = { name, ...payload, timestamp: Date.now() };
    await Promise.all([...this.#listeners].map((listener) => listener(event)));
    return event;
  }
}
