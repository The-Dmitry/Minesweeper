export default class BaseComponent {
  #node;

  constructor({
    tagName = 'div', classNames = [], textContent = '', attribute, parentNode,
  }) {
    this.#node = document.createElement(tagName);
    this.#node.classList.add(...classNames);
    this.#node.textContent = textContent;
    if (parentNode) {
      parentNode.append(this.#node);
    }
    if (attribute) {
      this.#node.setAttribute(...attribute);
    }
  }

  append(child) {
    this.#node.append(child.getNode());
  }

  getNode() {
    return this.#node;
  }

  appendChildren(children) {
    children.forEach((el) => {
      this.append(el);
    });
  }

  removeAllChildren() {
    while (this.#node.lastChild) {
      this.#node.lastChild.remove();
    }
  }
}
