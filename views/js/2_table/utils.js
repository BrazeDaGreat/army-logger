
/**
 * Reloads the user table with a filtered query based on search input.
 */
async function reloadUserTable() {
  const n = document.getElementById("searchUser").value;
  if (n.length < 1 || n === "") {
    displayTable('t1', 'tabledata', { }, ["Permanent Address", "Current Address", "BTY"]);
  } else {
    displayTable('t1', 'tabledata', {}, ["Permanent Address", "Current Address", "BTY", "Phone"], "", true, true, async (v) => {
      let name = v["Name"].toLowerCase()
      let id = n.toLowerCase()
      if (name.startsWith(id)) return true;
      return false;
    })
  }
}