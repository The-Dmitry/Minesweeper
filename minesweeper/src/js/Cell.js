import BaseComponent from './BaseComponent.js';

export default class Cell extends BaseComponent {
  constructor({
    tagName, classNames, textContent, attribute, parentNode,
  }, id, bomb = false) {
    super({
      tagName, classNames, textContent, attribute, parentNode,
    });
    this.id = id;
    this.bomb = bomb;
  }

  setTheBomb() {
    this.bomb = true;
  }

  isBomb() {
    // const cell = this;
    return this.bomb;
  }
}
