// import BaseComponent from './BaseComponent.js';
import Playground from './Playground.js';
// import Cell from './Cell.js';

const test = document.body;
const playGround = new Playground({ classNames: ['playground'], parentNode: test }, 100);

playGround.generatePlayground();

playGround.getNode().addEventListener('mousedown', (e) => {
  const [x, y] = e.target.getAttribute('data-id').split(',');
  playGround.checkTheCell(x, y);
});
