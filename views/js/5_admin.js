const PERMISSIONS = [
    "@view-profiles",
    "@add-remarks",
    "@feed-data",
    "@admin"
];

/**
 * Renders the admin page with account data and permissions.
 * @returns {Promise<void>} - A Promise that resolves when the rendering is complete.
 */
async function renderAdmin() {
    // const creds = await node.creds('read', 'credentials');
    // const credsVar = await creds.get('')
    const credsVar = await creds.get('accounts');
    renderAccounts(credsVar, PERMISSIONS, "adminAccounts");
}

/**
 * Renders the accounts data with the provided credentials and permissions list.
 * @param {Account[]} credsVar - The array of account credentials.
 * @param {string[]} permsList - The list of available permissions.
 * @param {string} id - The ID of the container element to render the accounts.
 */
function renderAccounts(credsVar, permsList, id) {
    const container = document.getElementById(id);
    if (!container) {
      console.error(`Element with ID '${id}' not found.`);
      return;
    }
  
    function getDelete(email) {
      // if (email !== "admin@ex.com") {
      if (email !== "admin") {
        return `<a class='btn btn-danger' href="#" onclick="deleteAccount('${email}')">Delete</a>`;
      }
      return `<a class='btn btn-danger disabled' href="#">Delete</a>`;
    }
  
    // Create the html
    // const html = credsVar.map((account) => {
    const html = Object.keys(credsVar).map((account) => {
      let email = account
      const { password, permissions } = credsVar[account];
  
      const permissionsHTML = permsList.map((perm) => {
        return `
          <input
            class="form-check-input"
            type="checkbox"
            value="${perm}"
            ${permissions.includes(perm) ? "checked" : ""}
            email="${email}"
            perm="${perm}"
          />
          <label>${perm}</label>
          <br>
        `;
      }).join("");
  
      return `
        <div class="col-lg-6">
          <div class="card">
            <div class="card-header">
              <ul class="nav nav-pills card-header-pills">
                <li class="nav-item">
                  ${getDelete(email)}
                </li>
              </ul>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-6">
                  <div class="">
                    <label for="email_${email}" class="form-label">Username</label>
                    <input disabled type="text" class="form-control" id="email_${email}" value="${email}">
                  </div>
                  <div class="">
                    <label for="password_${email}" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password_${email}" value="${password}">
                  </div>
                </div>
                <div class="col-6">
                  <h5>Permissions</h5>
                  ${permissionsHTML}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");
  
    container.outerHTML = html;
}

/**
 * Deletes the account with the specified email.
 * @param {string} email - The email of the account to delete.
 * @returns {Promise<void>} - A Promise that resolves when the account is deleted.
 */
async function deleteAccount(email) {
    await creds.delete(`accounts.${email}`)
    window.location.reload();
}

/**
 * Saves the updated account settings to the database.
 * @returns {Promise<void>} - A Promise that resolves when the settings are saved.
 */
async function saveSettings() {
    const credsVar = await creds.get('accounts');

    const settings = {}
    Object.keys(credsVar).forEach(email => {
      let emailInput = document.getElementById(`email_${email}`);
      const passwordInput = document.getElementById(`password_${email}`);
      const checkboxes = document.querySelectorAll(`input[type="checkbox"][email="${email}"]:checked`);
      settings[emailInput.value] = {
        password: passwordInput.value,
        permissions: Array.from(checkboxes).map((checkbox) => checkbox.getAttribute('perm'))
      }
    })
    await creds.set('accounts', settings);

    location.reload()
}

/**
 * Creates a new account with the provided email and password.
 * @returns {Promise<void>} - A Promise that resolves when the new account is created.
 */
async function newAccount() {
    Modal.create(
        ["New Account"],
        [
        `
        <div class="mb-3">
            <label class="form-label">Username</label>
            <input type="text" class="form-control" id="modalEmail">
        </div>
        <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" id="modalPass">
        </div>
        `
        ],
        [Modal.button("Create", "btn-outline-success", 'modalCreateAccount', async () => {
        const email = document.getElementById('modalEmail').value;
        const pass = document.getElementById('modalPass').value;
        // await node.creds('create', 'credentials', { email: email, password: pass, permissions: [] });
          await creds.set(`accounts.${email}`, { password: pass, permissions: []})
        window.location.reload();
        }), Modal.close("Cancel")]
    );
}
  