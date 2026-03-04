# RRUGA STUDIOS — Shopify Theme

## Store Info
- **Brand:** RRUGA STUDIOS
- **Store URL:** saharasandtest.myshopify.com
- **Base Theme:** Horizon

## Brand Identity
- **Industry:** Fashion / Clothing
- **Aesthetic:** Minimal & Clean
- **Design Style:** Glassmorphism
- **Primary Color:** #000000 (Black)
- **Secondary Color:** #FFFFFF (White)
- **Font:** Helvetica (fallback: Helvetica Neue, Arial, sans-serif)

## Glassmorphism Design Guidelines
When applying glassmorphism effects, follow these rules:
- Use semi-transparent backgrounds: `rgba(255, 255, 255, 0.1)` to `rgba(255, 255, 255, 0.2)`
- Apply backdrop blur: `backdrop-filter: blur(10px)` to `blur(20px)`
- Use subtle borders: `border: 1px solid rgba(255, 255, 255, 0.2)`
- Add soft box shadows: `box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1)`
- Keep backgrounds dark or use high-contrast imagery behind glass elements
- Maintain readability — white or light text on glass panels

## Redesign Priorities (in order)
1. **Hero Section** — Full width, glassmorphism overlay on image, bold Helvetica headline
2. **Header & Navigation** — Minimal, glass effect, black logo on transparent background
3. **Product Cards** — Clean grid, glass card effect, minimal typography
4. **Footer** — Minimal, dark background, clean layout

## File Structure
- `sections/` → theme sections (hero, header, footer, product cards etc.)
- `assets/` → CSS and JS files (main styles go here)
- `snippets/` → reusable components
- `templates/` → page templates
- `config/` → theme settings

## Rules
- Always keep designs **mobile responsive**
- Never break Shopify's built-in functionality — design only
- Keep animations **subtle and smooth** (no heavy transitions)
- Always use **Helvetica** font stack
- Maintain **black and white** color palette — avoid adding other colors unless asked
- When editing CSS, always add changes to the existing stylesheet, never create duplicate rules
- Test changes on both desktop and mobile breakpoints

## Git Workflow
- Branch: `main` → connected to Shopify store via GitHub integration
- Every `git push` to `main` auto-deploys to the live store
- Always commit with a clear message describing what was changed
