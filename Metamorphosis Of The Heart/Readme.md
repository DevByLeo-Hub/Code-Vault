# 💖 Metamorfose de Partículas - Coração e Estrela

Bem-vindo ao código do projeto Metamorfose de Partículas! 💖 Este é um projeto fascinante de Codificação Criativa (Creative Coding) focado em manipular a API do Canvas para criar transições fluidas e luminosas entre formas geométricas complexas utilizando pura matemática.

![Preview do Projeto](Heart.png)

## 🚀 Sobre o Projeto

Uma animação contínua construída do zero em HTML5 e JavaScript puro, sem o uso de imagens ou bibliotecas externas[cite: 26]. O código orquestra 1200 partículas individuais que viajam do centro da tela para formar um coração rosa pulsante, retraem de volta ao núcleo, e então renascem como uma estrela dourada, criando um espetáculo visual infinito[cite: 26].

## ✨ Funcionalidades Principais

* **Matemática Paramétrica:** O formato perfeito do coração é desenhado utilizando equações trigonométricas avançadas (combinando ondas de seno e cosseno), enquanto a estrela de 5 pontas é calculada através de um sistema de vértices radiais com raios alternados (`getStarPos`)[cite: 26].
* **Máquina de Estados (State Loop):** Um sistema baseado em `Date.now()` alterna os ciclos da animação entre 4 estados distintos de expansão e retração (com durações de 6000ms e 4500ms), guiando a coreografia do enxame de luzes[cite: 26].
* **Sistema de Atraso e Easing:** As partículas não se movem de forma dura. O uso estratégico de atrasos matemáticos (`delayOut` e `delayIn`) combinado com interpolação de movimento (`p.x += (shapeX - p.x) * 0.08`) confere uma movimentação orgânica e quase "viva" às partículas[cite: 26].
* **Efeito de Rastro Neon (Glow/Trail):** A cada quadro da animação, a tela é desenhada com um fundo preto semi-transparente, enquanto as partículas recebem o modo de mesclagem de adição (`globalCompositeOperation = "lighter"`). Isso cria um rastro de luz suave e um brilho neon intenso quando elas se aglomeram[cite: 26].
* **Transição de Paletas Chromáticas:** As cores são sorteadas e alteradas dinamicamente, passando de tons vibrantes de rosa e magenta para o coração, até tons solares de dourado, laranja e amarelo para a estrela[cite: 26].

## 🛠️ Tecnologias Utilizadas

* **HTML5 & CSS3:** Fornecem a estrutura em tela cheia (fullscreen) e a remoção de rolagem (`overflow: hidden`) sobre um fundo 100% preto para garantir o máximo contraste luminoso[cite: 26].
* **JavaScript (Vanilla):** Motor central da física. Faz uso extensivo do `CanvasRenderingContext2D`, manipulação complexa de Arrays contendo objetos de física e o loop nativo do `requestAnimationFrame`[cite: 26].

## 📂 Estrutura de Arquivos

* `index.html` - Arquivo único consolidado que contém a marcação básica, as regras CSS e toda a lógica complexa do motor de partículas em JavaScript[cite: 26].
* `Captura de tela 2026-08-08 093206.png` - Imagem de demonstração (preview) deste README.

## 🚀 Como Executar

1. Faça o download ou clone este repositório.
2. Dê um duplo clique no arquivo `index.html` para abri-lo em qualquer navegador web moderno.
3. Não é necessário instalar nada, basta assistir à transformação mágica acontecendo em tempo real na sua tela!
