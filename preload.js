const { contextBridge } = require('electron')
const JBase = require('./scripts/JBase.js')
const Processor = require('./scripts/Processor.js')
// const db = new JBase('db/main.json');
const dbs = {
    "t1": new JBase('db/t1.json'),
    "t2": new JBase('db/t2.json'),
    "t3": new JBase('db/t3.json'),
    "t4": new JBase('db/t4.json'),
    "t5": new JBase('db/t5.json'),
    "t6": new JBase('db/t6.json'),
}
const creds = new JBase('db/credentials.json')
async function init() {
    // await db.initialize()
    Object.keys(dbs).forEach(i => {
        dbs[i].initialize()
    })
    await creds.initialize()
}
init()

// Processor.process('t1')

contextBridge.exposeInMainWorld('node', {
    chrome: () => process.versions.chrome,
    json: () => db,
    // call: (fn, ...parameters) => db[fn](...parameters),
    call: (fn, db, ...parameters) => {
        // console.log([fn, db, ...parameters])
        return dbs[db][fn](db, ...parameters)
    },
    creds: (fn, ...parameters) => creds[fn](...parameters),
    // load: (file, dbType) => Processor.process(file, dbType, db)
    load: (file, dbType) => {
        return Processor.process(file, dbType, dbs[dbType])
    }
    // requireFunc: (r) => require(r)
    // jbase: (path) => {return new JBase(path)}
})