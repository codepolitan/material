'use strict';

import Emitter from './module/emitter';
import controller from './component/controller';

import element from './component/element';
import insert from './component/insert';
import css from './module/css';
import merge from './module/merge';
import bind from './module/bind';

var defaults = {
  prefix: 'material',
  class: 'textfield',
  type: 'control',
  tag: 'div',
  bind: {
    //'change': '_onChange',
    'input.focus': '_onInputFocus',
    'input.blur': '_onInputBlur',
    //'input.keypress': '_onInputKeyPress',
    'input.keyup': '_onInputKeyPress',
    'input.change': '_onChange',
    // 'input.keydown': '_onInputKeyPress'

  }
};

/**
 * Field class
 * @class
 * @extends {Control}
 */
export default class Field {

  /**
   * Constructor
   * @param  {Object} options - Component options
   * @return {Object} Class instance 
   */
  constructor(options) {
    //super();

    //this.emit('init');
    //this.options = merge(defaults, options);

    this.init(options);
    this.build();

    if (this.options.bind) {
      this.bind(this.options.bind);
    }

    return this;
  }

  /**
   * init
   * @param  {Object} options The class options
   * @return {Object} The class instance
   */
  init(options) {

    // init options and merge options to defaults
    options = options || {};
    this.options = merge(defaults, options);



    // implement modules
    Object.assign(this, Emitter, bind, insert);

    this.document = window.document;

    this.controller = controller;
    this.value = this.options.value;

    return this;
  }

  /**
   * [build description]
   * @return {Object} The class instance
   */
  build() {
    //create a new div as input element
    var tag = this.options.tag || 'div';
    this.wrapper = element.createElement(tag);
    css.add(this.wrapper, this.options.prefix + '-' + this.options.class);


    this._initLabel();
    this._initInput();
    this._initUnderline();

    //this._initControls();



    if (this.disabled) {
      css.add(this.wrapper, 'is-disabled');
    }

    // insert if container options is given
    if (this.options.container) {
      //console.log(this.name, opts.container);
      this.insert(this.options.container);
    }
  }

  /**
   * Setter
   * @param {string} prop
   * @param {string} value
   */
  set(prop, value) {

    switch (prop) {
      case 'value':
        this.setValue(value);
        break;
      case 'label':
        this.setLabel(value);
        break;
      default:
        this.setValue(prop);
    }

    return this;
  }

  /**
   * [_initLabel description]
   * @return {Object} The class instance
   */
  setLabel(label) {
    label = label || this.options.label;
    var text;

    if (label === null || label === false) {
      text = '';
    } else if (this.options.label) {
      text = label;
    } else {
      text = this.options.name;
    }

    this.label.textContent = text;
  }


  /**
   * Getter
   * @param {string} prop
   * @param {string} value
   */
  get(prop) {
    var value;

    switch (prop) {
      case 'value':
        value = this.getValue();
        break;
      case 'name':
        value = this.name;
        break;
      default:
        return this.getValue();
    }

    return value;
  }

  /**
   * [getValue description]
   * @return {Object} The class instance
   */
  getValue() {
    //console.log('getValue', this);
    return this.input.value;
  }

  /**
   * [setValue description]
   * @param {string} value [description]
   */
  setValue(value) {
    this.input.value = value;

    if (value) {
      css.remove(this.wrapper, 'is-empty');
    } else {
      css.add(this.wrapper, 'is-empty');
    }

    this.emit('change', value);
  }


  /**
   * Setter for the state of the component
   * @param {string} state active/disable etc...
   */
  setState(state) {
    if (this.state) {
      css.remove(this.wrapper, 'state-' + this.state);
    }

    if (state) {
      css.add(this.wrapper, 'state-' + state);
    }

    this.state = state;
    this.emit('state', state);

    return this;
  }

  _initLabel() {
    this.label = element.createElement('label');
    css.add(this.label, this.options.class + '-label');
    this.insertElement(this.label, this.wrapper);

    if (this.options.label !== false) {
      this.setLabel();
    }
  }

  /**
   * [_initInput description]
   * @return {Object} The class instance
   */
  _initInput() {

    this.input = element.createElement('input');
    this.input.setAttribute('type', 'text');
    css.add(this.input, this.options.class + '-input');

    this.insertElement(this.input, this.wrapper);

    if (!this.options.value) {
      css.add(this.wrapper, 'is-empty');
    }

    if (this.readonly) {
      this.input.setAttribute('readonly', 'readonly');
      this.input.setAttribute('tabindex', '-1');
    }

    return this.input;
  }

  /**
   * _initUnderline
   * @return {Object} The class instance
   */
  _initUnderline() {
    this.underline = element.createElement('span');
    css.add(this.underline, this.options.class + '-underline');
    this.insertElement(this.underline, this.wrapper);
  }

  /**
   * [_initValue description]
   * @return {Object} The class instance
   */
  _initValue() {
    var opts = this.options;

    //create a new div as input element
    if (opts.value) {
      this.setValue(opts.value);
    }
  }

  /**
   * [_onFocus description]
   * @return {Object} The class instance
   */
  _onInputFocus(e) {
    //console.log('_onInputFocus');
    if (this.readonly) return;
    this.setState('focus');
  }


  /**
   * [_onBlur description]
   * @return {Object} The class instance
   */
  _onInputBlur() {
    //console.log('_onInputBlur', this.readonly);
    if (this.readonly) return;
    this.setState(null);
  }

  /**
   * [_onFocus description]
   * @return {Object} The class instance
   */
  _onInputKeyPress(e) {
    //console.log('_onInputKeyPress', e);

    if (this.get('value') === '') {
      css.add(this.wrapper, 'is-empty');
    } else {
      css.remove(this.wrapper, 'is-empty');
    }

    this.emit('change', this.getValue());
  }

  /**
   * [setError description]
   * @param {string} error Error description
   */
  setError(error) {
    if (error) {
      this.addClass('field-error');
      if (this.error)
        this.error.set('html', error);
    } else {
      if (this.error)
        this.removeClass('field-error');
      if (this.error)
        this.error.set('html', '');
    }
  }
}