'use strict';

import merge from './module/merge';
import insert from './component/insert';
import css from './module/css';
import Emitter from './module/emitter';
import bind from './module/bind';
import controller from './component/controller';

// import component
import Layout from './layout';

const defaults = {
  prefix: 'material',
  class: 'form',
  tag: 'div',
  controls: ['field', 'checkbox', 'slider', 'switch']
};

/**
 * Form class
 *
 * @class
 * @extends {Component}
 * @return {Class} This class instance
 */
class Form {

  /**
   * Constructor
   * @param  {Object} options - Component options
   * @return {Object} Class instance 
   */
  constructor(options) {
    this.options = merge(defaults, options);

    this.init(options);
    this.build();

    return this;
  }

  /**
   * Initialize View
   * @return {void}
   */
  init(options) {
    // initOPtions

    // init intanciate name

    this.name = this.options.name;

    // merge options

    // implement module
    Object.assign(this,
      Emitter,
      bind,
      insert
    );

    this.document = window.document;
    this.controller = controller;


    //need to remove the options template to have a reference
    if (this.options.render) {
      this.render = options.render;
    }

    //this.key = {};

    return this;
  }


  /**
   * [_initForm description]
   * @return {Object} This class instance
   */
  build() {

    var tag = this.options.tag || 'div';

    this.wrapper = document.createElement(tag);
    css.add(this.wrapper, this.options.prefix + '-' + this.options.class);

    this._initLayout(this.options.layout);

    return this;
  }

  /**
   * Instanciate layout
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  _initLayout(options) {
    // complete layout options
    options.wrapper = this.wrapper;
    options.controls = this.options.controls;
    //console.log('control keys', this.options.controls);

    this.layout = new Layout(options);

    console.log('this.layout.controls', this.layout.controls);
    this._initControls(this.layout.controls);
  }

  /**
   * [_initControls description]
   * @param  {[type]} controls [description]
   * @return {[type]}          [description]
   */
  _initControls(controls) {
    if (!controls) return;

    this.key = this.key || {};

    for (var i = 0; i < controls.length; i++) {
      var control = controls[i];
      //control.setAttribute('data-key', control.name);
      console.log('keys', control.name, control);

      this.key[control.name] = control;

      control.on('change', function( /*value*/ ) {
        //console.log('change', this.name, value);
      });
    }
  }

  /**
   * [_onSubmit description]
   * @return {void}
   */
  _onSubmit(e) {
    e.preventDefault();
  }

  /**
   * [initControl description]
   * @param  {[type]} key     [description]
   * @param  {[type]} section [description]
   * @return {[type]}         [description]
   */
  initControl(key, section) {
    var name = key.name || 'undefined';

    var control = this.render(key);

    if (control) {
      this.key[name] = control;
      control.insert(section);
      control.addEvent('keyup', function() {
        //console.log('change', name, control.get('value'));
      });

      control.setAttribute('data-key', name);
    }
  }

  /**
   * Getter
   *
   * @param {string} prop
   * @param {string} value
   * @return {Object|void}
   */
  set(prop, value) {
    switch (prop) {
      case 'info':
        return this.setInfo(value);
      case 'schema':
        return this.setSchema(value);
      default:
        return this.setInfo(prop);
    }
  }

  /**
   * [setInfo description]
   * @param {[type]} info [description]
   */
  setInfo(info) {
    console.log('setInfo', info);
    this.info = this.original = info;

    this.parseInfo(info);

  }

  /**
   * [parseInfo description]
   * @param  {[type]} obj  [description]
   * @param  {[type]} name [description]
   * @param  {[type]} i    [description]
   * @return {[type]}      [description]
   */
  parseInfo(obj, name, i) {
    //console.log('parseInfo', obj, name, 'level ' + i);
    var level = i || 0;
    level = level + 1;
    var key;

    if (obj instanceof Object) {
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          console.log('key', key, level);
          //recursive call to scan property
          var n = null;
          if (name) {
            n = name + '.' + key;
          } else {
            n = key;
          }
          console.log('recall', n, level - 1);
          this.parseInfo(obj[key], n, level);
        }
      }
    } else {
      if (this.key[name] && this.key[name].set) {
        console.log();
        this.key[name].set(obj);
      }
    }
  }

  /**
   * Getter
   *
   * @param {string} prop
   * @param {string} value
   * @return {Object|void}
   */
  get(prop, value) {
    switch (prop) {
      case 'key':
        return this.getValue(value);
      case 'info':
        return this.getInfo();
      case 'original':
        return this.original;
      case 'options':
        return this.options;
      default: //default will replace the old method see up
        return this.getInfo();
    }
  }

  // /**
  //  * Get Value for the given key
  //  * @param  {string} name defined in dot notation
  //  * @param  {Object} info
  //  * @return {Mixin} The Value of the given key
  //  */
  // getValue(name, info) {
  //   var keys = name.split(/\./);
  //   var value = null;

  //   if (!name || !info) {
  //     return;
  //   }

  //   //_log.debug('getValueFromKey', name, info);

  //   if (keys.length === 1) {
  //     value = info[keys[0]];
  //   }
  //   if (keys.length === 2 && info[keys[0]]) {
  //     if (info[keys[0]]) {
  //       value = info[keys[0]][keys[1]];
  //     }
  //   }
  //   if (keys.length === 3) {
  //     if (info[keys[0]]) {
  //       if (info[keys[0]][keys[1]]) {
  //         value = info[keys[0]][keys[1]][keys[2]];
  //       }
  //     }
  //   }

  //   return value;
  // }


  getInfo() {
    return this.info;
  }
}

export default Form;