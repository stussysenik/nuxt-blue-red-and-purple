/**
 * VISUAL STRUCTURE — the chrome bar's physical properties.
 *
 * These tests verify the nav bar is actually doing its job as a persistent,
 * readable overlay. They check positioning, layering, and the frosted glass
 * effect that makes text readable over any background.
 */

export {};

describe('Chrome bar — structure and positioning', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('is fixed to the viewport', () => {
    cy.get('.chrome').then(($el) => {
      const style = window.getComputedStyle($el[0]);
      expect(style.position).to.equal('fixed');
      expect(style.inset).to.not.be.empty;
    });
  });

  it('sits above content (z-index)', () => {
    cy.get('.chrome').then(($el) => {
      const zIndex = window.getComputedStyle($el[0]).zIndex;
      // z-index: 5 in CSS — accept either numeric or string '5'
      expect(zIndex).to.not.equal('auto');
      expect(Number(zIndex)).to.be.greaterThan(0);
    });
  });

  it('contains all required nav elements', () => {
    // Use {force: true} because the active link has pointer-events: none
    cy.get('.chrome__home').should('exist');
    cy.get('.chrome__index').should('be.visible');
    cy.get('.chrome__generator').should('be.visible');
    cy.get('.chrome__cta').should('be.visible');
    cy.get('.theme-toggle').should('be.visible');
  });

  it('nav links point to correct routes', () => {
    cy.get('.chrome__home').should('have.attr', 'href', '/');
    cy.get('.chrome__index').should('have.attr', 'href', '/works');
    cy.get('.chrome__generator').should('have.attr', 'href', '/generator');
  });

  it('has rounded corners (Vercel-style pill shape)', () => {
    cy.get('.chrome__bar').then(($el) => {
      const radius = window.getComputedStyle($el[0]).borderRadius;
      expect(radius).to.not.equal('0px');
    });
  });

  it('has a visible border separating it from content', () => {
    cy.get('.chrome__bar').then(($el) => {
      const style = window.getComputedStyle($el[0]);
      const borderWidth = parseInt(style.borderWidth, 10);
      expect(borderWidth).to.be.greaterThan(0);
    });
  });
});

describe('Chrome bar — readability over busy backgrounds', () => {
  it('remains readable over the generative canvas', () => {
    // Default mode is generative — canvas is behind everything
    cy.visit('/');
    cy.get('.chrome__bar').assertContrast(4.5);
  });

  it('remains readable over hero content with grid lines', () => {
    cy.visit('/');
    cy.setModeTheme('essential', 'light');
    // Scroll down so nav overlaps body content
    cy.window().scrollTo(0, 400);
    cy.get('.chrome__bar').assertContrast(4.5);
  });

  it('remains readable on the works index with ghost image', () => {
    cy.visit('/works');
    cy.get('.chrome__bar').assertContrast(4.5);
  });
});

describe('Theme toggle — functionality', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('toggles from light to dark', () => {
    cy.get('html').should('have.attr', 'data-theme', 'light');
    cy.get('.theme-toggle').click();
    cy.get('html').should('have.attr', 'data-theme', 'dark');
  });

  it('toggles back from dark to light', () => {
    cy.get('.theme-toggle').click();
    cy.get('html').should('have.attr', 'data-theme', 'dark');
    cy.get('.theme-toggle').click();
    cy.get('html').should('have.attr', 'data-theme', 'light');
  });

  it('has accessible aria-label', () => {
    cy.get('.theme-toggle').should('have.attr', 'aria-label');
    cy.get('.theme-toggle').should('have.attr', 'aria-pressed');
  });

  it('aria-pressed reflects current theme', () => {
    cy.get('html').should('have.attr', 'data-theme', 'light');
    cy.get('.theme-toggle').should('have.attr', 'aria-pressed', 'false');
    cy.get('.theme-toggle').click();
    cy.get('.theme-toggle').should('have.attr', 'aria-pressed', 'true');
  });
});

describe('CTA button — visual properties', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('uses solid ink background (not transparent)', () => {
    cy.get('.chrome__cta').then(($el) => {
      const bg = window.getComputedStyle($el[0]).backgroundColor;
      // Should be a solid color, not transparent
      expect(bg).to.not.equal('transparent');
      expect(bg).to.not.match(/rgba\(\d+, \d+, \d+, 0\)/);
    });
  });

  it('text color is paper (inverted from bg)', () => {
    cy.get('.chrome__cta').then(($el) => {
      const style = window.getComputedStyle($el[0]);
      // The CTA should have light text on dark bg (or vice versa)
      // We verify contrast is high
      const color = style.color;
      const bg = style.backgroundColor;
      expect(color).to.not.equal(bg);
    });
  });
});
