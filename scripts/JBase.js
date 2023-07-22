/**
 * JBase Version 3.0
 * 
 * This version uses quick.db alongside better-sqlite3.
 */


/* Importing QuickDB */
const { QuickDB } = require("quick.db");


class JBase {


  constructor(filepath) {
    this.filepath = filepath;
  }

  initialize() {
    this.db = new QuickDB({ filePath: this.filepath })
    console.log('Initialized ', this.filepath)
  }


  // Setters and Getters
  async set(path, value) { return await this.db.set(path, value) }
  async get(path) { return await this.db.get(path) }

  // Array functions
  async push(path, value) { return await this.db.push(path, value) }
  async pull(path, value) { return await this.db.pull(path, value) }
  async has (path, value) { return await this.db.has(path, value) }

  // Filtering
  async filter(path, filter) {
    let dat = await this.get(path);
    if (dat == null) return;
    let ret = dat.filter(item => {
      for (const key in filter) { if (item[key] !== filter[key]) { return false } }
      return true
    })
    return ret;
  }
  // Checking whether a path exists or not
  async exists(path) { return !(await this.get(path) == null) }
  // Get and omit some fields
  async getOmit(path, omit) {
    let dat = await this.get(path)
    return dat.map(item => {
      return omit.reduce((acc, key) => {
        if (item.hasOwnProperty(key)) {
          acc[key] = item[key];
        }
        return acc;
      }, {});
    });
  }
  // filterOmit
  async filterOmit(path, filter, omit) {
    let filtered = await this.filter(path, filter)
    return filtered.map(item => {
      return omit.reduce((acc, key) => {
        if (item.hasOwnProperty(key)) {
          acc[key] = item[key];
        }
        return acc;
      }, {});
    });
  }
  // updating based on a filter query
  async update(path, filter, newValues) {

    let obj = await this.get(path);
    const targetIndex = obj.findIndex(item => {
      for (const key in filter) {
        if (item[key] !== filter[key]) {
          return false;
        }
      }
      return true;
    });

    
    if (targetIndex !== -1) {
      obj[targetIndex] = { ...obj[targetIndex], ...newValues };
      await this.set(path, obj)
      return true;
    }
  
    return false;
  }
  
}

module.exports = JBase

// async function run() {
//   let db = new JBase('db.sqlite3');
//   db.intialize();

//   console.log(await db.get('t1'))
//   console.log('------------------------------')
//   // await db.update('t1', { ID: 101 }, { ID: 101, name: 'Dratini'})
//   console.log('------------------------------')
//   console.log(await db.get('t1'))
// }
// run()