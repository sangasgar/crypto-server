class Storage {
  constructor() {
    this.map = new Map();
  }

  addItem(key, object) {
    this.map.set(key, object);
  }

  getItem(key) {
    return this.map.get(key);
  }

  getItems() {
    return this.map;
  }

  clearItems() {
    this.map = new Map();
  }
}
const storage = new Storage();
module.exports = storage;
