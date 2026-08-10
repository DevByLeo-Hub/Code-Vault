import math
from turtle import *
import turtle

tela = turtle.Screen()
tela.title("Heart")
tela.setup(width=600, height=600)
tela.onkey(bye, "Escape")
tela.listen()

def heart1(M):
    return 15*math.sin(M)**3

def heart2(M):
    return 12*math.cos(M)-5 *\
        math.cos(2*M)-2 *\
        math.cos(3*M) -\
        math.cos(4*M)

speed(0)
bgcolor("black")
color("red")

for i in range(750):
    goto(heart1(i)*18, heart2(i)*18)
    for j in range(1):
        color("red")
        goto(0, 0)

tela.tracer(0)

def desenhar_coracao_completo(escala):
    penup()
    goto(0,0)
    pendown()

    for i in range(750):
        goto(heart1(i)*escala, heart2(i)*escala)
        color("red")
        goto(0, 0)

tamanho_base = 18
fase = 0

while True:
    clear()
    
    escala_atual = tamanho_base + 1.5 * math.sin(fase)
    
    desenhar_coracao_completo(escala_atual)
    
    tela.update()
    fase += 0.05  

done()