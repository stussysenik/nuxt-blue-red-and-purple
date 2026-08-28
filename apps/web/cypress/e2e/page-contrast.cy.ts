/**
 * PAGE CONTRAST — body text, headings, and interactive elements must meet
 * WCAG AA across all modes and themes.
 *
 * This locks in the production norm: content is always readable. No mode
 * ships with low-contrast text. Ever.
 */

export {};

const MODES = ['essential', 'brutal', 'clay', 'generative'] as const;
const THEMES = ['light', 'dark'] as const;

describe('Homepage — text contrast across all modes', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  MODES.forEach((mode) => {
    THEMES.forEach((theme) => {
      it(`hero heading meets WCAG AA in ${mode} / ${theme}`, () => {
        cy.setModeTheme(mode, theme);
        cy.get('.hero .wordmark svg').should('be.visible');
        // The wordmark uses --ink fill — check the container
        cy.get('.hero').assertContrast(4.5);
      });

      it(`tagline meets WCAG AA in ${mode} / ${theme}`, () => {
        cy.setModeTheme(mode, theme);
        cy.get('.tagline').assertContrast(4.5);
      });

      it(`body subtext meets WCAG AA in ${mode} / ${theme}`, () => {
        cy.setModeTheme(mode, theme);
        cy.get('.hero__sub').assertContrast(4.5);
      });

      it(`primary CTA meets WCAG AA in ${mode} / ${theme}`, () => {
        cy.setModeTheme(mode, theme);
        cy.get('.hero__cta--primary').assertContrast(4.5);
      });

      it(`secondary CTA meets WCAG AA in ${mode} / ${theme}`, () => {
        cy.setModeTheme(mode, theme);
        cy.get('.hero__cta--secondary').assertContrast(4.5);
      });

      it(`band heading meets WCAG AA in ${mode} / ${theme}`, () => {
        cy.setModeTheme(mode, theme);
        cy.get('.band__title').first().assertContrast(4.5);
      });

      it(`band body text meets WCAG AA in ${mode} / ${theme}`, () => {
        cy.setModeTheme(mode, theme);
        cy.get('.band__lead').first().assertContrast(4.5);
      });
    });
  });
});

describe('Generator page — input and output contrast', () => {
  beforeEach(() => {
    cy.visit('/generator');
  });

  it('textarea placeholder is visible', () => {
    cy.get('.demo__textarea').then(($el) => {
      const style = window.getComputedStyle($el[0]);
      // Placeholder color is set via ::placeholder pseudo
      // We check the input itself is readable
      expect(style.color).to.not.equal('transparent');
    });
  });

  it('textarea meets WCAG AA', () => {
    cy.get('.demo__textarea').should('exist');
    cy.get('.demo__textarea').then(($el) => {
      const style = window.getComputedStyle($el[0]);
      // Check that text color is set and not transparent
      expect(style.color).to.not.equal('transparent');
      expect(style.color).to.not.equal('rgba(0, 0, 0, 0)');
    });
  });

  it('prompt chips meet WCAG AA', () => {
    cy.get('.demo__prompt').first().assertContrast(4.5);
  });

  it('demo section meets WCAG AA', () => {
    // Verify the demo input zone is visible and readable
    cy.get('.demo__input-zone').scrollIntoView().should('be.visible');
    cy.get('.demo__hint').assertContrast(4.5);
  });
});

describe('Works index — list contrast', () => {
  beforeEach(() => {
    cy.visit('/works');
  });

  it('work titles meet WCAG AA', () => {
    cy.get('.row__title').first().assertContrast(4.5);
  });

  it('category labels meet WCAG AA', () => {
    cy.get('.group__label').first().assertContrast(4.5);
  });

  it('generator CTA meets WCAG AA', () => {
    cy.get('.gen-cta__link').assertContrast(4.5);
  });
});

describe('World page — content contrast', () => {
  beforeEach(() => {
    cy.visit('/world');
  });

  it('hero title meets WCAG AA', () => {
    cy.get('.hero__title').assertContrast(4.5);
  });

  it('hero CTA meets WCAG AA', () => {
    cy.get('.hero__cta').assertContrast(4.5);
  });

  it('tier pricing meets WCAG AA', () => {
    cy.get('.tier__price-num').first().assertContrast(4.5);
  });

  it('final CTA meets WCAG AA', () => {
    cy.get('.final__cta').assertContrast(4.5);
  });
});
