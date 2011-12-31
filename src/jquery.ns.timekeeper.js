/*!
 * @author jameslafferty
 * @version 0.1
 * @copyright 2011 James Lafferty
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * This is a very simple, straightforward jQuery UI Widget to allow users
 * to keep track of time.
 */

 (function ($, undefined) {
	'use strict';
		var pad = function (length) {
				var that = this;
				if ('number' !== typeof that
					&& 'string' !== typeof that) {
					return false;
				}
				that = '' + that;
				while (that.length < length) {
					that = '0' + that;
				}
				return that;
			}, 
			checkTime = function () {
				var currentTime = new Date().getTime();
				return this.startTime - currentTime;
			
			},
			formatTime = function () {
				var timeDate = new Date(0 - parseInt(this, 10));
				return pad.call(timeDate.getUTCHours(), 2) + ':' 
					+ pad.call(timeDate.getUTCMinutes(), 2) + ':' 
					+ pad.call(timeDate.getUTCSeconds(), 2);
			},
			startTimer = function (precision) {
				var that = this,
					elapsed = $(that).timekeeper('option', 'elapsed');
				that.startTime = new Date().getTime() + elapsed;
				if (that.timer) {
					stopTimer.call(that);
				}
				that.timer = setInterval(function () {
					$(that).timekeeper('option', 'elapsed', 
						checkTime.call(that));	
				}, precision);
				return that.timer;
			},
			stopTimer = function () {
				var that = this,
					elapsed = $(that).timekeeper('option', 'elapsed');
				clearInterval(that.timer);
				that.timer = undefined;
			};
		$.widget('ns.timekeeper', {
			options : {
				elapsed : 0,	
				labels : {
					reset : 'Reset',
					start : 'Start',
					stop : 'Stop'
				},
				precision : 100
			},
			punchIn : function () {
				var that = this,
					element = that.element,
					options = that.options,
					precision = options.precision;
				startTimer.call(element, precision); 
			},
			punchOut : function () {
				var that = this,
					element = that.element;
				stopTimer.call(element);	
			},
			resetClock : function () {
				var that = this,
					element = that.element;
				if (element.timer) {
					stopTimer.call(element);
				}
				element.timekeeper('option', 'elapsed', 0);	
			},
			_create : function () {
				var that = this,
					element = that.element,
					options = that.options,
					labels = options.labels,
					display = $('<span />', {
						'css' : {
							'display' : 'block'
						}
					})
						.appendTo(element),
					startButton = $('<button />', {
						html : labels.start,
						click : function () {
							that.punchIn();				
						}
					}).button()
						.appendTo(element),
					stopButton = $('<button />', {
						html : labels.stop,
						click : function () {
							that.punchOut();	
						}
					}).button()
						.appendTo(element),
					resetButton = $('<button />', {
						html : labels.reset,
						click : function () {
							that.resetClock();	
						}})
						.button()
							.appendTo(element);
				that._bind({
					'timekeeperelapsedchange' : function (e, h) {
						display.html(formatTime.call(h.elapsed));
					}		
				});
			},
			_init : function () {
				var that = this,
					options = that.options,
					elapsed = options.elapsed;
				that._setOption('elapsed', elapsed);	
			},
			// It's often convenient to have an event fired when
			// an option changes.
			_setOption : function (key, value) {
				var that = this,
					keyVal = {};
				keyVal[key] = value;
				that._trigger(key + 'change', 0, $.extend(true, {}, keyVal));
				that._super(key, value);
			}
		});
 }(jQuery));
