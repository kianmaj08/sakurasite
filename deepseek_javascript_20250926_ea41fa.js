// Sakura-Blätter Animation
function createSakura() {
    const sakuraContainer = document.getElementById('sakuraContainer');
    if (!sakuraContainer) return;
    
    const sakura = document.createElement('div');
    sakura.classList.add('sakura');
    
    // Zufällige Position
    const leftPos = Math.random() * 100;
    sakura.style.left = `${leftPos}vw`;
    
    // Zufällige Größe
    const size = 5 + Math.random() * 10;
    sakura.style.width = `${size}px`;
    sakura.style.height = `${size}px`;
    
    // Zufällige Dauer und Verzögerung
    const duration = 5 + Math.random() * 10;
    const delay = Math.random() * 5;
    sakura.style.animationDuration = `${duration}s`;
    sakura.style.animationDelay = `${delay}s`;
    
    sakuraContainer.appendChild(sakura);
    
    // Entferne das Blatt nach der Animation
    setTimeout(() => {
        if (sakura.parentNode) {
            sakura.parentNode.removeChild(sakura);
        }
    }, (duration + delay) * 1000);
}

// Starte die Sakura-Animation für 10 Sekunden nach dem Laden
let sakuraInterval;
let sakuraActive = true;

function startSakura() {
    // Erstelle initial einige Blätter
    for (let i = 0; i < 15; i++) {
        setTimeout(createSakura, i * 300);
    }
    
    // Setze Intervall für weitere Blätter
    sakuraInterval = setInterval(createSakura, 300);
    
    // Stoppe nach 10 Sekunden (wie gewünscht)
    setTimeout(() => {
        clearInterval(sakuraInterval);
        sakuraActive = false;
        updateSakuraButtonText();
    }, 10000);
}

// Theme-Wechsel
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    
    // Speichere die Einstellung im localStorage
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Sakura an/aus schalten
function toggleSakura() {
    const sakuraContainer = document.getElementById('sakuraContainer');
    if (!sakuraContainer) return;
    
    if (!sakuraActive) {
        // Aktiviere Sakura
        startSakura();
        sakuraActive = true;
    } else {
        // Deaktiviere Sakura - entferne alle Blätter
        clearInterval(sakuraInterval);
        sakuraContainer.innerHTML = '';
        sakuraActive = false;
    }
    updateSakuraButtonText();
}

// Button-Text aktualisieren
function updateSakuraButtonText() {
    const sakuraToggleBtn = document.getElementById('sakuraToggle');
    if (sakuraToggleBtn) {
        sakuraToggleBtn.textContent = sakuraActive ? 'Sakura aus' : 'Sakura an';
    }
}

// Event Listener nach DOM geladen
document.addEventListener('DOMContentLoaded', () => {
    // Lade gespeichertes Theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    // Starte Sakura-Animation
    startSakura();
    updateSakuraButtonText();
    
    // Event Listener für Buttons
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('sakuraToggle').addEventListener('click', toggleSakura);
});