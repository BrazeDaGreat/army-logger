/**
 * Attempts to log in the user with the provided credentials.
 * @returns {Promise<void>} - A Promise that resolves when the login process is complete.
 */
async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const userCredentials = {
        email: email,
        password: password,
    };

    const data = await node.creds('read', 'credentials', userCredentials);
    if (data.length > 0) {
        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('permissions', data[0].permissions.join(","));
        window.location.href = './dashboard.html';
    } else {
        alertBox("Wrong email or password.");
    }
}

/**
 * Logs out the current user and redirects to the index page.
 */
function logout() {
    sessionStorage.setItem('loggedIn', 'false');
    sessionStorage.setItem('email', 'false');
    sessionStorage.setItem('password', 'false');
    window.location.href = './index.html';
}