const btnNo = document.getElementById('btn-no');
const btnYes = document.getElementById('btn-yes');
const questionContainer = document.getElementById('question-container');
const successContainer = document.getElementById('success-container');
const confettiContainer = document.getElementById('confetti-container');
const mensagemFuga = document.getElementById('mensagem-fuga');

const frases = [
    "Tem certeza?",
    "Pense bem...",
    "Olha lá, hein!",
    "Vai clicar mesmo?",
    "Dá mais uma pensadinha...",
    "Certeza absoluta?",
    "Acho que você clicou errado..."
];

let contadorFugas = 0;

function fugir() {
    btnNo.style.position = 'fixed';
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const buttonWidth = btnNo.offsetWidth;
    const buttonHeight = btnNo.offsetHeight;
    
    const randomX = Math.floor(Math.random() * (windowWidth - buttonWidth));
    const randomY = Math.floor(Math.random() * (windowHeight - buttonHeight));
    
    btnNo.style.left = randomX + 'px';
    btnNo.style.top = randomY + 'px';

    if (contadorFugas < frases.length) {
        mensagemFuga.innerText = frases[contadorFugas];
        contadorFugas++;
    } else {
        mensagemFuga.innerText = frases[frases.length - 1];
    }
}

btnNo.addEventListener('mouseover', fugir);
btnNo.addEventListener('touchstart', fugir); 

btnYes.addEventListener('click', () => {
    questionContainer.classList.add('hidden');
    successContainer.classList.remove('hidden');
    confettiContainer.classList.remove('hidden');
    iniciarChuva();
});

function iniciarChuva() {
    setInterval(() => {
        const el = document.createElement('div');
        
        if (Math.random() > 0.5) {
            el.classList.add('heart');
            el.innerText = Math.random() > 0.5 ? '❤️' : '💖';
        } else {
            el.classList.add('confetti');
            const colors = ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7', '#ffffff', '#ffd700'];
            el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            el.style.width = (Math.random() * 10 + 5) + 'px';
            el.style.height = (Math.random() * 20 + 10) + 'px';
        }

        el.style.left = Math.random() * 100 + 'vw';
        el.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        confettiContainer.appendChild(el);

        setTimeout(() => {
            el.remove();
        }, 5000);
    }, 50); 
}