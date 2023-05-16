import BaseComponent from './BaseComponent.js';

export default class Steps extends BaseComponent {
  #steps = 0;

  updateStep() {
    this.#steps += 1;
    this.getNode().textContent = `Steps: ${this.#steps}`;
  }

  set steps(num) {
    this.#steps = num;
    this.updateStep();
  }
}
