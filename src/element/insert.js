'use strict';

import dom from '../module/dom';

/**
 * insert element into dom
 * @param  {[type]} element   [description]
 * @param  {[type]} container [description]
 * @param  {[type]} context   [description]
 * @param  {[type]} debug     [description]
 * @return {[type]}           [description]
 */
function insert(element, container, context) {
  if (!element || !container) return;

  element = element.wrapper || element;
  container = container.wrapper || container;

  if (container instanceof HTMLElement) {
    container = container;
  } else {
    throw new Error("Can't insert " + container + " is not a HTMLElement object");
  }

  context = context || 'bottom';

  var contexts = ['top', 'bottom', 'after', 'before'];
  var methods = ['prepend', 'append', 'after', 'before'];

  var index = contexts.indexOf(context);
  if (index === -1) {
    return;
  }

  var method = methods[index];

  // insert component element to the dom tree using dom
  dom[method](container, element);

  return element;
}

export default insert;