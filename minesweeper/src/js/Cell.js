import BaseComponent from './BaseComponent.js';

export default class Cell extends BaseComponent {
  constructor({
    tagName, classNames, textContent, attribute, parentNode,
  }, bomb = false) {
    super({
      tagName, classNames, textContent, attribute, parentNode,
    });
    this.bomb = bomb;
  }

  setTheBomb() {
    this.bomb = true;
  }

  isBomb() {
    const cell = this.getNode();
    cell.disabled = true;
    return this.bomb;
  }
}
