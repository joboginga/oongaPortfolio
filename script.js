document.addEventListener('DOMContentLoaded', () => {

    /* ================================================
       1. TYPING EFFECT
    ================================================ */
    const typingEl = document.querySelector('.typing-text');
    const words = [
        'Urban Communities.',
        'Sustainable Cities.',
        'Efficient Transit.',
        'Equitable Mobility.',
        'Vibrant Neighborhoods.',
        'Inclusive Transportation.',
        'Mobility and Beyond.'
    ];
    let wIdx = 0, cIdx = 0, deleting = false, speed = 120;

    function type() {
        const word = words[wIdx];
        typingEl.textContent = deleting
            ? word.substring(0, cIdx - 1)
            : word.substring(0, cIdx + 1);
        deleting ? cIdx-- : cIdx++;
        speed = deleting ? 55 : 130;
        if (!deleting && cIdx === word.length) { deleting = true; speed = 2200; }
        else if (deleting && cIdx === 0) { deleting = false; wIdx = (wIdx + 1) % words.length; speed = 500; }
        setTimeout(type, speed);
    }
    if (typingEl) type();


    /* ================================================
       2. SCROLL-REVEAL (IntersectionObserver)
    ================================================ */
    const revealEls = document.querySelectorAll('.reveal, .reveal-left');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                revealObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObs.observe(el));


    /* ================================================
       3. SKILL BAR ANIMATION
    ================================================ */
    const fills = document.querySelectorAll('.fill');
    const barObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('animated');
                barObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.3 });
    fills.forEach(f => barObs.observe(f));


    /* ================================================
       4. CIRCULAR PROGRESS BARS
    ================================================ */
    const circles = document.querySelectorAll('.progress-circle');
    circles.forEach(circle => {
        const percent = parseInt(circle.getAttribute('data-percent'));
        const fillCircle = circle.querySelector('.fill-circle');
        if (!fillCircle) return;
        const r = 22;
        const circ = 2 * Math.PI * r;

        // Use thicker stroke for large circles in the about section
        const isLarge = !!circle.closest('.ap-lang-row');
        fillCircle.style.strokeDasharray = `${circ} ${circ}`;
        fillCircle.style.strokeDashoffset = String(circ);
        fillCircle.style.fill = 'none';
        fillCircle.style.stroke = '#d4a843';
        fillCircle.style.strokeWidth = isLarge ? '5' : '3.5';
        fillCircle.style.strokeLinecap = 'round';

        const circObs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const offset = circ - (percent / 100) * circ;

                    // Double rAF ensures initial hidden state is painted before animating
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            fillCircle.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(0.4, 0, 0.2, 1)';
                            fillCircle.style.strokeDashoffset = String(offset);
                        });
                    });
                    circObs.unobserve(e.target);
                }
            });
        }, { threshold: 0.15 });
        circObs.observe(circle);
    });


    /* ================================================
       5. MOBILE TOGGLES
    ================================================ */
    const sidebar = document.getElementById('sidebar');
    const miniNav = document.getElementById('mini-nav');
    const overlay = document.getElementById('app-overlay');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const navToggle = document.getElementById('nav-toggle');

    const closeAll = () => {
        sidebar?.classList.remove('active');
        miniNav?.classList.remove('active');
        overlay?.classList.remove('active');
    };

    sidebarToggle?.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        miniNav.classList.remove('active');
    });

    navToggle?.addEventListener('click', () => {
        miniNav.classList.toggle('active');
        overlay.classList.toggle('active');
        sidebar.classList.remove('active');
    });

    overlay?.addEventListener('click', closeAll);


    /* ================================================
       6. SMOOTH SCROLLING
    ================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                closeAll();
                const mc = document.getElementById('main-content');
                const isMobile = window.innerWidth <= 1050;
                
                if (isMobile) {
                    window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
                } else if (mc) {
                    mc.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
                } else {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });


    /* ================================================
       7. ACTIVE NAV HIGHLIGHT (scroll spy)
    ================================================ */
    const sections = document.querySelectorAll('section[id], div[id="education"]');
    const navLinks = document.querySelectorAll('.mini-nav a');

    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(sec => {
                const top = sec.offsetTop - 120;
                if (mainContent.scrollTop >= top) {
                    current = sec.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }


    /* ================================================
       8. CONTACT FORM
    ================================================ */
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    if (form && submitBtn) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const original = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.style.background = '#2dcc70';
            submitBtn.disabled = true;
            setTimeout(() => {
                submitBtn.innerHTML = original;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                form.reset();
            }, 3000);
        });
    }


    /* ================================================
       9. SKILL CARD HOVER number effect
    ================================================ */
    document.querySelectorAll('.expertise-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            document.querySelectorAll('.expertise-tag').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
        });
    });

    /* ================================================
       10. UNIFIED SCROLL SPY (Desktop + Mobile)
    ================================================ */
    const updateActiveNav = () => {
        const sections = document.querySelectorAll('section[id], .content-section[id], div[id="education"]');
        const navLinks = document.querySelectorAll('.mini-nav a');
        const mainContent = document.getElementById('main-content');
        
        const isMobile = window.innerWidth <= 1050;
        const scrollPos = isMobile ? window.pageYOffset : (mainContent ? mainContent.scrollTop : 0);
        
        let current = '';
        sections.forEach(sec => {
            const sectionTop = sec.offsetTop;
            if (scrollPos >= sectionTop - 250) {
                current = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    const mainScroll = document.getElementById('main-content');
    if (mainScroll) mainScroll.addEventListener('scroll', updateActiveNav);
    window.addEventListener('scroll', updateActiveNav);
    // Trigger once on load
    updateActiveNav();
});
