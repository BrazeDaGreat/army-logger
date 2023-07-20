/**
 * Shows the user profile page for the specified ID.
 * @param {string} id - The ID of the user profile.
 */
function showProfile(id) {
  sessionStorage.setItem("profile", id);
  window.location.href = "profile.html";
}

/**
 * Generates statistics for leave data and displays them.
 * @param {DataObject[]} obj - The leave data.
 */
function generateLeaveStats(obj) {
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
        <h6 class="text-success pt-1 fw-bold">${count}</h6>
        <span class="text-muted small pt-2 ps-1">@ <b>${location}</b></span>
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
  const leaveData = await node.call('read', 't6');
  generateLeaveStats(leaveData);

  const userData = await node.call('read', 't1');
  const courseData = await node.call('read', 't2');
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

  displayTable('t1', 'tabledata', {}, ["Permanent Address", "Current Address", "BTY"]);
  document.getElementById("userEmail").outerHTML = sessionStorage.getItem('email');

  if (sessionStorage.getItem('email') === "admin@ex.com") {
    setElement("adminDashboard",
      `<li class="nav-item">
        <a class="nav-link collapsed" href="./admin.html">
          <i class="bi bi-hammer"></i>
          <span>Admin Dashboard</span>
        </a>
      </li>`
    );
  }
}