import BaseComponent from './BaseComponent.js';
import Playground from './Playground.js';
import Timer from './Timer.js';
import Steps from './Steps.js';
import Input from './Input.js';
import modes from './modes.js';

const { body } = document;
// const playGround = new Playground({ classNames: ['playground'], parentNode: body }, 480, 30, 5);
const playGround = new Playground({ classNames: ['playground', 'size-10'], parentNode: body }, 100, 10, 10);

playGround.generatePlayground();

const controlParent = new BaseComponent({ classNames: ['control'], parentNode: body });

const timer = new Timer({ classNames: ['timer'], textContent: '00:00' });
const newGame = new BaseComponent({ tagName: 'button', classNames: ['new-game'], textContent: 'New Game' });
const steps = new Steps({ classNames: ['steps'], textContent: 'Steps: 0' });
const modalButton = new BaseComponent({ tagName: 'button', classNames: ['modal'] });
const modalParent = new BaseComponent({ classNames: ['modal-parent', 'hidden'], parentNode: body });
const closeModal = new BaseComponent({ classNames: ['cross'] });
const mode = new BaseComponent({ classNames: ['mode'], parentNode: modalParent.getNode() });
const modeSelect = new Input({ tagName: 'select', classNames: ['select-mode'], parentNode: mode.getNode(), options: modes });
modeSelect.setOptions();
const mineCount = new Input({ tagName: 'input', classNames: ['mines-count'], parentNode: mode.getNode(), type: 'number' });
mineCount.setMinMax(1, 10);
const setMode = new BaseComponent({ tagName: 'button', classNames: ['set-mode'], textContent: 'Set Mode', parentNode: mode.getNode() });

modalParent.appendChildren([closeModal]);
controlParent.appendChildren([timer, newGame, modalButton, steps]);

playGround.getNode().addEventListener('mousedown', (e) => {
  const [x, y] = e.target.getAttribute('data-id').split(',');
  if (e.button === 2) {
    playGround.setTheFlag(+x, +y);
    return;
  }
  playGround.checkTheCell(+x, +y);
  steps.updateStep();
  timer.startOrEnd(playGround.isGameStarted);
  if (playGround.isWon()) {
    timer.isGamePlaying = false;
    playGround.getNode().classList.add('no-events');
    console.log('YOU WOOON!!!');
  }
  if (playGround.isLoose) {
    timer.isGamePlaying = false;
    console.log('YOU LOOOSER!!!');
    playGround.getNode().classList.add('no-events');
  }
});

playGround.getNode().addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

function startNewGame() {
  playGround.startNewGame();
  timer.isGamePlaying = false;
  timer.seconds = -1;
  timer.getNode().textContent = '00:00';
  steps.steps = -1;
}

function handleModal() {
  modalParent.getNode().classList.toggle('hidden');
  playGround.getNode().classList.toggle('no-events-modal');
  newGame.getNode().classList.toggle('no-events-modal');
}

controlParent.getNode().addEventListener('mousedown', (e) => {
  if (e.target === newGame.getNode()) {
    startNewGame();
  }
});

modalButton.getNode().addEventListener('mousedown', handleModal);

closeModal.getNode().addEventListener('mousedown', handleModal);

modeSelect.getNode().addEventListener('change', (e) => {
  const count = +e.target.value;
  if (count === 16) { mineCount.setMinMax(1, 230); }
  if (count === 10) { mineCount.setMinMax(1, 95); }
  if (count === 5) { mineCount.setMinMax(1, 20); }
  mineCount.clearValue();
})

mineCount.getNode().addEventListener('input', (e) => {
  const node = e.target;
  if (+node.value > node.max) {
    node.value = node.max;
  }
})

setMode.getNode().addEventListener('mousedown', () => {
  const { totalCells, columns } = modeSelect.getModeObject(+modeSelect.getNode().value);
  const mines = +mineCount.getNode().value || 1;
  playGround.startNewGame(totalCells, mines, columns);
})