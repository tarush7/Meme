export const getCaretCoordinates = (element, position) => {
  const { offsetLeft, offsetTop } = element;
  const range = document.createRange();
  const selection = window.getSelection();
  
  // Create a text node to measure
  const text = element.value;
  const textNode = document.createTextNode(text.substring(0, position));
  const span = document.createElement('span');
  
  // Setup the measurement span
  span.appendChild(textNode);
  span.style.whiteSpace = 'pre';
  span.style.visibility = 'hidden';
  span.style.position = 'absolute';
  span.style.font = window.getComputedStyle(element).font;
  
  document.body.appendChild(span);
  
  const rect = span.getBoundingClientRect();
  document.body.removeChild(span);
  
  return {
    left: rect.width + offsetLeft,
    top: rect.height + offsetTop
  };
};

export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
