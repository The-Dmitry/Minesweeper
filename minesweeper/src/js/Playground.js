import BaseComponent from './BaseComponent.js';
import Cell from './Cell.js';

export default class Playground extends BaseComponent {
  #cellsList = [];

  #bombsList = [];

  #cellsCount = 0;

  #isGameStarted = false;

  constructor({
    tagName, classNames, textContent, attribute, parentNode,
  }, cellsCount = 0) {
    super({
      tagName, classNames, textContent, attribute, parentNode,
    });
    this.#cellsCount = cellsCount;
  }

  generatePlayground() {
    const index = Math.sqrt(this.#cellsCount);
    const array = [];
    for (let i = 0; i < index; i += 1) {
      const temp = [];
      for (let j = 0; j < index; j += 1) {
        const cell = new Cell({ tagName: 'button', classNames: ['cell'], attribute: ['data-id', [i, j]] });
        temp.push(cell);
      }
      array.push(temp);
      this.appendChildren(temp);
    }
    this.#cellsList = array;
  }

  defineBombs(num) {
    console.log(num);
    const arr = new Array(this.#cellsCount).fill(0).map((el, index) => index);
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    const result = new Set(arr.slice(0, Math.sqrt(this.#cellsCount)));
    if (result.has(num)) {
      const basicLength = result.size;
      result.delete(num);
      while (result.size < basicLength) {
        const test = Math.floor(Math.random() * (this.#cellsCount + 1));
        result.add(test);
      }
    }
    this.#bombsList = result;
    this.plantBombs();
  }

  plantBombs() {
    this.#bombsList.forEach((el) => {
      const num = el < 10 ? `0${el}` : `${el}`;
      const [x, y] = num.split('');
      this.#cellsList[+x][+y].setTheBomb();
    });
    // console.log(this.#cellsList);
  }

  checkTheCell(x, y) {
    if (!this.#isGameStarted) {
      this.#isGameStarted = true;
      const num = +[x, y].join('');
      this.defineBombs(num);
    }
    const cell = this.#cellsList[x][y];
    cell.isBomb();
  }

  set cellsList(array) {
    this.#cellsList = array;
  }

  get cellsList() {
    return this.#cellsList;
  }

  set cellsCount(cellsCount) {
    this.#cellsCount = cellsCount;
    this.generatePlayground();
  }

  get cellsCount() {
    return this.#cellsCount;
  }
}
