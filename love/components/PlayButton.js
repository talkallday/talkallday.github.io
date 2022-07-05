import createElement from '../utils/createElement.js';

const PlayButton = (eventPair) => {
  const playButton = createElement({
    classList: ['cell'],
    attributes: [['id', 'play']],
    eventListener: eventPair
});
  playButton.innerHTML = `Play`;
  playButton.style.backgroundColor = "green";
  return playButton;
}

export default PlayButton;