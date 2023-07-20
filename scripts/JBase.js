const fs = require('fs').promises;
const crypto = require('crypto');

class JBase {
  constructor(filename = 'db.json', encryptionKey = '123_secret@098') {
    this.db = {};
    this.filename = filename;
    this.encryptionKey = encryptionKey;

    // this.encryptFile()
    // this.salt = crypto.randomBytes(16); // Generate a random salt for key derivation
    // this.key = crypto.pbkdf2Sync(this.encryptionKey, this.salt, 100000, 32, 'sha512');
  }

  encryptFile() {
    // eFile(this.filename, this.encryptionKey)
    // TODO: yes.
    return;
  }

  decryptFile() {
    // deFile(this.filename, this.encryptionKey)
    // TODO: yes.
    return;
  }

  async initialize() {
    try {
      this.decryptFile()

      const data = await fs.readFile(this.filename, 'utf-8');
      this.db = JSON.parse(data);

      this.encryptFile()

    } catch (err) {
      this.db = {}
      await this.saveDatabase()
    }
  }

  async saveDatabase() {
    this.decryptFile()
    const jsonData = JSON.stringify(this.db, null, 2)
    await fs.writeFile(this.filename, jsonData, 'utf-8')
    console.log('Saved')
    this.encryptFile()
  }

  async create(collectionName, item) {
    if (!this.db[collectionName]) {
      this.db[collectionName] = [];
    }

    const newItem = { ...item };

    // Check for unique fields and throw an error if any duplicates found
    const uniqueFields = Object.keys(newItem).filter((field) => field.startsWith('unique_'));
    for (const field of uniqueFields) {
      const value = newItem[field];
      if (this.db[collectionName].some((existingItem) => existingItem[field] === value)) {
        throw new Error(`Duplicate value for unique field "${field}"`);
      }
    }

    // Encrypt fields marked for encryption (fields starting with "encrypt_")
    for (const field in newItem) {
      if (field.startsWith('encrypt_')) {
        const encryptedValue = this.encrypt(newItem[field]);
        newItem[field] = encryptedValue;
      }
    }

    this.db[collectionName].push(newItem);
    await this.saveDatabase();
    return newItem;
  }

  async read(collectionName, query = {}) {
    const collection = this.db[collectionName] || [];

    // Apply the query filter
    const filteredItems = collection.filter((item) => {
      for (const key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });

    return filteredItems;
  }

  async update(collectionName, query = {}, changes = {}) {
    const collection = this.db[collectionName] || [];

    // Apply the query filter
    const filteredItems = collection.filter((item) => {
      for (const key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });

    if (filteredItems.length === 0) {
      throw new Error('Items matching query not found');
    }

    // Encrypt fields marked for encryption (fields starting with "encrypt_")
    for (const field in changes) {
      if (field.startsWith('encrypt_')) {
        const encryptedValue = this.encrypt(changes[field]);
        changes[field] = encryptedValue;
      }
    }

    // Update the items
    filteredItems.forEach((item) => {
      for (const key in changes) {
        item[key] = changes[key];
      }
      item.$updatedAt = new Date().toISOString();
    });

    await this.saveDatabase();
    return filteredItems;
  }

  async delete(collectionName, query = {}) {
    const collection = this.db[collectionName] || [];

    // Apply the query filter
    const filteredItems = collection.filter((item) => {
      for (const key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });

    if (filteredItems.length === 0) {
      throw new Error('Items matching query not found');
    }

    // Remove the items from the collection
    this.db[collectionName] = collection.filter((item) => !filteredItems.includes(item));
    await this.saveDatabase();
    return filteredItems;
  }

  async dropCollection(collectionName) {
    delete this.db[collectionName];
    await this.saveDatabase();
  }

  async clearCollection(collectionName) {
    this.db[collectionName] = [];
    await this.saveDatabase();
  }

  async dropDatabase() {
    this.db = {};
    await this.saveDatabase();
  }
}

module.exports = JBase;


// Previous version which was using bad.db

// const BadDb = require('bad.db');

// class JBase {
//   constructor(filename = 'db.json') {
//     this.db = null;
//     this.filename = filename;
//   }

//   encrypt() {
//     return
//   }

//   decrypt() {
//     return
//   }

//   async initialize() {
//     this.db = await BadDb(this.filename);
//   }

//   async create(collectionName, item, options = {}) {
//     return await this.db(collectionName).create(item, options);
//   }

//   async read(collectionName, query = {}, options = {}) {
//     return await this.db(collectionName).read(query, options);
//   }

//   async update(collectionName, query = {}, changes = {}, options = {}) {
//     return await this.db(collectionName).update(query, changes, options);
//   }

//   async delete(collectionName, query = {}, options = {}) {
//     return await this.db(collectionName).delete(query, options);
//   }

//   async dropCollection(collectionName) {
//     await this.db(collectionName).drop();
//   }

//   async clearCollection(collectionName) {
//     await this.db(collectionName).clear();
//   }

//   async dropDatabase() {
//     await this.db.drop();
//   }
// }

// module.exports = JBase;
