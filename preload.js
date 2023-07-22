const { contextBridge } = require('electron')
const JBase = require('./scripts/JBase.js')
const Processor = require('./scripts/Processor.js')
const db = new JBase('db/db.sqlite3');

const creds = new JBase('db/creds.sqlite3')
async function init() {
    // await db.initialize()
    
    await db.initialize()
    await creds.initialize()
}
init()

// Processor.process('t1')

contextBridge.exposeInMainWorld('node', {
    chrome: () => process.versions.chrome,
    // json: () => db,
    // call: (fn, ...parameters) => db[fn](...parameters),
    // call: (fn, db, ...parameters) => {
    //     // console.log([fn, db, ...parameters])
    //     return dbs[db][fn](db, ...parameters)
    // },
    
    // creds: (fn, ...parameters) => creds[fn](...parameters),
    // load: (file, dbType) => Processor.process(file, dbType, db)
    // load: (file, dbType) => {
    //     return Processor.process(file, dbType, dbs[dbType])
    // }
    // requireFunc: (r) => require(r)
    // jbase: (path) => {return new JBase(path)}
})

contextBridge.exposeInMainWorld('db', {
    set: (path, value) => db.set(path, value),
    get: (path) => db.get(path),
    push: (path, value) => db.push(path, value),
    pull: (path, value) => db.pull(path, value),
    has: (path, value) => db.has(path, value),

    filter: (path, filter) => db.filter(path, filter),
    exists: (path) => db.exists(path),
    getOmit: (path, omit) => db.getOmit(path, omit),
    filterOmit: (path, filter, omit) => db.filterOmit(path, filter, omit)
})