// Default schedule if nothing is saved in DB
let currentSchedule = {
    'lundi': '15:45',
    'mardi': '17:25',
    'mercredi': '14:45',
    'jeudi': '16:35',
    'vendredi': '16:35'
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Load Schedule from DB
    try {
        const saved = await getSchedule();
        if (saved) {
            currentSchedule = saved;
        }
    } catch (e) {
        console.log("Using default schedule (DB not ready or empty)");
    }

    // 2. Inject the UI (Replace the old button with our Dropdown)
    setupTimerUI();

    // 3. Start the timer loop
    setInterval(timeUntilEndOfCourse, 1000);
    timeUntilEndOfCourse(); // Initial call
});

// --- UI INJECTION ---
function setupTimerUI() {
    const oldBtn = document.getElementById('timer-btn');
    if (!oldBtn) return;

    // Create the wrapper that replaces the button
    const wrapper = document.createElement('div');
    wrapper.className = 'timer-wrapper';

    // The visible part (looks like the old button)
    const display = document.createElement('div');
    display.className = 'timer-display-btn';
    display.innerHTML = '<div id="timer">Chargement...</div>';
    
    // The hidden dropdown menu
    const menu = document.createElement('div');
    menu.className = 'timer-settings-menu';
    
    menu.innerHTML = `
        <h4>Fin des cours</h4>
        <div class="timer-inputs">
            ${Object.keys(currentSchedule).map(day => `
                <div class="timer-row">
                    <label>${day.charAt(0).toUpperCase() + day.slice(1)}</label>
                    <input type="time" id="time-${day}" value="${currentSchedule[day]}">
                </div>
            `).join('')}
        </div>
        <button onclick="saveNewTimes()" class="timer-save-btn">Enregistrer</button>
    `;

    wrapper.appendChild(display);
    wrapper.appendChild(menu);

    // Replace the old element in the DOM
    oldBtn.parentNode.replaceChild(wrapper, oldBtn);
}

// --- LOGIC ---

// Called by the "Enregistrer" button inside the injected HTML
async function saveNewTimes() {
    const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
    const newSchedule = {};
    
    days.forEach(day => {
        const val = document.getElementById(`time-${day}`).value;
        if(val) newSchedule[day] = val;
    });

    currentSchedule = newSchedule;
    
    try {
        await saveSchedule(newSchedule);
        alert("Horaires sauvegardés !");
    } catch(e) {
        alert("Erreur de sauvegarde");
        console.error(e);
    }
    
    // Force update immediately
    timeUntilEndOfCourse();
}

function timeUntilEndOfCourse() {
    const timerEl = document.getElementById("timer");
    if (!timerEl) return;

    const currentTime = new Date();
    const currentDay = currentTime.toLocaleString('fr-FR', { weekday: 'long' }).toLowerCase();
  
    if (currentDay === 'samedi' || currentDay === 'dimanche') {
        timerEl.innerText = "Bon weekend !";
        return;
    }

    const courseEndStr = currentSchedule[currentDay];
    if (courseEndStr) {
        const courseEndTime = new Date(currentTime);
        const [hours, minutes] = courseEndStr.split(':').map(Number);
        courseEndTime.setHours(hours, minutes, 0, 0); 

        let timeRemaining = courseEndTime - currentTime;

        if (timeRemaining < 0) {
            timerEl.innerText = "Cours terminés";
            return;
        }

        const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const secondsRemaining = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        timerEl.innerText = `Fin dans: ${hoursRemaining}:${minutesRemaining}:${secondsRemaining}`;
    } else {
        timerEl.innerText = "Pas de cours";
    }
}