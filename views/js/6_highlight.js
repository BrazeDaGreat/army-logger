
function highlightSection(label, content, color="red") {
  return `
  <div class="activity-item d-flex">
    <div class="activite-label">${label}</div>
      <i class='bi bi-square-fill activity-badge align-self-start' style="color: ${color}"></i>
      <div class="activity-content">
        ${content}
      </div>
    </div>
  </div>
  `
}

async function renderHighlights() {
  let elmnt = document.getElementById("highlightActivity")
  elmnt.innerHTML = ""
  
  // Getting useful data
  let users = await db.get('t1'); // Users
  let leaves = await db.get('t6'); // Leaves

  // amount of people on leave using remarks
  const lastRemarks = {};
  for (const { ID, Remarks } of leaves) {
    lastRemarks[ID] = Remarks
  }
  const countByRemarks = {}
  for (const remark of Object.values(lastRemarks)) {
    countByRemarks[remark] = (countByRemarks[remark] || 0) + 1;
  }


  /* Total Users */
  elmnt.innerHTML += highlightSection("", `<span class="badge bg-dark">${users.length} users</span>`, "#1A5276")

  // Leave stats
  for (const [remark, count] of Object.entries(countByRemarks)) {
    elmnt.innerHTML += highlightSection(
      `<button onclick="openLeaveRemark(${count},'${remark}')" data-bs-toggle="modal" data-bs-target="#modal" class='btn btn-dark' style="padding: 0px; margin:0px; width: 80%"><i class="bi bi-window-plus"></i></button>`,
      `<span class="badge bg-dark">${count} @ ${remark}</span>`,
      "#5499C7"
    )
  }



  // elmnt.innerHTML += highlightSection("10m ago", "hlo awaaz aarhi ha", "blue")
  // elmnt.innerHTML += highlightSection("10m ago", "chai peelo friends", "green")
  // elmnt.innerHTML += highlightSection("10m ago", "ankal ji paani pila dijiye")
}
async function openLeaveRemark(count, remark) {
  Modal.create(
    [`${count} @ ${remark}`],
    [`<wrapper id="remarkTable"></wrapper>`],
    [
      Modal.close('Close')
    ]
  )

  displayTable('t6', 'remarkTable', { Remarks: remark }, [], "", false, false, async (v) => {
    if (v["Date Back"] == "-") { return true }
    // console.log(v["Date Back"])
    let u = await db.filter('t6', { ID: v["ID"] })
    // console.log(v)
    // console.log(u[u.length -1])
    // console.log(arraysEqual(v, u[u.length -1]))
    if ( arraysEqual(v, u[u.length -1]) ) return true;
    return false
  })
}

function hasDatePassed(unix) {
  const currentUnixTimestamp = Math.floor(Date.now() / 1000); // Convert to seconds

  return !(currentUnixTimestamp >= unix);
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}