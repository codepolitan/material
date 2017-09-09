'use strict';


import init from './component/init';
import classify from './component/classify';
import events from './component/events';
import insert from './component/insert';
import create from './element/create';
import merge from './module/merge';
import emitter from './module/emitter';

const defaults = {
  prefix: 'material',
  class: 'drawer',
  modifier: 'width',
  tag: 'div',
  modules: [emitter, events, insert]
};

/**
 * Class representing a UI Container. Can add components.
 *
 * @extends Component
 * @return {parent} The class instance
 * @example new Container({
 *   container: document.body
 * });
 */
class Drawer {

  /**
   * Constructor
   * @param  {Object} options - Component options
   * @return {Object} Class instance 
   */
  constructor(options) {
    this.options = merge(defaults, options);

    init(this);
    this.build(this.options);

    this.emit('ready');

    return this;
  }

  /**
   * Build Method
   * @return {Object} This class instance
   */
  build(options) {

    this.wrapper = create('aside', options.css);

    classify(this.wrapper, options);

    if (options.container) {
      this.insert(options.container);
    }

    if (!this.options.display) {
      this.display = 'opened';
    }

    this.emit('built', this.wrapper);

    return this;
  }


  /**
   * [toggle description]
   * @return {Object} The class instance
   */
  toggle() {
    if (this.display === 'opened') {
      this.close();
    } else {
      this.open();
    }

    return this.display;
  }

  /**
   * [minimize description]
   * @return {Object} The class instance
   */
  close() {
    this.wrapper.style[this.options.modifier] = '0px';
    this.display = 'closed';
    this.emit(this.display);

    return this;
  }

  /**
   * [normalize description]
   * @return {Object} The class instance
   */
  open() {
    this.wrapper.style[this.options.modifier] = '200px';
    this.display = 'opened';
    this.emit(this.display);

    return this;
  }
}

export default Drawer;