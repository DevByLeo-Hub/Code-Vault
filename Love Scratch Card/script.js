const categorias = [
    { id: 'massagem', img: 'ursomassagem.gif', text: 'Vale Massagem' },
    { id: 'casa', img: 'ursocama.gif', text: 'Ficar Agarradinhos' },
    { id: 'cinema', img: 'ursocinema1.gif', text: 'Sessão Cinema' },
    { id: 'quente', img: 'ursopasseio.gif', text: 'Passeio' },
    { id: 'jantar', img: 'ursojantar.gif', text: 'Jantar Especial' },
    { id: 'beijos', img: 'ursobeijo.gif', text: 'Chuva de Beijos' },
    { id: 'show', img: 'ursoshow.gif', text: 'Vale Night de Show' }
];

const container = document.getElementById('container-raspadinhas');
const resultadoBox = document.getElementById('resultado-box');
const mensagemResultado = document.getElementById('mensagem-resultado');
const btnSortear = document.getElementById('btn-sortear');

let isDrawing = false;
let premioGanho = null;
let canvases = [];
let checkCounter = 0;

function embaralharArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function gerarItens() {
    let itens = [];
    
    const vencedor = categorias.find(c => c.id === 'jantar');
    premioGanho = vencedor.text;
    itens.push(vencedor, vencedor, vencedor);
    
    let outras = categorias.filter(c => c.id !== vencedor.id);
    embaralharArray(outras);
    
    itens.push(outras[0], outras[0]);
    itens.push(outras[1], outras[2], outras[3]);
    
    return embaralharArray(itens);
}

function dispararConfetes() {
    const emojis = ['❤️', '💖', '✨', '🎉', '🎊', '🎀'];
    for (let i = 0; i < 80; i++) {
        const confete = document.createElement('div');
        confete.className = 'confete';
        confete.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        confete.style.left = Math.random() * 100 + 'vw';
        confete.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confete.style.animationDelay = Math.random() * 2 + 's';
        confete.style.fontSize = (Math.random() * 15 + 15) + 'px';
        document.body.appendChild(confete);
    }
}

function checkWinCondition() {
    let raspadosTotais = 0;
    
    canvases.forEach(canvasInfo => {
        if(canvasInfo.revelado) {
            raspadosTotais++;
            return;
        }
        
        const ctx = canvasInfo.ctx;
        const canvas = canvasInfo.canvas;
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let transparentPixels = 0;
        
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) transparentPixels++;
        }
        
        const percent = (transparentPixels / (pixels.length / 4)) * 100;
        if (percent > 45) {
            canvasInfo.revelado = true;
            raspadosTotais++;
        }
    });

    if (raspadosTotais === 8 && resultadoBox.classList.contains('hidden')) {
        mensagemResultado.innerHTML = `🎉 Você ganhou:<br><strong>${premioGanho}!</strong>`;
        resultadoBox.classList.remove('hidden');
        dispararConfetes();
    }
}

function rasparGlobal(x, y) {
    let desenhou = false;
    
    canvases.forEach(canvasInfo => {
        const rect = canvasInfo.canvas.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            const scaleX = canvasInfo.canvas.width / rect.width;
            const scaleY = canvasInfo.canvas.height / rect.height;
            const canvasX = (x - rect.left) * scaleX;
            const canvasY = (y - rect.top) * scaleY;
            
            canvasInfo.ctx.beginPath();
            canvasInfo.ctx.arc(canvasX, canvasY, 18, 0, Math.PI * 2);
            canvasInfo.ctx.fill();
            desenhou = true;
        }
    });

    if (desenhou) {
        checkCounter++;
        if (checkCounter % 5 === 0) {
            checkWinCondition();
        }
    }
}

function inicializar() {
    container.innerHTML = '';
    resultadoBox.classList.add('hidden');
    canvases = [];
    checkCounter = 0;
    
    document.querySelectorAll('.confete').forEach(e => e.remove());
    
    const itensSorteados = gerarItens();

    itensSorteados.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'raspadinha-item';

        const premioDiv = document.createElement('div');
        premioDiv.className = 'premio-conteudo';
        premioDiv.innerHTML = `<img src="${item.img}" alt="${item.text}"><span>${item.text}</span>`;

        const canvas = document.createElement('canvas');
        canvas.width = 120; 
        canvas.height = 120; 
        
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.fillStyle = '#fda4af'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = '700 18px "Fredoka", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('RASPE', canvas.width / 2, (canvas.height / 2) - 5);

        ctx.globalCompositeOperation = 'destination-out';

        canvases.push({ canvas, ctx, revelado: false });

        itemDiv.appendChild(premioDiv);
        itemDiv.appendChild(canvas);
        container.appendChild(itemDiv);
    });
}

window.addEventListener('mousedown', () => isDrawing = true);
window.addEventListener('mouseup', () => { 
    isDrawing = false; 
    checkWinCondition(); 
});
window.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    rasparGlobal(e.clientX, e.clientY);
});

window.addEventListener('touchstart', () => isDrawing = true);
window.addEventListener('touchend', () => { 
    isDrawing = false; 
    checkWinCondition(); 
});
window.addEventListener('touchmove', (e) => {
    if (!isDrawing) return;
    rasparGlobal(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });

btnSortear.addEventListener('click', inicializar);
inicializar();