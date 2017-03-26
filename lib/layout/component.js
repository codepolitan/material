'use strict';

import style from '../element/style';
import css from '../module/css';

module.exports = {

  /**
   * Instanciate the given object comp
   * @param  {Object} comp list component
   * @return {component}
   */
  _initComponent(options) {
    //console.log('_initComponent', options.name, options);
    options = options || {};

    // shortcuts
    // options.flex = options.flex || comp.flex;
    // options.hide = options.hide || comp.hide;
    // options.theme = options.theme || comp.theme;

    var name = options.name || 'main';

    //options.container = comp.container;
    var component = this.component[name] = new options.component(options);

    this.components.push(component);

    //console.log('component instance', component);

    // register component

    this._componentRegister(name, component);

    //settings
    //this._initComponentSettings(component);

    // style, size and event
    this._setComponentStyles(component);
    this._setComponentDisplay(component);


    return component;
  },

  /**
   * [_componentRegister description]
   * @param  {string} name      [description]
   * @param  {component} component [description]
   */
  _componentRegister(name, component) {
    //console.log('_componentRegister', name, component._name);
    this.components = this.components || [];
    this.components.push(component);
    var _name = component._name;

    this.controls = this.controls || [];

    var controls = this.options.controls;

    //console.log('control', component.name, _name, controls);

    if (controls && controls.indexOf(_name) >= 0) {
      this.controls.push(component);
    }

  },

  /**
   * [_initComponentSettings description]
   * @param  {component} component [description]
   */
  // _initComponentSettings(component) {
  //
  //  var name = component.getName();
  //  var element = component.element;
  // },

  /**
   * [_initComponentSettings description]
   * @param  {component} component [description]
   */
  _setComponentStyles(component) {

    if (component.options.flex) {
      css.add(component.element, 'flex-' + component.options.flex);
    } else {

      //console.log('not flex', component.options.name, component.options);


      if (component.options.size && component.options.width) {
        var size = component.options.size;
        if (this.settings &&
          this.settings.layout &&
          this.settings.layout.section &&
          this.settings.layout.section[component.name] &&
          this.settings.layout.section[component.name].width) {

          size = this.settings.layout.section[component.name].width;



          style.set(component.element, {
            'width': size + 'px'
          });
        }
      } else {
        style.set(component.element, {
          height: component.options.size + 'px'
        });
      }
    }

    if (component.options.hide) {
      style.set(component.element, {
        display: 'none'
      });
    }

    if (component.options.theme) {
      css.add(component.element, 'theme' + '-' + component.options.theme);
    }
  },

  /**
   * [_initSize description]
   * @param  {component} component [description]
   */
  _setComponentDisplay(component) {
    var display = 'normalized';

    // var name = component.getName();
    // if (this.settings[name] && this.settings[name].display) {
    //  display = this.settings[name].display;
    // }

    if (!component.setDisplay) return;
    component.setDisplay(display, 'width');

    if (component.options.flex) return;

    //this._initResizer(component);
    this.emit('drag');

    this._attachComponentEvents(component);
  },

  /**
   * _setComponentSettings description
   * @param {Object} component Component object
   */
  // _setComponentSettings(component) {
  //  var display = 'normalized';

  //  var name = component.getName();
  //  var element = component.element;

  //  if (component.options.flex) {

  //    if (this.settings[name] && this.settings[name].width) {
  //      //style('flex', 'none');
  //      element.addClass('flex-none');
  //      if (display === 'minimized') {

  //        style('width', 0);
  //      } else {

  //        if (this.settings[name].width < 32)
  //          this.settings[name].width = 32;

  //        element.style('width', this.settings[name].width || 160);
  //      }

  //      component.width = this.settings[name].width || 200;
  //      component._modifier = 'width';
  //    } else if (this.settings[name] && this.settings[name].height) {
  //      element.style('flex', 'none');
  //      element.style('height', this.settings[name].height);
  //      component.height = this.settings[name].height || 160;
  //      component._modifier = 'height';
  //    }
  //  }
  // },

  /**
   * [_attachComponentEvents description]
   * @param  {component} component [description]
   */
  _attachComponentEvents(component) {
    var name = component.getName();

    /**
     *  toggled
     */
    component.on('toggled', () => {
      this.emit('resize');
    }).on('resizing', () => {
      this.emit('resize');
    }).on('display', (state) => {
      this.emit('resize');
      this.emit('display', [name, state]);
    });

    this.on('resize', () => {
      component.emit('resize');
    }).on('drag:', () => {
      component.emit('resize');
    }).on('normalize', () => {
      component.emit('resize');
    }).on('maximize', () => {
      component.emit('resize');
    }).on('minimize', () => {
      component.emit('resize');
    });
  }
};