import createElement from "./utils.js";

const getLoopLabel = () => {
  const loopLabel = createElement({divType: 'label', attributes: [['for', 'loops-select']]});
  loopLabel.textContent = ` Loops`;
  loopLabel.style.color = 'white';
  return loopLabel;
}

export default getLoopLabel;
