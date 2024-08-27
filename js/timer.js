const maxTimers = 3;
let timerCount = 0;

// Function to create a new timer
function createTimer() {
  if (timerCount >= maxTimers) {
    alert("Maximum of 3 timers allowed.");
    return;
  }

  timerCount++;

  // Create new timer HTML
  const timerHTML = `
    <div class="timer" id="timer${timerCount}">

      <div class="timer-controls">
        <select class="time-select">
          <option value="25">25 minutes</option>
          <option value="15">15 minutes</option>
          <option value="5">5 minutes</option>
        </select>
        <button class="start-btn"><i class="fa-solid fa-play"></i></button>
        <button class="pause-btn" style="display: none;"><i class="fa-solid fa-pause"></i></button>
        <button class="reset-btn" style="display: none;"><i class="fa-solid fa-clock-rotate-left"></i></button>
        <button class="delete-btn"><i class="fa-solid fa-trash-can"></i></button>
      </div>
        <div class="timer-title">Work</div>
      <div class="timer-display">00:00</div>
    </div>
  `;

  const container = document.getElementById('timers-container');
  container.insertAdjacentHTML('beforeend', timerHTML);

  // Attach event listeners to the new timer
  const newTimerIndex = timerCount - 1;
  const timerElement = document.querySelector(`#timer${timerCount}`);
  timerElement.querySelector('.start-btn').addEventListener('click', () => startTimer(newTimerIndex));
  timerElement.querySelector('.pause-btn').addEventListener('click', () => pauseTimer(newTimerIndex));
  timerElement.querySelector('.reset-btn').addEventListener('click', () => resetTimer(newTimerIndex));
  timerElement.querySelector('.delete-btn').addEventListener('click', () => deleteTimer(newTimerIndex));
  timerElement.querySelector('.time-select').addEventListener('change', () => handleTimeChange(newTimerIndex));

  // Initialize the new timer
  initializeTimer(newTimerIndex);
}

// Function to initialize a timer
function initializeTimer(timerIndex) {
  const timerElement = document.getElementById(`timer${timerIndex + 1}`);
  const timeSelect = timerElement.querySelector('.time-select');
  const display = timerElement.querySelector('.timer-display');

  timerElement.timerData = {
    timer: null,
    isRunning: false,
    timeLeft: parseInt(timeSelect.value) * 60,
    selectedTime: parseInt(timeSelect.value) * 60
  };

  updateDisplay(timerElement.timerData.timeLeft, display);
  updateTabTitle(timerElement); // Initialize tab title
}

// Function to handle time change
function handleTimeChange(timerIndex) {
  const timerElement = document.getElementById(`timer${timerIndex + 1}`);
  const timeSelect = timerElement.querySelector('.time-select');
  const display = timerElement.querySelector('.timer-display');

  // Reset the timer data
  timerElement.timerData.selectedTime = parseInt(timeSelect.value) * 60;
  timerElement.timerData.timeLeft = timerElement.timerData.selectedTime;

  if (timerElement.timerData.isRunning) {
    // If the timer is running, reset it
    clearInterval(timerElement.timerData.timer);
    timerElement.timerData.isRunning = false;
    timerElement.querySelector('.start-btn').style.display = 'inline-block';
    timerElement.querySelector('.pause-btn').style.display = 'none';
    timerElement.querySelector('.reset-btn').style.display = 'none';
  }

  updateDisplay(timerElement.timerData.timeLeft, display);
  updateTabTitle(timerElement);
}

// Function to start a timer
function startTimer(timerIndex) {
  const timerElement = document.getElementById(`timer${timerIndex + 1}`);
  const timeSelect = timerElement.querySelector('.time-select');
  const display = timerElement.querySelector('.timer-display');
  const startBtn = timerElement.querySelector('.start-btn');
  const pauseBtn = timerElement.querySelector('.pause-btn');
  const resetBtn = timerElement.querySelector('.reset-btn');
  
  if (!timerElement.timerData.isRunning) {
    timerElement.timerData.timer = setInterval(() => {
      if (timerElement.timerData.timeLeft > 0) {
        timerElement.timerData.timeLeft--;
        updateDisplay(timerElement.timerData.timeLeft, display);
        updateTabTitle(timerElement);
      } else {
        clearInterval(timerElement.timerData.timer);
        playNotificationSound();
        if (timerIndex === 0) { // If it's the first timer (work timer)
          startCooldownTimer(timerIndex);
        }
        alert('Time is up!');
      }
    }, 1000);
    timerElement.timerData.isRunning = true;
    timeSelect.style.display = 'none';
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
    resetBtn.style.display = 'inline-block';
  }
}

// Function to pause a timer
function pauseTimer(timerIndex) {
  const timerElement = document.getElementById(`timer${timerIndex + 1}`);
  const startBtn = timerElement.querySelector('.start-btn');
  const pauseBtn = timerElement.querySelector('.pause-btn');
  
  clearInterval(timerElement.timerData.timer);
  timerElement.timerData.isRunning = false;
  startBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  startBtn.style.display = 'inline-block';
  pauseBtn.style.display = 'none';
  updateTabTitle(timerElement);
}

// Function to reset a timer
function resetTimer(timerIndex) {
  const timerElement = document.getElementById(`timer${timerIndex + 1}`);
  const timeSelect = timerElement.querySelector('.time-select');
  const display = timerElement.querySelector('.timer-display');
  const startBtn = timerElement.querySelector('.start-btn');
  const pauseBtn = timerElement.querySelector('.pause-btn');
  const resetBtn = timerElement.querySelector('.reset-btn');
  
  clearInterval(timerElement.timerData.timer);
  timerElement.timerData.timeLeft = timerElement.timerData.selectedTime;
  updateDisplay(timerElement.timerData.timeLeft, display);
  timerElement.timerData.isRunning = false;
  timeSelect.style.display = 'inline-block';
  startBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  startBtn.style.display = 'inline-block';
  pauseBtn.style.display = 'none';
  resetBtn.style.display = 'none';
  updateTabTitle(timerElement);
}

// Function to delete a timer
function deleteTimer(timerIndex) {
  const timerElement = document.getElementById(`timer${timerIndex + 1}`);
  timerElement.remove();
  timerCount--;
  // Reinitialize remaining timers
  document.querySelectorAll('.timer').forEach((_, index) => initializeTimer(index));
}

// Function to update timer display
function updateDisplay(timeLeft, display) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Function to update tab title
function updateTabTitle(timerElement) {
  const timerTitle = timerElement.querySelector('.timer-title').textContent;
  const timeLeft = timerElement.timerData.timeLeft;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  document.title = `${timerTitle} - ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Function to play notification sound
function playNotificationSound() {
  const audio = new Audio('../mp3/boopMix.mp3'); // Sample sound
  audio.play();
}

// Function to start a cooldown timer
function startCooldownTimer(timerIndex) {
  const timerElement = document.getElementById(`timer${timerIndex + 1}`);
  const cooldownTime = 5 * 60; // 5 minutes in seconds

  // Update the timer's title and time
  timerElement.querySelector('.timer-title').textContent = 'Cooldown';
  timerElement.timerData.selectedTime = cooldownTime;
  timerElement.timerData.timeLeft = cooldownTime;
  updateDisplay(cooldownTime, timerElement.querySelector('.timer-display'));
  startTimer(timerIndex); // Automatically start the cooldown timer
}

// Initialize the "Add Timer" button
document.getElementById('add-timer-btn').addEventListener('click', createTimer);

// Initialize existing timers
document.querySelectorAll('.timer').forEach((_, index) => initializeTimer(index));
