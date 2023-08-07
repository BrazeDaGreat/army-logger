
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

function highlightButton(onclick="", icon="window-plus") {
  return `<button onclick="${onclick}" data-bs-toggle="modal" data-bs-target="#modal" class='btn btn-dark' style="padding: 0px; margin:0px; width: 80%"><i class="bi bi-${icon}"></i></button>`
}

function highlightSpan(text) {
  return `<span class="badge bg-dark">${text}</span>`
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
      highlightButton(`openLeaveRemark(${count},'${remark}')`),
      `<span class="badge bg-dark">${count} @ ${remark}</span>`,
      "#5499C7"
    )
  }


  /* Leave Time */
  let lastLeavesPreFilter = {}
  for (const leaveE of leaves) {
    lastLeavesPreFilter[leaveE["ID"]] = leaveE
  }
  // console.log(lastLeavesPreFilter)

  let lastLeavesFilter = []
  for (const leaveE of Object.values(lastLeavesPreFilter)) {
    if (leaveE["Remarks"] == "Unit") continue;
    lastLeavesFilter.push({ ID: leaveE["ID"], "Date Left": leaveE["Date Left"] })
  }
  // console.log(lastLeavesFilter)


  const leaveDates = {
    '6+': [],
    '5+': [],
    '4+': [],
    '3+': [],
    '2+': [],
    '1-': [],
  };
  
  const currentDate = new Date(); // Get the current date and time
  
  lastLeavesFilter.forEach(leave => {
    const leaveDate = new Date(leave['Date Left'] * 1000); // Convert Unix timestamp to milliseconds
  
    const timeDiffMonths = (currentDate - leaveDate) / (1000 * 60 * 60 * 24 * 30); // Calculate months difference
    if (timeDiffMonths >= 6) {
      leaveDates['6+'].push(leave);
    } else if (timeDiffMonths >= 5) {
      leaveDates['5+'].push(leave);
    } else if (timeDiffMonths >= 4) {
      leaveDates['4+'].push(leave);
    } else if (timeDiffMonths >= 3) {
      leaveDates['3+'].push(leave);
    } else if (timeDiffMonths >= 2) {
      leaveDates['2+'].push(leave);
    } else if (timeDiffMonths >= 1) {
      leaveDates['1+'].push(leave);
    } else if (timeDiffMonths < 1) {
      leaveDates['1-'].push(leave);
    }
  });

  // console.log(leaveDates)

  elmnt.innerHTML += highlightSection("", highlightSpan("Leave Times"), "lightgreen")

  Object.keys(leaveDates).forEach(l => {
    if (leaveDates[l].length < 1) return;
    elmnt.innerHTML += highlightSection(
      highlightButton(`openLeaveDate('${l}')`),
      highlightSpan(`${leaveDates[l].length} @ ${l} month(s)`), "green"
    )
  })

  elmnt.innerHTML += `
  <div class="row">
    <div class="mb-2 col-8">
      <label for="leaveDaysCount" class="form-label">Search by days</label>
      <input type="number" class="form-control" id="leaveDaysCount" value=0 min=0>
      </div>
    <div class="mb-2 col-2">
      <label for="leaveDaysCount" class="form-label">&nbsp;</label>
      <button class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#modal" onclick="openLeaveDay(document.getElementById('leaveDaysCount').value)"><i class="bi bi-search"></i></button>
    </div>
  </div>

  `


  // elmnt.innerHTML += highlightSection("10m ago", "hlo awaaz aarhi ha", "blue")
  // elmnt.innerHTML += highlightSection("10m ago", "chai peelo friends", "green")
  // elmnt.innerHTML += highlightSection("10m ago", "ankal ji paani pila dijiye")
}

async function lastLeaves(remarks=["Unit", "Emergency Leave", "Leave"]) {
  const leaves = await db.get('t6');


  let lastLeaves = {}
  for (const leaveE of leaves) {
    lastLeaves[leaveE["ID"]] = leaveE
  }

  let lastLeavesFilter = {}
  for (const leaveE of Object.values(lastLeaves)) {
    if (!remarks.includes(leaveE["Remarks"])) continue
    lastLeavesFilter[leaveE["ID"]] = leaveE
  }

  return lastLeavesFilter
}

async function openLeaveDay(count) {

  function moreThanXDays(unix, days) {
    console.log(days)
    days = Number(days)
    const currentUnix = Math.floor(Date.now() / 1000);
    const differenceInSeconds = currentUnix - unix;
    const daysInSeconds = days * 24 * 60 * 60;
    
    return differenceInSeconds >= daysInSeconds;
}

  // console.log(count)

  const leaves = await lastLeaves(["Emergency Leave", "Leave"])
  // console.log(leaves)

  Modal.create(
    [`@ >= ${count} days`],
    [`<wrapper id="leaveDateTable"></wrapper>`],
    [
      Modal.close('Close')
    ]
  )

  displayTable('t6', 'leaveDateTable', {}, [], "", false, false, async (v) => {

    if (leaves[v["ID"]] == undefined) return false

    ret1 = false
    ret3 = false
    
    // Knowing if it is the final copy
    let u = await db.filter('t6', { ID: v["ID"] })
    if ( arraysEqual(v, u[u.length -1]) ) ret1 = true
    if (moreThanXDays(leaves[v["ID"]]["Date Left"], count)) ret3 = true

    // console.log(ret1 && ret3)
    return (ret1 && ret3)
  })

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

async function openLeaveDate(l) {

  const leaves = await db.get('t6');

  let lastLeavesPreFilter = {}
  for (const leaveE of leaves) {
    lastLeavesPreFilter[leaveE["ID"]] = leaveE
  }
  // console.log(lastLeavesPreFilter)

  let lastLeavesFilter = []
  for (const leaveE of Object.values(lastLeavesPreFilter)) {
    if (leaveE["Remarks"] == "Unit") continue;
    lastLeavesFilter.push({ ID: leaveE["ID"], "Date Left": leaveE["Date Left"] })
  }
  // console.log(lastLeavesFilter)


  const leaveDates = {
    '6+': [],
    '5+': [],
    '4+': [],
    '3+': [],
    '2+': [],
    '1-': [],
  };
  
  const currentDate = new Date(); // Get the current date and time
  
  lastLeavesFilter.forEach(leave => {
    const leaveDate = new Date(leave['Date Left'] * 1000); // Convert Unix timestamp to milliseconds
  
    const timeDiffMonths = (currentDate - leaveDate) / (1000 * 60 * 60 * 24 * 30); // Calculate months difference
    if (timeDiffMonths >= 6) {
      leaveDates['6+'].push(leave);
    } else if (timeDiffMonths >= 5) {
      leaveDates['5+'].push(leave);
    } else if (timeDiffMonths >= 4) {
      leaveDates['4+'].push(leave);
    } else if (timeDiffMonths >= 3) {
      leaveDates['3+'].push(leave);
    } else if (timeDiffMonths >= 2) {
      leaveDates['2+'].push(leave);
    } else if (timeDiffMonths >= 1) {
      leaveDates['1+'].push(leave);
    } else if (timeDiffMonths < 1) {
      leaveDates['1-'].push(leave);
    }
  });

  console.log(leaveDates[l])

  Modal.create(
    [`@ ${l}`],
    [`<wrapper id="leaveDateTable"></wrapper>`],
    [
      Modal.close('Close')
    ]
  )

  displayTable('t6', 'leaveDateTable', {}, [], "", false, false, async (v) => {
    ret1 = false
    ret2 = false
    
    // Knowing if it is the final copy
    let u = await db.filter('t6', { ID: v["ID"] })
    if ( arraysEqual(v, u[u.length -1]) ) ret1 = true

    leaveDates[l].forEach(i => {
      if (v["ID"] == i["ID"]) ret2 = true
    })

    return (ret1 && ret2)
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