import pygame
import math
import random

pygame.init()

WIDTH, HEIGHT = 600, 600 
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Radar Scanner")
clock = pygame.time.Clock()

BLACK = (0, 0, 0)
DARK_GREEN = (0, 60, 0)
GREEN = (0, 255, 0)

CENTER = (WIDTH // 2, HEIGHT // 2)
RADIUS = 250 

enemies = []

for _ in range(5):
    angle = random.uniform(0, 360)
    distance = random.uniform(50, RADIUS - 30) 
    x = CENTER[0] + distance * math.cos(math.radians(angle))
    y = CENTER[1] + distance * math.sin(math.radians(angle))
    enemies.append({'pos': (x, y), 'angle': angle, 'alpha': 0})

radar_angle = 0

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    screen.fill(BLACK)

    for r in range(50, RADIUS, 50):
        pygame.draw.circle(screen, DARK_GREEN, CENTER, r, 1)
        
    pygame.draw.line(screen, DARK_GREEN, (CENTER[0], CENTER[1] - RADIUS), (CENTER[0], CENTER[1] + RADIUS), 1)
    pygame.draw.line(screen, DARK_GREEN, (CENTER[0] - RADIUS, CENTER[1]), (CENTER[0] + RADIUS, CENTER[1]), 1)
    pygame.draw.circle(screen, GREEN, CENTER, RADIUS, 2)

    sweep_surface = pygame.Surface((WIDTH, HEIGHT), pygame.SRCALPHA)
    
    for i in range(60):
        line_angle = radar_angle - i
        alpha = max(0, 255 - (i * 4)) 
        
        end_x = CENTER[0] + RADIUS * math.cos(math.radians(line_angle))
        end_y = CENTER[1] + RADIUS * math.sin(math.radians(line_angle))
        
        pygame.draw.line(sweep_surface, (0, 255, 0, alpha), CENTER, (end_x, end_y), 2)
        
    screen.blit(sweep_surface, (0, 0))

    for enemy in enemies:
        diff = abs((radar_angle % 360) - enemy['angle'])
        
        if diff < 2 or diff > 358:
            enemy['alpha'] = 255
        
        if enemy['alpha'] > 0:
            enemy_surface = pygame.Surface((40, 40), pygame.SRCALPHA)
            pygame.draw.circle(enemy_surface, (150, 255, 150, enemy['alpha']), (20, 20), 4)
            pygame.draw.circle(enemy_surface, (0, 255, 0, int(enemy['alpha'] * 0.5)), (20, 20), 10)
            
            screen.blit(enemy_surface, (enemy['pos'][0] - 20, enemy['pos'][1] - 20))
            
            enemy['alpha'] -= 3
            if enemy['alpha'] < 0:
                enemy['alpha'] = 0

    pygame.display.flip()
    radar_angle += 1
    if radar_angle >= 360:
        radar_angle = 0
        
    clock.tick(60)

pygame.quit()