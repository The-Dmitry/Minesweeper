import BaseComponent from './BaseComponent.js';
import Cell from './Cell.js';

export default class Playground extends BaseComponent {
  #cellsList = [];

  #cellsCount = 0;

  openedCells = 0;

  #bombsList = [];

  #bombsCount = 0;

  #columns = 0;

  #isGameStarted = false;

  #isLoose = false;

  constructor({
    tagName, classNames, textContent, attribute, parentNode,
  }, cellsCount, columns, bombsCount) {
    super({
      tagName, classNames, textContent, attribute, parentNode,
    });
    this.#cellsCount = cellsCount;
    this.#columns = columns;
    this.#bombsCount = bombsCount;
  }

  generatePlayground() {
    const limit = this.#columns;
    const array = [];
    let id = 0;
    for (let i = 0; i < this.#cellsCount / limit; i += 1) {
      const temp = [];
      for (let j = 0; j < limit; j += 1) {
        const cell = new Cell({ tagName: 'button', classNames: ['cell'], attribute: ['data-id', [i, j]] }, id);
        temp.push(cell);
        id += 1;
      }
      array.push(temp);
      this.appendChildren(temp);
    }
    this.#cellsList = array;
    // console.log(this.#cellsList);
  }

  defineBombs(x, y) {
    const arr = new Array(this.#cellsCount).fill(0).map((el, index) => index);
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    const result = new Set(arr.slice(0, this.#bombsCount));
    const num = this.#cellsList[x][y].id;
    if (result.has(num)) {
      const basicLength = result.size;
      result.delete(num);
      while (result.size < basicLength) {
        const newNum = Math.floor(Math.random() * (this.#bombsCount + 1));
        if (newNum !== num) {
          result.add(newNum);
        }
      }
    }
    this.#bombsList = result;
    this.plantBombs();
  }

  plantBombs() {
    const list = this.#cellsList;
    for (let i = 0; i < list.length; i += 1) {
      list[i].forEach((item) => {
        if (this.#bombsList.has(item.id)) {
          item.setTheBomb();
        }
      });
    }
  }

  checkTheCell(x, y) {
    if (!this.#isGameStarted) {
      this.#isGameStarted = true;
      this.defineBombs(+x, +y);
    }
    if (!this.isValid(x, y)) { return; }
    const cell = this.#cellsList[x][y];
    if (cell.getNode().disabled || cell.isFlag) { return; }
    if (cell.isBomb()) {
      cell.boom();
      this.#isLoose = true;
      return;
    }
    cell.getNode().disabled = true;
    this.openedCells += 1;

    const bombCount = this.checkAround(x, y);
    if (bombCount > 0) {
      cell.notBoom(bombCount);
      return;
    }

    for (let i = -1; i <= 1; i += 1) {
      for (let j = -1; j <= 1; j += 1) {
        if (this.isValid(x + i, y + j)) {
          this.checkTheCell(x + i, y + j);
        }
      }
    }
  }

  checkAround(x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i += 1) {
      for (let j = -1; j <= 1; j += 1) {
        if (this.isValid(x + i, y + j)) {
          if (this.#cellsList[x + i][y + j].isBomb()) {
            count += 1;
          }
        }
      }
    }
    return count;
  }

  isValid(x, y) {
    const row = this.#cellsList.length - 1;
    const column = this.#cellsList[0].length - 1;
    return (x >= 0 && x <= row) && (y >= 0 && y <= column);
  }

  isWon() {
    return this.#cellsCount - this.openedCells === this.#bombsCount;
  }

  startNewGame(cells, bombs, columns) {
    this.removeAllChildren();
    this.#isGameStarted = false;
    this.#isLoose = false;
    if (cells && bombs) {
      this.#cellsCount = cells;
      this.#bombsCount = bombs;
      this.#columns = columns;
      this.getNode().classList.remove('size-10', 'size-15', 'size-25');
      this.getNode().classList.add(`size-${columns}`);
    }
    this.openedCells = 0;
    this.generatePlayground();
    this.getNode().classList.remove('no-events');
  }

  loadGame({ cellsCount, bombsList, columns, stepsArray, flagArray }) {
    this.#cellsCount = cellsCount;
    this.#bombsList = new Set(bombsList);
    this.#columns = columns;
    this.#isGameStarted = true;
    this.generatePlayground();
    this.plantBombs();
    this.loadFlags(flagArray);
    this.getNode().classList.remove('size-10', 'size-15', 'size-25');
    this.getNode().classList.add(`size-${columns}`);
    stepsArray.forEach((point) => {
      this.checkTheCell(...point);
    });
  }

  loadFlags(flags) {
    flags.forEach((flag) => {
      this.setTheFlag(...flag);
    });
  }

  blowUpEverything(className) {
    this.#cellsList.forEach((array) => array.forEach((cell) => {
      if (cell.bomb) {
        cell.boom(className);
      }
    }))
  }

  get isLoose() {
    return this.#isLoose;
  }

  setTheFlag(x, y) {
    this.#cellsList[x][y].setTheFlag();
  }

  get isGameStarted() {
    return this.#isGameStarted;
  }

  set isGameStarted(bool) {
    this.#isGameStarted = bool;
  }

  set cellsList(array) {
    this.#cellsList = array;
  }

  get cellsList() {
    return this.#cellsList;
  }

  get bombsList() {
    return this.#bombsList;
  }

  set bombsList(list) {
    this.#bombsList = list;
  }

  set cellsCount(cellsCount) {
    this.#cellsCount = cellsCount;
    this.generatePlayground();
  }

  get cellsCount() {
    return this.#cellsCount;
  }

  get getColumns() {
    return this.#columns;
  }
}
