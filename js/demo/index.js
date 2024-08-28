import { preloadImages } from '../utils.js';

// Configuration
const CONFIG = {
    LENIS: {
        lerp: 0.05,
        smoothWheel: true
    },
    SCROLL: {
        THRESHOLD: 100,
        ANIMATION_DURATION: 2000,
        AUTO_HIDE_DURATION: 5000
    }
};

// DOM Elements
const DOM = {
    contentElements: Array.from(document.querySelectorAll('.content--sticky')),
    scrollAnimation: document.querySelector('.main__action'),
    contactForm: document.getElementById('contact-form'),
    loading: document.getElementById('loading'),
    successMessage: document.getElementById('success-message'),
    closeBtn: document.querySelector('#success-message .close-btn'),
    sliders: {
        slider1: document.getElementById('slider1'),
        slider2: document.getElementById('slider2')
    }
};

// Global variables
let lenis;

// Smooth Scrolling
const initSmoothScrolling = () => {
    lenis = new Lenis(CONFIG.LENIS);
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
};

// Scroll Animations
const initScrollAnimations = () => {
    DOM.contentElements.forEach((el, index) => {
        const isLast = index === DOM.contentElements.length - 1;
        const img = el.querySelector('.content__img');

        gsap.timeline({
            scrollTrigger: {
                trigger: el,
                start: isLast ? 'top top' : 'bottom top',
                end: '+=100%',
                scrub: true
            }
        })
        .to(el, {
            ease: 'none',
            yPercent: -50
        }, 0)
        .fromTo(img, 
            {
                yPercent: 10,
                rotation: 20,
                scale: 0.9,
                filter: 'contrast(130%)'
            }, 
            {
                ease: 'none',
                yPercent: -30,
                rotation: 0,
                scale: 1,
                filter: 'contrast(100%)',
                scrollTrigger: {
                    trigger: el,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            }, 0
        );
    });
};

// Scroll Animation Visibility
const handleScrollAnimationVisibility = () => {
    const checkScroll = () => {
        DOM.scrollAnimation.style.opacity = window.scrollY > CONFIG.SCROLL.THRESHOLD ? '0' : '1';
    };

    window.addEventListener('scroll', checkScroll);
};

// Slider Content Generation
const generateSliderContent = (logos) => {
    return logos.concat(logos).map((logo, index) => `
        <div class="slide">
            <img src="/media/logos/${logo}" alt="Technology logo ${index + 1}" />
        </div>
    `).join('');
};

// Slider Initialization
const initSliders = () => {
    const logos1 = ["C.svg", "CPP.svg", "JS.svg", "PY.svg", "JAVA.svg", "TS.svg", "RUST.svg", "RUBY.svg", "SQL.svg", "GO.svg", "BASH.svg", "HTML.svg", "CSS.svg"];
    const logos2 = ["DJANGO.svg", "DOCKER.svg", "AWS.svg", "MYSQL.svg", "REACT.svg", "NEXT.svg", "VERCEL.svg", "POSTGRESQL.svg", "NODEJS.svg", "MONGODB.svg", "REDIS.svg", "FIREBASE.svg", "TAILWIND.svg"];

    DOM.sliders.slider1.innerHTML = generateSliderContent(logos1);
    DOM.sliders.slider2.innerHTML = generateSliderContent(logos2);
};

// Form Submission Handling
const handleFormSubmission = (e) => {
    e.preventDefault();
    DOM.loading.style.display = 'flex';

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        DOM.loading.style.display = 'none';
        showSuccessMessage();
        e.target.reset();
    }, CONFIG.SCROLL.ANIMATION_DURATION);
};

// Success Message Display
const showSuccessMessage = () => {
    DOM.successMessage.style.display = 'flex';
    setTimeout(() => DOM.successMessage.classList.add('show'), 10);
    setTimeout(hideSuccessMessage, CONFIG.SCROLL.AUTO_HIDE_DURATION);
};

// Success Message Hide
const hideSuccessMessage = () => {
    DOM.successMessage.classList.remove('show');
    DOM.successMessage.classList.add('hide');
    setTimeout(() => {
        DOM.successMessage.style.display = 'none';
        DOM.successMessage.classList.remove('hide');
    }, 300);
};

// Initialization
const init = () => {
    initSmoothScrolling();
    initScrollAnimations();
    handleScrollAnimationVisibility();
    initSliders();

    DOM.contactForm.addEventListener('submit', handleFormSubmission);
    DOM.closeBtn.addEventListener('click', hideSuccessMessage);
};

// Start the application
preloadImages('.content__img')
    .then(() => {
        document.body.classList.remove('loading');
        init();
    })
    .catch(error => {
        console.error('Failed to preload images:', error);
        // Fallback initialization if image preloading fails
        document.body.classList.remove('loading');
        init();
    });