import BottomBar from './components/BottomBar.js';
import Board from './components/Board.js'

export const getApp = () => {
  const app = document.getElementById('app');
  app.appendChild(Board())
  app.appendChild(BottomBar());
}

window.onload = () => {
  getApp();
}
