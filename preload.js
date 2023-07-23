const { contextBridge } = require('electron')
const JBase = require('./scripts/JBase.js')
const Processor = require('./scripts/Processor.js')
const db = new JBase('db/main.db');
const creds = new JBase('db/creds.db');

function init() {
    db.initialize()
    creds.initialize()
}
init()

contextBridge.exposeInMainWorld('csvimport', {
    process: (file, dbType) => Processor.process(file, dbType, db)
})

contextBridge.exposeInMainWorld('db', {
    set: (path, value) => db.set(path, value),
    get: (path) => db.get(path),
    read: (path) => db.get(path), // For Compatibility
    push: (path, value) => db.push(path, value),
    pull: (path, value) => db.pull(path, value),
    has: (path, value) => db.has(path, value),
    update: (path, filter, value) => db.update(path, filter, value),
    delete: (path) => db.delete(path),

    filter: (path, filter) => db.filter(path, filter),
    exists: (path) => db.exists(path),
    getOmit: (path, omit) => db.getOmit(path, omit),
    filterOmit: (path, filter, omit) => db.filterOmit(path, filter, omit)
})

contextBridge.exposeInMainWorld('creds', {
    set: (path, value) => creds.set(path, value),
    get: (path) => creds.get(path),
    read: (path) => creds.get(path), // For Compatibility
    push: (path, value) => creds.push(path, value),
    pull: (path, value) => creds.pull(path, value),
    has: (path, value) => creds.has(path, value),
    delete: (path) => creds.delete(path),

    filter: (path, filter) => creds.filter(path, filter),
    exists: (path) => creds.exists(path),
    getOmit: (path, omit) => creds.getOmit(path, omit),
    filterOmit: (path, filter, omit) => creds.filterOmit(path, filter, omit)
})