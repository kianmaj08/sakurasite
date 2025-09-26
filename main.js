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


// --- Settings-Dropdown ---
(function() {
  const tgl = document.getElementById('settingsToggle');
  const menu = document.getElementById('settingsMenu');
  if (tgl && menu) {
    tgl.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('open');
    });
    document.addEventListener('click', () => menu.classList.remove('open'));
  }
})();

// --- DATEN & RENDERING ---
const SUBJECTS = [
  "Deutsch","Mathe","Englisch","Geschichte","Philosophie","Informatik",
  "Physik","Kunst","Erdkunde","Sowi","Chemie"
];
const SUBJECT_CLASS = {
  "Deutsch":"tag-deutsch","Mathe":"tag-mathe","Englisch":"tag-englisch","Geschichte":"tag-geschichte",
  "Philosophie":"tag-philosophie","Informatik":"tag-informatik","Physik":"tag-physik","Kunst":"tag-kunst",
  "Erdkunde":"tag-erdkunde","Sowi":"tag-sowi","Chemie":"tag-chemie"
};
const STATUS_CLASS = {
  "Fertig":"badge-fertig","In Arbeit":"badge-inarbeit","Test":"badge-test","Coming soon":"badge-comingsoon"
};

async function loadContent(dataset) {
  try {
    const resp = await fetch(`content/${dataset}.json`);
    if (!resp.ok) throw new Error('Not found');
    return await resp.json();
  } catch (e) {
    return []; // leer
  }
}

function renderTagChips(container, activeTags, onToggle) {
  container.innerHTML = "";
  SUBJECTS.forEach(sub => {
    const chip = document.createElement('span');
    chip.className = `tag-chip ${SUBJECT_CLASS[sub]} ${activeTags.has(sub) ? 'active' : ''}`;
    chip.textContent = sub;
    chip.addEventListener('click', () => onToggle(sub));
    container.appendChild(chip);
  });
}

function cardTemplate(item) {
  const tagsHtml = (item.tags||[]).map(t => `<span class="tag-chip ${SUBJECT_CLASS[t]||''}">${t}</span>`).join('');
  const badgeCls = STATUS_CLASS[item.status] || 'badge-test';
  return `<article class="card glass-effect">
    <h3>${item.title||''}</h3>
    <p class="meta">von ${item.author||'Unbekannt'}</p>
    <p>${item.description||''}</p>
    <div class="card-tags">${tagsHtml}</div>
    <div class="card-footer">
      <a href="${item.link||'#'}" target="_blank" rel="noopener">
        <button class="neu-button">Öffnen</button>
      </a>
      <span class="badge ${badgeCls}">${item.status||'Test'}</span>
    </div>
  </article>`;
}

function matchesQuery(item, q, activeTags) {
  const hay = `${item.title||''} ${item.description||''} ${item.author||''} ${(item.tags||[]).join(' ')}`.toLowerCase();
  const okQ = !q || hay.includes(q.toLowerCase());
  const okTags = activeTags.size===0 || (item.tags||[]).some(t => activeTags.has(t));
  return okQ && okTags;
}

(async function initContent() {
  const dataset = window.DATASET;
  const grid = document.getElementById('cardsGrid');
  const search = document.getElementById('searchInput');
  const tagFilter = document.getElementById('tagFilter');
  if (!grid || !search || !tagFilter) return;

  const data = await loadContent(dataset);
  let query = "";
  const activeTags = new Set();

  function render() {
    const filtered = data.filter(item => matchesQuery(item, query, activeTags));
    grid.innerHTML = filtered.map(cardTemplate).join('') || '<p>Keine Einträge gefunden.</p>';
  }

  renderTagChips(tagFilter, activeTags, (tag) => {
    if (activeTags.has(tag)) activeTags.delete(tag); else activeTags.add(tag);
    renderTagChips(tagFilter, activeTags, arguments.callee);
    render();
  });

  search.addEventListener('input', (e) => { query = e.target.value; render(); });
  render();
})();

