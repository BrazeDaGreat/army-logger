/**
 * Shows the user profile page for the specified ID.
 * @param {string} id - The ID of the user profile.
 */
function showProfile(id) {
  sessionStorage.setItem("profile", id);
  window.location.href = "profile.html";
}

/**
 * Loads the profile data for the user with the specified ID.
 * @returns {Promise<void>} - A Promise that resolves when the profile data is loaded.
 */
async function loadData() {
  const id = sessionStorage.getItem("profile");
  // const t1 = await node.call('read', 't1', { ID: Number(id) });
  const t1 = await db.filter('t1', { ID: Number(id) });
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
  setValue("valueNo", profileData["Phone"]);

  displayTable('t2', 't2', { ID: Number(id) }, ["ID"], "class='table table-bordered'");
  displayTable('t3', 't3', { ID: Number(id) }, ["ID"], "class='table table-bordered'");
  displayTable('t4', 't4', { ID: Number(id) }, ["ID"], "class='table table-bordered'");
  displayTable('t5', 't5', { ID: Number(id) }, ["ID"], "class='table table-bordered'", false);
  displayTable('t6', 't6', { ID: Number(id) }, ["ID"], "class='table table-bordered'");
}