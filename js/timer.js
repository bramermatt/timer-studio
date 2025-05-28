const timerButtons = document.querySelectorAll('[data-time]');
const customStartBtn = document.getElementById('start-custom-timer');
const activeLabel = document.getElementById('active-timer-label');
const activeTime = document.getElementById('active-timer-time');
const pauseBtn = document.getElementById('pause-timer');
const resetBtn = document.getElementById('reset-timer');
const customSection = customStartBtn.closest('.mb-6');
const timersGrid = document.querySelector('#timers .grid');

let countdown;
let totalSeconds = 0;
let remainingSeconds = 0;
let isPaused = false;

// Format time as H:MM or MM:SS based on duration
function formatTime(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}`;
  } else {
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}

// Update the active timer display
function updateDisplay() {
  activeTime.textContent = formatTime(remainingSeconds);
}

// Start the countdown
function startCountdown() {
  clearInterval(countdown);
  isPaused = false;
  pauseBtn.textContent = 'Pause';
  pauseBtn.classList.remove('hidden');
  resetBtn.classList.remove('hidden');

  countdown = setInterval(() => {
    if (!isPaused && remainingSeconds > 0) {
      remainingSeconds--;
      updateDisplay();
    } else if (remainingSeconds === 0) {
      clearInterval(countdown);
      activeLabel.textContent = "Timer Complete";
    }
  }, 1000);
}

// Activate a timer and start countdown
function activateTimer(label, seconds) {
  totalSeconds = seconds;
  remainingSeconds = seconds;
  activeLabel.textContent = label;
  updateDisplay();
  startCountdown();
  timersGrid.classList.add('hidden');
  customSection.classList.add('hidden');
}

// Handle preset timer buttons
timerButtons.forEach(btn => {
  // Only attach if NOT a Pomodoro button
  if (!btn.classList.contains('pomodoro-btn')) {
    btn.addEventListener('click', () => {
      const minutes = parseInt(btn.dataset.time);
      const seconds = minutes * 60;
      const label = `${btn.textContent} Timer`;
      activateTimer(label, seconds);
    });
  }
});

// Handle custom timer
customStartBtn.addEventListener('click', () => {
  const hrs = parseInt(document.getElementById('custom-hours').value) || 0;
  const mins = parseInt(document.getElementById('custom-minutes').value) || 0;

  if (hrs === 0 && mins === 0) {
    alert('Enter valid time.');
    return;
  }

  const seconds = hrs * 3600 + mins * 60;
  const label = `${hrs > 0 ? `${hrs}h ` : ''}${mins > 0 ? `${mins}m ` : ''}Timer`.trim();
  activateTimer(label, seconds);
});

// Pause or resume the countdown
pauseBtn.addEventListener('click', () => {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
});

// Reset the timer
resetBtn.addEventListener('click', () => {
  clearInterval(countdown);
  activeLabel.textContent = 'No Timer Active';
  activeTime.textContent = '00:00';
  pauseBtn.classList.add('hidden');
  resetBtn.classList.add('hidden');
  timersGrid.classList.remove('hidden');
  customSection.classList.remove('hidden');
});

function resetCustomTimerFields() {
  document.getElementById('custom-hours').value = '';
  document.getElementById('custom-minutes').value = '';
  activeLabel.textContent = 'No Timer Active';
  activeTime.textContent = '00:00';
  pauseBtn.classList.add('hidden');
  resetBtn.classList.add('hidden');
  timersGrid.classList.remove('hidden');
  customSection.classList.remove('hidden');
}

window.addEventListener('DOMContentLoaded', resetCustomTimerFields);
