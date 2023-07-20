/**
 * @typedef {Object} DataObject
 * @property {string} ID - The ID of the data object.
 * @property {string} Location - The location of the data object.
 */

/**
 * @typedef {Object} NewDataObject
 * @property {string} ID - The ID of the new data object.
 * @property {string} Location - The location of the new data object.
 * @property {string} [Permanent_Address] - The permanent address of the new data object.
 * @property {string} [Current_Address] - The current address of the new data object.
 * @property {string} [BTY] - The BTY of the new data object.
 */

/**
 * @typedef {Object} UserCredentials
 * @property {string} email - The user's email.
 * @property {string} password - The user's password.
 */

/**
 * Displays an alert box with the specified message.
 * @param {string} message - The message to display in the alert box.
 */
function alertBox(message) {
    document.getElementById("alert").innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
          ${message}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div><br><br>`;
}

/**
 * Sets the innerHTML of an element with the specified value.
 * @param {string} id - The ID of the element.
 * @param {string} value - The value to set.
 */
function setValue(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.innerHTML = value;
  }
}

/**
 * Replaces an element with the specified HTML content.
 * @param {string} id - The ID of the element to replace.
 * @param {string} html - The HTML content to use as the replacement.
 */
function setElement(id, html) {
  const element = document.getElementById(id);
  if (element) {
    element.outerHTML = html;
  }
}

/**
 * Loads the profile data for the user with the specified ID.
 * @returns {Promise<void>} - A Promise that resolves when the profile data is loaded.
 */
async function loadData() {
    const id = sessionStorage.getItem("profile");
    const t1 = await node.call('read', 't1', { ID: id });
    console.log(t1);
    const profileData = t1[0];
  
    const dob = `${formatTime(profileData["DOB"])} (${formatAge(profileData["DOB"])})`;
    const doe = `${formatTime(profileData["DOE"])} (${formatAge(profileData["DOE"])})`;
  
    setElement("profileOverview", `
      <img src="assets/img/profile-img.jpg" alt="Profile" class="rounded-circle">
      <h2>${profileData["Rank"]} ${profileData["Name"]}</h2>
      <h3>ID#. ${profileData["ID"]}</h3>
    `);
  
    setValue("valueId", profileData["ID"]);
    setValue("valueBty", profileData["BTY"]);
    setValue("valueName", profileData["Name"]);
    setValue("valueLocation", profileData["Current Address"]);
    setValue("valueDOB", dob);
    setValue("valueDOE", doe);
    // setValue("valueNote", profileData["Note"]);
    setValue("valueRank", profileData["Rank"]);
    setValue("valuePerma", profileData["Permanent Address"]);
    setValue("valueNo", profileData["Phone No#"]);
  
    displayTable('t2', 't2', { ID: id }, ["ID"], "class='table table-bordered'");
    displayTable('t3', 't3', { ID: id }, ["ID"], "class='table table-bordered'");
    displayTable('t4', 't4', { ID: id }, ["ID"], "class='table table-bordered'");
    displayTable('t5', 't5', { ID: id }, ["ID"], "class='table table-bordered'", false);
    displayTable('t6', 't6', { ID: id }, ["ID"], "class='table table-bordered'");
}

/**
 * Formats a Unix timestamp to a date string.
 * @param {number|string} unix - The Unix timestamp.
 * @param {boolean} [ymd=false] - Whether to format the date as "YYYY-MM-DD".
 * @returns {string} - The formatted date string.
 */
function formatTime(unix, ymd = false) {
  const date = new Date(unix * 1000);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-based
  const year = date.getFullYear();
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  if (ymd) {
    return `${year}-${formattedMonth}-${formattedDay}`;
  }

  return `${formattedDay}-${formattedMonth}-${year}`;
}

/**
 * Formats a date of birth to an age string.
 * @param {number|string} dob - The date of birth as a Unix timestamp.
 * @returns {string} - The formatted age string.
 */
function formatAge(dob) {
  const now = new Date();
  const birthDate = new Date(dob * 1000);

  let ageYears = now.getFullYear() - birthDate.getFullYear();
  let ageMonths = now.getMonth() - birthDate.getMonth();
  let ageDays = now.getDate() - birthDate.getDate();

  // Adjust age if birth month is ahead of current month
  if (ageMonths < 0 || (ageMonths === 0 && ageDays < 0)) {
      ageYears--;
      ageMonths += 12;
  }

  // Adjust age if birth day is ahead of current day
  if (ageDays < 0) {
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth(), 0);
      ageDays += lastMonthDate.getDate();
      ageMonths--;
  }

  return `${ageYears}y ${ageMonths}m ${ageDays}d`;
}