import BaseComponent from './BaseComponent.js';

export default class Input extends BaseComponent {
  constructor({
    tagName, classNames, textContent, attribute, parentNode, options, type,
  }) {
    super({
      tagName, classNames, textContent, attribute, parentNode,
    });
    if (options) {
      this.options = options;
    }
    if (type) {
      this.getNode().setAttribute('type', type);
    }
  }

  setOptions() {
    this.options.forEach((opt) => {
      const option = new Option(`${opt.title}`, `${opt.columns}`);
      this.getNode().add(option);
    });
  }

  setMinMax(min, max) {
    const node = this.getNode();
    node.placeholder = `Max: ${max}`;
    node.min = min;
    node.max = max;
  }

  clearValue() {
    this.getNode().value = '';
  }

  getModeObject(num) {
    return this.options.find((mode) => mode.columns === num);
  }

  selectOption(num) {
    let node;
    this.getNode().childNodes.forEach((el) => {
      if (+el.value === num) {
        node = el;
      }
    });
    node.selected = true;
  }
}
