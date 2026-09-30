# Hackathon

## Context
We are doing a hackathon for KBC and they want to understand their users and act on it.
So you goal is to build a demo for it that works locally.


## Persona
Thomas works for 3 years, lived with his parents
saved up money working in a tech start up as Sales
Wants to move from the countryside to the city


## Style guide

The demo should feel like a KBC product. Colors are sampled from `kbc-logo.png` and a screenshot of kbc.be. The derived shades are marked as derived.

### Color profile

| Token | Hex | Use |
| --- | --- | --- |
| `kbc-navy` | `#163861` | Brand navy (the logo's "KBC" letters). Headings, nav, logo, strong accents |
| `kbc-ink` | `#16293A` | Body text and modal headings |
| `kbc-sky` | `#00AEEF` | Primary buttons, links, active states, focus rings |
| `kbc-sky-logo` | `#1AABE3` | Logo circle and band. Only for brand marks and illustrations |
| `kbc-sky-tint` | `#D2ECF8` | Selected rows, badges, soft highlights |
| `kbc-mist` | `#F3F8FB` | Page sections, footer strips, card backgrounds |
| `white` | `#FFFFFF` | Modals, cards, text on sky or navy |
| `kbc-slate` | `#5A6F82` | Secondary text, captions, placeholders (derived) |
| `kbc-line` | `#DCE6EE` | Borders and dividers (derived) |
| `kbc-scrim` | `rgba(22, 56, 97, 0.6)` | Navy overlay behind modals and on hero photos |

Rules:

- Keep most of the page white or `kbc-mist`. Use `kbc-sky` for actions and `kbc-navy` for structure. Don't fill large areas with sky blue.
- Use `kbc-ink` or `kbc-navy` for text, never pure black.
- White text is fine on `kbc-navy`. On `kbc-sky`, keep white text semibold and at least 16px so it stays readable.
- Status colors should be muted so they don't compete with the blues: success `#2E8540`, warning `#E8A317`, error `#C8102E`.

### Typography

- Use a clean, slightly rounded sans: `"Nunito Sans", "Segoe UI", system-ui, sans-serif`.
- Headings are semibold in `kbc-navy`. The hero heading is large and light-weight, as on kbc.be ("Zorgeloos je wagen...").
- Body text is 16px, line-height 1.5, in `kbc-ink`. Legal and small print is 12px uppercase with slight letter-spacing.

### Components

- **Primary button**: pill (`rounded-full`), `kbc-sky` background, white semibold text, 40px high, 24px horizontal padding. On hover, darken to `#0098D4` (derived).
- **Secondary button**: pill, white background, 1px `kbc-sky` border, `kbc-sky` text.
- **Modal / card**: white, 6-8px radius, soft shadow `0 8px 24px rgba(22, 56, 97, 0.15)`, centered logo on top. Put a `kbc-mist` footer strip at the bottom for legal links.
- **Top nav**: small links on top with the active item underlined. Below that, the logo on the left and the main menu with chevrons. The CTA buttons sit on the right.
- **Hero**: full-width photo under a `kbc-scrim` overlay, white headline, one short tagline, one primary CTA. Close it with a curved white wave into the content.
- **Spacing**: 8px grid. Use generous whitespace and at most one primary action per view.

### Tailwind tokens

```css
@theme {
  --color-kbc-navy: #163861;
  --color-kbc-ink: #16293A;
  --color-kbc-sky: #00AEEF;
  --color-kbc-sky-logo: #1AABE3;
  --color-kbc-sky-tint: #D2ECF8;
  --color-kbc-mist: #F3F8FB;
  --color-kbc-slate: #5A6F82;
  --color-kbc-line: #DCE6EE;
  --font-sans: "Nunito Sans", "Segoe UI", system-ui, sans-serif;
}
```


## Additional video
if possible create like a video about the user flow and the demo of the applcation