from turtle import *
from colorsys import *
import random
import turtle

tela = turtle.Screen()
tela.title("Árvore Fractal Orgânica")
tracer(2)
bgcolor('black')
left(90)
up()
goto(0, -250)
down()

def draw_tree(branch_len, pen_size):
    if branch_len < 5:
        return

    pensize(pen_size)
    h = 0.25 - (branch_len / 200) * 0.25
    color(hsv_to_rgb(h, 0.9, 1))
    forward(branch_len)

    angle = random.uniform(20, 30)
    right(angle)
    draw_tree(branch_len * 0.75, pen_size * 0.7)
    left(angle * 2)
    draw_tree(branch_len * 0.75, pen_size * 0.7)
    right(angle)

    h_back = 0.25 - ((branch_len / 0.75) / 200) * 0.25
    color(hsv_to_rgb(h_back, 0.9, 1))
    pensize(pen_size)
    backward(branch_len)

draw_tree(100, 10)
done()