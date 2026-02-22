document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // NAVBAR FUNCTIONALITY
    // ============================================
    const navbar = document.querySelector('.navbar');
    const navItems = document.querySelectorAll('.nav-item');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Scroll Effect: Add 'scrolled' class when scrolling down
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Handle Active State on Click
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to the clicked item
            this.classList.add('active');

            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    });

    // Mobile Menu Toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // ============================================
    // CLAPBOARD VIDEO CONTROLS
    // ============================================
    const video = document.getElementById('hero-video');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const muteBtn = document.getElementById('mute-btn');

    if (video && playPauseBtn && muteBtn) {
        // Play/Pause functionality
        playPauseBtn.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playPauseBtn.classList.add('playing');
            } else {
                video.pause();
                playPauseBtn.classList.remove('playing');
            }
        });

        // Mute/Unmute functionality
        muteBtn.addEventListener('click', () => {
            video.muted = !video.muted;
            muteBtn.classList.toggle('muted', video.muted);
        });

        // Update button states based on video events
        video.addEventListener('play', () => {
            playPauseBtn.classList.add('playing');
        });

        video.addEventListener('pause', () => {
            playPauseBtn.classList.remove('playing');
        });

        // Initialize mute state
        muteBtn.classList.add('muted');
    }

    // ============================================
    // SET CURRENT DATE ON SLATE
    // ============================================
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        dateElement.textContent = `${day}/${month}/${year}`;
    }

    // ============================================
    // CLAPBOARD ENTRANCE ANIMATION
    // ============================================
    const clapperTop = document.querySelector('.clapper-top');
    
    if (clapperTop) {
        // Initial state - clapper closed
        clapperTop.style.transform = 'rotate(0deg) translateY(0)';
        clapperTop.style.opacity = '0';
        
        // Animate to open position after a short delay
        setTimeout(() => {
            clapperTop.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease';
            clapperTop.style.transform = 'rotate(-12deg) translateY(45px)';
            clapperTop.style.opacity = '1';
        }, 300);
    }

    // ============================================
    // SMOOTH SCROLL FOR NAV LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // SCROLL SPY - Update active nav item on scroll
    // ============================================
    const sections = document.querySelectorAll('.section');
    
    const updateActiveNav = () => {
        const scrollPosition = window.scrollY + navbar.offsetHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav);
});