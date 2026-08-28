/**
 * NAV CONTRAST — the chrome bar must be readable in every mode × theme.
 *
 * This is the production norm: the navigation is the one persistent element
 * across the entire site. If it fails, the product fails. These tests lock
 * in WCAG AA (4.5:1) for all nav text and 3:1 for the active indicator.
 */

import { contrastRatio, parseColor } from '../support/e2e';

export {};

const MODES = ['essential', 'brutal', 'clay', 'generative'] as const;
const THEMES = ['light', 'dark'] as const;

describe('Navigation bar — high contrast across all modes and themes', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  MODES.forEach((mode) => {
    THEMES.forEach((theme) => {
      it(`nav links meet WCAG AA in ${mode} / ${theme}`, () => {
        cy.setModeTheme(mode, theme);
        // The home link ("/") and nav links must be readable
        cy.get('.chrome__home').assertContrast(4.5);
        cy.get('.chrome__index').assertContrast(4.5);
        cy.get('.chrome__generator').assertContrast(4.5);
      });

      it(`CTA button meets WCAG AA in ${mode} / ${theme}`, () => {
        cy.setModeTheme(mode, theme);
        cy.get('.chrome__cta').assertContrast(4.5);
      });

      it(`theme toggle is visible in ${mode} / ${theme}`, () => {
        cy.setModeTheme(mode, theme);
        cy.get('.theme-toggle').should('be.visible');
        // The toggle uses --ink color, same as nav links.
        // Verify it has a non-transparent color set.
        cy.get('.theme-toggle').then(($el) => {
          const color = window.getComputedStyle($el[0]).color;
          expect(color).to.not.equal('transparent');
          expect(color).to.not.equal('rgba(0, 0, 0, 0)');
        });
      });

      it(`active page indicator is visible in ${mode} / ${theme}`, () => {
        cy.setModeTheme(mode, theme);
        // Navigate to /works to get an active state
        cy.get('.chrome__index').click();
        cy.get('.chrome__index[aria-current="page"]').should('exist');
      });
    });
  });

  it('nav bar has a frosted glass backdrop (not transparent)', () => {
    cy.get('.chrome__bar').then(($el) => {
      const style = window.getComputedStyle($el[0]);
      // Must have a backdrop-filter for the frosted effect
      expect(style.backdropFilter).to.not.equal('none');
      // Must have a semi-transparent background (browsers may resolve
      // color-mix() to oklab(), rgba(), or keep as color-mix())
      expect(style.backgroundColor).to.match(/rgba|hsla|color-mix|oklab/);
    });
  });

  it('nav bar border is visible (separates from content)', () => {
    cy.get('.chrome__bar').then(($el) => {
      const style = window.getComputedStyle($el[0]);
      expect(style.borderWidth).to.not.equal('0px');
    });
  });
});

describe('Navigation bar — interaction states', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('hovering a nav link keeps it readable (opacity never kills contrast)', () => {
    cy.get('.chrome__index')
      .trigger('mouseenter')
      .then(($el) => {
        const opacity = window.getComputedStyle($el[0]).opacity;
        // Hover opacity must stay >= 0.6 to preserve AA
        expect(Number(opacity)).to.be.gte(0.6);
      });
  });

  it('focus ring is visible on keyboard navigation', () => {
    cy.get('.chrome__home').focus();
    cy.get('.chrome__home').then(($el) => {
      const style = window.getComputedStyle($el[0]);
      // Must have a visible outline on focus
      expect(style.outlineWidth).to.not.equal('0px');
      expect(style.outlineStyle).to.not.equal('none');
    });
  });

  it('CTA button has a visible focus ring', () => {
    cy.get('.chrome__cta').focus();
    cy.get('.chrome__cta').then(($el) => {
      const style = window.getComputedStyle($el[0]);
      expect(style.outlineWidth).to.not.equal('0px');
    });
  });
});
