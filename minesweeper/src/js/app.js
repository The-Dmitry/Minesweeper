// import BaseComponent from './BaseComponent.js';
import Playground from './Playground.js';
// import Cell from './Cell.js';

const test = document.body;
const playGround = new Playground({ classNames: ['playground'], parentNode: test }, 480, 30, 10);
// const playGround = new Playground({ classNames: ['playground'], parentNode: test }, 3, 1, 2);

playGround.generatePlayground();

playGround.getNode().addEventListener('mousedown', (e) => {
  const [x, y] = e.target.getAttribute('data-id').split(',');
  playGround.checkTheCell(+x, +y);
});
