document.addEventListener('DOMContentLoaded', () => {
    // Leaderboard modal
    document.getElementById('nav-leaderboard').onclick = () => {
        document.getElementById('leaderboard-modal').classList.add('active');
        // Optionally trigger leaderboard refresh here
    };
    document.getElementById('close-leaderboard').onclick = () => {
        document.getElementById('leaderboard-modal').classList.remove('active');
    };

    // Settings modal
    document.getElementById('nav-settings').onclick = () => {
        document.getElementById('settings-modal').classList.add('active');
    };
    document.getElementById('close-settings').onclick = () => {
        document.getElementById('settings-modal').classList.remove('active');
    };

    // Hide popups on start
    document.getElementById('leaderboard-modal').classList.remove('active');
    document.getElementById('settings-modal').classList.remove('active');


    document.getElementById('nav-leaderboard').onclick = () => {
        document.getElementById('leaderboard-modal').classList.add('active');
        updateLeaderboard();
    };
    document.getElementById('close-leaderboard').onclick = () => {
        document.getElementById('leaderboard-modal').classList.remove('active');
    };
});