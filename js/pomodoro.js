// Pomodoro timer variables
let pomodoroCountdown;
let pomodoroRemainingSeconds = 0;
let pomodoroTotalSeconds = 0;
let isPomodoroPaused = false;
let startTime;
const audio = new Audio('path_to_lofi_music.mp3'); // Specify your LoFi music path

// Get references to both timers
const activePomoTimer = document.getElementById('active-pomo-timer');
const activePomoTimerLabel = document.getElementById('active-pomo-timer-label');
const activePomoTimerTime = document.getElementById('active-pomo-timer-time');
const activePomoTimerEndTime = document.getElementById('active-pomo-timer-end-time');
const pausePomodoroBtn = document.getElementById('pause-pomo-btn');
const resetPomodoroBtn = document.getElementById('reset-pomo-btn');
const lofiMusicCheckbox = document.getElementById('lofi-music');

// Function to update Pomodoro display
function updatePomodoroDisplay() {
    activePomoTimerTime.textContent = formatTime(pomodoroRemainingSeconds);

    // Calculate and display the end time
    const endTime = new Date(startTime.getTime() + pomodoroRemainingSeconds * 1000);
    activePomoTimerEndTime.textContent = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
}

// Function to format time (MM:SS or HH:MM)
function formatTime(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}` : `${m}:${s.toString().padStart(2, '0')}`;
}

// Function to start Pomodoro countdown
function startPomodoroCountdown(isNewSession = false) {
    clearInterval(pomodoroCountdown);
    isPomodoroPaused = false;
    if (isNewSession) {
        startTime = new Date();
    }

    pomodoroCountdown = setInterval(() => {
        if (!isPomodoroPaused && pomodoroRemainingSeconds > 0) {
            pomodoroRemainingSeconds--;
            updatePomodoroDisplay();
        } else if (pomodoroRemainingSeconds === 0) {
            clearInterval(pomodoroCountdown);
            activePomoTimerLabel.textContent = "Timer Complete!";
            playCompletionSound();
            if (lofiMusicCheckbox.checked) {
                audio.pause(); // Stop music when timer ends
            }
        }
    }, 1000);
}

// Play completion sound when timer ends
function playCompletionSound() {
    const beep = new Audio('path_to_beep_sound.mp3'); // Specify your beep sound path
    beep.play();
}

// Function to start Pomodoro timer with specified minutes
function startPomodoroTimer(minutes) {
    pomodoroTotalSeconds = minutes * 60;
    pomodoroRemainingSeconds = pomodoroTotalSeconds;
    activePomoTimerLabel.textContent = `${minutes}-Minute Focus`;
    activePomoTimer.classList.remove('hidden'); // Show the active Pomodoro timer
    startPomodoroCountdown(true); // Pass true to indicate a new session
    updatePomodoroDisplay();

    // Show the Pomodoro section and hide other sections (if needed)
    document.getElementById('pomodoro').classList.remove('hidden');
    document.getElementById('timers').classList.add('hidden');

    // Play LoFi music if checkbox is checked
    if (lofiMusicCheckbox.checked) {
        audio.play();
        audio.loop = true; // Loop music
    }
}

document.querySelector('.pomodoro-btn[data-time="25"]').addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent bubbling
    startPomodoroTimer(25);
});

// Start 15-minute Pomodoro session
document.querySelector('.pomodoro-btn[data-time="15"]').addEventListener('click', (e) => {
    e.stopPropagation();
    startPomodoroTimer(15);
});

// Pause/Resume Pomodoro button
pausePomodoroBtn.addEventListener('click', () => {
    isPomodoroPaused = !isPomodoroPaused;
    pausePomodoroBtn.textContent = isPomodoroPaused ? 'Resume' : 'Pause';
});

// Reset Pomodoro button
resetPomodoroBtn.addEventListener('click', () => {
    clearInterval(pomodoroCountdown);
    pomodoroRemainingSeconds = 0;
    activePomoTimerLabel.textContent = "None";
    activePomoTimerTime.textContent = "00:00";
    activePomoTimerEndTime.textContent = "--:--";
    activePomoTimer.classList.add('hidden'); // Hide the active Pomodoro timer
    pausePomodoroBtn.textContent = 'Pause'; // Reset button text
    if (lofiMusicCheckbox.checked) {
        audio.pause(); // Stop LoFi music
    }

    // Switch back to the Timers tab if needed
    document.getElementById('timers').classList.remove('hidden');
});
