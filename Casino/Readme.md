# 🎰 Caça-Níquel Python - Simulador de Terminal

Bem-vindo ao código do projeto Caça-Níquel Python! 🎰 Este é um projeto de simulação interativa focado em recriar a clássica experiência de um cassino diretamente no terminal de comandos, utilizando arte em emojis.

![Preview do Projeto](Cassino.png)

## 🚀 Sobre o Projeto

Um script interativo construído inteiramente em Python puro, sem a necessidade de bibliotecas externas complexas[cite: 17]. O projeto simula as rodadas de uma máquina caça-níquel (slot machine), onde o jogador utiliza o teclado para girar os rolos, recebendo feedback visual e textual com base na combinação sorteada[cite: 17].

## ✨ Funcionalidades Principais

* **Símbolos Clássicos em Emojis:** O jogo utiliza uma lista de emojis nativos (🍒, 🍋, 🍉, 🍇, 🔔, 💎, 7️⃣) para representar os ícones tradicionais das máquinas de cassino de forma divertida no terminal[cite: 17].
* **Sistema de Premiação Dinâmico:** A função `verificar_resultado` analisa os rolos após cada giro. Se os 3 símbolos forem iguais, o jogador recebe um alerta de "JACKPOT!"[cite: 17].
* **Feedback de Quase-Vitória (Near-miss):** Se apenas 2 símbolos coincidirem (seja o primeiro com o segundo, o segundo com o terceiro, ou as pontas), o jogo sorteia uma frase motivacional (como "Sorte está chegando!") da lista `frases_casino` para manter o jogador engajado[cite: 17].
* **Efeito de Suspense:** O script utiliza a função `time.sleep(1)` para pausar o código por um segundo exato após o jogador pressionar Enter, criando uma pequena tensão dramática antes de revelar os rolos[cite: 17].
* **Loop Interativo de Jogo:** O programa roda em um loop contínuo (`while True`), permitindo rodadas infinitas ao apertar "Enter" ou encerrar o programa graciosamente ao digitar "sair"[cite: 17].

## 🛠️ Tecnologias Utilizadas

* **Python:** A linguagem base responsável por toda a estruturação do script, manipulação de strings formatadas (f-strings) e laços condicionais[cite: 17].
* **Módulo Random:** Biblioteca nativa do Python crucial para a aleatoriedade do jogo, utilizando o método `random.choice()` tanto para selecionar os três emojis de cada giro quanto para escolher a frase de consolação[cite: 17].
* **Módulo Time:** Utilizado especificamente para gerenciar o atraso cronometrado da renderização de texto no console[cite: 17].

## 📂 Estrutura de Arquivos

* `main.py` (ou `slot_machine.py`) - O arquivo único contendo toda a lógica do jogo.
* `Captura de tela 2026-08-10 095329.png` - Imagem de demonstração (preview) do terminal em funcionamento deste README.

## 🚀 Como Executar

1. Certifique-se de ter o **Python** instalado na sua máquina (não é necessária nenhuma instalação via `pip`, pois os módulos usados são nativos).
2. Faça o download ou clone este repositório.
3. Abra o terminal (ou prompt de comando) e navegue até a pasta onde o arquivo está salvo.
4. Execute o script com o comando: `python main.py` (substitua pelo nome real do seu arquivo).
5. Pressione **Enter** para girar os rolos e tentar a sorte, ou digite **sair** para fechar o jogo!
