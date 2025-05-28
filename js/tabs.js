document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabSections = document.querySelectorAll(".tab-section");

  function clearActiveClasses() {
    tabButtons.forEach(btn => {
      btn.classList.remove("active-tab", "text-zinc-900", "dark:text-white", "font-semibold");
      btn.classList.add("text-zinc-500");
    });
  }

  function showTab(tabName) {
    tabSections.forEach(section => {
      section.classList.toggle("hidden", section.id !== tabName);
    });

    clearActiveClasses();

    tabButtons.forEach(btn => {
      if (btn.dataset.tab === tabName) {
        btn.classList.remove("text-zinc-500");
        btn.classList.add("active-tab", "text-zinc-900", "dark:text-white", "font-semibold");
      }
    });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      showTab(btn.dataset.tab);
    });
  });

  // Initialize on Timers tab
  showTab("timers");
});
