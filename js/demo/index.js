import { preloadImages } from '../utils.js';

// Variable to store the Lenis smooth scrolling object
let lenis;

// Selecting DOM elements

const contentElements = [...document.querySelectorAll('.content--sticky')];
const totalContentElements = contentElements.length;

// Initializes Lenis for smooth scrolling with specific properties
const initSmoothScrolling = () => {
	// Instantiate the Lenis object with specified properties
	lenis = new Lenis({
		lerp: 0.05, // Lower values create a smoother scroll effect
		smoothWheel: true // Enables smooth scrolling for mouse wheel events
	});

	// Update ScrollTrigger each time the user scrolls
	lenis.on('scroll', () => ScrollTrigger.update());

	// Define a function to run at each animation frame
	const scrollFn = (time) => {
		lenis.raf(time); // Run Lenis' requestAnimationFrame method
		requestAnimationFrame(scrollFn); // Recursively call scrollFn on each frame
	};
	// Start the animation frame loop
	requestAnimationFrame(scrollFn);
};

// Function to handle scroll-triggered animations
const scroll = () => {

    contentElements.forEach((el, position) => {
        
		const isLast = position === totalContentElements-1;
		
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
            yPercent: -100
        }, 0)
		// Animate the content inner image
        .fromTo(el.querySelector('.content__img'), {
			yPercent: 20,
            rotation: 40,
			scale: 0.8,
			filter: 'contrast(150%)'
		}, {
            ease: 'none',
            yPercent: -100,
            rotation: 0,
			scale: 1,
			filter: 'contrast(100%)',
			scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'max',
                scrub: true
            }
        }, 0);

    });

};

// Initialization function
const init = () => {
    initSmoothScrolling(); // Initialize Lenis for smooth scrolling
    scroll(); // Apply scroll-triggered animations
};

preloadImages('.content__img').then(() => {
    // Once images are preloaded, remove the 'loading' indicator/class from the body
    document.body.classList.remove('loading');
    init();
});


const logos1 = [
    "C.svg", "CPP.svg", "JS.svg", "PY.svg", "JAVA.svg",
    "TS.svg", "RUST.svg", "RUBY.svg", "SQL.svg", "GO.svg",
    "BASH.svg", "HTML.svg", "CSS.svg"
];

const logos2 = [
    "DJANGO.svg", "DOCKER.svg", "AWS.svg", "MYSQL.svg", "REACT.svg",
    "NEXT.svg", "VERCEL.svg", "POSTGRESQL.svg", "NODEJS.svg", "MONGODB.svg", "REDIS.svg",
    "FIREBASE.svg", "TAILWIND.svg"
];

const generateSlides = (logos) => {
    return logos.concat(logos).map((logo, index) => `
        <div class="slide">
            <img src="/media/logos/${logo}" alt="image ${index + 1}" />
        </div>
    `).join('');
};

document.getElementById('slider1').innerHTML = generateSlides(logos1);
document.getElementById('slider2').innerHTML = generateSlides(logos2);
