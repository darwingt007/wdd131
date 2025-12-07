/* scripts/main.js
   - Navigation toggle
   - Dark mode toggle (localStorage)
   - SVG logo injection
   - Ride tracker (localStorage), render, remove
   - Session generator (buildSession + DOM)
   - Tip generator (array methods)
   - Review form handling (localStorage)
   - Progress tracker for simple weekly minutes
   - All output HTML uses template literals exclusively
*/

/* Short selectors */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* ------------------ Dark mode ------------------ */
const THEME_KEY = 'hcl_theme_v1';

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    const toggle = $('#darkToggle');
    if (toggle) toggle.textContent = theme === 'dark' ? '🌙 Dark' : '☀️ Light';
}

function initTheme() {
    const saved = localStorage.getItem(THEME_KEY) || 'light';
    applyTheme(saved);
    // create toggle button if not present
    if (!$('#darkToggle')) {
        const btn = document.createElement('button');
        btn.className = 'dark-toggle';
        btn.id = 'darkToggle';
        btn.type = 'button';
        btn.textContent = saved === 'dark' ? '🌙 Dark' : '☀️ Light';
        btn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            localStorage.setItem(THEME_KEY, next);
            applyTheme(next);
        });
        // try to insert into header nav
        const header = document.querySelector('header') || document.body;
        const nav = header.querySelector('nav') || header;
        nav.appendChild(btn);
    } else {
        $('#darkToggle').addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            localStorage.setItem(THEME_KEY, next);
            applyTheme(next);
        });
    }
}

/* ------------------ Logo injection ------------------ */
function injectLogo() {
    // Simple cycling-themed SVG logo (scalable, accessible)
    const svg = `
    <svg role="img" aria-labelledby="logoTitle logoDesc" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <title id="logoTitle">Healthy Cycling Life Logo</title>
      <desc id="logoDesc">A stylized bicycle wheel and path representing cycling and health</desc>
      <circle cx="20" cy="32" r="10" stroke="var(--primary-green)" stroke-width="2.5" fill="none"/>
      <circle cx="44" cy="32" r="10" stroke="var(--primary-green)" stroke-width="2.5" fill="none"/>
      <path d="M10 42 C18 34, 46 28, 54 20" stroke="var(--primary-blue)" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    </svg>
  `;
    $$('.logo').forEach(el => {
        // if the element already contains an image/text, keep text and add svg before it
        if (!el.dataset.logoInjected) {
            el.insertAdjacentHTML('afterbegin', svg);
            el.dataset.logoInjected = 'true';
        }
    });
}

/* ------------------ Nav toggle for small screens ------------------ */
function initNavToggle() {
    const toggle = $('#menu-toggle');
    const navList = $('#nav-menu');
    if (!toggle || !navList) return;
    toggle.addEventListener('click', () => {
        navList.classList.toggle('open');
    });
}

/* ------------------ RIDE TRACKER ------------------ */
const RIDES_KEY = 'hcl_rides_v1';

function loadRides() {
    try { return JSON.parse(localStorage.getItem(RIDES_KEY)) || []; } catch (e) { return []; }
}
function saveRides(arr) { localStorage.setItem(RIDES_KEY, JSON.stringify(arr)); }

function computeStats(rides) {
    const count = rides.length;
    const totalDistance = rides.reduce((s, r) => s + Number(r.distance || 0), 0);
    const totalTime = rides.reduce((s, r) => s + Number(r.time || 0), 0); // minutes
    const avgSpeed = totalTime > 0 ? (totalDistance / (totalTime / 60)) : 0;
    return { count, totalDistance: Number(totalDistance.toFixed(1)), avgSpeed: Number(avgSpeed.toFixed(1)) };
}

function renderRides() {
    const ul = $('#savedRides');
    if (!ul) return;
    const rides = loadRides();
    ul.innerHTML = rides.map((r, i) => {
        return `
      <li>
        <strong>${r.date}</strong> — ${r.distance} km in ${r.time} min (elev ${r.elevation} m)
        <button data-index="${i}" class="remove-ride">Remove</button>
      </li>
    `;
    }).join('') || `<li>No rides saved yet.</li>`;

    const stats = computeStats(rides);
    if ($('#ridesCount')) $('#ridesCount').textContent = `Rides saved: ${stats.count}`;
    if ($('#totalDistance')) $('#totalDistance').textContent = `Total distance: ${stats.totalDistance} km`;
    if ($('#avgSpeed')) $('#avgSpeed').textContent = `Average speed: ${stats.avgSpeed} km/h`;

    $$('.remove-ride').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = Number(btn.dataset.index);
            const arr = loadRides();
            arr.splice(idx, 1);
            saveRides(arr);
            renderRides();
        });
    });
}

function initRideForm() {
    const form = $('#rideForm');
    if (!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        const fd = new FormData(form);
        const ride = {
            date: fd.get('rideDate'),
            distance: Number(fd.get('distance')),
            time: Number(fd.get('time')),
            elevation: Number(fd.get('elevation'))
        };
        if (!ride.date || !ride.distance || !ride.time) {
            alert('Please complete date, distance, and time.');
            return;
        }
        const arr = loadRides();
        arr.push(ride);
        saveRides(arr);
        form.reset();
        renderRides();
    });
    const clearBtn = $('#clearRides');
    if (clearBtn) clearBtn.addEventListener('click', () => {
        if (confirm('Clear all rides?')) {
            localStorage.removeItem(RIDES_KEY);
            renderRides();
        }
    });
}

/* ------------------ SESSION GENERATOR ------------------ */
function buildSession({ focus, duration }) {
    const session = { title: '', description: '', steps: [], notes: '' };
    if (focus === 'endurance') {
        session.title = `Endurance ${duration}min`;
        session.description = `Steady aerobic work for ${duration} minutes.`;
        session.steps = [`10-15 min easy warm-up`, `${Math.max(20, duration - 30)} min steady aerobic pace`, `5-10 min cool-down`];
        session.notes = 'Keep cadence steady (80–95 rpm) and hydrate.';
    } else if (focus === 'climbing') {
        session.title = `Climbing ${duration}min`;
        session.description = `Short sustained climbs to build strength.`;
        const reps = Math.max(2, Math.floor((duration - 20) / 10));
        session.steps = ['10 min warm-up', ...Array.from({ length: reps }, (_, i) => `6-8 min climb effort (RPE 7-8), recover 4 min`), '10 min cool-down'];
        session.notes = 'Use seated and standing climbs; focus on breathing.';
    } else {
        session.title = `Speed ${duration}min`;
        session.description = `High-intensity intervals for speed.`;
        session.steps = ['15 min warm-up', '6 x (1 min hard / 2 min easy)', '10 min cool-down'];
        session.notes = 'Explosive cadence on hard efforts.';
    }
    return session;
}

function initSessionGenerator() {
    const btn = $('#genSession');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const focus = $('#focus') ? $('#focus').value : 'endurance';
        const duration = Number($('#duration') ? $('#duration').value : 60);
        const session = buildSession({ focus, duration });
        const out = $('#sessionOutput');
        if (!out) return;
        out.innerHTML = `
      <h3>${session.title}</h3>
      <p>${session.description}</p>
      <ol>${session.steps.map(s => `<li>${s}</li>`).join('')}</ol>
      <p><strong>Notes:</strong> ${session.notes}</p>
    `;
        out.classList.remove('hidden');
        out.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

/* ------------------ TIP GENERATOR ------------------ */
const TIPS = [
    'Keep a steady cadence to improve efficiency.',
    'Practice fueling and hydration on training rides.',
    'Use cadence drills (1 min high cadence, 2 min easy).',
    'Include one long low-intensity ride per week.',
    'Prioritize sleep after a hard training day.'
];

function initTipGenerator() {
    const btn = $('#tip-button');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const idx = Math.floor(Math.random() * TIPS.length);
        const out = $('#tip-output');
        if (out) out.textContent = TIPS[idx];
    });
}

/* ------------------ REVIEWS (form handling) ------------------ */
/* ------------------ REVIEWS (form handling) ------------------ */
const REVIEWS_KEY = 'hcl_reviews_v1';

function loadReviews() {
    try { return JSON.parse(localStorage.getItem(REVIEWS_KEY)) || []; } catch (e) { return []; }
}
function saveReviews(arr) { localStorage.setItem(REVIEWS_KEY, JSON.stringify(arr)); }

function initReviews() {
    const form = $('#reviewForm');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();

        const fd = new FormData(form);
        const features = [];

        ['durability', 'easeOfUse', 'performance', 'design'].forEach(id => {
            const el = $(`#${id}`);
            if (el && el.checked) features.push(el.value);
        });

        const review = {
            productName: fd.get('productName'),
            rating: fd.get('overallRating'),
            installDate: fd.get('installDate'),
            features,
            reviewText: fd.get('reviewText') || '',
            userName: fd.get('userName') || 'Anonymous',
            createdAt: new Date().toISOString()
        };

        if (!review.productName || !review.rating || !review.installDate) {
            alert('Please fill required fields.');
            return;
        }

        const arr = loadReviews();
        arr.push(review);
        saveReviews(arr);

        const conf = $('#confirmation-message');

        if (conf) {
            conf.classList.remove('hidden');
            $('#counter-display').textContent = arr.length;

            // CLEAR FORM AFTER SUBMIT
            form.reset();

            // OPTIONAL: hide form
            form.classList.add('hidden');
        } else {
            alert('Review saved.');

            // CLEAR FORM AFTER SUBMIT
            form.reset();
        }
    });
}


/* ------------------ PROGRESS TRACKER (simple) ------------------ */
const PROG_KEY = 'hcl_progress_v1';
function loadProgress() { try { return JSON.parse(localStorage.getItem(PROG_KEY)) || []; } catch (e) { return []; } }
function saveProgress(arr) { localStorage.setItem(PROG_KEY, JSON.stringify(arr)); }

function renderProgress() {
    const list = $('#progress-list');
    if (!list) return;
    const arr = loadProgress();
    list.innerHTML = arr.map((p, i) => `<li>${p.date}: ${p.minutes} min <button data-index="${i}" class="remove-prog">Remove</button></li>`).join('') || '<li>No entries yet</li>';
    $$('.remove-prog').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = Number(btn.dataset.index);
            const a = loadProgress();
            a.splice(idx, 1);
            saveProgress(a);
            renderProgress();
        });
    });
}

function initProgressInput() {
    const input = $('#minutes-input');
    const saveBtn = $('#save-progress');
    if (!input || !saveBtn) return;
    saveBtn.addEventListener('click', () => {
        const minutes = Number(input.value);
        if (!minutes || minutes <= 0) { alert('Enter minutes > 0'); return; }
        const arr = loadProgress();
        arr.unshift({ date: new Date().toLocaleDateString(), minutes });
        saveProgress(arr);
        input.value = '';
        renderProgress();
    });
}

/* ------------------ INIT ------------------ */
function init() {
    initTheme();
    injectLogo();
    initNavToggle();

    // features across pages (safe to call even if elements missing)
    initRideForm();
    renderRides();
    initSessionGenerator();
    initTipGenerator();
    initReviews();
    renderProgress();
    initProgressInput();
}

/* Run on DOM ready */
document.addEventListener('DOMContentLoaded', init);
