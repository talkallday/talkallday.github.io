import { setUpSoundboard } from './default'

const setUpApp = () => {
  const app = document.getElementById('app');
  app.innerHTML = 'oh hello';
}

window.onload = () => {
  setUpApp();
}
