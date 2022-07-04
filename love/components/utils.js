const createElement = ({divType, classList, attributes, eventListener} = {}) => {
  let parentDiv = document.createElement(divType || 'div');
  if (classList) {
    classList.forEach(cl => parentDiv.classList.add(cl));
  }
  if (attributes) {
    attributes.forEach(attributePair => {
      const [attribute, value] = attributePair;
      parentDiv.setAttribute(attribute, value);
    })
  }
  if (eventListener) {
    let [event, listener] = eventListener;
    parentDiv.addEventListener(event, listener);
  }
  return parentDiv;
}

export default createElement;