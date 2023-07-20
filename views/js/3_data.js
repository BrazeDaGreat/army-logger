/**
 * Returns the data type based on the field name.
 * @param {string} field - The field name.
 * @returns {string} - The data type.
 */
function getType(field) {
  switch (field) {
    case "ID":
      return "number";
    case "DOB":
    case "DOE":
    case "Date Left":
    case "Date Back":
    case "Date_Left":
    case "Date_Back":
      return "date";
    case "Phone No#":
      return "tel";
    default:
      return "text";
  }
}

/**
 * Converts a date string to a Unix timestamp.
 * @param {string} string - The date string.
 * @returns {string} - The Unix timestamp.
 */
function convertToUnix(string) {
  const date = new Date(string);
  const unixTime = Math.floor(date.getTime() / 1000).toString();
  return unixTime;
}

/**
 * Retrieves new data from the modal form.
 * @param {string[]|Object} dat - The data as an array of strings or an object.
 * @returns {NewDataObject} - The new data as an object.
 */
function getNewData(dat) {
  const fields = Array.isArray(dat) ? dat.join("||SEP||").split(" ").join("_").split("||SEP||") : Object.keys(dat).join("||SEP||").split(" ").join("_").split("||SEP||");
  fields.splice(fields.length - 2, 2);
  if (fields.includes("$id")) {
    fields.splice(fields.length - 1, 1);
  }

  const newdat = {};
  fields.forEach((field) => {
    let value = document.getElementById(`editValue__${field}`).value;
    if (field === "DOB" || field === "DOE" || field === "Date_Left" || field === "Date_Back") {
      value = convertToUnix(value);
    }
    newdat[field.split("_").join(" ")] = value;
  });

  return newdat;
}

/**
 * Updates the data object with new values and saves it.
 * @param {string} collection - The collection name.
 * @param {DataObject} dat - The data object.
 * @returns {Promise<void>} - A Promise that resolves when the update is complete.
 */
async function updateData(collection, dat) {
  await node.call("update", collection, dat, getNewData(dat));
  window.location.reload();
}

/**
 * Edits the values of a data object using a modal dialog.
 * @param {string} collection - The collection name.
 * @param {DataObject} dat - The data object.
 * @returns {Promise<void>} - A Promise that resolves when the editing is complete.
 */
async function editValues(collection, dat) {
  const data = (await node.call("read", collection, dat))[0];
  const fields = Object.keys(data).slice(0, -2);
  if (fields.includes("$id")) {
    fields.pop();
  }

  const desc = fields.map((field) => {
    let value = data[field];
    let type = getType(field);
    if (type === "date") {
      value = formatTime(value, true);
    }
    return `
      <div class="mb-3 input-group">
        <label class="input-group-text">${field}</label>
        <input id="editValue__${field.split(" ").join("_")}" type="${type}" class="form-control" value="${value}">
      </div>`;
  });

  Modal.create(
    [`Edit ID#${dat.ID}`],
    desc,
    [
      Modal.button("Save", "btn-outline-warning", "modalSave", async () => {
        await updateData(collection, dat);
      }),
      Modal.close("Cancel"),
    ]
  );
}

/**
 * Creates a new data entry using a modal dialog.
 * @param {string} collection - The collection name.
 * @param {string[]} fields - The fields for the new data entry.
 * @returns {Promise<void>} - A Promise that resolves when the data entry is created.
 */
async function createData(collection, fields) {
  Modal.create(
    [`New Entry`],
    fields.map((field) => `
      <div class="mb-3 input-group">
        <label class="input-group-text">${field}</label>
        <input id="editValue__${field.split(" ").join("_")}" type="${getType(field)}" class="form-control">
      </div>`
    ),
    [
      Modal.button("Save", "btn-outline-warning", "modalSave", async () => {
        await node.call('create', collection, getNewData(fields));
        window.location.reload();
      }),
      Modal.close("Cancel"),
    ]
  );
}

/**
 * Creates a new data entry using a modal dialog.
 * @param {string} collection - The collection name.
 * @param {string[]} fields - The fields for the new data entry.
 * @returns {Promise<void>} - A Promise that resolves when the data entry is created.
 */
async function feedData(collection, fields) {
fields = fields.slice(0, -2);
if (fields.includes("$id")) {
  fields.pop();
}

const desc = fields.map((field) => {
  const type = getType(field);
  return `
    <div class="mb-3 input-group">
      <label class="input-group-text">${field}</label>
      <input id="editValue__${field.split(" ").join("_")}" type="${type}" class="form-control">
    </div>`;
});

Modal.create(
  ["New Entry"],
  desc,
  [
    Modal.button("Save", "btn-outline-warning", "modalSave", async () => {
      await node.call('create', collection, getNewData(fields));
      window.location.reload();
    }),
    Modal.close("Cancel"),
  ]
);
}


// node.load('t1')
async function loadFromFile() {

  let desc = `
  <select class="form-select" aria-label="Database Select" id="dbType">
    <option selected value="t1">Basic Information</option>
    <option value="t2">Courses</option>
    <option value="t3">Relations</option>
    <option value="t4">Reports</option>
    <option value="t5">Remarks</option>
    <option value="t6">Leaves</option>
  </select>
  <hr>
  <div class="input-group mb-3">
    <input type="file" class="form-control" id="dbFile" accept=".csv">
  </div>
  `;
  

  Modal.create(
    ["Import from CSV"],
    [desc],
    [
      Modal.button("Import", "btn-outline-info", "modalImport", async () => {
        let inputfile = document.getElementById("dbFile").files;
        let dbType = document.getElementById("dbType").value;
        let path = inputfile[0].path

        await node.load(path, dbType)

        window.location.reload()
      }),
      Modal.close("Cancel")
    ]
  )
}