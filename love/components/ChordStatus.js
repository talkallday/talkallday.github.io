import createElement from "./utils.js";

const ChordStatus = () => {
  // color chord status
  const rowColor = createElement({classList: ['cell'], attributes: [['id', 'play-color']]});
  rowColor.innerHTML = 'Not Playing';
  return rowColor;
}

export default ChordStatus;
