# ❤️ Coração Pulsante em Python - Turtle Graphics

Bem-vindo ao código do projeto Coração Pulsante! ❤️ Este é um projeto de Codificação Criativa utilizando Python puro para gerar arte matemática animada, simulando um batimento cardíaco através de geometria paramétrica.

![Preview do Projeto](coração.png)

## 🚀 Sobre o Projeto

Um script visual construído com a biblioteca gráfica `turtle` do Python[cite: 28]. O projeto não utiliza imagens pré-renderizadas; em vez disso, ele desenha um coração preenchido por centenas de linhas radiais que partem do centro em direção às bordas calculadas matematicamente, criando uma textura única e um efeito de pulsação contínua[cite: 28].

## ✨ Funcionalidades Principais

* **Matemática Paramétrica:** O formato perfeito do coração é traçado utilizando funções trigonométricas (`math.sin` e `math.cos`) que calculam as coordenadas exatas das bordas X e Y em um loop de 750 iterações[cite: 28].
* **Animação de Batimento:** Um loop infinito (`while True`) manipula dinamicamente a escala da geometria utilizando uma onda senoidal (`math.sin(fase)`), fazendo o coração aumentar e diminuir de tamanho suavemente para simular batimentos reais[cite: 28].
* **Efeito de Raios (Textura Radial):** A textura interna não é um preenchimento sólido convencional. O algoritmo move a caneta da borda do coração de volta para a origem `(0, 0)` a cada iteração, gerando um padrão denso de fios/raios luminosos vermelhos sobre o fundo preto[cite: 28].
* **Renderização Otimizada:** Para evitar que o desenho seja feito de forma lenta e sequencial, o código desativa a animação de traço padrão do Turtle (`tela.tracer(0)`) e força a atualização manual da tela (`tela.update()`), garantindo 100% de fluidez na animação[cite: 28].
* **Controle de Teclado:** O script possui um "listener" de eventos configurado para fechar a janela graciosamente caso o usuário pressione a tecla "Escape"[cite: 28].

## 🛠️ Tecnologias Utilizadas

* **Python:** Linguagem de programação central estruturando a lógica e os loops de renderização[cite: 28].
* **Turtle Graphics:** Biblioteca nativa do Python utilizada para instanciar a tela (`tela.setup`), gerenciar o pincel de desenho virtual e capturar os eventos do teclado[cite: 28].
* **Módulo Math:** Biblioteca matemática nativa utilizada para as fórmulas trigonométricas de base do formato do coração e do cálculo de escala do batimento[cite: 28].

## 📂 Estrutura de Arquivos

* `heart.py` (ou `script.py`) - O arquivo principal contendo toda a lógica geométrica e o loop de animação do Turtle.
* `image_5382f5.png` - Imagem de demonstração (preview) deste README.

## 🚀 Como Executar

1. Certifique-se de ter o **Python** instalado no seu computador. (O módulo `turtle` já vem embutido por padrão, então não é necessário usar `pip install`).
2. Faça o download ou clone este repositório.
3. Abra o terminal ou prompt de comando na pasta do arquivo.
4. Execute o script com o comando: `python heart.py` (substitua pelo nome do seu arquivo, caso seja diferente).
5. Aprecie a animação matemática! Para sair, basta pressionar a tecla **Escape (ESC)** no seu teclado.
