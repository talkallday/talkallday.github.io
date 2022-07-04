import createElement from "./utils.js";

const ChordStatus = () => {
  // color chord status
  const playColor = createElement({classList: ['cell'], attributes: [['id', 'play-color']]});
  playColor.innerHTML = `Not Playing`;
  return playColor;
}

export default ChordStatus;
