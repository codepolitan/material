
/**
 * bind module
 *
 * class module/binding
 */
'use strict';

// var prime = require('prime/index'),
// var Emitter = require('prime/emitter'),

module.exports = {

	//mixin: [Emitter],

	/**
	 * initBinding
	 * Iterate and bind passed Object
	 * @function initBinding
	 * @return {Object}      this.bind
	 */
	bind: function(options) {
		options = options || this.options.binding;

		if (!options) return;

		if (!options._list) {
			this._bindObject(options);
		} else {
			var list = options._list;

			for (var i = 0; list.length > i; i++ ) {
				var bind = binding[list[i]];
				this.binding = this.binding || {};

				this._bindObject(bind);
			}
		}

		return this;
	},

	/**
	 * Bind an object
	 * @param  {Object} obj obj whit key and value to be bound
	 * @return {void}
	 */
	_bindObject: function(obj) {

		for (var key in obj) {

			if (obj.hasOwnProperty(key)) {

				var value = obj[key];

				if (typeof value !== 'object') {
					this._bindKey(key, value);
				} else {
					this._bindList(key, value);
				}
			}
		}
	},

	/**
	 * Bind a list of events to a specific object
	 * @param  {string} key Object path that will listen
	 * @param  {Array} values List if values to bind
	 * @return {void}
	 */
	_bindList: function(key, values) {
		_log.debug('_bindList', key, values);

		for (var i = 0; i < values.length; i++) {
			this._bindKey(key, values[i]);
		}
	},

	/**
	 * Bind to object path
	 * get the event,
	 * get the reference to the last key of the first object,
	 * check if there is a event or a mehtod to bind
	 * @param  {string} key Object path that will listen
	 * @param  {string} val Object path to be bound
	 * @return {void}
	 */
	_bindKey: function(key, val) {

		var eventKeys = key.split('.');
		var ev = eventKeys[eventKeys.length - 1];

		eventKeys.pop();
		var listener = this._path(eventKeys.join('.'));

		var valKeys = val.split('.');

		//Check if it's an event
		if (valKeys[valKeys.length - 2] === 'emit') {
			var emit = valKeys[valKeys.length - 1];
			this._bindEvent(listener, ev, emit, val);
		} else {
			this._bindMethod(listener, ev, val);
		}
	},

	/**
	 * Listen to the given event and trigger another
	 * @param  {Object} listener Object to listen
	 * @param  {string} ev Event that will be listened
	 * @param  {string} emit Event that will be emitted
	 * @param  {string} val Method path to be bound
	 * @return {void}
	 */
	_bindEvent: function(listener, ev, emit, val) {

		var valKeys = val.split('.');
		valKeys.splice(-2, 2);

		var bound = this._path(valKeys.join('.'));

		//console.log('--- bind', listener);

		if (listener && listener.on && bound && bound.emit) {
			listener.on(ev, bound.emit.bind(bound, emit));
		} else {
			//console.log('---', listener, bound);
			
			if (!listener.on && !bound.emit) {
				//console.log('missing both');
			} else if (!listener.on) {
				//console.log('missing listener.on', listener.on);
			} else if (!bound.emit) {
				//console.log('missing bound.emit', bound);
			}

			//_log.debug('missing context or method', listener, val);
		}
	},

	/**
	 * Listen to the given event and bind to the given method
	 * @param  {Object} listener Object to listen
	 * @param  {string} ev Event that will be listened
	 * @param  {string} val Method path to be bound
	 * @return {void}
	 */
	_bindMethod: function(listener, ev, val) {
		var method = this._path(val);

		var valKeys = val.split('.');
		valKeys.pop();
		var bound = this._path(valKeys.join('.'));

		if (method && method.bind && bound) {
			listener.on(ev, method.bind(bound));
		}
	},

	/**
	 * Return the last reference from an object
	 * @param  {string} str Object path for example key1.key2.key3
	 * @return {value} The value of the last reference
	 */
	_path: function(str) {
		//_log.debug('_path', str);
		if (!str) return this;
		else if (!str.match(/\./)) return this[str];

		var last;

		var keys = str.split('.');
		for (var i = 0, l = keys.length; i < l; i++) {
			var key = keys[i];

			last = last || this;
			last = last[key];
		}

		return last;
	}

};