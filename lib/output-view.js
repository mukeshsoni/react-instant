'use babel';

import { React, ReactDOM } from 'react-for-atom'

import Output from './components/Output.js'

export default class OutputView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.getTitle = function () { return 'Preview' };
    ReactDOM.render(<Output/>, this.element)
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}
