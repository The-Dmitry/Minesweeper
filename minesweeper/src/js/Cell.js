import BaseComponent from './BaseComponent.js';

export default class Cell extends BaseComponent {
  isFlag = false;

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
    return this.bomb;
  }

  setTheFlag() {
    this.isFlag = !this.isFlag;
    this.getNode().classList.toggle('flag');
  }

  boom(className) {
    this.getNode().classList.remove('flag');
    this.getNode().classList.add(`${className}`);
    if (className === 'boom') {
      this.getNode().disabled = true;
    }
  }

  notBoom(count) {
    const node = this.getNode();
    node.textContent = `${count}`;
    node.disabled = true;
    node.classList.add(`near-${count}`);
  }
}
