// Cypress support file — loaded before every spec.
// Custom commands for contrast checking live here.

/**
 * Convert a hex or rgb(a) string to { r, g, b }.
 */
function parseColor(color: string): { r: number; g: number; b: number } | null {
  // hex
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
      };
    }
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
      };
    }
  }
  // rgb() / rgba()
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    return {
      r: Number(match[1]),
      g: Number(match[2]),
      b: Number(match[3]),
    };
  }
  // color-mix() — browsers resolve this to rgb() at computed-style time,
  // but if we hit it raw, approximate by extracting the first color.
  const colorMixMatch = color.match(/color-mix\([^,]+,\s*(#[0-9a-f]{3,8})/i);
  if (colorMixMatch) {
    return parseColor(colorMixMatch[1]);
  }
  return null;
}

/**
 * Relative luminance per WCAG 2.1.
 */
function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * WCAG contrast ratio between two {r,g,b} colors.
 */
function contrastRatio(
  c1: { r: number; g: number; b: number },
  c2: { r: number; g: number; b: number },
): number {
  const l1 = relativeLuminance(c1.r, c1.g, c1.b);
  const l2 = relativeLuminance(c2.r, c2.g, c2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Get the computed background color of an element (resolved to rgb()).
       */
      computedBgColor(): Chainable<string>;
      /**
       * Get the computed color (text color) of an element.
       */
      computedColor(): Chainable<string>;
      /**
       * Assert that a given element meets a minimum WCAG contrast ratio
       * between its text color and its background.
       */
      assertContrast(minRatio: number): Chainable<void>;
      /**
       * Set the mode + theme on document.documentElement.
       */
      setModeTheme(mode: string, theme: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('computedBgColor', { prevSubject: 'element' }, (subject) => {
  return cy
    .wrap(subject)
    .then(($el) => {
      const bg = window.getComputedStyle($el[0]).backgroundColor;
      return bg;
    });
});

Cypress.Commands.add('computedColor', { prevSubject: 'element' }, (subject) => {
  return cy.wrap(subject).then(($el) => {
    const color = window.getComputedStyle($el[0]).color;
    return color;
  });
});

Cypress.Commands.add(
  'assertContrast',
  { prevSubject: 'element' },
  (subject, minRatio: number) => {
    cy.wrap(subject).then(($el) => {
      const el = $el[0];
      const textColor = parseColor(window.getComputedStyle(el).color);
      expect(textColor, 'text color parsed').to.not.be.null;

      // Walk up the DOM to find a background.
      let bgEl: HTMLElement | null = el;
      let bgColor: string | null = null;
      while (bgEl) {
        bgColor = window.getComputedStyle(bgEl).backgroundColor;
        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
          break;
        }
        bgEl = bgEl.parentElement;
      }
      expect(bgColor, 'background color found').to.not.be.null;

      const bg = parseColor(bgColor!);
      if (!bg) {
        // If we can't parse the background (e.g., color-mix with transparency),
        // fall back to the CSS custom property --paper value which is the
        // frosted glass backdrop's base color.
        cy.get('html').then(($html) => {
          const paper = $html[0].style.getPropertyValue('--paper')
            || getComputedStyle($html[0]).getPropertyValue('--paper');
          // Resolve CSS custom property to computed color
          const paperColor = parseColor(paper);
          // If we can't resolve, try reading from documentElement dataset
          if (!paperColor) {
            // Last resort: use the body background
            const bodyBg = parseColor(getComputedStyle(document.body).backgroundColor);
            expect(bodyBg, 'body bg parsed').to.not.be.null;
            const ratio = contrastRatio(textColor!, bodyBg!);
            expect(ratio, `contrast ratio ${ratio.toFixed(2)}:1 (body fallback)`).to.be.gte(minRatio);
            return;
          }
          const ratio = contrastRatio(textColor!, paperColor);
          expect(ratio, `contrast ratio ${ratio.toFixed(2)}:1`).to.be.gte(minRatio);
        });
        return;
      }
      const ratio = contrastRatio(textColor!, bg);
      expect(ratio, `contrast ratio ${ratio.toFixed(2)}:1`).to.be.gte(minRatio);
    });
  },
);

Cypress.Commands.add('setModeTheme', (mode: string, theme: string) => {
  cy.window().then((win) => {
    win.document.documentElement.dataset.mode = mode;
    win.document.documentElement.dataset.theme = theme;
  });
});

export { parseColor, relativeLuminance, contrastRatio };
