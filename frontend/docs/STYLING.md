
# Styling Guide

## Styling stack

The current frontend uses Tailwind CSS 4 and shared global styles in `src/app/globals.css`. Most component styling is expressed through Tailwind utility classes.

## Existing visual direction

- Minimal, professional portfolio layout.
- Purple/blue accent treatment.
- Light backgrounds, subtle borders, rounded cards, and responsive spacing.
- Responsive navigation and grid layouts.

Some admin screens use explicit color values (for example `#6d5ce7` and `#3978e8`) while public components also use global theme classes such as `primary`, `muted`, and `border`.

## Guidelines

- Review `src/app/globals.css` before adding global rules or new design tokens.
- Reuse existing Tailwind classes and theme variables.
- Keep mobile, tablet, and desktop layouts usable.
- Maintain readable contrast, visible focus states, and semantic interactive elements.
- Avoid adding another CSS framework or duplicating existing design rules.
- Keep animation lightweight and purposeful.

## Updating styles

Make the smallest change that achieves the requested visual result. Check the affected page at its relevant responsive sizes. A full production build is best reserved for a grouped verification pass or release check rather than every minor style adjustment.
