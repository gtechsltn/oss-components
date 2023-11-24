import Component from '@glimmer/component';
import { assert } from '@ember/debug';

type ProgressBarSkins = 'primary' | 'warning' | 'success';

interface OSSProgressBarArgs {
  value: number;
  label?: string;
  displayValue?: boolean;
  skin?: ProgressBarSkins;
  small?: boolean;
}

export default class OSSProgressBar extends Component<OSSProgressBarArgs> {
  constructor(owner: unknown, args: OSSProgressBarArgs) {
    super(owner, args);

    assert(
      '[component][OSS::ProgressBar] You must pass a numbered value between 0 and 100',
      typeof args.value === 'number' && args.value >= 0 && args.value <= 100
    );

    const stylesheet = document.styleSheets[0];
    const keyframesRule = `@keyframes oss-progress-bar-animation {
      from {
        width: 0;
      }
      to {
        width: ${this.args.value}%;
      }
    }`;
    stylesheet.insertRule(keyframesRule, stylesheet.cssRules.length);
  }

  get skin(): string {
    return this.args.skin || 'primary';
  }

  get computedStyles(): string {
    return 'oss-progress-bar--inner--' + this.skin;
  }

  get progressBarInnerStyle(): string {
    return `width: ${this.args.value + '%'}`;
  }
}
