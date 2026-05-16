/* =====================================================
   CEREMONY SQUAD — script.js
   Vanilla JavaScript · All interactive features
   ===================================================== */

"use strict";

/* ──────────────────────────────────────────────────────
   1. LOADER
────────────────────────────────────────────────────── */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => {
    loader.classList.add("hidden");
    document.body.style.overflow = "";
  }, 2000);
});
document.body.style.overflow = "hidden";

/* =============================================
   2. CUSTOM CURSOR
   ============================================= */
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left  = mouseX + 'px';
  cursorDot.style.top   = mouseY + 'px';
});
// Smooth ring follow
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();
// Smooth ring follow
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();
// Smooth ring follow
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

/* ──────────────────────────────────────────────────────
   2. STICKY NAV + HEADER SCROLL
────────────────────────────────────────────────────── */
const header = document.getElementById("header");

function onScroll() {
  if (window.scrollY > 60) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  // Back-to-top
  const btt = document.getElementById("backToTop");
  if (window.scrollY > 500) {
    btt.classList.add("visible");
  } else {
    btt.classList.remove("visible");
  }
}

window.addEventListener("scroll", onScroll, { passive: true });


/* ──────────────────────────────────────────────────────
   3. HAMBURGER MENU
────────────────────────────────────────────────────── */
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("open");
});

// Close on link click
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("open");
  });
});

// Close on outside click
document.addEventListener("click", e => {
  if (!header.contains(e.target)) {
    hamburger.classList.remove("active");
    navLinks.classList.remove("open");
  }
});


/* ──────────────────────────────────────────────────────
   4. BACK TO TOP
────────────────────────────────────────────────────── */
document.getElementById("backToTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


/* ──────────────────────────────────────────────────────
   5. SCROLL REVEAL
────────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(
  ".reveal-fade, .reveal-up, .reveal-left, .reveal-right"
).forEach(el => revealObserver.observe(el));


/* ──────────────────────────────────────────────────────
   6. COUNTER ANIMATION
────────────────────────────────────────────────────── */
function animateCounter(el, target, duration = 1600) {
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    // Ease out
    const val = Math.floor(easeOut(progress) * target);
    el.textContent = val;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".stat-num").forEach(el => counterObserver.observe(el));


/* ──────────────────────────────────────────────────────
   7. GALLERY FILTER + LIGHTBOX
────────────────────────────────────────────────────── */
const filterBtns   = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".masonry-item");
const lightbox     = document.getElementById("lightbox");
const lightboxImg  = document.getElementById("lightboxImg");
const lightboxCap  = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev  = document.getElementById("lightboxPrev");
const lightboxNext  = document.getElementById("lightboxNext");

let visibleItems = [];
let currentIndex  = 0;

// Filter logic
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      if (filter === "all" || item.dataset.category === filter) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });
  });
});

// Build visible list
function buildVisible() {
  visibleItems = [...galleryItems].filter(i => !i.classList.contains("hidden"));
}

// Open lightbox
function openLightbox(index) {
  buildVisible();
  currentIndex = index;
  const item = visibleItems[currentIndex];
  const img  = item.querySelector("img");
  const cap  = item.querySelector(".masonry-overlay span");

  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCap.textContent = cap ? cap.textContent : "";
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

function showPrev() {
  currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
  openLightbox(currentIndex);
}

function showNext() {
  currentIndex = (currentIndex + 1) % visibleItems.length;
  openLightbox(currentIndex);
}

galleryItems.forEach((item, i) => {
  item.addEventListener("click", () => {
    buildVisible();
    const visible = [...galleryItems].filter(it => !it.classList.contains("hidden"));
    const vIdx = visible.indexOf(item);
    openLightbox(vIdx);
  });
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", showPrev);
lightboxNext.addEventListener("click", showNext);
document.querySelector(".lightbox-backdrop").addEventListener("click", closeLightbox);

document.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showPrev();
  if (e.key === "ArrowRight") showNext();
});


/* ──────────────────────────────────────────────────────
   8. TESTIMONIAL CAROUSEL
────────────────────────────────────────────────────── */
const track  = document.getElementById("testimonialTrack");
const cards  = track.querySelectorAll(".testimonial-card");
const dotsEl = document.getElementById("carouselDots");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let current = 0;
let autoSlide;

// Create dots
cards.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.className = "carousel-dot" + (i === 0 ? " active" : "");
  dot.setAttribute("aria-label", `Slide ${i + 1}`);
  dot.addEventListener("click", () => goTo(i));
  dotsEl.appendChild(dot);
});

function goTo(idx) {
  current = (idx + cards.length) % cards.length;
  track.style.transform = `translateX(calc(-${current * 100}% - ${current * 1.75}rem))`;
  document.querySelectorAll(".carousel-dot").forEach((d, i) => {
    d.classList.toggle("active", i === current);
  });
}

prevBtn.addEventListener("click", () => { goTo(current - 1); resetAuto(); });
nextBtn.addEventListener("click", () => { goTo(current + 1); resetAuto(); });

function resetAuto() {
  clearInterval(autoSlide);
  autoSlide = setInterval(() => goTo(current + 1), 5000);
}

autoSlide = setInterval(() => goTo(current + 1), 5000);

// Touch / swipe
let touchStart = 0;
track.addEventListener("touchstart", e => { touchStart = e.touches[0].clientX; }, { passive: true });
track.addEventListener("touchend", e => {
  const diff = touchStart - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) { diff > 0 ? goTo(current + 1) : goTo(current - 1); resetAuto(); }
});


/* ──────────────────────────────────────────────────────
   9. CONTACT FORM VALIDATION
────────────────────────────────────────────────────── */
const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", e => {
  e.preventDefault();
  let valid = true;

  const name    = document.getElementById("name");
  const email   = document.getElementById("email");
  const event   = document.getElementById("eventType");
  const message = document.getElementById("message");

  // Clear
  ["nameError","emailError","eventError","messageError"].forEach(id => {
    document.getElementById(id).textContent = "";
  });

  if (!name.value.trim() || name.value.trim().length < 2) {
    document.getElementById("nameError").textContent = "Please enter your full name.";
    name.focus();
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value.trim())) {
    document.getElementById("emailError").textContent = "Please enter a valid email address.";
    if (valid) email.focus();
    valid = false;
  }

  if (!event.value) {
    document.getElementById("eventError").textContent = "Please select an event type.";
    valid = false;
  }

  if (!message.value.trim() || message.value.trim().length < 20) {
    document.getElementById("messageError").textContent = "Please share a little more about your vision (min 20 chars).";
    valid = false;
  }

  if (valid) {
    // Simulate send
    const btn = contactForm.querySelector("button[type='submit']");
    btn.textContent = "Sending…";
    btn.disabled = true;
    setTimeout(() => {
      contactForm.reset();
      btn.textContent = "Send Enquiry";
      btn.disabled = false;
      const success = document.getElementById("formSuccess");
      success.classList.add("visible");
      setTimeout(() => success.classList.remove("visible"), 5000);
    }, 1500);
  }
});


/* ──────────────────────────────────────────────────────
   10. NEWSLETTER FORM
────────────────────────────────────────────────────── */
document.getElementById("newsletterForm").addEventListener("submit", e => {
  e.preventDefault();
  const success = document.getElementById("newsletterSuccess");
  success.classList.add("visible");
  e.target.reset();
  setTimeout(() => success.classList.remove("visible"), 4000);
});


/* ──────────────────────────────────────────────────────
   11. SMOOTH SCROLL FOR NAV LINKS
────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const offset = document.getElementById("header").offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  });
});


/* ──────────────────────────────────────────────────────
   12. ACTIVE NAV LINK ON SCROLL
────────────────────────────────────────────────────── */
const sections = document.querySelectorAll("section[id]");

const activeObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll(".nav-links a").forEach(a => {
          a.style.color = "";
        });
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.style.color = "var(--gold)";
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => activeObserver.observe(s));
