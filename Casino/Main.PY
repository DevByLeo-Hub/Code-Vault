import random
import time

symbols = ['🍒', '🍋', '🍉', '🍇', '🔔', '💎', '7️⃣']

frases_casino = [
    "Quase lá, campeão!",
    "Isso foi quase, não pare!",
    "Sorte está chegando!",
    "Está esquentando!",
    "Isso tem cara de próxima vitória...",
    "Boa! Mais uma rodada!"
]

def girar_slot():
    return [random.choice(symbols) for _ in range(3)]

def verificar_resultado(rolos):

    if rolos[0] == rolos[1] == rolos[2]:
        return "✨ JACKPOT! Três iguais! Você venceu grande! ✨"
    
    elif rolos[0] == rolos[1] or rolos[1] == rolos[2] or rolos[0] == rolos[2]:
        return random.choice(frases_casino)
    
    else:
        return "" 

def jogar():

    print("🎰 Bem-vindo ao Caça-Níquel Python 🎰")
    print("Pressione Enter para girar. (Digite 'sair' para encerrar)")
    
    while True:
        acao = input("\nAperte Enter para girar os rolos... ")
        
        if acao.lower() == 'sair':
            print("Saindo do cassino... Volte sempre!")
            break
            
        print("Girando...\n")
        time.sleep(1) 

        rolos = girar_slot()
        resultado = verificar_resultado(rolos)
        
        print(f"| {rolos[0]} | {rolos[1]} | {rolos[2]} |")
        
        if resultado:
            print(f"\n{resultado}")
            
        print("-" * 30)

if __name__ == "__main__":
    jogar()

    