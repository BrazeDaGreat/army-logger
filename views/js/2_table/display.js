async function displayTable(collection = 't1', id='tabledata', qu={}, omit=[], attr="", feedable=true) {
    // const data = await node.call('read', collection, qu, {});
    const data = await db.filter(collection, qu)
    if (data == null || data == undefined || data == false) {
      let tdata = await db.get(collection)
      if (feedable == true) {
        if (sessionStorage.getItem('permissions').includes('@feed-data') || sessionStorage.getItem('permissions').includes('@admin')) {
          let thtml = `<br><button class="btn btn-outline-warning" data-bs-toggle="modal" data-bs-target="#modal" onclick="createData('${collection}', ${JSON.stringify(Object.keys(tdata[0])).replace(/"/g, '\'')})">
          <i class="bi bi-plus-circle"></i> New Data
          </button><br>`
          const element = document.getElementById(id);
          if (!element) return;
          element.innerHTML = thtml;
          return
        }
      }
    }
    // console.log(data)
    if (data.length == 0) return
    const element = document.getElementById(id);
  
    if (!element) {
      // console.error("Element with id 'tabledata' not found.");
      return;
    }
  
    let tableHTML = '<table id="'+id+'" class="table table-hover" '+attr+'>';
  
    // Check if data is an array
    if (Array.isArray(data)) {
      // Generate table headers
      tableHTML += '<thead><tr>';
      if (sessionStorage.getItem('permissions').includes("@admin")) {
        tableHTML += '<th scope="col">Edit</th>'
      }
      for (const key in data[0]) {
        if (omit.includes(key)) { continue }
        tableHTML += '<th scope="col">' + key + '</th>';
      }
      tableHTML += '</tr></thead><tbody>';
  
      // Generate table rows
      // console.log(data)
      for (const item of data) {
        if (collection == 't2') {
          console.log(item)
        }
        tableHTML += '<tr>';
        if (sessionStorage.getItem('permissions').includes("@admin")) {
          tableHTML += `
          <td>
            <button
              class="btn btn-outline-warning" data-bs-toggle="modal" data-bs-target="#modal" onclick="editValues('${collection}', ${JSON.stringify(item).replace(/"/g, '\'')})">
              <i class="bi bi-pencil-fill"></i>
            </button>
          </td>
          `
        }

        for (const key in item) {
          
          if (omit.includes(key)) { continue }
          if (key == "ID") {
            tableHTML += '<th scope="row"><a href="#" onclick=\'showProfile("'+ item[key] +'")\'>'+ item[key] +'</a></th>'
            continue
          }
          if (key == "DOB" || key == "DOE" || key == "Date Left" || key == "Date Back") {
            tableHTML += '<td>'+ formatTime(item[key]) +'</td>'
            continue
          }
          tableHTML += '<td>' + item[key] + '</td>';
        }
        tableHTML += '</tr></tbody>';
      }
    } else {
      console.error("Data is not an array.");
      tableHTML += '<tr><td colspan="2">Invalid data format</td></tr>';
    }
  
    tableHTML += '</table>';
    if (feedable == true) {
      if (sessionStorage.getItem('permissions').includes('@feed-data') || sessionStorage.getItem('permissions').includes('@admin')) {
        tableHTML += `<br><button class="btn btn-outline-warning" data-bs-toggle="modal" data-bs-target="#modal" onclick="createData('${collection}', ${JSON.stringify(Object.keys(data[0])).replace(/"/g, '\'')})">
        <i class="bi bi-plus-circle"></i> New Data
        </button><br>`
      }
    }
    element.innerHTML = tableHTML;
}