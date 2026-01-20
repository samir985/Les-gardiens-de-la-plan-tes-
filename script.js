// ÉTAT DU JEU
var game = {
    score: 0,
    level: 1,
    lives: 3,
    totalCorrect: 0,
    currentWaste: null,
    soundsEnabled: true
};

// DONNÉES DES DÉCHETS
var wastes = [
    { name: 'Pomme', emoji: '🍎', type: 'organic', color: '#66bb6a' },
    { name: 'Bouteille', emoji: '🥤', type: 'plastic', color: '#ffd54f' },
    { name: 'Journal', emoji: '📰', type: 'paper', color: '#64b5f6' },
    { name: 'Banane', emoji: '🍌', type: 'organic', color: '#66bb6a' },
    { name: 'Canette', emoji: '🥫', type: 'metal', color: '#bdbdbd' },
    { name: 'Carton', emoji: '📦', type: 'paper', color: '#64b5f6' },
    { name: 'Brique Jus', emoji: '🧃', type: 'plastic', color: '#ffd54f' },
    { name: 'Orange', emoji: '🍊', type: 'organic', color: '#66bb6a' },
    { name: 'Papier', emoji: '📄', type: 'paper', color: '#64b5f6' },
    { name: 'Salade', emoji: '🥗', type: 'organic', color: '#66bb6a' }
];

// INITIALISATION
document.addEventListener('DOMContentLoaded', function() {
    createNavigationDots();
    document.getElementById('soundToggle').addEventListener('click', toggleSound);
    document.getElementById('helpButton').addEventListener('click', showHelp);
    
    // Scroll vers le haut au chargement
    window.scrollTo(0, 0);
});

function createNavigationDots() {
    var pages = ['welcome', 'intro', 'problem', 'learn1', 'learn2', 'game', 'results'];
    var dotsContainer = document.getElementById('navigationDots');
    
    pages.forEach(function(page, index) {
        var dot = document.createElement('div');
        dot.className = 'dot';
        dot.setAttribute('data-page', page);
        dot.addEventListener('click', function() {
            if (page !== 'game' && page !== 'results') {
                changePage(page);
            }
        });
        dotsContainer.appendChild(dot);
    });
    
    updateNavigationDots('welcome');
}

function updateNavigationDots(activePage) {
    var dots = document.querySelectorAll('.dot');
    dots.forEach(function(dot) {
        dot.classList.remove('active');
        if (dot.getAttribute('data-page') === activePage) {
            dot.classList.add('active');
        }
    });
}

// GESTION DES PAGES - CORRECTION DU SCROLL
function changePage(pageId) {
    var pages = document.querySelectorAll('.page');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('active');
    }
    document.getElementById(pageId).classList.add('active');
    updateNavigationDots(pageId);
    
    // SCROLL VERS LE HAUT à chaque changement de page
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// FONCTIONS POUR ARRÊTER LE JEU
function showStopConfirmation() {
    document.getElementById('currentScoreStop').textContent = game.score;
    document.getElementById('stopConfirmModal').style.display = 'flex';
}

function closeStopConfirm() {
    document.getElementById('stopConfirmModal').style.display = 'none';
}

function stopGame() {
    closeStopConfirm();
    // Réinitialiser le jeu
    game.score = 0;
    game.level = 1;
    game.lives = 3;
    game.totalCorrect = 0;
    game.currentWaste = null;
    
    // Retourner à la page d'accueil
    changePage('welcome');
}

// JEU
function startGame() {
    game.score = 0;
    game.level = 1;
    game.lives = 3;
    game.totalCorrect = 0;
    
    updateGameDisplay();
    generateWaste();
    changePage('game');
}

function generateWaste() {
    var randomIndex = Math.floor(Math.random() * wastes.length);
    game.currentWaste = wastes[randomIndex];
    
    var wasteHtml = '<div class="current-waste" style="background: ' + game.currentWaste.color + ';">';
    wasteHtml += '<div class="waste-emoji">' + game.currentWaste.emoji + '</div>';
    wasteHtml += '<div class="waste-name">' + game.currentWaste.name + '</div>';
    wasteHtml += '</div>';
    
    document.getElementById('currentWaste').innerHTML = wasteHtml;
    document.getElementById('feedback').innerHTML = '';
    document.getElementById('feedback').className = 'feedback';
    
    var progress = (game.totalCorrect % 10) * 10;
    document.getElementById('gameProgress').style.width = progress + '%';
}

function checkAnswer(binType) {
    if (!game.currentWaste) return;

    var feedbackEl = document.getElementById('feedback');
    
    if (binType === game.currentWaste.type) {
        var points = game.level * 10;
        game.score += points;
        game.totalCorrect++;
        
        feedbackEl.innerHTML = '🎉 Bravo ! +' + points + ' points';
        feedbackEl.className = 'feedback correct';
        
        playSound('correct');
        
        setTimeout(function() {
            if (game.totalCorrect % 5 === 0) {
                game.level++;
            }
            updateGameDisplay();
            generateWaste();
        }, 1500);
    } else {
        game.lives--;
        feedbackEl.innerHTML = '❌ Oups ! Réessaie';
        feedbackEl.className = 'feedback incorrect';
        
        playSound('incorrect');
        updateLives();
        
        if (game.lives === 0) {
            setTimeout(function() {
                showResults();
            }, 2000);
        }
    }
}

function updateGameDisplay() {
    document.getElementById('score').textContent = game.score;
    document.getElementById('level').textContent = game.level;
    updateLives();
}

function updateLives() {
    var livesHtml = '';
    for (var i = 0; i < 3; i++) {
        if (i < game.lives) {
            livesHtml += '<span>❤️</span>';
        } else {
            livesHtml += '<span style="opacity: 0.3;">💔</span>';
        }
    }
    document.getElementById('lives').innerHTML = livesHtml;
}

function showResults() {
    document.getElementById('finalScore').textContent = 'Score Final : ' + game.score + ' points';
    document.getElementById('totalCorrect').textContent = 'Tu as réussi ' + game.totalCorrect + ' tris corrects ! 🎯';
    
    var message = '';
    var trophy = '';
    if (game.score >= 50) {
        message = 'Incroyable ! Tu es un vrai super-héros de la planète ! Continue comme ça ! 🌍💚';
        trophy = '🏆';
    } else if (game.score >= 30) {
        message = 'Très bien ! Tu apprends vite ! Continue à t\'entraîner ! 💪';
        trophy = '🌟';
    } else {
        message = 'C\'est un bon début ! Réessaie pour devenir encore meilleur ! 🌟';
        trophy = '🎈';
    }
    
    document.getElementById('message').textContent = message;
    document.getElementById('trophyEmoji').textContent = trophy;
    changePage('results');
}

function restartGame() {
    startGame();
}

// FONCTIONNALITÉS AVANCÉES
function toggleSound() {
    game.soundsEnabled = !game.soundsEnabled;
    var soundBtn = document.getElementById('soundToggle');
    soundBtn.textContent = game.soundsEnabled ? '🔊' : '🔇';
}

function playSound(type) {
    if (!game.soundsEnabled) return;
    
    try {
        var audioContext = new (window.AudioContext || window.webkitAudioContext)();
        var oscillator = audioContext.createOscillator();
        var gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (type === 'correct') {
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
        } else {
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        }
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('Audio non supporté');
    }
}

function showHelp() {
    document.getElementById('helpModal').style.display = 'flex';
}

function closeHelp() {
    document.getElementById('helpModal').style.display = 'none';
}