document.addEventListener('DOMContentLoaded', () => {
    // Register
    document.getElementById('register-btn').onclick = async () => {
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value;

        if (!username.match(/^[a-zA-Z0-9_]+$/)) {
            document.getElementById('register-error').textContent = 'Username must be letters, numbers, or underscores only.';
            return;
        }
        if (password.length < 6) {
            document.getElementById('register-error').textContent = 'Password must be at least 6 characters.';
            return;
        }

        // Check if username exists
        const snapshot = await firebase.database().ref('users').orderByChild('username').equalTo(username).once('value');
        if (snapshot.exists()) {
            document.getElementById('register-error').textContent = 'Username is already taken.';
            return;
        }

        // Store user with plain text password (for demo purposes)
        const newUserRef = firebase.database().ref('users').push();
        await newUserRef.set({
            username: username,
            password: password,
            countriesUnlocked: 1
        });

        // Save session
        localStorage.setItem('wt_user', JSON.stringify({ username, userKey: newUserRef.key }));

        document.getElementById('register-error').textContent = '';
        showApp();
    };

    // Login
    document.getElementById('login-btn').onclick = async () => {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        const snapshot = await firebase.database().ref('users').orderByChild('username').equalTo(username).once('value');
        if (!snapshot.exists()) {
            document.getElementById('login-error').textContent = 'Invalid username or password.';
            return;
        }
        let userData, userKey;
        snapshot.forEach(child => {
            userData = child.val();
            userKey = child.key;
        });

        if (password !== userData.password) {
            document.getElementById('login-error').textContent = 'Invalid username or password.';
            return;
        }

        // Save session
        localStorage.setItem('wt_user', JSON.stringify({ username, userKey }));

        document.getElementById('login-error').textContent = '';
        showApp();
    };

    // Logout (in settings)
    document.getElementById('logout-btn').onclick = async () => {
        localStorage.removeItem('wt_user');
        showAuth();
    };

    // Show change password area
    document.getElementById('change-password-btn').onclick = () => {
        document.getElementById('change-password-area').style.display = 'block';
        document.getElementById('change-password-error').textContent = '';
        document.getElementById('change-password-success').textContent = '';
    };

    // Change password
    document.getElementById('confirm-change-password-btn').onclick = async () => {
        const oldPassword = document.getElementById('old-password').value;
        const newPassword = document.getElementById('new-password').value;
        const user = JSON.parse(localStorage.getItem('wt_user'));
        if (!user || !user.userKey) return;

        const userRef = firebase.database().ref('users/' + user.userKey);
        const snapshot = await userRef.once('value');
        const userData = snapshot.val();

        if (oldPassword !== userData.password) {
            document.getElementById('change-password-error').textContent = 'Old password is incorrect.';
            document.getElementById('change-password-success').textContent = '';
            return;
        }
        if (newPassword.length < 6) {
            document.getElementById('change-password-error').textContent = 'New password must be at least 6 characters.';
            document.getElementById('change-password-success').textContent = '';
            return;
        }

        await userRef.update({ password: newPassword });

        document.getElementById('change-password-error').textContent = '';
        document.getElementById('change-password-success').textContent = 'Password changed successfully!';
        document.getElementById('old-password').value = '';
        document.getElementById('new-password').value = '';
    };

    // Delete account
    document.getElementById('delete-account-btn').onclick = async () => {
        if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
        const user = JSON.parse(localStorage.getItem('wt_user'));
        if (!user || !user.userKey) return;
        await firebase.database().ref('users/' + user.userKey).remove();
        localStorage.removeItem('wt_user');
        showAuth();
    };
});

// Helper to get current user key
function getCurrentUserKey() {
    const user = JSON.parse(localStorage.getItem('wt_user'));
    return user && user.userKey ? user.userKey : null;
}
window.getCurrentUserKey