
/**
 * Reloads the user table with a filtered query based on search input.
 */
function reloadUserTable() {
  const n = document.getElementById("searchUser").value;
  if (n.length < 1 || n === "") {
    displayTable('t1', 'tabledata', { }, ["Permanent Address", "Current Address", "BTY"]);
  } else {
    displayTable('t1', 'tabledata', (x) => { return x.Name.includes(n); }, ["Permanent Address", "Current Address", "BTY"]);
  }
}