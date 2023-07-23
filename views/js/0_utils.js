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
 * Formats a Unix timestamp to a date string.
 * @param {number|string} unix - The Unix timestamp.
 * @param {boolean} [ymd=false] - Whether to format the date as "YYYY-MM-DD".
 * @returns {string} - The formatted date string.
 */
function formatTime(unix, ymd = false) {
  if (unix == "-") return "N/A";
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
  if (dob == "-") return "N/A";
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

/**
 * Generates statistics for leave data and displays them.
 * @param {DataObject[]} obj - The leave data.
 */
function generateLeaveStats(obj) {
  if (obj == null || obj == {}) return;
  const lastLocations = {};
  for (const { ID, Location } of obj) {
    lastLocations[ID] = Location;
  }

  const countByLocation = {};
  for (const location of Object.values(lastLocations)) {
    countByLocation[location] = (countByLocation[location] || 0) + 1;
  }

  const leaveStatsElement = document.getElementById("leaveStats");
  const html = [];
  if (leaveStatsElement) {
    for (const [location, count] of Object.entries(countByLocation)) {
      html.push(`
      <!--
        <h6 class="text-success pt-1 fw-bold">${count}</h6>
        <span class="text-muted small pt-2 ps-1">@ <b>${location}</b></span>
      -->
      <span class="pt-1" style="font-size: 1.25rem;">
        <span class="text-success fw-bolder">${count}</span> @ <span class="text-muted fw-bold">${location}</span>
      </span>
        
        <br>
      `);
    }
    leaveStatsElement.outerHTML = html.join("");
  }
}

/**
 * Renders the page and displays various statistics and tables.
 * @returns {Promise<void>} - A Promise that resolves when the rendering is complete.
 */
async function render() {
  // const leaveData = await node.call('read', 't6');
  const leaveData = await db.read('t6');
  if (!(leaveData == null || leaveData == {})) {
    generateLeaveStats(leaveData);
  }

  // const userData = await node.call('read', 't1');
  const userData = await db.read('t1');
  if (userData == null || userData == {}) return;
  // const courseData = await node.call('read', 't2');
  const courseData = await db.read('t2');
  if (!(courseData == null || courseData == {})) {
    setElement("userStats", `
      <div class="d-flex align-items-center">
        <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
          <i class="bi bi-people-fill"></i>
        </div>
        <h6 class="text-primary pt-1 fw-bold ps-3">${userData.length}</h6>
        <span class="text-muted small pt-2 ps-1">Users</span>
      </div>
      <div class="d-flex align-items-center">
        <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
          <i class="bi bi-book-half"></i>
        </div>
        <h6 class="text-success pt-1 ps-3 fw-bold">${courseData.length}</h6>
        <span class="text-muted small pt-2 ps-1">Courses</span>
      </div>
    `);
  }

  displayTable('t1', 'tabledata', {}, ["Permanent Address", "Current Address", "BTY"]);
  document.getElementById("userEmail").outerHTML = sessionStorage.getItem('email');

  if (sessionStorage.getItem('email') === "admin") {
    setElement("adminDashboard",
      `<li class="nav-item">
        <a class="nav-link collapsed" href="./admin.html">
          <i class="bi bi-hammer"></i>
          <span>Admin Dashboard</span>
        </a>
      </li>`
    );
  }

  renderHighlights()
}