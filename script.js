// =========================
// PORTFOLIO ADVANCED SCRIPT
// =========================


// =========================
// CUSTOM CURSOR
// =========================

const cursor = document.createElement("div");

cursor.classList.add("custom-cursor");

document.body.appendChild(cursor);

document.addEventListener("mousemove", (e) => {

    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";

});


// =========================
// TYPING EFFECT
// =========================

const typingText = document.querySelector(".typing-text");

const words = [
    "Flutter Developer",
    "Frontend Developer",
    "UI/UX Designer",
    "Full Stack Developer",
    "Firebase Developer"
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect(){

    const currentWord = words[wordIndex];

    if(isDeleting){

        typingText.textContent =
        currentWord.substring(0, charIndex--);

    }else{

        typingText.textContent =
        currentWord.substring(0, charIndex++);

    }

    let speed = isDeleting ? 70 : 120;

    if(!isDeleting &&
       charIndex === currentWord.length + 1){

        speed = 1500;
        isDeleting = true;

    }

    else if(isDeleting &&
            charIndex === 0){

        isDeleting = false;

        wordIndex++;

        if(wordIndex === words.length){

            wordIndex = 0;

        }

    }

    setTimeout(typeEffect, speed);

}

typeEffect();


// =========================
// SCROLL REVEAL
// =========================

const hiddenElements =
document.querySelectorAll(".hidden");

const observer =
new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},{
    threshold:0.2
});

hiddenElements.forEach((el) => {

    observer.observe(el);

});


// =========================
// NAVBAR SCROLL EFFECT
// =========================

const navbar =
document.querySelector(".header");

window.addEventListener("scroll", () => {

    if(window.scrollY > 50){

        navbar.classList.add("active-navbar");

    }else{

        navbar.classList.remove("active-navbar");

    }

});


// =========================
// ACTIVE NAV LINK
// =========================

const sections =
document.querySelectorAll("section");

const navItems =
document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach((section) => {

        const sectionTop = section.offsetTop;

        if(scrollY >= sectionTop - 200){

            current =
            section.getAttribute("id");

        }

    });

    navItems.forEach((link) => {

        link.classList.remove("active");

        if(link.getAttribute("href")
           === `#${current}`){

            link.classList.add("active");

        }

    });

});


// =========================
// MOBILE MENU
// =========================

const menuBtn =
document.querySelector(".menu-btn");

const navLinks =
document.querySelector(".nav-links");

const menuIcon =
document.querySelector(".menu-btn i");

menuBtn.addEventListener("click", () => {

    navLinks.classList.toggle("show-menu");

    if(navLinks.classList.contains("show-menu")){

        menuIcon.classList.remove(
            "ri-menu-3-line"
        );

        menuIcon.classList.add(
            "ri-close-line"
        );

    }else{

        menuIcon.classList.remove(
            "ri-close-line"
        );

        menuIcon.classList.add(
            "ri-menu-3-line"
        );

    }

});


// =========================
// CLOSE MENU ON LINK CLICK
// =========================

document.querySelectorAll(".nav-links a")
.forEach((link) => {

    link.addEventListener("click", () => {

        navLinks.classList.remove(
            "show-menu"
        );

        menuIcon.classList.remove(
            "ri-close-line"
        );

        menuIcon.classList.add(
            "ri-menu-3-line"
        );

    });

});


// =========================
// SCROLL PROGRESS BAR
// =========================

const progressBar =
document.createElement("div");

progressBar.classList.add(
    "scroll-progress"
);

document.body.appendChild(progressBar);

window.addEventListener("scroll", () => {

    const totalHeight =
    document.body.scrollHeight -
    window.innerHeight;

    const progress =
    (window.pageYOffset / totalHeight)
    * 100;

    progressBar.style.width =
    progress + "%";

});


// =========================
// PARALLAX HERO
// =========================

window.addEventListener("mousemove", (e) => {

    const heroImage =
    document.querySelector(".hero-image");

    const x =
    (window.innerWidth / 2 - e.pageX)
    / 40;

    const y =
    (window.innerHeight / 2 - e.pageY)
    / 40;

    heroImage.style.transform =
    `translate(${x}px, ${y}px)`;

});


// =========================
// MAGNETIC BUTTONS
// =========================

const buttons =
document.querySelectorAll(".btn");

buttons.forEach((btn) => {

    btn.addEventListener("mousemove",
    (e) => {

        const position =
        btn.getBoundingClientRect();

        const x =
        e.clientX -
        position.left -
        position.width / 2;

        const y =
        e.clientY -
        position.top -
        position.height / 2;

        btn.style.transform =
        `translate(${x * 0.2}px,
        ${y * 0.2}px)`;

    });

    btn.addEventListener("mouseleave",
    () => {

        btn.style.transform =
        "translate(0px,0px)";

    });

});


// =========================
// PARTICLE BACKGROUND
// =========================

const canvas =
document.createElement("canvas");

canvas.id = "particle-canvas";

document.body.appendChild(canvas);

canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.zIndex = "-1";
canvas.style.pointerEvents = "none";

const ctx = canvas.getContext("2d");

function resizeCanvas(){

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

resizeCanvas();

let particlesArray = [];

class Particle{

    constructor(){

        this.x =
        Math.random() * canvas.width;

        this.y =
        Math.random() * canvas.height;

        this.size =
        Math.random() * 2;

        this.speedX =
        (Math.random() - 0.5) * 0.5;

        this.speedY =
        (Math.random() - 0.5) * 0.5;

    }

    update(){

        this.x += this.speedX;
        this.y += this.speedY;

        if(this.x > canvas.width)
            this.x = 0;

        if(this.x < 0)
            this.x = canvas.width;

        if(this.y > canvas.height)
            this.y = 0;

        if(this.y < 0)
            this.y = canvas.height;

    }

    draw(){

        ctx.fillStyle =
        "rgba(56,189,248,0.7)";

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}

function initParticles(){

    particlesArray = [];

    for(let i = 0; i < 120; i++){

        particlesArray.push(
            new Particle()
        );

    }

}

initParticles();

function animateParticles(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    particlesArray.forEach((particle) => {

        particle.update();
        particle.draw();

    });

    requestAnimationFrame(
        animateParticles
    );

}

animateParticles();

window.addEventListener("resize", () => {

    resizeCanvas();

    initParticles();

});


// =========================
// LOADER
// =========================

window.addEventListener("load", () => {

    const loader =
    document.createElement("div");

    loader.classList.add("loader");

    loader.innerHTML = `

        <div class="loader-text">
            Suraj SK
        </div>

    `;

    document.body.appendChild(loader);

    setTimeout(() => {

        loader.classList.add(
            "loader-hide"
        );

    },1500);

});


// =========================
// PROJECT CARD TILT
// =========================

const cards =
document.querySelectorAll(".project-card");

cards.forEach((card) => {

    card.addEventListener("mousemove",
    (e) => {

        const rect =
        card.getBoundingClientRect();

        const x =
        e.clientX - rect.left;

        const y =
        e.clientY - rect.top;

        const rotateX =
        ((y / rect.height) - 0.5) * 10;

        const rotateY =
        ((x / rect.width) - 0.5) * -10;

        card.style.transform =

        `perspective(1000px)
         rotateX(${rotateX}deg)
         rotateY(${rotateY}deg)
         translateY(-10px)`;

    });

    card.addEventListener("mouseleave",
    () => {

        card.style.transform =

        `perspective(1000px)
         rotateX(0)
         rotateY(0)`;

    });

});
