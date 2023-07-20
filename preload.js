const { contextBridge } = require('electron')
const JBase = require('./scripts/JBase.js')
const Processor = require('./scripts/Processor.js')
const db = new JBase('db/main.json');
const creds = new JBase('db/credentials.json')
async function init() {
    await db.initialize()
    await creds.initialize()
}
init()

// Processor.process('t1')

contextBridge.exposeInMainWorld('node', {
    chrome: () => process.versions.chrome,
    json: () => db,
    call: (fn, ...parameters) => db[fn](...parameters),
    creds: (fn, ...parameters) => creds[fn](...parameters),
    load: (file, dbType) => Processor.process(file, dbType, db)
    // requireFunc: (r) => require(r)
    // jbase: (path) => {return new JBase(path)}
})