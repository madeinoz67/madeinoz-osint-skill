/**
 * Mock Sharp for CI environments
 */

export class MockSharp {
  constructor() {}

  static async version() {
    return '0.0.0-mock';
  }

  metadata() {
    return this;
  }

  toBuffer() {
    return Promise.resolve(Buffer.alloc(1));
  }

  resize() {
    return this;
  }

  extract() {
    return this;
  }

  raw() {
    return this;
  }

  ensureAlpha() {
    return this;
  }

  modulate() {
    return this;
  }

  get format() {
    return this;
  }

  set format(value) {
    // Mock setter
  }
}

export default MockSharp;
