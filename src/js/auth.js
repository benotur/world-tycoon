document.addEventListener('DOMContentLoaded', () => {
    checkAuthOnLoad();

    // Auth modal tab switching
    document.getElementById('show-login').onclick = () => {
        document.getElementById('login-form').style.display = '';
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('show-login').classList.add('active');
        document.getElementById('show-register').classList.remove('active');
    };
    document.getElementById('show-register').onclick = () => {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = '';
        document.getElementById('show-login').classList.remove('active');
        document.getElementById('show-register').classList.add('active');
    };

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

        const snapshot = await firebase.database().ref('users').orderByChild('username').equalTo(username).once('value');
        if (snapshot.exists()) {
            document.getElementById('register-error').textContent = 'Username is already taken.';
            return;
        }

        const newUserRef = firebase.database().ref('users').push();
        await newUserRef.set({
            username: username,
            password: password
        });

        localStorage.setItem('wt_user', JSON.stringify({ username, userKey: newUserRef.key }));

        document.getElementById('register-error').textContent = '';
        onAuthSuccess();
        location.reload();
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

        localStorage.setItem('wt_user', JSON.stringify({ username, userKey }));

        document.getElementById('login-error').textContent = '';
        onAuthSuccess();
        location.reload();
    };

    // Settings actions
    if (document.getElementById('settings-logout-btn')) {
        document.getElementById('settings-logout-btn').onclick = () => {
            localStorage.removeItem('wt_user');
            showAuthOnly();
            document.getElementById('settings-modal').classList.remove('active');
        };
    }

    if (document.getElementById('change-username-btn')) {
        document.getElementById('change-username-btn').onclick = async () => {
            const newUsername = document.getElementById('settings-username').value.trim();
            if (!newUsername.match(/^[a-zA-Z0-9_]+$/)) {
                document.getElementById('settings-error').textContent = 'Invalid username.';
                document.getElementById('settings-message').textContent = '';
                return;
            }
            const userKey = getCurrentUserKey();
            const snapshot = await firebase.database().ref('users').orderByChild('username').equalTo(newUsername).once('value');
            if (snapshot.exists()) {
                document.getElementById('settings-error').textContent = 'Username already taken.';
                document.getElementById('settings-message').textContent = '';
                return;
            }
            await firebase.database().ref('users/' + userKey + '/username').set(newUsername);
            let user = JSON.parse(localStorage.getItem('wt_user'));
            user.username = newUsername;
            localStorage.setItem('wt_user', JSON.stringify(user));
            document.getElementById('settings-message').textContent = 'Username changed!';
            document.getElementById('settings-error').textContent = '';
        };
    }

    if (document.getElementById('change-password-btn')) {
        document.getElementById('change-password-btn').onclick = async () => {
            const newPassword = document.getElementById('settings-password').value;
            if (newPassword.length < 6) {
                document.getElementById('settings-error').textContent = 'Password too short.';
                document.getElementById('settings-message').textContent = '';
                return;
            }
            const userKey = getCurrentUserKey();
            await firebase.database().ref('users/' + userKey + '/password').set(newPassword);
            document.getElementById('settings-message').textContent = 'Password changed!';
            document.getElementById('settings-error').textContent = '';
        };
    }

    if (document.getElementById('delete-account-btn')) {
        document.getElementById('delete-account-btn').onclick = async () => {
            if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
            const userKey = getCurrentUserKey();
            await firebase.database().ref('users/' + userKey).remove();
            localStorage.removeItem('wt_user');
            showAuthOnly();
            document.getElementById('settings-modal').classList.remove('active');
        };
    }
});

function getCurrentUserKey() {
    const user = JSON.parse(localStorage.getItem('wt_user'));
    return user && user.userKey ? user.userKey : null;
}
window.getCurrentUserKey = getCurrentUserKey;

function checkAuthOnLoad() {
    const user = JSON.parse(localStorage.getItem('wt_user'));
    if (!user || !user.userKey) {
        showAuthOnly();
    } else {
        onAuthSuccess();
    }
}

function showAuthOnly() {
    document.getElementById('auth-modal').classList.add('active');
    document.getElementById('game-ui').classList.remove('active');
    document.getElementById('starter-country-modal').classList.remove('active');
}

function onAuthSuccess() {
    document.getElementById('auth-modal').classList.remove('active');
    document.getElementById('game-ui').classList.add('active');
    if (!window.mapInitialized) {
        window.mapInitialized = true;
        if (typeof startGame === "function") startGame();
    }
    // Always check the database for starter country
    loadGameState((game) => {
        if (!game || !game.starterCountry) {
            // No starter country chosen, show modal
            showStarterCountryModal();
        } else {
            // Starter country exists, hide modal if open
            document.getElementById('starter-country-modal').classList.remove('active');
        }
    });
}