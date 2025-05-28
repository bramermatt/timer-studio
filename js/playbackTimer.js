// Clear the input fields on page load
window.addEventListener('load', () => {
    document.getElementById("remaining-hours").value = '';
    document.getElementById("remaining-minutes").value = '';
    document.getElementById("speed").value = '';
    document.getElementById("result").classList.add("hidden");
});

// Function to allow only numeric values in inputs (for hours, minutes, and speed)
const numericInputs = document.querySelectorAll('#remaining-hours, #remaining-minutes, #speed');
numericInputs.forEach(input => {
    input.addEventListener('input', () => {
        // Ensure input is a number or empty
        input.value = input.value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters
    });
});

// Function to trigger calculation when Enter key is pressed
function handleEnterKey(event) {
    if (event.key === 'Enter') {
        calculatePlaybackTime();
    }
}

// Attach the enter key event listener to the inputs
const allInputs = document.querySelectorAll('#remaining-hours, #remaining-minutes, #speed');
allInputs.forEach(input => {
    input.addEventListener('keydown', handleEnterKey);
});

document.getElementById("calculate-btn").addEventListener("click", calculatePlaybackTime);

function calculatePlaybackTime() {
    // Get input values
    const remainingHours = parseInt(document.getElementById("remaining-hours").value) || 0;
    const remainingMinutes = parseInt(document.getElementById("remaining-minutes").value) || 0;
    const speed = parseFloat(document.getElementById("speed").value) || 1;

    // Get current system time
    const currentTime = new Date();
    const sysHours = currentTime.getHours();
    const sysMinutes = currentTime.getMinutes();

    // Convert time remaining to total minutes
    const totalMinutes = (remainingHours * 60) + remainingMinutes;

    // Calculate adjusted time in minutes based on playback speed
    const adjustedMinutes = totalMinutes / speed;

    // Convert adjusted minutes to hours and minutes
    const adjustedHours = Math.floor(adjustedMinutes / 60);
    const adjustedRemainingMinutes = Math.floor(adjustedMinutes % 60);

    // Calculate real-world time based on current system time
    const realWorldMinutes = (sysHours * 60 + sysMinutes) + adjustedMinutes;
    const realWorldHours = Math.floor(realWorldMinutes / 60);
    const realWorldRemainingMinutes = Math.floor(realWorldMinutes % 60);

    // Display results
    document.getElementById("adjusted-time").textContent = `${adjustedHours}:${adjustedRemainingMinutes.toString().padStart(2, '0')}`;
    document.getElementById("real-world-time").textContent = `${realWorldHours}:${realWorldRemainingMinutes.toString().padStart(2, '0')}`;

    // Show result section
    document.getElementById("result").classList.remove("hidden");
}
