document.addEventListener('DOMContentLoaded', () => {
    setupNav();
    checkSession();
});

function setupNav() {
    document.getElementById('nav-login').onclick = () => showSection('login');
    document.getElementById('nav-register').onclick = () => showSection('register');
    document.getElementById('nav-game').onclick = () => showSection('game');
    document.getElementById('nav-leaderboard').onclick = () => showSection('leaderboard');
    document.getElementById('nav-settings').onclick = () => showSection('settings');
}

function showSection(section) {
    document.getElementById('login-section').style.display = section === 'login' ? 'block' : 'none';
    document.getElementById('register-section').style.display = section === 'register' ? 'block' : 'none';
    document.getElementById('game-section').style.display = section === 'game' ? 'block' : 'none';
    document.getElementById('leaderboard-section').style.display = section === 'leaderboard' ? 'block' : 'none';
    document.getElementById('settings-section').style.display = section === 'settings' ? 'block' : 'none';
}

function checkSession() {
    const user = JSON.parse(localStorage.getItem('wt_user'));
    if (user && user.username && user.userKey) {
        showApp();
    } else {
        showAuth();
    }
}

function showAuth() {
    showSection('login');
    document.getElementById('nav-login').style.display = 'inline-block';
    document.getElementById('nav-register').style.display = 'inline-block';
    document.getElementById('nav-game').style.display = 'none';
    document.getElementById('nav-leaderboard').style.display = 'none';
    document.getElementById('nav-settings').style.display = 'none';
}

function showApp() {
    showSection('game');
    document.getElementById('nav-login').style.display = 'none';
    document.getElementById('nav-register').style.display = 'none';
    document.getElementById('nav-game').style.display = 'inline-block';
    document.getElementById('nav-leaderboard').style.display = 'inline-block';
    document.getElementById('nav-settings').style.display = 'inline-block';
}