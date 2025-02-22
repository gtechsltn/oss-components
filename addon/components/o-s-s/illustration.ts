import Component from '@glimmer/component';

export const extractCSSVars = (): string[] => {
  return (
    Array.from(document.styleSheets)
      .filter((styleSheet) => {
        try {
          return styleSheet.cssRules;
        } catch (e) {
          return false;
        }
      })
      .map((styleSheet) => Array.from(styleSheet.cssRules))
      .flat()
      .filter((cssRule: CSSStyleRule) => cssRule.selectorText === ':root')
      .map((cssRule: CSSStyleRule) => cssRule.cssText.split('{')[1].split('}')[0].trim().split(';'))
      .flat()
      .filter((text) => text !== '')
  );
};

interface OSSIllustrationArgs {
  src: string;
}

export default class OSSIllustration extends Component<OSSIllustrationArgs> {
  setupCSSVars(event: Event): void {
    const svgDocument = (<HTMLObjectElement>event.target).contentDocument?.querySelector('svg');

    if (svgDocument) {
      const style = document.createElement('style');
      style.textContent = `:root { ${extractCSSVars().join(';')} }`;
      svgDocument.append(style);
    }
  }
}
