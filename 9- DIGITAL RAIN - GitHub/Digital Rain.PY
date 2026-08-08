import pygame
import random

pygame.init()

WIDTH, HEIGHT = 500, 500
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Chuva Digital Azul - Hacker Clássico")
clock = pygame.time.Clock()

FONT_SIZE = 16
font = pygame.font.SysFont("consolas", FONT_SIZE, bold=True)

WORDS = ["SYSTEM", "DATA", "NETWORK", "CLOUD", "VIRTUAL", "CODE", "BLUE", "CYBER", "LOGIC", "SERVER"]

CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*"

columns = WIDTH // FONT_SIZE

fade_surface = pygame.Surface((WIDTH, HEIGHT))
fade_surface.fill((0, 0, 0))
fade_surface.set_alpha(15) 

drops = []
for i in range(columns):
    drops.append({
        "row": random.randint(-50, 0), 
        "is_word": random.random() > 0.4, 
        "word": random.choice(WORDS) + "       " 
    })

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    screen.blit(fade_surface, (0, 0))

    for i, drop in enumerate(drops):
        x = i * FONT_SIZE
        y = drop["row"] * FONT_SIZE

        if drop["row"] >= 0:
            if drop["is_word"]:
                char = drop["word"][drop["row"] % len(drop["word"])]
            else:

                char = random.choice(CHARS)

            if char != " ":
                text = font.render(char, True, (100, 200, 255))
                screen.blit(text, (x, y))

        drop["row"] += 1

        if y > HEIGHT and random.random() > 0.8:
            drop["row"] = random.randint(-15, 0)
            drop["is_word"] = random.random() > 0.4
            drop["word"] = random.choice(WORDS) + "       "

    pygame.display.flip()
    clock.tick(15)

pygame.quit()