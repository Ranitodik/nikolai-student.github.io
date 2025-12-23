const scores = JSON.parse(localStorage.getItem('scores') || '[]');
const list = document.getElementById('ratingList');

scores.sort((a, b) => b.score - a.score);

scores.forEach(player => {
    const li = document.createElement('li');
    li.textContent = `${player.name}: ${player.score} очков (уровень ${player.level})`;
    list.appendChild(li);
});