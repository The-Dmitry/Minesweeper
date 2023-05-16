import BaseComponent from './BaseComponent.js';

export default class Control extends BaseComponent {
  #seconds = 0;

  #isGamePlaying = false;

  startOrEnd(bool) {
    if (bool !== this.#isGamePlaying) {
      this.#isGamePlaying = bool;
      this.countdown();
    }
  }

  countdown() {
    if (this.#isGamePlaying) {
      setTimeout(() => {
        this.#seconds += 1;
        this.calcDuration(this.#seconds);
        this.countdown();
      }, 1000);
      return;
    }
    this.calcDuration(this.#seconds);
  }

  calcDuration(num) {
    const sec = parseInt(num % 60, 10);
    const min = Math.floor(num / 60);
    this.getNode().textContent = `${min.toString().padStart(2, 0)}:${sec.toString().padStart(2, 0)}` || '00:00';
  }

  set isGamePlaying(bool) {
    this.#isGamePlaying = bool;
  }

  set seconds(num) {
    this.#seconds = num;
  }

  get seconds() {
    return this.#seconds;
  }
}
