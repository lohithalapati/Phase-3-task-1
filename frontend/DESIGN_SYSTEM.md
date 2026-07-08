# NeuralHandoff V5 - Design System Documentation

This document is the single source of truth for all design tokens and component standards.

## 1. Color System

### Primary Palette
| Name          | Hex       | Token                    | Usage                       |
|---------------|-----------|--------------------------|-----------------------------|
| Neural Blue   | #2563EB | primary.neural         | Primary CTAs, active states |
| Neural Cyan   | #06B6D4 | primary.cyan           | Glows, secondary accents    |

### Backgrounds
| Name          | Hex       | Token                    | Usage                       |
|---------------|-----------|--------------------------|-----------------------------|
| Primary BG    | #050816 | ackground.primary     | Main app background         |
| Surface BG    | #111827 | ackground.surface     | Base for non-glass surfaces |

### Surfaces (Glassmorphism)
| Name          | RGBA                      | Token              | Usage                         |
|---------------|---------------------------|--------------------|-------------------------------|
| Glass         | gba(255, 255, 255, 0.05) | surface.glass    | Light, transparent surfaces   |
| Card          | gba(15, 23, 42, 0.72)  | surface.card     | Main content cards            |
| Border        | gba(255, 255, 255, 0.08) | surface.border   | Default border for surfaces   |

## 2. Typography

| Role      | Font Family       | Token         | Usage                                 |
|-----------|-------------------|---------------|---------------------------------------|
| Headings  | Playfair Display  | ont-serif  | Hero sections, major titles only      |
| Body      | Inter             | ont-sans   | All other application text            |
| Code      | JetBrains Mono    | ont-mono   | Code snippets, technical text         |

## 3. Motion System (Durations)

| Name   | Milliseconds | Token         | Usage                                 |
|--------|--------------|---------------|---------------------------------------|
| Fast   | 150ms      | duration-fast | Hover effects, subtle feedback      |
| Medium | 250ms      | duration-medium | Component transitions (e.g., cards) |
| Slow   | 400ms      | duration-slow | Major panel/overlay transitions     |
