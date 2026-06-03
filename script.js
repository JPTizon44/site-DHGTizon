// script.js
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Menu Toggle Logic
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link-item');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
            if (!isExpanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when a link is clicked
        navLinkItems.forEach(item => {
            item.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    const handleNavbarScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll();

    // 3. Scroll Progress Bar
    const scrollProgress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        }
    });

    // 4. Highlight Active Navigation Links on Scroll
    const sections = document.querySelectorAll('section, header');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinkItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    });

    // 5. Card Mouse Tracking Effect (Glow)
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 6. Smooth Scrolling for Anchor Links with Navbar Offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - (navbarHeight - 5);
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 7. Stats Counter Animation (Triggered on Scroll)
    const statsSection = document.querySelector('.stats');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            let count = 0;
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // ~60fps

            const updateCount = () => {
                count += increment;
                if (count < target) {
                    stat.innerText = Math.floor(count);
                    requestAnimationFrame(updateCount);
                } else {
                    stat.innerText = target;
                }
            };
            updateCount();
        });
    };

    // 8. GSAP Animations and Custom IntersectionObserver Fallback
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Sinaliza no body que o GSAP está ativo para desativar transições CSS conflituosas
        document.body.classList.add('gsap-active');

        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Hero Section Entrance
        gsap.from('.hero-badge', { opacity: 0, y: -20, duration: 1, ease: 'power4.out', delay: 0.2 });
        gsap.from('.hero h1', { opacity: 0, y: 30, duration: 1.2, ease: 'power4.out', delay: 0.4 });
        gsap.from('.hero p', { opacity: 0, y: 20, duration: 1, ease: 'power4.out', delay: 0.6 });
        gsap.from('.hero-actions', { opacity: 0, y: 20, duration: 1, ease: 'power4.out', delay: 0.8 });
        gsap.from('.hero-scroll-indicator', { opacity: 0, duration: 1, delay: 1.2 });

        // Parallax scroll on Hero Background Image
        gsap.to('.hero-bg', {
            yPercent: 15,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // Initialize scroll animations for elements
        const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
        scrollRevealElements.forEach(el => {
            const animType = el.getAttribute('data-animation');
            let startVars = { opacity: 0 };
            let endVars = { opacity: 1, duration: 1, ease: 'power3.out' };

            if (animType === 'slide-up') {
                startVars.y = 50;
                endVars.y = 0;
            } else if (animType === 'slide-right') {
                startVars.x = -50;
                endVars.x = 0;
            } else if (animType === 'slide-left') {
                startVars.x = 50;
                endVars.x = 0;
            } else if (animType === 'fade-in') {
                startVars.scale = 0.95;
                endVars.scale = 1;
            }

            gsap.fromTo(el, startVars, {
                ...endVars,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    onEnter: () => {
                        el.classList.add('is-visible');
                    }
                }
            });
        });

        // Trigger Counter Animation inside ScrollTrigger
        if (statsSection) {
            ScrollTrigger.create({
                trigger: statsSection,
                start: 'top 85%',
                onEnter: () => {
                    if (!animated) {
                        animateStats();
                        animated = true;
                    }
                }
            });
        }

    } else {
        // FALLBACK: If GSAP is blocked or fails to load, use standard IntersectionObserver
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
        scrollRevealElements.forEach(el => revealObserver.observe(el));

        // Fallback Stats Trigger
        if (statsSection) {
            const statsObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !animated) {
                        animateStats();
                        animated = true;
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            statsObserver.observe(statsSection);
        }
        
        // Manual simple entrance fallback for Hero elements
        document.querySelectorAll('.hero-badge, .hero h1, .hero p, .hero-actions').forEach(el => {
            el.style.opacity = '1';
        });
    }
});