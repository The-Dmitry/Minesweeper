import BaseComponent from './BaseComponent.js';

export default class Flag extends BaseComponent {
  #flags;

  set setFlags(num) {
    this.#flags = num;
  }

  get getFlags() {
    return this.#flags;
  }

  updateFlags() {
    this.getNode().textContent = `Flags/Mines: ${this.#flags}`;
  }

  changeCountFlag(num) {
    this.#flags += num;
    this.updateFlags();
  }
}
