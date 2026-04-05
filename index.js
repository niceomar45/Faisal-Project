document.addEventListener("DOMContentLoaded", () => {
  // ============================================
  // FILM STRIP — requestAnimationFrame infinite scroll
  // No CSS animation = no loop jump, never ends
  // ============================================

  function buildSprocketRow(holeCount, isBottom) {
    const row = document.createElement("div");
    row.className = "sprocket-row" + (isBottom ? " row-bottom" : "");
    for (let i = 0; i < holeCount; i++) {
      const hole = document.createElement("div");
      hole.className = "hole";
      row.appendChild(hole);
    }
    return row;
  }

  function buildFilmUnit(frameCount, startNum) {
    const unit = document.createElement("div");
    unit.className = "film-unit";
    const holeCount = Math.ceil((frameCount * 62) / 26);

    unit.appendChild(buildSprocketRow(holeCount, false));

    const frames = document.createElement("div");
    frames.className = "film-frames";
    for (let i = 0; i < frameCount; i++) {
      const frame = document.createElement("div");
      frame.className = "film-frame";
      const num = document.createElement("span");
      num.className = "frame-num";
      num.textContent = String(((startNum + i) % 99) + 1).padStart(2, "0");
      frame.appendChild(num);
      frames.appendChild(frame);
    }
    unit.appendChild(frames);
    unit.appendChild(buildSprocketRow(holeCount, true));
    return unit;
  }

  function populateFilmTrack(trackEl, reversed) {
    // Fill 3× the viewport width so there's always content visible
    const targetWidth = window.innerWidth * 3;
    const FRAMES = 8;
    const unitApproxWidth = FRAMES * 62;
    const unitsNeeded = Math.ceil(targetWidth / unitApproxWidth) + 4;

    const units = [];
    for (let i = 0; i < unitsNeeded; i++) {
      units.push(buildFilmUnit(FRAMES, i * FRAMES));
    }
    if (reversed) units.reverse();

    units.forEach((u) => trackEl.appendChild(u));

    // Measure real rendered width of ONE set
    // then duplicate it for seamless wrap
    requestAnimationFrame(() => {
      const setWidth = trackEl.scrollWidth;
      // Clone all children to make a second identical set
      const children = Array.from(trackEl.children);
      children.forEach((child) => {
        trackEl.appendChild(child.cloneNode(true));
      });
      startScroll(trackEl, setWidth, reversed ? -1 : 1);
    });
  }

  // ============================================
  // rAF scroller — pixel-perfect, never stops
  // ============================================
  const SPEED = 0.3; // px per frame (~36px/s at 60fps)

  function startScroll(trackEl, setWidth, direction) {
    let pos = direction === 1 ? 0 : -setWidth; // start position

    function tick() {
      pos -= SPEED * direction;

      // When we've scrolled exactly one set width, snap back — invisible seam
      if (direction === 1 && pos <= -setWidth) pos += setWidth;
      if (direction === -1 && pos >= 0) pos -= setWidth;

      trackEl.style.transform = `translateX(${pos}px)`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const topTrack = document.getElementById("top-film-track");
  const bottomTrack = document.getElementById("bottom-film-track");
  if (topTrack) populateFilmTrack(topTrack, false);
  if (bottomTrack) populateFilmTrack(bottomTrack, true);

  // ============================================
  // NAVBAR
  // ============================================
  const navbar = document.querySelector(".navbar");
  const navItems = document.querySelectorAll(".nav-item");
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });

  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      navItems.forEach((nav) => nav.classList.remove("active"));
      this.classList.add("active");
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        mobileMenuToggle.classList.remove("active");
      }
    });
  });

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      mobileMenuToggle.classList.toggle("active");
    });
  }

  // ============================================
  // VIDEO CONTROLS
  // ============================================
  const video = document.getElementById("hero-video");
  const playPauseBtn = document.getElementById("play-pause-btn");
  const muteBtn = document.getElementById("mute-btn");

  if (video && playPauseBtn && muteBtn) {
    playPauseBtn.addEventListener("click", () => {
      if (video.paused) {
        video.play();
        playPauseBtn.classList.add("playing");
      } else {
        video.pause();
        playPauseBtn.classList.remove("playing");
      }
    });
    muteBtn.addEventListener("click", () => {
      video.muted = !video.muted;
      muteBtn.classList.toggle("muted", video.muted);
    });
    video.addEventListener("play", () => playPauseBtn.classList.add("playing"));
    video.addEventListener("pause", () =>
      playPauseBtn.classList.remove("playing"),
    );
    muteBtn.classList.add("muted");
  }

  // ============================================
  // SMOOTH SCROLL
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - navbar.offsetHeight,
          behavior: "smooth",
        });
      }
    });
  });

  // ============================================
  // SCROLL SPY
  // ============================================
  const sections = document.querySelectorAll(".section");
  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY + navbar.offsetHeight + 100;
    sections.forEach((section) => {
      if (
        scrollPos >= section.offsetTop &&
        scrollPos < section.offsetTop + section.offsetHeight
      ) {
        const id = section.getAttribute("id");
        navItems.forEach((item) => {
          item.classList.toggle(
            "active",
            item.getAttribute("href") === "#" + id,
          );
        });
      }
    });
  });
});
