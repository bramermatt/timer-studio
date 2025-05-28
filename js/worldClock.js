document.addEventListener("DOMContentLoaded", function () {
  const cities = [
    { name: "New York", timeZone: "America/New_York" },
    { name: "London", timeZone: "Europe/London" },
    { name: "Tokyo", timeZone: "Asia/Tokyo" },
    { name: "Sydney", timeZone: "Australia/Sydney" },
    { name: "Dubai", timeZone: "Asia/Dubai" },
  ];

  let is24HourFormat = true;  // Default to 24-hour format
  const toggleButton = document.getElementById("toggle-time-format");
  const clockContainer = document.getElementById("world-clock-list");

  // Function to update the time every second
  function updateClock() {
    cities.forEach((city, index) => {
      const date = new Date();
      const options = { timeZone: city.timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit' };

      // Adjust the format based on the selected time format
      if (is24HourFormat) {
        options.hour12 = false;  // 24-hour format
      } else {
        options.hour12 = true;   // 12-hour format
      }

      const timeString = date.toLocaleTimeString([], options);
      const gmtOffset = -date.getTimezoneOffset() / 60;

      // If the city already has a card, update the time
      let card = document.getElementById(`card-${index}`);
      if (!card) {
        card = document.createElement("div");
        card.classList.add("bg-white", "dark:bg-zinc-800", "p-4", "rounded-lg", "shadow-md", "flex", "flex-col", "items-center");
        card.id = `card-${index}`;
        clockContainer.appendChild(card);
      }

      // Highlight the "current time" differently (bold or change color)
      // Determine if this city matches the user's current location by timezone
      let timeClass = "text-zinc-900";
      let borderClass = "";

      // Try to get user's current timezone
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (city.timeZone === userTimeZone) {
        timeClass = "font-bold text-blue-500";
        borderClass = "border-2 border-blue-500";
      }

      // Add border class if this is the current location
      card.className = `bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md flex flex-col items-center ${borderClass}`;

      card.innerHTML = `
        <h3 class="text-lg font-semibold text-zinc-800 dark:text-zinc-100">${city.name}</h3>
        <p class="text-xl ${timeClass} dark:text-zinc-100" id="time-${index}">${timeString}</p>
        <p class="text-sm text-zinc-600 dark:text-zinc-400" id="gmt-${index}">GMT ${gmtOffset >= 0 ? '+' : ''}${gmtOffset}</p>
      `;
    });
  }

  // Toggle between 24-hour and 12-hour formats
  toggleButton.addEventListener("click", function () {
    is24HourFormat = !is24HourFormat;
    toggleButton.textContent = is24HourFormat ? "12/hr" : "24/hr";
    updateClock();
  });

  // Call the updateClock function every second
  setInterval(updateClock, 1000);
  updateClock(); // Initialize the clock immediately
});
