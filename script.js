// ==============================
// Basic JavaScript Interactions
// ==============================
//
// 1) Dark mode toggle with localStorage persistence
// 2) Smooth scrolling for internal navigation
// 3) Reveal-on-scroll animations using IntersectionObserver
// 4) Footer year auto-update
//
// All written in vanilla JavaScript with beginner-friendly comments.

// ------------ DARK MODE TOGGLE ------------

(function setupThemeToggle() {
  const toggleButton = document.getElementById("theme-toggle");
  const body = document.body;
  const THEME_KEY = "preferred-theme";

  // Update the icon emoji based on current theme
  function updateIcon() {
    const iconSpan = toggleButton.querySelector(".theme-icon");
    if (body.classList.contains("light-theme")) {
      iconSpan.textContent = "☀️"; // Light theme
    } else {
      iconSpan.textContent = "🌙"; // Dark theme
    }
  }

  // Apply stored theme preference on page load, or respect system preference
  const savedTheme = window.localStorage.getItem(THEME_KEY);
  if (savedTheme === "light") {
    body.classList.add("light-theme");
  } else if (savedTheme === "dark") {
    body.classList.remove("light-theme");
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    body.classList.add("light-theme");
  }

  updateIcon();

  // Toggle theme when user clicks the button
  toggleButton.addEventListener("click", function () {
    const isLight = body.classList.toggle("light-theme");
    window.localStorage.setItem(THEME_KEY, isLight ? "light" : "dark");
    updateIcon();
  });
})();

// ------------ SMOOTH SCROLLING ------------

(function setupSmoothScrolling() {
  // Select all anchor links that navigate to an ID on the same page
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href");

      // Ignore if href is just "#"
      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      // Prevent the default "jump"
      event.preventDefault();

      // Smoothly scroll to the selected section
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });
})();

// ------------ REVEAL-ON-SCROLL ANIMATION ------------

(function setupRevealOnScroll() {
  const revealElements = document.querySelectorAll(".reveal-on-scroll");

  // If IntersectionObserver is not supported, just show the elements
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  // Observer callback: runs when an observed element enters or leaves the viewport
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // Once visible, no need to observe again
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18 // When ~18% of the element is visible, trigger the animation
    }
  );

  // Attach the observer to each element we want to animate
  revealElements.forEach(function (el) {
    observer.observe(el);
  });
})();

// ------------ FOOTER YEAR (SMALL DETAIL) ------------

(function updateFooterYear() {
  const yearSpan = document.getElementById("year");
  if (!yearSpan) return;
  const currentYear = new Date().getFullYear();
  yearSpan.textContent = currentYear;
})();

// ------------ CERTIFICATE SLIDER ------------

(function setupCertificateSlider() {
  const sliderContainer = document.querySelector('.slider-container');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const cards = document.querySelectorAll('.certificate-card');

  if (!sliderContainer || !prevBtn || !nextBtn || cards.length === 0) return;

  let currentIndex = 0;
  const totalCards = cards.length;
  let startX = 0;
  let isDragging = false;

  function updateSlider() {
    const translateX = -currentIndex * 100;
    sliderContainer.style.transform = `translateX(${translateX}%)`;
  }

  prevBtn.addEventListener('click', function() {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalCards - 1;
    updateSlider();
  });

  nextBtn.addEventListener('click', function() {
    currentIndex = (currentIndex < totalCards - 1) ? currentIndex + 1 : 0;
    updateSlider();
  });

  // Touch events for swiping
  sliderContainer.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  sliderContainer.addEventListener('touchmove', function(e) {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        // Swipe left - next
        currentIndex = (currentIndex < totalCards - 1) ? currentIndex + 1 : 0;
      } else {
        // Swipe right - prev
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalCards - 1;
      }
      updateSlider();
      isDragging = false;
    }
  });

  sliderContainer.addEventListener('touchend', function() {
    isDragging = false;
  });

  // Optional: Auto-slide every 5 seconds
  // setInterval(() => {
  //   currentIndex = (currentIndex < totalCards - 1) ? currentIndex + 1 : 0;
  //   updateSlider();
  // }, 5000);
})();