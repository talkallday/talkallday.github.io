import createElement from "./utils.js";

const PlayButton = (eventPair) => {
  const playButton = createElement({
    classList: ['press'],
    attributes: [['id', 'play']],
    eventListener: eventPair
});
  playButton.innerHTML = `Play`;
  playButton.style.backgroundColor = "green";
  return playButton;
}

export default PlayButton;