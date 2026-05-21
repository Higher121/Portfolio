
// Typing Animation

const typingText = document.querySelector('.typing');

const words = [
    'Flutter Developer',
    'Web Developer',
    'UI Designer',
    'App Developer'
];

let wordIndex = 0;
let charIndex = 0;
let currentWord = '';
let currentChars = '';

function type(){

    if(wordIndex < words.length){

        currentWord = words[wordIndex];
        currentChars = currentWord.slice(0, ++charIndex);

        typingText.textContent = currentChars;

        if(currentChars.length == currentWord.length){
            wordIndex++;
            charIndex = 0;

            if(wordIndex == words.length){
                wordIndex = 0;
            }
        }
    }

    setTimeout(type,200);
}

type();


// Scroll Animation

const observer = new IntersectionObserver((entries)=>{

    entries.forEach((entry)=>{

        if(entry.isIntersecting){
            entry.target.classList.add('show');
        }

    });

});

const hiddenElements = document.querySelectorAll('.hidden');

hiddenElements.forEach((el)=>observer.observe(el));


// Navbar Background Scroll

window.addEventListener('scroll',()=>{

    const navbar = document.querySelector('.navbar');

    if(window.scrollY > 50){
        navbar.style.background = '#020617';
    }
    else{
        navbar.style.background = 'rgba(15,23,42,0.8)';
    }

});

//advanced features
