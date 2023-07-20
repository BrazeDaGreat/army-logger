const fs = require('fs');
const { convertCSVToArray } = require('convert-csv-to-array');
const { listenerCount } = require('process');

function convertDatesToUnixTimestamps(obj) {
    const dateRegex = /\d{1,2}\/\d{1,2}\/\d{4}/;
  
    for (let key in obj) {
      if (obj.hasOwnProperty(key) && typeof obj[key] === "string" && dateRegex.test(obj[key])) {
        try {
          const [month, day, year] = obj[key].split("/");
          const date = new Date(`${year}-${month}-${day}`);
          const unixTimestamp = Math.floor(date.getTime() / 1000);
          obj[key] = unixTimestamp;
        } catch (error) {
          // Date format is invalid, do nothing
        }
      }
    }
  
    return obj;
  }

function process(file, dbType, db) {
    // let data = fs.readFileSync(`csv/${file}.csv`, 'utf8').toString()
    let data = fs.readFileSync(file).toString()
        .replace(/\r/g, "");
        // .split("\n");

    data = convertCSVToArray(data, {
        header: false,
        separator: '\t'
    })

    console.log(data)

    // Loading it into the database

    data.forEach(async elmnt => {
        // await db[file].create(elmnt)
        elmnt = convertDatesToUnixTimestamps(elmnt)
        await db.create(dbType, elmnt)
        console.log('Pushed.')
    });
}

module.exports = {
    process
}