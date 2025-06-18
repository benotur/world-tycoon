window.updateLeaderboard = function() {
    const leaderboard = document.getElementById('leaderboard');
    if (!leaderboard) return;
    firebase.database().ref('users').once('value')
        .then(snapshot => {
            const users = [];
            snapshot.forEach(child => {
                users.push(child.val());
            });
            users.sort((a, b) => (b.countriesUnlocked || 0) - (a.countriesUnlocked || 0));
            leaderboard.innerHTML = '';
            users.slice(0, 10).forEach(user => {
                leaderboard.innerHTML += `<li>${user.username}: ${user.countriesUnlocked || 0} countries unlocked</li>`;
            });
        })
        .catch(err => {
            leaderboard.innerHTML = '<li>Error loading leaderboard.</li>';
        });
};