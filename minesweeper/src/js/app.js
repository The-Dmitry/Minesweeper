import BaseComponent from './BaseComponent.js';
import Playground from './Playground.js';
import Timer from './Timer.js';
import Steps from './Steps.js';

const { body } = document;
// const playGround = new Playground({ classNames: ['playground'], parentNode: body }, 480, 30, 5);
const playGround = new Playground({ classNames: ['playground'], parentNode: body }, 100, 10, 10);

playGround.generatePlayground();

const controlParent = new BaseComponent({ classNames: ['control'], parentNode: body });

const timer = new Timer({ classNames: ['timer'], textContent: '00:00' });
const newGame = new BaseComponent({ tagName: 'button', classNames: ['new-game'], textContent: 'New Game' });
const steps = new Steps({ classNames: ['steps'], textContent: 'Steps: 0' });

controlParent.appendChildren([timer, newGame, steps]);

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

controlParent.getNode().addEventListener('mousedown', (e) => {
  if (e.target === newGame.getNode()) {
    startNewGame();
  }
});
