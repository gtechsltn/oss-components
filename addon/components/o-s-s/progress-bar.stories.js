import hbs from 'htmlbars-inline-precompile';

const ProgressBarSkins = ['primary', 'warning', 'success'];
const ProgressBarSizes = ['sm', 'lg'];

export default {
  title: 'Components/OSS::ProgressBar',
  component: 'progress-bar',
  argTypes: {
    value: {
      type: { required: true },
      description: 'Numbered value between 0 & 100',
      table: {
        type: {
          summary: 'number'
        },
        defaultValue: { summary: 42 }
      },
      control: { type: 'number' }
    },
    label: {
      description: 'Displayed label',
      table: {
        type: {
          summary: 'string'
        },
        defaultValue: { summary: undefined }
      },
      control: { type: 'text' }
    },
    displayValue: {
      description: 'Boolean to check if @value should be displayed on the right side of the bar',
      table: {
        type: {
          summary: 'boolean'
        },
        defaultValue: { summary: undefined }
      },
      control: { type: 'boolean' }
    },
    size: {
      description: 'Adjust size',
      table: {
        type: {
          summary: ProgressBarSizes.join('|')
        },
        defaultValue: { summary: 'lg' }
      },
      options: ProgressBarSizes,
      control: { type: 'select' }
    },
    skin: {
      description: 'Adjust appearance',
      table: {
        type: {
          summary: ProgressBarSkins.join('|')
        },
        defaultValue: { summary: 'primary' }
      },
      options: ProgressBarSkins,
      control: { type: 'select' }
    }
  },
  parameters: {
    docs: {
      description: {
        component: 'Configurable component that can be used to display progression in a bar'
      }
    }
  }
};

const defaultArgs = {
  value: 30,
  label: 'Hello',
  displayValue: true,
  skin: 'primary',
  size: 'lg'
};

const BasicUsageTemplate = (args) => ({
  template: hbs`
    <div style="background-color: #1c1c1c;width:200px">
      <OSS::ProgressBar 
        @value={{this.value}}
        @label={{this.label}}
        @displayValue={{this.displayValue}}
        @skin={{this.skin}}
        @size={{this.size}}  />
    </div>
  `,
  context: args
});

export const Usage = BasicUsageTemplate.bind({});
Usage.args = defaultArgs;
