'use strict';

import init from './component/init';
import classify from './component/classify';
import css from './module/css';
import events from './component/events';
import insert from './component/insert';
import offset from './element/offset';

import create from './element/create';

import bind from './module/bind';
import merge from './module/merge';
import emitter from './module/emitter';

import List from './list';
import Item from './item';
import Divider from './divider';

const defaults = {
  prefix: 'material',
  class: 'menu',
  tag: 'div',
  modules: [emitter, events, bind, insert]
};


/**
 * This Class represents a menu.
 *
 * @return {parent} The class instance
 * @example new Container({
 *   container: document.body
 * });
 */
class Menu {

  /**
   * Constructor
   * @param  {Object} options - Component options
   * @return {Object} Class instance 
   */
  constructor(options) {
    this.options = merge(defaults, options || {});

    init(this);
    this.build(this.options);

    if (this.options.bind) {
      this.bind(this.options.bind);
    }

    this.emit('ready');

    return this;
  }

  /**
   * Build Method
   * @return {Object} This class instance
   */
  build(options) {

    var tag = options.tag || 'div';
    this.wrapper = create(tag, options.css);

    classify(this.wrapper, options);

    if (options.container) {
      this.insert(options.container);
    }

    if (this.options.list) {
      new List({
        wrapper: this.wrapper,
        list: this.options.list,
        height: 600,
        label: 'Flat',
        render: (info) => {
          console.log('render', info);
          var item;

          if (info.type === 'divider') {
            item = new Divider();
          } else {
            console.log('item');
            var item = new Item({
              name: info.name,
              text: info.name
            });
          }

          return item;
        },
        select: (item) => {
          console.log('item...', item);
          this.selected = item;
        }
      });
    }
    this.emit('built', this.wrapper);

    return this;
  }

  show(e) {
    css.add(this.wrapper, 'show');
    var offs = offset(e.target);
    console.log('show', e.target, offs);
    var offsw = offset(this.wrapper);

    this.wrapper.style.top = offs.top + 'px';
    this.wrapper.style.left = offs.left - offsw.width + offs.width + 'px';
  }
}

export default Menu;