import BaseComponent from './BaseComponent.js';
import Playground from './Playground.js';
import Timer from './Timer.js';
import Steps from './Steps.js';
import Input from './Input.js';
import modes from './modes.js';

let stepsArray = []
const { body } = document;
const playGround = new Playground({ classNames: ['playground', 'size-10'], parentNode: body }, 100, 10, 15);



const controlParent = new BaseComponent({ classNames: ['control'], parentNode: body });

const timer = new Timer({ classNames: ['timer'], textContent: '00:00' });
const newGame = new BaseComponent({ tagName: 'button', classNames: ['new-game'], textContent: 'New Game' });
const steps = new Steps({ classNames: ['steps'], textContent: 'Steps: 0' });
// const modalButton = new BaseComponent({ tagName: 'button', classNames: ['modal'] });
// const modalParent = new BaseComponent({ classNames: ['modal-parent', 'hidden'], parentNode: body });
// const closeModal = new BaseComponent({ classNames: ['cross'], parentNode: modalParent.getNode() });
// const mode = new BaseComponent({ classNames: ['mode'], parentNode: modalParent.getNode() });
const modeSelect = new Input({
  tagName: 'select', classNames: ['select-mode'], options: modes,
});
modeSelect.setOptions();
const mineCount = new Input({
  tagName: 'input', classNames: ['mines-count'], type: 'number',
});
mineCount.setMinMax(1, 95);
// const setModeButton = new BaseComponent({
//   tagName: 'button', classNames: ['set-mode'], textContent: 'Set Mode', parentNode: mode.getNode(),
// });

// const data = localStorage.getItem('game');

// const obj = JSON.parse(data);
// console.log(obj);




controlParent.appendChildren([timer, newGame, steps, modeSelect, mineCount,]);

function startNewGame() {
  const { totalCells, columns } = modeSelect.getModeObject(+modeSelect.getNode().value);
  const alternate = Math.round((totalCells / 100) * 15);
  const mines = +mineCount.getNode().value || alternate;
  mineCount.getNode().value = mines;
  playGround.startNewGame(totalCells, mines, columns);
  timer.isGamePlaying = false;
  timer.seconds = -1;
  timer.getNode().textContent = '00:00';
  steps.steps = -1;
  stepsArray = [];
}

function stopTheGame() {
  timer.isGamePlaying = false;
  playGround.getNode().classList.add('no-events');
  playGround.isGameStarted = false;
}

// function handleModal() {
//   modalParent.getNode().classList.toggle('hidden');
//   playGround.getNode().classList.toggle('no-events-modal');
//   newGame.getNode().classList.toggle('no-events-modal');
// }

function saveGame() {
  if (playGround.isGameStarted) {
    const data = {
      cellsCount: playGround.cellsCount,
      bombsList: [...playGround.bombsList],
      timer: timer.seconds,
      steps: steps.steps,
      stepsArray,
      columns: playGround.getColumns,
    };
    const string = JSON.stringify(data);
    localStorage.setItem('game', string);
    return;
  }
  localStorage.removeItem('game');
}

function loadGame() {
  const data = localStorage.getItem('game');
  if (data) {
    const obj = JSON.parse(data);
    playGround.loadGame(obj);
    timer.seconds = obj.timer;
    timer.calcDuration(obj.timer);
    stepsArray = obj.stepsArray;
    steps.steps = obj.steps - 1;
    mineCount.getNode().value = obj.bombsList.length;
    modeSelect.selectOption(obj.columns);
    chooseMode();
    return;
  }
  playGround.generatePlayground();
}

loadGame()

function openTheCell(e) {
  const { target } = e;
  const [x, y] = target.getAttribute('data-id').split(',');
  if (e.button === 2) {
    playGround.setTheFlag(+x, +y);
    return;
  }
  playGround.checkTheCell(+x, +y);
  stepsArray.push([+x, +y]);
  steps.updateStep();
  timer.startOrEnd(playGround.isGameStarted);
  if (playGround.isWon()) {
    stopTheGame();
    console.log('YOU WOOON!!!');
  }
  if (playGround.isLoose) {
    stopTheGame();
    console.log('YOU LOOOSER!!!');
  }
  
  console.log(playGround.bombsList);
}



function chooseMode(e) {
  const count = e ? +e.target.value : +modeSelect.getNode().value;
  if (count === 16) { mineCount.setMinMax(1, 230); }
  if (count === 10) { mineCount.setMinMax(1, 95); }
  if (count === 5) { mineCount.setMinMax(1, 20); }
  if (e) {
    mineCount.clearValue();
  }
}

newGame.getNode().addEventListener('mousedown', startNewGame);
playGround.getNode().addEventListener('mousedown', openTheCell);
modeSelect.getNode().addEventListener('change', chooseMode);

mineCount.getNode().addEventListener('input', (e) => {
  const node = e.target;
  if (+node.value > node.max) {
    node.value = node.max;
  }
});

playGround.getNode().addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

window.addEventListener('beforeunload', () => {
  saveGame();
})

console.log();

//Чтобы состояние игры сохранилось, нужно сделать хотя бы 1 ход