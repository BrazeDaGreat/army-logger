
/**
 * Reloads the user table with a filtered query based on search input.
 */
async function reloadUserTable() {
  const n = document.getElementById("searchUser").value;
  if (n.length < 1 || n === "") {
    displayTable('t1', 'tabledata', { }, ["Permanent Address", "Current Address", "BTY"]);
  } else {
    let x = await db.filter('t1', { Name: n })
    if (x.length < 1 || x == false) {
      displayTable('t1', 'tabledata', { }, ["Permanent Address", "Current Address", "BTY"]);
    } else {
      displayTable('t1', 'tabledata', { Name: n }, ["Permanent Address", "Current Address", "BTY", "Phone"])
    }
  }
}