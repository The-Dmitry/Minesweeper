import BaseComponent from './BaseComponent.js';
import Playground from './Playground.js';
import Timer from './Timer.js';
import Steps from './Steps.js';
import Input from './Input.js';
import Flag from './Flag.js';
import modes from './modes.js';
import sounds from './sounds.js';

let stepsArray = [];
let flagArray = [];
let resultArray = [];
let isDark = JSON.parse(localStorage.getItem('theme'));
const { body } = document;

const audio = new Audio();
audio.volume = 0.5;

const playGround = new Playground({ classNames: ['playground', 'size-10'], parentNode: body }, 100, 10, 10);
const controlParent = new BaseComponent({ classNames: ['control'], parentNode: body });
const timer = new Timer({ classNames: ['timer'], textContent: '00:00' });
const newGame = new BaseComponent({ tagName: 'button', classNames: ['new-game'], textContent: 'New Game' });
const steps = new Steps({ classNames: ['steps'], textContent: 'Moves: 0' });
const modalButton = new BaseComponent({ tagName: 'button', textContent: 'Results', classNames: ['results'] });
const modalParent = new BaseComponent({ classNames: ['modal-parent', 'hidden'], parentNode: body });
const closeModal = new BaseComponent({ classNames: ['cross'] });
const resultTitle = new BaseComponent({ tagName: 'h2', classNames: ['result-title'], textContent: 'Results' });
const resultList = new BaseComponent({ classNames: ['result-list'] });
const modeSelect = new Input({ tagName: 'select', classNames: ['select-mode'], options: modes });
const mineCount = new Input({ tagName: 'input', classNames: ['mines-count'], type: 'number' });
const flagCount = new Flag({ classNames: ['flag-count'], textContent: 'Flags / Mines: 0' });
const theme = new BaseComponent({ tagName: 'button', classNames: ['theme'] });
const soundSwitch = new BaseComponent({ tagName: 'button', classNames: ['sound-switch'], parentNode: body });
const message = new BaseComponent({ classNames: ['final-message'] });

controlParent.appendChildren([timer, newGame, steps, modeSelect, mineCount,
  modalButton, flagCount, theme]);
modalParent.appendChildren([closeModal, resultTitle, resultList]);

modeSelect.setOptions();
mineCount.setMinMax(10, 99);

function startNewGame() {
  message.getNode().remove();
  const { totalCells, columns } = modeSelect.getModeObject(+modeSelect.getNode().value);
  const count = +mineCount.getNode().value;
  const mines = count > 9 ? count : 10;
  mineCount.getNode().value = mines;
  playGround.startNewGame(totalCells, mines, columns);
  timer.isGamePlaying = false;
  timer.seconds = -1;
  timer.getNode().textContent = '00:00';
  flagCount.setFlags = mines;
  flagCount.updateFlags();
  steps.steps = -1;
  stepsArray = [];
  flagArray = [];
}

function playSound(sound) {
  audio.src = sound;
  audio.play();
}

function handleDarkMode() {
  if (isDark) {
    body.classList.add('dark');
    theme.getNode().classList.remove('sun');
    return;
  }
  body.classList.remove('dark');
  theme.getNode().classList.add('sun');
}

function stopTheGame() {
  timer.isGamePlaying = false;
  playGround.getNode().classList.add('no-events');
  playGround.isGameStarted = false;
}

function handleModal() {
  message.getNode().remove();
  modalParent.getNode().classList.toggle('hidden');
  playGround.getNode().classList.toggle('no-events-modal');
  newGame.getNode().classList.toggle('no-events-modal');
}

function saveGame() {
  if (playGround.isGameStarted) {
    const data = {
      cellsCount: playGround.cellsCount,
      bombsList: [...playGround.bombsList],
      timer: timer.seconds,
      steps: steps.steps,
      stepsArray,
      flagArray,
      columns: playGround.getColumns,
    };
    const string = JSON.stringify(data);
    localStorage.setItem('game', string);
    return;
  }
  localStorage.removeItem('game');
}

function showResultFromLs() {
  resultList.removeAllChildren();

  let resultString = '';
  if (resultArray.length) {
    const arr = resultArray.reverse();
    arr.forEach((res, index) => {
      const sec = parseInt(res.time % 60, 10).toString().padStart(2, 0);
      const min = Math.floor(res.time / 60).toString().padStart(2, 0);
      const string = `<p class="result">${index + 1}. Time: ${min}:${sec}, Steps: ${res.steps}, Mode: ${res.mode}x${res.mode}, Mines: ${res.mines}</p>`;
      resultString += string;
    });
  } else {
    resultString = '<p class="result">The list of games is empty. Only won games are counted</p>';
  }
  resultList.getNode().innerHTML = resultString;
}

function loadGame() {
  const data = localStorage.getItem('game');
  const list = localStorage.getItem('results');
  if (list) {
    resultArray = JSON.parse(list);
  }
  handleDarkMode();
  showResultFromLs();
  if (data) {
    const obj = JSON.parse(data);
    playGround.loadGame(obj);
    timer.seconds = obj.timer - 1;
    timer.calcDuration(obj.timer - 1);
    stepsArray = obj.stepsArray;
    flagArray = obj.flagArray;
    steps.steps = obj.steps - 1;
    mineCount.getNode().value = obj.bombsList.length;
    flagCount.setFlags = obj.bombsList.length;
    flagCount.changeCountFlag(-flagArray.length);
    modeSelect.selectOption(obj.columns);
    return;
  }
  playGround.generatePlayground();
  flagCount.setFlags = 10;
  flagCount.updateFlags();
}

function showMessage(win, seconds, moves) {
  if (win) {
    const sec = parseInt(seconds % 60, 10).toString().padStart(2, 0);
    const min = Math.floor(seconds / 60).toString().padStart(2, 0);
    message.getNode().innerHTML = `<p class="message">Hooray! You found all mines in ${min}:${sec} and ${moves} moves!</p>
                          <button class="close-message">Close</button>`;
  } else {
    message.getNode().innerHTML = `<p class="message">Game over. Try again</p>
                          <button class="close-message">Close</button>`;
  }
  message.getNode().addEventListener('click', () => {
    message.getNode().remove();
  });
  setTimeout(() => {
    body.append(message.getNode());
  }, 700);
}

function showWin(win) {
  if (win) {
    const result = {
      time: timer.seconds,
      steps: steps.steps,
      mode: playGround.getColumns,
      mines: playGround.bombsList.size,
    };
    resultArray.push(result);
    resultArray = resultArray.slice(-10);
    localStorage.setItem('results', JSON.stringify(resultArray));
    showResultFromLs();
    showMessage(win, result.time, result.steps);
    setTimeout(() => {
      playSound(sounds.win);
    }, 700);
    return;
  }
  showMessage(win);
  setTimeout(() => {
    playSound(sounds.defeat);
  }, 700);
}

function findRepeatedFlag(array, xy) {
  let result = -1;
  const coords = JSON.stringify(xy);
  array.forEach((el, index) => {
    if (coords === JSON.stringify(el)) {
      result = index;
    }
  });
  return result;
}

function openTheCell(e) {
  const { target } = e;
  if (!target.matches('.cell')) { return; }
  const [x, y] = target.getAttribute('x-y').split(',');
  if (e.button === 2) {
    if (target.matches('.flag')) {
      flagCount.changeCountFlag(1);
      const flagIndex = findRepeatedFlag(flagArray, [+x, +y]);
      if (flagIndex >= 0) {
        flagArray.splice(flagIndex, 1);
      }
      playGround.setTheFlag(+x, +y);
      return;
    }
    if (flagCount.getFlags) {
      flagCount.changeCountFlag(-1);
      playGround.setTheFlag(+x, +y);
      flagArray.push([+x, +y]);
    }
    return;
  }
  playGround.checkTheCell(+x, +y);
  playSound(sounds.move);
  if (!target.matches('.flag')) {
    steps.updateStep();
    stepsArray.push([+x, +y]);
  }
  timer.startOrEnd(playGround.isGameStarted);
  if (playGround.isWon()) {
    playGround.blowUpEverything('not-boom');
    stopTheGame();
    showWin(true);
  }
  if (playGround.isLoose) {
    stopTheGame();
    showWin(false);
    playGround.blowUpEverything('boom');
  }
}

function chooseMode(e) {
  if (e) {
    mineCount.clearValue();
  }
}

modalButton.getNode().onclick = handleModal;
closeModal.getNode().onclick = handleModal;

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

theme.getNode().addEventListener('mousedown', () => {
  isDark = !isDark;
  handleDarkMode();
  localStorage.setItem('theme', isDark);
});

soundSwitch.getNode().addEventListener('mousedown', () => {
  soundSwitch.getNode().classList.toggle('sound-switch_off');
  if (audio.volume) {
    audio.volume = 0;
    return;
  }
  audio.volume = 0.5;
});

window.addEventListener('beforeunload', () => {
  saveGame();
});

loadGame();

console.log();

// Чтобы состояние игры сохранилось, нужно сделать хотя бы 1 ход