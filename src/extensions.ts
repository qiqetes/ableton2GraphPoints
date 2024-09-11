declare global {
  interface Array<T> {
    last(): T;
  }
}

Array.prototype.last = function <T>(): T {
  return this.length > 0 ? this[this.length - 1] : undefined;
};

export {};
