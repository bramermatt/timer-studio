document.addEventListener("DOMContentLoaded", function () {
  // Get user's current time in minutes since midnight UTC
  function getUtcMinutes(date, timeZone) {
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzDate = new Date(date.toLocaleString("en-US", { timeZone }));
    // Difference in ms, convert to minutes
    return ((tzDate - utcDate) / 60000);
  }

  const baseDate = new Date();
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const cities = [
    { name: "New York", timeZone: "America/New_York" },
    { name: "London", timeZone: "Europe/London" },
    { name: "Tokyo", timeZone: "Asia/Tokyo" },
    { name: "Los Angeles", timeZone: "America/Los_Angeles" },
    { name: "Berlin", timeZone: "Europe/Berlin" },
    { name: "Moscow", timeZone: "Europe/Moscow" },
    { name: "Beijing", timeZone: "Asia/Shanghai" },
    { name: "Mumbai", timeZone: "Asia/Kolkata" },
    { name: "Rio de Janeiro", timeZone: "America/Sao_Paulo" },
    { name: "Cairo", timeZone: "Africa/Cairo" },
    { name: "Toronto", timeZone: "America/Toronto" },
    { name: "Dubai", timeZone: "Asia/Dubai" },
    { name: "Sydney", timeZone: "Australia/Sydney" },
  ].map(city => ({
    ...city,
    offset: getUtcMinutes(baseDate, city.timeZone)
  }));

  // Sort cities by absolute time difference to user's timezone
  const userOffset = getUtcMinutes(baseDate, userTimeZone);
  cities.sort((a, b) => Math.abs(a.offset - userOffset) - Math.abs(b.offset - userOffset));

  let is24HourFormat = true;  // Default to 24-hour format
  const toggleButton = document.getElementById("toggle-time-format");
  const clockContainer = document.getElementById("world-clock-list");
  // let userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Try to get user's real timezone via geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        // Optionally, use a timezone API here to get the timezone from lat/lng
        // For now, we just use the system timezone
      },
      err => {
        // Permission denied or unavailable, fallback to system timezone
      }
    );
  }

  // Function to update the time every second
  function updateClock() {
    const userDate = new Date();
    const userDay = userDate.toLocaleDateString([], { weekday: 'long', timeZone: userTimeZone });

    cities.forEach((city, index) => {
      const date = new Date();
      const options = { timeZone: city.timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit' };
      options.hour12 = !is24HourFormat;

      const timeString = date.toLocaleTimeString([], options);
      const cityDay = date.toLocaleDateString([], { weekday: 'long', timeZone: city.timeZone });

      // Highlight if day is different
      const isDifferentDay = cityDay !== userDay;
      let dayClass = isDifferentDay ? "text-red-500 font-semibold" : "text-zinc-600 dark:text-zinc-400";

      // Label for current time
      let label = city.name;
      let timeClass = "text-zinc-900";
      let borderClass = "";

      if (city.timeZone === userTimeZone) {
        label = `Current Time (${city.name})`;
        timeClass = "font-bold text-center text-blue-500";
        borderClass = "border-2 border-blue-500";
      }

      // If the city already has a card, update the time
      let card = document.getElementById(`card-${index}`);
      if (!card) {
        card = document.createElement("div");
        card.classList.add("bg-white", "dark:bg-zinc-800", "p-4", "rounded-lg", "shadow-md", "flex", "flex-col", "items-center");
        card.id = `card-${index}`;
        clockContainer.appendChild(card);
      }

      // Add border class if this is the current location
      card.className = `bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md flex flex-col items-center ${borderClass}`;

      card.innerHTML = `
        <h3 class="text-lg text-center font-semibold text-zinc-800 dark:text-zinc-100">${label}</h3>
        <p class="text-xl ${timeClass} dark:text-zinc-100" id="time-${index}">${timeString}</p>
        <p class="text-sm ${dayClass}" id="day-${index}">${cityDay}</p>
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
