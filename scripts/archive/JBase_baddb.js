const BadDb = require('bad.db');

class JBase {
  constructor(filename = 'db.json') {
    this.db = null;
    this.filename = filename;
  }

  encrypt() {
    return
  }

  decrypt() {
    return
  }

  async initialize() {
    this.db = await BadDb(this.filename);
  }

  async create(collectionName, item, options = {}) {
    return await this.db(collectionName).create(item, options);
  }

  async read(collectionName, query = {}, options = {}) {
    return await this.db(collectionName).read(query, options);
  }

  async update(collectionName, query = {}, changes = {}, options = {}) {
    return await this.db(collectionName).update(query, changes, options);
  }

  async delete(collectionName, query = {}, options = {}) {
    return await this.db(collectionName).delete(query, options);
  }

  async dropCollection(collectionName) {
    await this.db(collectionName).drop();
  }

  async clearCollection(collectionName) {
    await this.db(collectionName).clear();
  }

  async dropDatabase() {
    await this.db.drop();
  }
}

module.exports = JBase;
