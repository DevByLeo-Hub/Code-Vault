# 🪐 Esfera Cósmica 3D - Sistema de Partículas

Bem-vindo ao código do projeto da Esfera Cósmica 3D! 🪐 Este é um projeto fascinante de Codificação Criativa (Creative Coding) focado na renderização avançada de milhares de partículas simultâneas utilizando o poder do WebGL.

![Preview do Projeto](exemplo.jpg)

## 🚀 Sobre o Projeto

Um simulador visual cósmico construído em um arquivo único, utilizando a biblioteca Three.js para renderizar geometrias complexas diretamente no navegador[cite: 30]. O sistema combina lógicas matemáticas de esferas espirais e físicas orbitais com materiais customizados via shaders (GLSL), garantindo efeitos intensos de brilho neon (glow) com excelente performance[cite: 30].

## ✨ Funcionalidades Principais

* **Núcleo Pulsante (Spiral Sphere):** O centro do espetáculo é composto por 25.000 partículas distribuídas perfeitamente usando equações trigonométricas (`Math.acos` e `Math.sin`). O núcleo possui um efeito de "respiração", onde sua escala aumenta e diminui suavemente com o tempo[cite: 30].
* **Anéis Orbitais Multicores:** Seis anéis independentes, com 3.000 partículas cada, cruzam o núcleo. Eles rotacionam em múltiplos eixos (X, Y, Z) com velocidades dinâmicas (`dynamicSpeed`) que mudam conforme a animação avança[cite: 30].
* **Shaders Customizados (GLSL Avançado):** O brilho das partículas não depende de imagens externas. Um `ShaderMaterial` injetado diretamente no código calcula o desfoque radial (`glow`), pulsações individuais e o desvanecimento pela distância (distance fade) no nível do pixel[cite: 30].
* **Profundidade Cósmica (Starfield & Nebula):** O fundo 3D é composto por um campo estelar de 8.000 estrelas que giram lentamente, enquanto uma camada fixa de nebulosa roxa é gerada em CSS puro (`radial-gradient` com `mix-blend-mode: screen`)[cite: 30].
* **Cores e Mesclagem de Luz (Additive Blending):** As paletas de cores (Ouro, Esmeralda, Rubi, Bronze e Prata) são aplicadas nas partículas utilizando o modo `AdditiveBlending`, o que significa que as cores se somam ao se sobreporem, criando a ilusão perfeita de luz e energia concentrada[cite: 30].
* **Câmera Interativa:** Totalmente controlável pelo usuário através do `OrbitControls`, permitindo girar e dar zoom pelo espaço tridimensional ao redor da esfera, com amortecimento suave (`enableDamping`)[cite: 30].

## 🛠️ Tecnologias Utilizadas

* **HTML5 & CSS3:** Utilizados para criar a camada invisível da nebulosa de fundo e garantir que a visualização 3D ocupe 100% da tela sem barras de rolagem[cite: 30].
* **JavaScript (ES Modules):** A linguagem central que gerencia os loops de renderização (`requestAnimationFrame`), cálculos matemáticos das órbitas e as matrizes de partículas[cite: 30].
* **Three.js (v0.162.0):** Biblioteca gráfica principal que abstrai a complexidade do WebGL para desenhar a cena 3D, gerenciar a câmera, compilar os shaders e injetar as propriedades (`BufferAttribute`) nas partículas[cite: 30].

## 📂 Estrutura de Arquivos

* `index.html` - Arquivo consolidado que contém a marcação HTML, estilização CSS de fundo, a importação do Three.js e toda a lógica de construção das partículas em JavaScript[cite: 30].
* `exemplo.jpg` - Imagem de demonstração (preview) deste README.

## 🚀 Como Executar

1. Faça o download ou clone este repositório.
2. Devido à importação de módulos do Three.js via `importmap` na tag `<script>`, é recomendado abrir o projeto através de um servidor local (como a extensão "Live Server" do VSCode) para que o navegador não bloqueie o carregamento por políticas de segurança (CORS).
3. Arraste o mouse pela tela para rotacionar o sistema solar em 360º.
4. Use o "scroll" (roda do mouse) ou o movimento de pinça (em telas touch) para dar zoom in e out na galáxia!
