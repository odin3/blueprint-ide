/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1137);


/***/ },

/***/ 1:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var root_1 = __webpack_require__(22);
	var toSubscriber_1 = __webpack_require__(271);
	var observable_1 = __webpack_require__(140);
	/**
	 * A representation of any set of values over any amount of time. This the most basic building block
	 * of RxJS.
	 *
	 * @class Observable<T>
	 */
	var Observable = (function () {
	    /**
	     * @constructor
	     * @param {Function} subscribe the function that is  called when the Observable is
	     * initially subscribed to. This function is given a Subscriber, to which new values
	     * can be `next`ed, or an `error` method can be called to raise an error, or
	     * `complete` can be called to notify of a successful completion.
	     */
	    function Observable(subscribe) {
	        this._isScalar = false;
	        if (subscribe) {
	            this._subscribe = subscribe;
	        }
	    }
	    /**
	     * Creates a new Observable, with this Observable as the source, and the passed
	     * operator defined as the new observable's operator.
	     * @method lift
	     * @param {Operator} operator the operator defining the operation to take on the observable
	     * @return {Observable} a new observable with the Operator applied
	     */
	    Observable.prototype.lift = function (operator) {
	        var observable = new Observable();
	        observable.source = this;
	        observable.operator = operator;
	        return observable;
	    };
	    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
	        var operator = this.operator;
	        var sink = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
	        if (operator) {
	            operator.call(sink, this.source);
	        }
	        else {
	            sink.add(this._trySubscribe(sink));
	        }
	        if (sink.syncErrorThrowable) {
	            sink.syncErrorThrowable = false;
	            if (sink.syncErrorThrown) {
	                throw sink.syncErrorValue;
	            }
	        }
	        return sink;
	    };
	    Observable.prototype._trySubscribe = function (sink) {
	        try {
	            return this._subscribe(sink);
	        }
	        catch (err) {
	            sink.syncErrorThrown = true;
	            sink.syncErrorValue = err;
	            sink.error(err);
	        }
	    };
	    /**
	     * @method forEach
	     * @param {Function} next a handler for each value emitted by the observable
	     * @param {PromiseConstructor} [PromiseCtor] a constructor function used to instantiate the Promise
	     * @return {Promise} a promise that either resolves on observable completion or
	     *  rejects with the handled error
	     */
	    Observable.prototype.forEach = function (next, PromiseCtor) {
	        var _this = this;
	        if (!PromiseCtor) {
	            if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
	                PromiseCtor = root_1.root.Rx.config.Promise;
	            }
	            else if (root_1.root.Promise) {
	                PromiseCtor = root_1.root.Promise;
	            }
	        }
	        if (!PromiseCtor) {
	            throw new Error('no Promise impl found');
	        }
	        return new PromiseCtor(function (resolve, reject) {
	            // Must be declared in a separate statement to avoid a RefernceError when
	            // accessing subscription below in the closure due to Temporal Dead Zone.
	            var subscription;
	            subscription = _this.subscribe(function (value) {
	                if (subscription) {
	                    // if there is a subscription, then we can surmise
	                    // the next handling is asynchronous. Any errors thrown
	                    // need to be rejected explicitly and unsubscribe must be
	                    // called manually
	                    try {
	                        next(value);
	                    }
	                    catch (err) {
	                        reject(err);
	                        subscription.unsubscribe();
	                    }
	                }
	                else {
	                    // if there is NO subscription, then we're getting a nexted
	                    // value synchronously during subscription. We can just call it.
	                    // If it errors, Observable's `subscribe` will ensure the
	                    // unsubscription logic is called, then synchronously rethrow the error.
	                    // After that, Promise will trap the error and send it
	                    // down the rejection path.
	                    next(value);
	                }
	            }, reject, resolve);
	        });
	    };
	    Observable.prototype._subscribe = function (subscriber) {
	        return this.source.subscribe(subscriber);
	    };
	    /**
	     * An interop point defined by the es7-observable spec https://github.com/zenparsing/es-observable
	     * @method Symbol.observable
	     * @return {Observable} this instance of the observable
	     */
	    Observable.prototype[observable_1.observable] = function () {
	        return this;
	    };
	    // HACK: Since TypeScript inherits static properties too, we have to
	    // fight against TypeScript here so Subject can have a different static create signature
	    /**
	     * Creates a new cold Observable by calling the Observable constructor
	     * @static true
	     * @owner Observable
	     * @method create
	     * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
	     * @return {Observable} a new cold observable
	     */
	    Observable.create = function (subscribe) {
	        return new Observable(subscribe);
	    };
	    return Observable;
	}());
	exports.Observable = Observable;
	//# sourceMappingURL=Observable.js.map

/***/ },

/***/ 4:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var isFunction_1 = __webpack_require__(125);
	var Subscription_1 = __webpack_require__(17);
	var Observer_1 = __webpack_require__(152);
	var rxSubscriber_1 = __webpack_require__(110);
	/**
	 * Implements the {@link Observer} interface and extends the
	 * {@link Subscription} class. While the {@link Observer} is the public API for
	 * consuming the values of an {@link Observable}, all Observers get converted to
	 * a Subscriber, in order to provide Subscription-like capabilities such as
	 * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
	 * implementing operators, but it is rarely used as a public API.
	 *
	 * @class Subscriber<T>
	 */
	var Subscriber = (function (_super) {
	    __extends(Subscriber, _super);
	    /**
	     * @param {Observer|function(value: T): void} [destinationOrNext] A partially
	     * defined Observer or a `next` callback function.
	     * @param {function(e: ?any): void} [error] The `error` callback of an
	     * Observer.
	     * @param {function(): void} [complete] The `complete` callback of an
	     * Observer.
	     */
	    function Subscriber(destinationOrNext, error, complete) {
	        _super.call(this);
	        this.syncErrorValue = null;
	        this.syncErrorThrown = false;
	        this.syncErrorThrowable = false;
	        this.isStopped = false;
	        switch (arguments.length) {
	            case 0:
	                this.destination = Observer_1.empty;
	                break;
	            case 1:
	                if (!destinationOrNext) {
	                    this.destination = Observer_1.empty;
	                    break;
	                }
	                if (typeof destinationOrNext === 'object') {
	                    if (destinationOrNext instanceof Subscriber) {
	                        this.destination = destinationOrNext;
	                        this.destination.add(this);
	                    }
	                    else {
	                        this.syncErrorThrowable = true;
	                        this.destination = new SafeSubscriber(this, destinationOrNext);
	                    }
	                    break;
	                }
	            default:
	                this.syncErrorThrowable = true;
	                this.destination = new SafeSubscriber(this, destinationOrNext, error, complete);
	                break;
	        }
	    }
	    Subscriber.prototype[rxSubscriber_1.rxSubscriber] = function () { return this; };
	    /**
	     * A static factory for a Subscriber, given a (potentially partial) definition
	     * of an Observer.
	     * @param {function(x: ?T): void} [next] The `next` callback of an Observer.
	     * @param {function(e: ?any): void} [error] The `error` callback of an
	     * Observer.
	     * @param {function(): void} [complete] The `complete` callback of an
	     * Observer.
	     * @return {Subscriber<T>} A Subscriber wrapping the (partially defined)
	     * Observer represented by the given arguments.
	     */
	    Subscriber.create = function (next, error, complete) {
	        var subscriber = new Subscriber(next, error, complete);
	        subscriber.syncErrorThrowable = false;
	        return subscriber;
	    };
	    /**
	     * The {@link Observer} callback to receive notifications of type `next` from
	     * the Observable, with a value. The Observable may call this method 0 or more
	     * times.
	     * @param {T} [value] The `next` value.
	     * @return {void}
	     */
	    Subscriber.prototype.next = function (value) {
	        if (!this.isStopped) {
	            this._next(value);
	        }
	    };
	    /**
	     * The {@link Observer} callback to receive notifications of type `error` from
	     * the Observable, with an attached {@link Error}. Notifies the Observer that
	     * the Observable has experienced an error condition.
	     * @param {any} [err] The `error` exception.
	     * @return {void}
	     */
	    Subscriber.prototype.error = function (err) {
	        if (!this.isStopped) {
	            this.isStopped = true;
	            this._error(err);
	        }
	    };
	    /**
	     * The {@link Observer} callback to receive a valueless notification of type
	     * `complete` from the Observable. Notifies the Observer that the Observable
	     * has finished sending push-based notifications.
	     * @return {void}
	     */
	    Subscriber.prototype.complete = function () {
	        if (!this.isStopped) {
	            this.isStopped = true;
	            this._complete();
	        }
	    };
	    Subscriber.prototype.unsubscribe = function () {
	        if (this.closed) {
	            return;
	        }
	        this.isStopped = true;
	        _super.prototype.unsubscribe.call(this);
	    };
	    Subscriber.prototype._next = function (value) {
	        this.destination.next(value);
	    };
	    Subscriber.prototype._error = function (err) {
	        this.destination.error(err);
	        this.unsubscribe();
	    };
	    Subscriber.prototype._complete = function () {
	        this.destination.complete();
	        this.unsubscribe();
	    };
	    Subscriber.prototype._unsubscribeAndRecycle = function () {
	        var _a = this, _parent = _a._parent, _parents = _a._parents;
	        this._parent = null;
	        this._parents = null;
	        this.unsubscribe();
	        this.closed = false;
	        this.isStopped = false;
	        this._parent = _parent;
	        this._parents = _parents;
	        return this;
	    };
	    return Subscriber;
	}(Subscription_1.Subscription));
	exports.Subscriber = Subscriber;
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var SafeSubscriber = (function (_super) {
	    __extends(SafeSubscriber, _super);
	    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
	        _super.call(this);
	        this._parentSubscriber = _parentSubscriber;
	        var next;
	        var context = this;
	        if (isFunction_1.isFunction(observerOrNext)) {
	            next = observerOrNext;
	        }
	        else if (observerOrNext) {
	            next = observerOrNext.next;
	            error = observerOrNext.error;
	            complete = observerOrNext.complete;
	            if (observerOrNext !== Observer_1.empty) {
	                context = Object.create(observerOrNext);
	                if (isFunction_1.isFunction(context.unsubscribe)) {
	                    this.add(context.unsubscribe.bind(context));
	                }
	                context.unsubscribe = this.unsubscribe.bind(this);
	            }
	        }
	        this._context = context;
	        this._next = next;
	        this._error = error;
	        this._complete = complete;
	    }
	    SafeSubscriber.prototype.next = function (value) {
	        if (!this.isStopped && this._next) {
	            var _parentSubscriber = this._parentSubscriber;
	            if (!_parentSubscriber.syncErrorThrowable) {
	                this.__tryOrUnsub(this._next, value);
	            }
	            else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
	                this.unsubscribe();
	            }
	        }
	    };
	    SafeSubscriber.prototype.error = function (err) {
	        if (!this.isStopped) {
	            var _parentSubscriber = this._parentSubscriber;
	            if (this._error) {
	                if (!_parentSubscriber.syncErrorThrowable) {
	                    this.__tryOrUnsub(this._error, err);
	                    this.unsubscribe();
	                }
	                else {
	                    this.__tryOrSetError(_parentSubscriber, this._error, err);
	                    this.unsubscribe();
	                }
	            }
	            else if (!_parentSubscriber.syncErrorThrowable) {
	                this.unsubscribe();
	                throw err;
	            }
	            else {
	                _parentSubscriber.syncErrorValue = err;
	                _parentSubscriber.syncErrorThrown = true;
	                this.unsubscribe();
	            }
	        }
	    };
	    SafeSubscriber.prototype.complete = function () {
	        if (!this.isStopped) {
	            var _parentSubscriber = this._parentSubscriber;
	            if (this._complete) {
	                if (!_parentSubscriber.syncErrorThrowable) {
	                    this.__tryOrUnsub(this._complete);
	                    this.unsubscribe();
	                }
	                else {
	                    this.__tryOrSetError(_parentSubscriber, this._complete);
	                    this.unsubscribe();
	                }
	            }
	            else {
	                this.unsubscribe();
	            }
	        }
	    };
	    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
	        try {
	            fn.call(this._context, value);
	        }
	        catch (err) {
	            this.unsubscribe();
	            throw err;
	        }
	    };
	    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
	        try {
	            fn.call(this._context, value);
	        }
	        catch (err) {
	            parent.syncErrorValue = err;
	            parent.syncErrorThrown = true;
	            return true;
	        }
	        return false;
	    };
	    SafeSubscriber.prototype._unsubscribe = function () {
	        var _parentSubscriber = this._parentSubscriber;
	        this._context = null;
	        this._parentSubscriber = null;
	        _parentSubscriber.unsubscribe();
	    };
	    return SafeSubscriber;
	}(Subscriber));
	//# sourceMappingURL=Subscriber.js.map

/***/ },

/***/ 8:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */
	
	'use strict'
	
	var base64 = __webpack_require__(84)
	var ieee754 = __webpack_require__(43)
	var isArray = __webpack_require__(27)
	
	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	
	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.
	
	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()
	
	/*
	 * Export kMaxLength after typed array support is determined.
	 */
	exports.kMaxLength = kMaxLength()
	
	function typedArraySupport () {
	  try {
	    var arr = new Uint8Array(1)
	    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
	    return arr.foo() === 42 && // typed array instances can be augmented
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}
	
	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}
	
	function createBuffer (that, length) {
	  if (kMaxLength() < length) {
	    throw new RangeError('Invalid typed array length')
	  }
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = new Uint8Array(length)
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer(length)
	    }
	    that.length = length
	  }
	
	  return that
	}
	
	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */
	
	function Buffer (arg, encodingOrOffset, length) {
	  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
	    return new Buffer(arg, encodingOrOffset, length)
	  }
	
	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error(
	        'If encoding is specified then the first argument must be a string'
	      )
	    }
	    return allocUnsafe(this, arg)
	  }
	  return from(this, arg, encodingOrOffset, length)
	}
	
	Buffer.poolSize = 8192 // not used by this implementation
	
	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	  arr.__proto__ = Buffer.prototype
	  return arr
	}
	
	function from (that, value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number')
	  }
	
	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    return fromArrayBuffer(that, value, encodingOrOffset, length)
	  }
	
	  if (typeof value === 'string') {
	    return fromString(that, value, encodingOrOffset)
	  }
	
	  return fromObject(that, value)
	}
	
	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(null, value, encodingOrOffset, length)
	}
	
	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	  if (typeof Symbol !== 'undefined' && Symbol.species &&
	      Buffer[Symbol.species] === Buffer) {
	    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
	    Object.defineProperty(Buffer, Symbol.species, {
	      value: null,
	      configurable: true
	    })
	  }
	}
	
	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number')
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative')
	  }
	}
	
	function alloc (that, size, fill, encoding) {
	  assertSize(size)
	  if (size <= 0) {
	    return createBuffer(that, size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(that, size).fill(fill, encoding)
	      : createBuffer(that, size).fill(fill)
	  }
	  return createBuffer(that, size)
	}
	
	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(null, size, fill, encoding)
	}
	
	function allocUnsafe (that, size) {
	  assertSize(size)
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0
	    }
	  }
	  return that
	}
	
	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(null, size)
	}
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size)
	}
	
	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8'
	  }
	
	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding')
	  }
	
	  var length = byteLength(string, encoding) | 0
	  that = createBuffer(that, length)
	
	  var actual = that.write(string, encoding)
	
	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual)
	  }
	
	  return that
	}
	
	function fromArrayLike (that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0
	  that = createBuffer(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	function fromArrayBuffer (that, array, byteOffset, length) {
	  array.byteLength // this throws if `array` is not a valid ArrayBuffer
	
	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds')
	  }
	
	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds')
	  }
	
	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array)
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset)
	  } else {
	    array = new Uint8Array(array, byteOffset, length)
	  }
	
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array)
	  }
	  return that
	}
	
	function fromObject (that, obj) {
	  if (Buffer.isBuffer(obj)) {
	    var len = checked(obj.length) | 0
	    that = createBuffer(that, len)
	
	    if (that.length === 0) {
	      return that
	    }
	
	    obj.copy(that, 0, 0, len)
	    return that
	  }
	
	  if (obj) {
	    if ((typeof ArrayBuffer !== 'undefined' &&
	        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(that, 0)
	      }
	      return fromArrayLike(that, obj)
	    }
	
	    if (obj.type === 'Buffer' && isArray(obj.data)) {
	      return fromArrayLike(that, obj.data)
	    }
	  }
	
	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	}
	
	function checked (length) {
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}
	
	function SlowBuffer (length) {
	  if (+length != length) { // eslint-disable-line eqeqeq
	    length = 0
	  }
	  return Buffer.alloc(+length)
	}
	
	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}
	
	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }
	
	  if (a === b) return 0
	
	  var x = a.length
	  var y = b.length
	
	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i]
	      y = b[i]
	      break
	    }
	  }
	
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}
	
	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}
	
	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }
	
	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }
	
	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length
	    }
	  }
	
	  var buffer = Buffer.allocUnsafe(length)
	  var pos = 0
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i]
	    if (!Buffer.isBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    }
	    buf.copy(buffer, pos)
	    pos += buf.length
	  }
	  return buffer
	}
	
	function byteLength (string, encoding) {
	  if (Buffer.isBuffer(string)) {
	    return string.length
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
	      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    string = '' + string
	  }
	
	  var len = string.length
	  if (len === 0) return 0
	
	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength
	
	function slowToString (encoding, start, end) {
	  var loweredCase = false
	
	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.
	
	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }
	
	  if (end === undefined || end > this.length) {
	    end = this.length
	  }
	
	  if (end <= 0) {
	    return ''
	  }
	
	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0
	  start >>>= 0
	
	  if (end <= start) {
	    return ''
	  }
	
	  if (!encoding) encoding = 'utf8'
	
	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)
	
	      case 'ascii':
	        return asciiSlice(this, start, end)
	
	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)
	
	      case 'base64':
	        return base64Slice(this, start, end)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true
	
	function swap (b, n, m) {
	  var i = b[n]
	  b[n] = b[m]
	  b[m] = i
	}
	
	Buffer.prototype.swap16 = function swap16 () {
	  var len = this.length
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1)
	  }
	  return this
	}
	
	Buffer.prototype.swap32 = function swap32 () {
	  var len = this.length
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3)
	    swap(this, i + 1, i + 2)
	  }
	  return this
	}
	
	Buffer.prototype.swap64 = function swap64 () {
	  var len = this.length
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7)
	    swap(this, i + 1, i + 6)
	    swap(this, i + 2, i + 5)
	    swap(this, i + 3, i + 4)
	  }
	  return this
	}
	
	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}
	
	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}
	
	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}
	
	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (!Buffer.isBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer')
	  }
	
	  if (start === undefined) {
	    start = 0
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0
	  }
	  if (thisStart === undefined) {
	    thisStart = 0
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length
	  }
	
	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }
	
	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }
	
	  start >>>= 0
	  end >>>= 0
	  thisStart >>>= 0
	  thisEnd >>>= 0
	
	  if (this === target) return 0
	
	  var x = thisEnd - thisStart
	  var y = end - start
	  var len = Math.min(x, y)
	
	  var thisCopy = this.slice(thisStart, thisEnd)
	  var targetCopy = target.slice(start, end)
	
	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i]
	      y = targetCopy[i]
	      break
	    }
	  }
	
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}
	
	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1
	
	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset
	    byteOffset = 0
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000
	  }
	  byteOffset = +byteOffset  // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1)
	  }
	
	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0
	    else return -1
	  }
	
	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding)
	  }
	
	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (Buffer.isBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF // Search for a byte value [0-255]
	    if (Buffer.TYPED_ARRAY_SUPPORT &&
	        typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
	  }
	
	  throw new TypeError('val must be string, number or Buffer')
	}
	
	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1
	  var arrLength = arr.length
	  var valLength = val.length
	
	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase()
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2
	      arrLength /= 2
	      valLength /= 2
	      byteOffset /= 2
	    }
	  }
	
	  function read (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }
	
	  var i
	  if (dir) {
	    var foundIndex = -1
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex
	        foundIndex = -1
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true
	      for (var j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false
	          break
	        }
	      }
	      if (found) return i
	    }
	  }
	
	  return -1
	}
	
	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	}
	
	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	}
	
	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	}
	
	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }
	
	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')
	
	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) return i
	    buf[offset + i] = parsed
	  }
	  return i
	}
	
	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}
	
	function latin1Write (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}
	
	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}
	
	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }
	
	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining
	
	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }
	
	  if (!encoding) encoding = 'utf8'
	
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)
	
	      case 'ascii':
	        return asciiWrite(this, string, offset, length)
	
	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length)
	
	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}
	
	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}
	
	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []
	
	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1
	
	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint
	
	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }
	
	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }
	
	    res.push(codePoint)
	    i += bytesPerSequence
	  }
	
	  return decodeCodePointsArray(res)
	}
	
	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000
	
	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }
	
	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}
	
	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}
	
	function latin1Slice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}
	
	function hexSlice (buf, start, end) {
	  var len = buf.length
	
	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len
	
	  var out = ''
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i])
	  }
	  return out
	}
	
	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}
	
	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end
	
	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }
	
	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }
	
	  if (end < start) end = start
	
	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end)
	    newBuf.__proto__ = Buffer.prototype
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start]
	    }
	  }
	
	  return newBuf
	}
	
	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}
	
	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }
	
	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}
	
	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}
	
	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}
	
	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}
	
	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}
	
	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}
	
	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}
	
	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}
	
	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}
	
	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}
	
	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}
	
	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}
	
	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}
	
	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }
	
	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }
	
	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}
	
	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}
	
	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = 0
	  var mul = 1
	  var sub = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = byteLength - 1
	  var mul = 1
	  var sub = 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}
	
	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}
	
	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}
	
	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}
	
	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}
	
	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start
	
	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0
	
	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')
	
	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }
	
	  var len = end - start
	  var i
	
	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, start + len),
	      targetStart
	    )
	  }
	
	  return len
	}
	
	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start
	      start = 0
	      end = this.length
	    } else if (typeof end === 'string') {
	      encoding = end
	      end = this.length
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0)
	      if (code < 256) {
	        val = code
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255
	  }
	
	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }
	
	  if (end <= start) {
	    return this
	  }
	
	  start = start >>> 0
	  end = end === undefined ? this.length : end >>> 0
	
	  if (!val) val = 0
	
	  var i
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val
	    }
	  } else {
	    var bytes = Buffer.isBuffer(val)
	      ? val
	      : utf8ToBytes(new Buffer(val, encoding).toString())
	    var len = bytes.length
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len]
	    }
	  }
	
	  return this
	}
	
	// HELPER FUNCTIONS
	// ================
	
	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g
	
	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}
	
	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}
	
	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}
	
	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []
	
	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i)
	
	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }
	
	        // valid lead
	        leadSurrogate = codePoint
	
	        continue
	      }
	
	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }
	
	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }
	
	    leadSurrogate = null
	
	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }
	
	  return bytes
	}
	
	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}
	
	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break
	
	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }
	
	  return byteArray
	}
	
	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}
	
	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}
	
	function isnan (val) {
	  return val !== val // eslint-disable-line no-self-compare
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },

/***/ 13:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Observable_1 = __webpack_require__(1);
	var Subscriber_1 = __webpack_require__(4);
	var Subscription_1 = __webpack_require__(17);
	var ObjectUnsubscribedError_1 = __webpack_require__(111);
	var SubjectSubscription_1 = __webpack_require__(153);
	var rxSubscriber_1 = __webpack_require__(110);
	/**
	 * @class SubjectSubscriber<T>
	 */
	var SubjectSubscriber = (function (_super) {
	    __extends(SubjectSubscriber, _super);
	    function SubjectSubscriber(destination) {
	        _super.call(this, destination);
	        this.destination = destination;
	    }
	    return SubjectSubscriber;
	}(Subscriber_1.Subscriber));
	exports.SubjectSubscriber = SubjectSubscriber;
	/**
	 * @class Subject<T>
	 */
	var Subject = (function (_super) {
	    __extends(Subject, _super);
	    function Subject() {
	        _super.call(this);
	        this.observers = [];
	        this.closed = false;
	        this.isStopped = false;
	        this.hasError = false;
	        this.thrownError = null;
	    }
	    Subject.prototype[rxSubscriber_1.rxSubscriber] = function () {
	        return new SubjectSubscriber(this);
	    };
	    Subject.prototype.lift = function (operator) {
	        var subject = new AnonymousSubject(this, this);
	        subject.operator = operator;
	        return subject;
	    };
	    Subject.prototype.next = function (value) {
	        if (this.closed) {
	            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
	        }
	        if (!this.isStopped) {
	            var observers = this.observers;
	            var len = observers.length;
	            var copy = observers.slice();
	            for (var i = 0; i < len; i++) {
	                copy[i].next(value);
	            }
	        }
	    };
	    Subject.prototype.error = function (err) {
	        if (this.closed) {
	            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
	        }
	        this.hasError = true;
	        this.thrownError = err;
	        this.isStopped = true;
	        var observers = this.observers;
	        var len = observers.length;
	        var copy = observers.slice();
	        for (var i = 0; i < len; i++) {
	            copy[i].error(err);
	        }
	        this.observers.length = 0;
	    };
	    Subject.prototype.complete = function () {
	        if (this.closed) {
	            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
	        }
	        this.isStopped = true;
	        var observers = this.observers;
	        var len = observers.length;
	        var copy = observers.slice();
	        for (var i = 0; i < len; i++) {
	            copy[i].complete();
	        }
	        this.observers.length = 0;
	    };
	    Subject.prototype.unsubscribe = function () {
	        this.isStopped = true;
	        this.closed = true;
	        this.observers = null;
	    };
	    Subject.prototype._trySubscribe = function (subscriber) {
	        if (this.closed) {
	            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
	        }
	        else {
	            return _super.prototype._trySubscribe.call(this, subscriber);
	        }
	    };
	    Subject.prototype._subscribe = function (subscriber) {
	        if (this.closed) {
	            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
	        }
	        else if (this.hasError) {
	            subscriber.error(this.thrownError);
	            return Subscription_1.Subscription.EMPTY;
	        }
	        else if (this.isStopped) {
	            subscriber.complete();
	            return Subscription_1.Subscription.EMPTY;
	        }
	        else {
	            this.observers.push(subscriber);
	            return new SubjectSubscription_1.SubjectSubscription(this, subscriber);
	        }
	    };
	    Subject.prototype.asObservable = function () {
	        var observable = new Observable_1.Observable();
	        observable.source = this;
	        return observable;
	    };
	    Subject.create = function (destination, source) {
	        return new AnonymousSubject(destination, source);
	    };
	    return Subject;
	}(Observable_1.Observable));
	exports.Subject = Subject;
	/**
	 * @class AnonymousSubject<T>
	 */
	var AnonymousSubject = (function (_super) {
	    __extends(AnonymousSubject, _super);
	    function AnonymousSubject(destination, source) {
	        _super.call(this);
	        this.destination = destination;
	        this.source = source;
	    }
	    AnonymousSubject.prototype.next = function (value) {
	        var destination = this.destination;
	        if (destination && destination.next) {
	            destination.next(value);
	        }
	    };
	    AnonymousSubject.prototype.error = function (err) {
	        var destination = this.destination;
	        if (destination && destination.error) {
	            this.destination.error(err);
	        }
	    };
	    AnonymousSubject.prototype.complete = function () {
	        var destination = this.destination;
	        if (destination && destination.complete) {
	            this.destination.complete();
	        }
	    };
	    AnonymousSubject.prototype._subscribe = function (subscriber) {
	        var source = this.source;
	        if (source) {
	            return this.source.subscribe(subscriber);
	        }
	        else {
	            return Subscription_1.Subscription.EMPTY;
	        }
	    };
	    return AnonymousSubject;
	}(Subject));
	exports.AnonymousSubject = AnonymousSubject;
	//# sourceMappingURL=Subject.js.map

/***/ },

/***/ 16:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(100));
	__export(__webpack_require__(74));
	__export(__webpack_require__(56));
	__export(__webpack_require__(57));
	__export(__webpack_require__(102));
	__export(__webpack_require__(101));


/***/ },

/***/ 17:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var isArray_1 = __webpack_require__(73);
	var isObject_1 = __webpack_require__(201);
	var isFunction_1 = __webpack_require__(125);
	var tryCatch_1 = __webpack_require__(32);
	var errorObject_1 = __webpack_require__(25);
	var UnsubscriptionError_1 = __webpack_require__(198);
	/**
	 * Represents a disposable resource, such as the execution of an Observable. A
	 * Subscription has one important method, `unsubscribe`, that takes no argument
	 * and just disposes the resource held by the subscription.
	 *
	 * Additionally, subscriptions may be grouped together through the `add()`
	 * method, which will attach a child Subscription to the current Subscription.
	 * When a Subscription is unsubscribed, all its children (and its grandchildren)
	 * will be unsubscribed as well.
	 *
	 * @class Subscription
	 */
	var Subscription = (function () {
	    /**
	     * @param {function(): void} [unsubscribe] A function describing how to
	     * perform the disposal of resources when the `unsubscribe` method is called.
	     */
	    function Subscription(unsubscribe) {
	        /**
	         * A flag to indicate whether this Subscription has already been unsubscribed.
	         * @type {boolean}
	         */
	        this.closed = false;
	        this._parent = null;
	        this._parents = null;
	        this._subscriptions = null;
	        if (unsubscribe) {
	            this._unsubscribe = unsubscribe;
	        }
	    }
	    /**
	     * Disposes the resources held by the subscription. May, for instance, cancel
	     * an ongoing Observable execution or cancel any other type of work that
	     * started when the Subscription was created.
	     * @return {void}
	     */
	    Subscription.prototype.unsubscribe = function () {
	        var hasErrors = false;
	        var errors;
	        if (this.closed) {
	            return;
	        }
	        var _a = this, _parent = _a._parent, _parents = _a._parents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
	        this.closed = true;
	        this._parent = null;
	        this._parents = null;
	        // null out _subscriptions first so any child subscriptions that attempt
	        // to remove themselves from this subscription will noop
	        this._subscriptions = null;
	        var index = -1;
	        var len = _parents ? _parents.length : 0;
	        // if this._parent is null, then so is this._parents, and we
	        // don't have to remove ourselves from any parent subscriptions.
	        while (_parent) {
	            _parent.remove(this);
	            // if this._parents is null or index >= len,
	            // then _parent is set to null, and the loop exits
	            _parent = ++index < len && _parents[index] || null;
	        }
	        if (isFunction_1.isFunction(_unsubscribe)) {
	            var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
	            if (trial === errorObject_1.errorObject) {
	                hasErrors = true;
	                errors = errors || (errorObject_1.errorObject.e instanceof UnsubscriptionError_1.UnsubscriptionError ?
	                    flattenUnsubscriptionErrors(errorObject_1.errorObject.e.errors) : [errorObject_1.errorObject.e]);
	            }
	        }
	        if (isArray_1.isArray(_subscriptions)) {
	            index = -1;
	            len = _subscriptions.length;
	            while (++index < len) {
	                var sub = _subscriptions[index];
	                if (isObject_1.isObject(sub)) {
	                    var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
	                    if (trial === errorObject_1.errorObject) {
	                        hasErrors = true;
	                        errors = errors || [];
	                        var err = errorObject_1.errorObject.e;
	                        if (err instanceof UnsubscriptionError_1.UnsubscriptionError) {
	                            errors = errors.concat(flattenUnsubscriptionErrors(err.errors));
	                        }
	                        else {
	                            errors.push(err);
	                        }
	                    }
	                }
	            }
	        }
	        if (hasErrors) {
	            throw new UnsubscriptionError_1.UnsubscriptionError(errors);
	        }
	    };
	    /**
	     * Adds a tear down to be called during the unsubscribe() of this
	     * Subscription.
	     *
	     * If the tear down being added is a subscription that is already
	     * unsubscribed, is the same reference `add` is being called on, or is
	     * `Subscription.EMPTY`, it will not be added.
	     *
	     * If this subscription is already in an `closed` state, the passed
	     * tear down logic will be executed immediately.
	     *
	     * @param {TeardownLogic} teardown The additional logic to execute on
	     * teardown.
	     * @return {Subscription} Returns the Subscription used or created to be
	     * added to the inner subscriptions list. This Subscription can be used with
	     * `remove()` to remove the passed teardown logic from the inner subscriptions
	     * list.
	     */
	    Subscription.prototype.add = function (teardown) {
	        if (!teardown || (teardown === Subscription.EMPTY)) {
	            return Subscription.EMPTY;
	        }
	        if (teardown === this) {
	            return this;
	        }
	        var subscription = teardown;
	        switch (typeof teardown) {
	            case 'function':
	                subscription = new Subscription(teardown);
	            case 'object':
	                if (subscription.closed || typeof subscription.unsubscribe !== 'function') {
	                    return subscription;
	                }
	                else if (this.closed) {
	                    subscription.unsubscribe();
	                    return subscription;
	                }
	                else if (typeof subscription._addParent !== 'function' /* quack quack */) {
	                    var tmp = subscription;
	                    subscription = new Subscription();
	                    subscription._subscriptions = [tmp];
	                }
	                break;
	            default:
	                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
	        }
	        var subscriptions = this._subscriptions || (this._subscriptions = []);
	        subscriptions.push(subscription);
	        subscription._addParent(this);
	        return subscription;
	    };
	    /**
	     * Removes a Subscription from the internal list of subscriptions that will
	     * unsubscribe during the unsubscribe process of this Subscription.
	     * @param {Subscription} subscription The subscription to remove.
	     * @return {void}
	     */
	    Subscription.prototype.remove = function (subscription) {
	        var subscriptions = this._subscriptions;
	        if (subscriptions) {
	            var subscriptionIndex = subscriptions.indexOf(subscription);
	            if (subscriptionIndex !== -1) {
	                subscriptions.splice(subscriptionIndex, 1);
	            }
	        }
	    };
	    Subscription.prototype._addParent = function (parent) {
	        var _a = this, _parent = _a._parent, _parents = _a._parents;
	        if (!_parent || _parent === parent) {
	            // If we don't have a parent, or the new parent is the same as the
	            // current parent, then set this._parent to the new parent.
	            this._parent = parent;
	        }
	        else if (!_parents) {
	            // If there's already one parent, but not multiple, allocate an Array to
	            // store the rest of the parent Subscriptions.
	            this._parents = [parent];
	        }
	        else if (_parents.indexOf(parent) === -1) {
	            // Only add the new parent to the _parents list if it's not already there.
	            _parents.push(parent);
	        }
	    };
	    Subscription.EMPTY = (function (empty) {
	        empty.closed = true;
	        return empty;
	    }(new Subscription()));
	    return Subscription;
	}());
	exports.Subscription = Subscription;
	function flattenUnsubscriptionErrors(errors) {
	    return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError_1.UnsubscriptionError) ? err.errors : err); }, []);
	}
	//# sourceMappingURL=Subscription.js.map

/***/ },

/***/ 18:
/***/ function(module, exports) {

	"use strict";
	var MessageType;
	(function (MessageType) {
	    MessageType[MessageType["Initialize"] = 0] = "Initialize";
	    MessageType[MessageType["FrameworkLoaded"] = 1] = "FrameworkLoaded";
	    MessageType[MessageType["Ping"] = 2] = "Ping";
	    MessageType[MessageType["NotNgApp"] = 3] = "NotNgApp";
	    MessageType[MessageType["Response"] = 4] = "Response";
	    MessageType[MessageType["ApplicationError"] = 5] = "ApplicationError";
	    MessageType[MessageType["SendUncaughtError"] = 6] = "SendUncaughtError";
	    MessageType[MessageType["DispatchWrapper"] = 7] = "DispatchWrapper";
	    MessageType[MessageType["Push"] = 8] = "Push";
	    MessageType[MessageType["NgVersion"] = 9] = "NgVersion";
	    MessageType[MessageType["CompleteTree"] = 10] = "CompleteTree";
	    MessageType[MessageType["TreeDiff"] = 11] = "TreeDiff";
	    MessageType[MessageType["NgModules"] = 12] = "NgModules";
	    MessageType[MessageType["RouterTree"] = 13] = "RouterTree";
	    MessageType[MessageType["SelectComponent"] = 14] = "SelectComponent";
	    MessageType[MessageType["UpdateProperty"] = 15] = "UpdateProperty";
	    MessageType[MessageType["UpdateProviderProperty"] = 16] = "UpdateProviderProperty";
	    MessageType[MessageType["EmitValue"] = 17] = "EmitValue";
	    MessageType[MessageType["Highlight"] = 18] = "Highlight";
	    MessageType[MessageType["FindElement"] = 19] = "FindElement";
	    MessageType[MessageType["GoogleTagManagerSend"] = 20] = "GoogleTagManagerSend";
	})(MessageType = exports.MessageType || (exports.MessageType = {}));


/***/ },

/***/ 22:
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";
	/**
	 * window: browser in DOM main thread
	 * self: browser in WebWorker
	 * global: Node.js/other
	 */
	exports.root = (typeof window == 'object' && window.window === window && window
	    || typeof self == 'object' && self.self === self && self
	    || typeof global == 'object' && global.global === global && global);
	if (!exports.root) {
	    throw new Error('RxJS could not find any global context (window, self, global)');
	}
	//# sourceMappingURL=root.js.map
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },

/***/ 23:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(54));
	__export(__webpack_require__(55));
	__export(__webpack_require__(30));
	__export(__webpack_require__(83));
	__export(__webpack_require__(39));
	__export(__webpack_require__(18));


/***/ },

/***/ 25:
/***/ function(module, exports) {

	"use strict";
	// typeof any so that it we don't have to cast when comparing a result to the error object
	exports.errorObject = { e: {} };
	//# sourceMappingURL=errorObject.js.map

/***/ },

/***/ 26:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// int64-buffer.js
	
	/*jshint -W018 */ // Confusing use of '!'.
	/*jshint -W030 */ // Expected an assignment or function call and instead saw an expression.
	/*jshint -W093 */ // Did you mean to return a conditional instead of an assignment?
	
	var Uint64BE, Int64BE, Uint64LE, Int64LE;
	
	!function(exports) {
	  // constants
	
	  var UNDEFINED = "undefined";
	  var BUFFER = (UNDEFINED !== typeof Buffer) && Buffer;
	  var UINT8ARRAY = (UNDEFINED !== typeof Uint8Array) && Uint8Array;
	  var ARRAYBUFFER = (UNDEFINED !== typeof ArrayBuffer) && ArrayBuffer;
	  var ZERO = [0, 0, 0, 0, 0, 0, 0, 0];
	  var isArray = Array.isArray || _isArray;
	  var BIT32 = 4294967296;
	  var BIT24 = 16777216;
	
	  // storage class
	
	  var storage; // Array;
	
	  // generate classes
	
	  Uint64BE = factory("Uint64BE", true, true);
	  Int64BE = factory("Int64BE", true, false);
	  Uint64LE = factory("Uint64LE", false, true);
	  Int64LE = factory("Int64LE", false, false);
	
	  // class factory
	
	  function factory(name, bigendian, unsigned) {
	    var posH = bigendian ? 0 : 4;
	    var posL = bigendian ? 4 : 0;
	    var pos0 = bigendian ? 0 : 3;
	    var pos1 = bigendian ? 1 : 2;
	    var pos2 = bigendian ? 2 : 1;
	    var pos3 = bigendian ? 3 : 0;
	    var fromPositive = bigendian ? fromPositiveBE : fromPositiveLE;
	    var fromNegative = bigendian ? fromNegativeBE : fromNegativeLE;
	    var proto = Int64.prototype;
	    var isName = "is" + name;
	    var _isInt64 = "_" + isName;
	
	    // properties
	    proto.buffer = void 0;
	    proto.offset = 0;
	    proto[_isInt64] = true;
	
	    // methods
	    proto.toNumber = toNumber;
	    proto.toString = toString;
	    proto.toJSON = toNumber;
	    proto.toArray = toArray;
	
	    // add .toBuffer() method only when Buffer available
	    if (BUFFER) proto.toBuffer = toBuffer;
	
	    // add .toArrayBuffer() method only when Uint8Array available
	    if (UINT8ARRAY) proto.toArrayBuffer = toArrayBuffer;
	
	    // isUint64BE, isInt64BE
	    Int64[isName] = isInt64;
	
	    // CommonJS
	    exports[name] = Int64;
	
	    return Int64;
	
	    // constructor
	    function Int64(buffer, offset, value, raddix) {
	      if (!(this instanceof Int64)) return new Int64(buffer, offset, value, raddix);
	      return init(this, buffer, offset, value, raddix);
	    }
	
	    // isUint64BE, isInt64BE
	    function isInt64(b) {
	      return !!(b && b[_isInt64]);
	    }
	
	    // initializer
	    function init(that, buffer, offset, value, raddix) {
	      if (UINT8ARRAY && ARRAYBUFFER) {
	        if (buffer instanceof ARRAYBUFFER) buffer = new UINT8ARRAY(buffer);
	        if (value instanceof ARRAYBUFFER) value = new UINT8ARRAY(value);
	      }
	
	      // Int64BE() style
	      if (!buffer && !offset && !value && !storage) {
	        // shortcut to initialize with zero
	        that.buffer = newArray(ZERO, 0);
	        return;
	      }
	
	      // Int64BE(value, raddix) style
	      if (!isValidBuffer(buffer, offset)) {
	        var _storage = storage || Array;
	        raddix = offset;
	        value = buffer;
	        offset = 0;
	        buffer = new _storage(8);
	      }
	
	      that.buffer = buffer;
	      that.offset = offset |= 0;
	
	      // Int64BE(buffer, offset) style
	      if (UNDEFINED === typeof value) return;
	
	      // Int64BE(buffer, offset, value, raddix) style
	      if ("string" === typeof value) {
	        fromString(buffer, offset, value, raddix || 10);
	      } else if (isValidBuffer(value, raddix)) {
	        fromArray(buffer, offset, value, raddix);
	      } else if ("number" === typeof raddix) {
	        writeInt32(buffer, offset + posH, value); // high
	        writeInt32(buffer, offset + posL, raddix); // low
	      } else if (value > 0) {
	        fromPositive(buffer, offset, value); // positive
	      } else if (value < 0) {
	        fromNegative(buffer, offset, value); // negative
	      } else {
	        fromArray(buffer, offset, ZERO, 0); // zero, NaN and others
	      }
	    }
	
	    function fromString(buffer, offset, str, raddix) {
	      var pos = 0;
	      var len = str.length;
	      var high = 0;
	      var low = 0;
	      if (str[0] === "-") pos++;
	      var sign = pos;
	      while (pos < len) {
	        var chr = parseInt(str[pos++], raddix);
	        if (!(chr >= 0)) break; // NaN
	        low = low * raddix + chr;
	        high = high * raddix + Math.floor(low / BIT32);
	        low %= BIT32;
	      }
	      if (sign) {
	        high = ~high;
	        if (low) {
	          low = BIT32 - low;
	        } else {
	          high++;
	        }
	      }
	      writeInt32(buffer, offset + posH, high);
	      writeInt32(buffer, offset + posL, low);
	    }
	
	    function toNumber() {
	      var buffer = this.buffer;
	      var offset = this.offset;
	      var high = readInt32(buffer, offset + posH);
	      var low = readInt32(buffer, offset + posL);
	      if (!unsigned) high |= 0; // a trick to get signed
	      return high ? (high * BIT32 + low) : low;
	    }
	
	    function toString(radix) {
	      var buffer = this.buffer;
	      var offset = this.offset;
	      var high = readInt32(buffer, offset + posH);
	      var low = readInt32(buffer, offset + posL);
	      var str = "";
	      var sign = !unsigned && (high & 0x80000000);
	      if (sign) {
	        high = ~high;
	        low = BIT32 - low;
	      }
	      radix = radix || 10;
	      while (1) {
	        var mod = (high % radix) * BIT32 + low;
	        high = Math.floor(high / radix);
	        low = Math.floor(mod / radix);
	        str = (mod % radix).toString(radix) + str;
	        if (!high && !low) break;
	      }
	      if (sign) {
	        str = "-" + str;
	      }
	      return str;
	    }
	
	    function writeInt32(buffer, offset, value) {
	      buffer[offset + pos3] = value & 255;
	      value = value >> 8;
	      buffer[offset + pos2] = value & 255;
	      value = value >> 8;
	      buffer[offset + pos1] = value & 255;
	      value = value >> 8;
	      buffer[offset + pos0] = value & 255;
	    }
	
	    function readInt32(buffer, offset) {
	      return (buffer[offset + pos0] * BIT24) +
	        (buffer[offset + pos1] << 16) +
	        (buffer[offset + pos2] << 8) +
	        buffer[offset + pos3];
	    }
	  }
	
	  function toArray(raw) {
	    var buffer = this.buffer;
	    var offset = this.offset;
	    storage = null; // Array
	    if (raw !== false && offset === 0 && buffer.length === 8 && isArray(buffer)) return buffer;
	    return newArray(buffer, offset);
	  }
	
	  function toBuffer(raw) {
	    var buffer = this.buffer;
	    var offset = this.offset;
	    storage = BUFFER;
	    if (raw !== false && offset === 0 && buffer.length === 8 && Buffer.isBuffer(buffer)) return buffer;
	    var dest = new BUFFER(8);
	    fromArray(dest, 0, buffer, offset);
	    return dest;
	  }
	
	  function toArrayBuffer(raw) {
	    var buffer = this.buffer;
	    var offset = this.offset;
	    var arrbuf = buffer.buffer;
	    storage = UINT8ARRAY;
	    if (raw !== false && offset === 0 && (arrbuf instanceof ARRAYBUFFER) && arrbuf.byteLength === 8) return arrbuf;
	    var dest = new UINT8ARRAY(8);
	    fromArray(dest, 0, buffer, offset);
	    return dest.buffer;
	  }
	
	  function isValidBuffer(buffer, offset) {
	    var len = buffer && buffer.length;
	    offset |= 0;
	    return len && (offset + 8 <= len) && ("string" !== typeof buffer[offset]);
	  }
	
	  function fromArray(destbuf, destoff, srcbuf, srcoff) {
	    destoff |= 0;
	    srcoff |= 0;
	    for (var i = 0; i < 8; i++) {
	      destbuf[destoff++] = srcbuf[srcoff++] & 255;
	    }
	  }
	
	  function newArray(buffer, offset) {
	    return Array.prototype.slice.call(buffer, offset, offset + 8);
	  }
	
	  function fromPositiveBE(buffer, offset, value) {
	    var pos = offset + 8;
	    while (pos > offset) {
	      buffer[--pos] = value & 255;
	      value /= 256;
	    }
	  }
	
	  function fromNegativeBE(buffer, offset, value) {
	    var pos = offset + 8;
	    value++;
	    while (pos > offset) {
	      buffer[--pos] = ((-value) & 255) ^ 255;
	      value /= 256;
	    }
	  }
	
	  function fromPositiveLE(buffer, offset, value) {
	    var end = offset + 8;
	    while (offset < end) {
	      buffer[offset++] = value & 255;
	      value /= 256;
	    }
	  }
	
	  function fromNegativeLE(buffer, offset, value) {
	    var end = offset + 8;
	    value++;
	    while (offset < end) {
	      buffer[offset++] = ((-value) & 255) ^ 255;
	      value /= 256;
	    }
	  }
	
	  // https://github.com/retrofox/is-array
	  function _isArray(val) {
	    return !!val && "[object Array]" == Object.prototype.toString.call(val);
	  }
	
	}(typeof exports === 'object' && typeof exports.nodeName !== 'string' ? exports : (this || {}));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8).Buffer))

/***/ },

/***/ 27:
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },

/***/ 28:
/***/ function(module, exports, __webpack_require__) {

	// util.js
	
	var Int64Buffer = __webpack_require__(26);
	var Uint64BE = Int64Buffer.Uint64BE;
	var Int64BE = Int64Buffer.Int64BE;
	
	var MAXBUFLEN = 8192;
	
	exports.writeString = writeString;
	exports.readString = readString;
	exports.byteLength = byteLength;
	exports.copy = copy;
	exports.writeUint64BE = writeUint64BE;
	exports.writeInt64BE = writeInt64BE;
	
	// new Buffer(string, "utf-8") is SLOWER then below
	
	function writeString(string, start) {
	  var buffer = this;
	  var index = start || 0;
	  var length = string.length;
	  // JavaScript's string uses UTF-16 surrogate pairs for characters other than BMP.
	  // This encodes string as CESU-8 which never reaches 4 octets per character.
	  for (var i = 0; i < length; i++) {
	    var chr = string.charCodeAt(i);
	    if (chr < 0x80) {
	      buffer[index++] = chr;
	    } else if (chr < 0x800) {
	      buffer[index++] = 0xC0 | (chr >> 6);
	      buffer[index++] = 0x80 | (chr & 0x3F);
	    } else {
	      buffer[index++] = 0xE0 | (chr >> 12);
	      buffer[index++] = 0x80 | ((chr >> 6) & 0x3F);
	      buffer[index++] = 0x80 | (chr & 0x3F);
	    }
	  }
	  return index - start;
	}
	
	// Buffer.ptototype.toString is 2x FASTER then below
	// https://github.com/feross/buffer may throw "Maximum call stack size exceeded." at String.fromCharCode.apply.
	
	function readString(start, end) {
	  var buffer = this;
	  var index = start - 0 || 0;
	  if (!end) end = buffer.length;
	  var size = end - start;
	  if (size > MAXBUFLEN) size = MAXBUFLEN;
	  var out = [];
	  for (; index < end;) {
	    var array = new Array(size);
	    for (var pos = 0; pos < size && index < end;) {
	      var chr = buffer[index++];
	      chr = (chr < 0x80) ? chr :
	        (chr < 0xE0) ? (((chr & 0x3F) << 6) | (buffer[index++] & 0x3F)) :
	          (((chr & 0x3F) << 12) | ((buffer[index++] & 0x3F) << 6) | ((buffer[index++] & 0x3F)));
	      array[pos++] = chr;
	    }
	    if (pos < size) array = array.slice(0, pos);
	    out.push(String.fromCharCode.apply("", array));
	  }
	  return (out.length > 1) ? out.join("") : out.length ? out.shift() : "";
	}
	
	// Buffer.byteLength is FASTER than below
	
	function byteLength(string) {
	  var length = 0 | 0;
	  Array.prototype.forEach.call(string, function(chr) {
	    var code = chr.charCodeAt(0);
	    length += (code < 0x80) ? 1 : (code < 0x800) ? 2 : 3;
	  });
	  return length;
	}
	
	// https://github.com/feross/buffer lacks descending copying feature
	
	function copy(target, targetStart, start, end) {
	  var i;
	  if (!start) start = 0;
	  if (!end && end !== 0) end = this.length;
	  if (!targetStart) targetStart = 0;
	  var len = end - start;
	
	  if (target === this && start < targetStart && targetStart < end) {
	    // descending
	    for (i = len - 1; i >= 0; i--) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else {
	    // ascending
	    for (i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start];
	    }
	  }
	
	  return len;
	}
	
	function writeUint64BE(value, offset) {
	  new Uint64BE(this, offset, value);
	}
	
	function writeInt64BE(value, offset) {
	  new Int64BE(this, offset, value);
	}


/***/ },

/***/ 29:
/***/ function(module, exports, __webpack_require__) {

	// codec.js
	
	exports.codec = {
	  preset: __webpack_require__(50).createCodec({preset: true})
	};


/***/ },

/***/ 30:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var message_type_1 = __webpack_require__(18);
	var utils_1 = __webpack_require__(16);
	var Serialize;
	(function (Serialize) {
	    Serialize[Serialize["None"] = 0] = "None";
	    Serialize[Serialize["Binary"] = 1] = "Binary";
	    Serialize[Serialize["Recreator"] = 2] = "Recreator";
	})(Serialize = exports.Serialize || (exports.Serialize = {}));
	exports.messageSource = 'AUGURY_INSPECTED_APPLICATION';
	exports.checkSource = function (message) { return message.messageSource === exports.messageSource; };
	exports.testResponse = function (request, response) {
	    return exports.checkSource(response)
	        && response.messageResponseId === request.messageId
	        && response.messageType === message_type_1.MessageType.Response;
	};
	exports.deserializeMessage = function (message) {
	    switch (message.serialize) {
	        case Serialize.Binary:
	            message.content = utils_1.deserializeBinary(message.content);
	            break;
	        case Serialize.Recreator:
	            message.content = utils_1.deserialize(message.content);
	            break;
	        case Serialize.None:
	            break;
	        default:
	            throw new Error("Unknown serialization type: " + message.serialize);
	    }
	    message.serialize = Serialize.None;
	};
	exports.serializeMessage = function (message) {
	    switch (message.serialize) {
	        case Serialize.None:
	            message.content = utils_1.serializeBinary(message.content);
	            message.serialize = Serialize.Binary;
	        default:
	            break;
	    }
	};


/***/ },

/***/ 32:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var errorObject_1 = __webpack_require__(25);
	var tryCatchTarget;
	function tryCatcher() {
	    try {
	        return tryCatchTarget.apply(this, arguments);
	    }
	    catch (e) {
	        errorObject_1.errorObject.e = e;
	        return errorObject_1.errorObject;
	    }
	}
	function tryCatch(fn) {
	    tryCatchTarget = fn;
	    return tryCatcher;
	}
	exports.tryCatch = tryCatch;
	;
	//# sourceMappingURL=tryCatch.js.map

/***/ },

/***/ 36:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var AsyncAction_1 = __webpack_require__(108);
	var AsyncScheduler_1 = __webpack_require__(109);
	/**
	 *
	 * Async Scheduler
	 *
	 * <span class="informal">Schedule task as if you used setTimeout(task, duration)</span>
	 *
	 * `async` scheduler schedules tasks asynchronously, by putting them on the JavaScript
	 * event loop queue. It is best used to delay tasks in time or to schedule tasks repeating
	 * in intervals.
	 *
	 * If you just want to "defer" task, that is to perform it right after currently
	 * executing synchronous code ends (commonly achieved by `setTimeout(deferredTask, 0)`),
	 * better choice will be the {@link asap} scheduler.
	 *
	 * @example <caption>Use async scheduler to delay task</caption>
	 * const task = () => console.log('it works!');
	 *
	 * Rx.Scheduler.async.schedule(task, 2000);
	 *
	 * // After 2 seconds logs:
	 * // "it works!"
	 *
	 *
	 * @example <caption>Use async scheduler to repeat task in intervals</caption>
	 * function task(state) {
	 *   console.log(state);
	 *   this.schedule(state + 1, 1000); // `this` references currently executing Action,
	 *                                   // which we reschedule with new state and delay
	 * }
	 *
	 * Rx.Scheduler.async.schedule(task, 3000, 0);
	 *
	 * // Logs:
	 * // 0 after 3s
	 * // 1 after 4s
	 * // 2 after 5s
	 * // 3 after 6s
	 *
	 * @static true
	 * @name async
	 * @owner Scheduler
	 */
	exports.async = new AsyncScheduler_1.AsyncScheduler(AsyncAction_1.AsyncAction);
	//# sourceMappingURL=async.js.map

/***/ },

/***/ 39:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var message_1 = __webpack_require__(30);
	var message_type_1 = __webpack_require__(18);
	var application_error_1 = __webpack_require__(54);
	var hash_1 = __webpack_require__(55);
	var path_1 = __webpack_require__(41);
	var utils_1 = __webpack_require__(16);
	var create = function (properties) {
	    return Object.assign({
	        messageSource: message_1.messageSource,
	        messageId: hash_1.getRandomHash(),
	        serialize: message_1.Serialize.None,
	    }, properties);
	};
	var MessageFactory = (function () {
	    function MessageFactory() {
	    }
	    MessageFactory.initialize = function (options) {
	        return create({
	            messageType: message_type_1.MessageType.Initialize,
	            content: options,
	        });
	    };
	    MessageFactory.frameworkLoaded = function () {
	        return create({
	            messageType: message_type_1.MessageType.FrameworkLoaded,
	        });
	    };
	    MessageFactory.ping = function () {
	        return create({
	            messageType: message_type_1.MessageType.Ping,
	        });
	    };
	    MessageFactory.notNgApp = function () {
	        return create({
	            messageType: message_type_1.MessageType.NotNgApp,
	        });
	    };
	    MessageFactory.push = function () {
	        return create({
	            messageType: message_type_1.MessageType.Push,
	        });
	    };
	    MessageFactory.ngVersion = function (ngVersion) {
	        return create({
	            messageType: message_type_1.MessageType.NgVersion,
	            content: ngVersion,
	        });
	    };
	    MessageFactory.completeTree = function (tree) {
	        return create({
	            messageType: message_type_1.MessageType.CompleteTree,
	            content: tree.roots,
	            serialize: message_1.Serialize.None,
	        });
	    };
	    MessageFactory.treeDiff = function (changes) {
	        return create({
	            messageType: message_type_1.MessageType.TreeDiff,
	            content: changes,
	            serialize: message_1.Serialize.None,
	        });
	    };
	    MessageFactory.selectComponent = function (node, requestInstance) {
	        return create({
	            messageType: message_type_1.MessageType.SelectComponent,
	            content: {
	                path: path_1.deserializePath(node.id),
	                requestInstance: requestInstance
	            }
	        });
	    };
	    MessageFactory.updateProperty = function (path, newValue) {
	        return create({
	            messageType: message_type_1.MessageType.UpdateProperty,
	            content: {
	                path: path,
	                newValue: newValue,
	            },
	        });
	    };
	    MessageFactory.updateProviderProperty = function (path, token, propertyPath, newValue) {
	        return create({
	            messageType: message_type_1.MessageType.UpdateProviderProperty,
	            content: {
	                path: path,
	                token: token,
	                propertyPath: propertyPath,
	                newValue: newValue,
	            },
	        });
	    };
	    MessageFactory.emitValue = function (path, value) {
	        return create({
	            messageType: message_type_1.MessageType.EmitValue,
	            content: {
	                path: path,
	                value: value
	            }
	        });
	    };
	    MessageFactory.ngModules = function (content) {
	        return create({
	            messageType: message_type_1.MessageType.NgModules,
	            content: content,
	        });
	    };
	    MessageFactory.routerTree = function (content) {
	        return create({
	            messageType: message_type_1.MessageType.RouterTree,
	            content: content,
	        });
	    };
	    MessageFactory.highlight = function (nodes) {
	        return create({
	            messageType: message_type_1.MessageType.Highlight,
	            content: {
	                nodes: nodes.map(function (n) { return n.id; }),
	            },
	        });
	    };
	    MessageFactory.findDOMElement = function () {
	        return create({
	            messageType: message_type_1.MessageType.FindElement,
	            content: {
	                start: true
	            }
	        });
	    };
	    MessageFactory.foundDOMElement = function (node) {
	        return create({
	            messageType: message_type_1.MessageType.FindElement,
	            content: {
	                node: node,
	                stop: true
	            },
	        });
	    };
	    MessageFactory.analyticsEvent = function (event, desc) {
	        return create({
	            messageType: message_type_1.MessageType.GoogleTagManagerSend,
	            content: {
	                event: event,
	                desc: desc
	            }
	        });
	    };
	    MessageFactory.applicationError = function (error) {
	        return create({
	            messageType: message_type_1.MessageType.ApplicationError,
	            content: error,
	        });
	    };
	    MessageFactory.uncaughtApplicationError = function (error) {
	        return create({
	            messageType: message_type_1.MessageType.ApplicationError,
	            content: new application_error_1.ApplicationError(application_error_1.ApplicationErrorType.UncaughtException, error),
	        });
	    };
	    MessageFactory.sendUncaughtError = function (error, ngVersion) {
	        return create({
	            messageType: message_type_1.MessageType.SendUncaughtError,
	            content: {
	                error: error,
	                ngVersion: ngVersion,
	            },
	        });
	    };
	    MessageFactory.dispatchWrapper = function (message) {
	        return create({
	            messageType: message_type_1.MessageType.DispatchWrapper,
	            content: message,
	        });
	    };
	    MessageFactory.response = function (message, response, serializeResponse) {
	        var prepare = function () {
	            if (serializeResponse) {
	                return utils_1.serialize(response);
	            }
	            return response;
	        };
	        var prepareError = function (r) { return ({ name: r.name, message: r.message, stack: r.stack }); };
	        var serialization = serializeResponse
	            ? message_1.Serialize.Recreator
	            : message_1.Serialize.None;
	        return create({
	            messageType: message_type_1.MessageType.Response,
	            messageId: null,
	            messageSource: message.messageSource,
	            messageResponseId: message.messageId,
	            serialize: serialization,
	            content: response instanceof Error ? null : prepare(),
	            error: response instanceof Error ? prepareError(response) : null
	        });
	    };
	    return MessageFactory;
	}());
	exports.MessageFactory = MessageFactory;


/***/ },

/***/ 40:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(282));
	__export(__webpack_require__(41));
	__export(__webpack_require__(158));


/***/ },

/***/ 41:
/***/ function(module, exports) {

	"use strict";
	exports.serializePath = function (path) {
	    return path.join(' ');
	};
	var numberOrString = function (segment) {
	    var v = parseInt(segment, 10);
	    if (isNaN(v)) {
	        return segment;
	    }
	    return v;
	};
	exports.deserializePath = function (path) {
	    return path.split(/ /).map(numberOrString);
	};
	exports.deserializeChangePath = function (path) {
	    return path.split(/\/| /).map(numberOrString);
	};


/***/ },

/***/ 42:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * event-lite.js - Light-weight EventEmitter (less than 1KB when gzipped)
	 *
	 * @copyright Yusuke Kawasaki
	 * @license MIT
	 * @constructor
	 * @see https://github.com/kawanet/event-lite
	 * @see http://kawanet.github.io/event-lite/EventLite.html
	 * @example
	 * var EventLite = require("event-lite");
	 *
	 * function MyClass() {...}             // your class
	 *
	 * EventLite.mixin(MyClass.prototype);  // import event methods
	 *
	 * var obj = new MyClass();
	 * obj.on("foo", function() {...});     // add event listener
	 * obj.once("bar", function() {...});   // add one-time event listener
	 * obj.emit("foo");                     // dispatch event
	 * obj.emit("bar");                     // dispatch another event
	 * obj.off("foo");                      // remove event listener
	 */
	
	function EventLite() {
	  if (!(this instanceof EventLite)) return new EventLite();
	}
	
	(function(EventLite) {
	  // export the class for node.js
	  if (true) module.exports = EventLite;
	
	  // property name to hold listeners
	  var LISTENERS = "listeners";
	
	  // methods to export
	  var methods = {
	    on: on,
	    once: once,
	    off: off,
	    emit: emit
	  };
	
	  // mixin to self
	  mixin(EventLite.prototype);
	
	  // export mixin function
	  EventLite.mixin = mixin;
	
	  /**
	   * Import on(), once(), off() and emit() methods into target object.
	   *
	   * @function EventLite.mixin
	   * @param target {Prototype}
	   */
	
	  function mixin(target) {
	    for (var key in methods) {
	      target[key] = methods[key];
	    }
	    return target;
	  }
	
	  /**
	   * Add an event listener.
	   *
	   * @function EventLite.prototype.on
	   * @param type {string}
	   * @param func {Function}
	   * @returns {EventLite} Self for method chaining
	   */
	
	  function on(type, func) {
	    getListeners(this, type).push(func);
	    return this;
	  }
	
	  /**
	   * Add one-time event listener.
	   *
	   * @function EventLite.prototype.once
	   * @param type {string}
	   * @param func {Function}
	   * @returns {EventLite} Self for method chaining
	   */
	
	  function once(type, func) {
	    var that = this;
	    wrap.originalListener = func;
	    getListeners(that, type).push(wrap);
	    return that;
	
	    function wrap() {
	      off.call(that, type, wrap);
	      func.apply(this, arguments);
	    }
	  }
	
	  /**
	   * Remove an event listener.
	   *
	   * @function EventLite.prototype.off
	   * @param [type] {string}
	   * @param [func] {Function}
	   * @returns {EventLite} Self for method chaining
	   */
	
	  function off(type, func) {
	    var that = this;
	    var listners;
	    if (!arguments.length) {
	      delete that[LISTENERS];
	    } else if (!func) {
	      listners = that[LISTENERS];
	      if (listners) {
	        delete listners[type];
	        if (!Object.keys(listners).length) return off.call(that);
	      }
	    } else {
	      listners = getListeners(that, type, true);
	      if (listners) {
	        listners = listners.filter(ne);
	        if (!listners.length) return off.call(that, type);
	        that[LISTENERS][type] = listners;
	      }
	    }
	    return that;
	
	    function ne(test) {
	      return test !== func && test.originalListener !== func;
	    }
	  }
	
	  /**
	   * Dispatch (trigger) an event.
	   *
	   * @function EventLite.prototype.emit
	   * @param type {string}
	   * @param [value] {*}
	   * @returns {boolean} True when a listener received the event
	   */
	
	  function emit(type, value) {
	    var that = this;
	    var listeners = getListeners(that, type, true);
	    if (!listeners) return false;
	    var arglen = arguments.length;
	    if (arglen === 1) {
	      listeners.forEach(zeroarg);
	    } else if (arglen === 2) {
	      listeners.forEach(onearg);
	    } else {
	      var args = Array.prototype.slice.call(arguments, 1);
	      listeners.forEach(moreargs);
	    }
	    return !!listeners.length;
	
	    function zeroarg(func) {
	      func.call(that);
	    }
	
	    function onearg(func) {
	      func.call(that, value);
	    }
	
	    function moreargs(func) {
	      func.apply(that, args);
	    }
	  }
	
	  /**
	   * @ignore
	   */
	
	  function getListeners(that, type, readonly) {
	    if (readonly && !that[LISTENERS]) return;
	    var listeners = that[LISTENERS] || (that[LISTENERS] = {});
	    return listeners[type] || (listeners[type] = []);
	  }
	
	})(EventLite);


/***/ },

/***/ 43:
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]
	
	  i += d
	
	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}
	
	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0
	
	  value = Math.abs(value)
	
	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }
	
	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }
	
	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}
	
	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}
	
	  buffer[offset + i - d] |= s * 128
	}


/***/ },

/***/ 44:
/***/ function(module, exports) {

	// buffer-shortage.js
	
	exports.BufferShortageError = BufferShortageError;
	
	BufferShortageError.prototype = Error.prototype;
	
	function BufferShortageError() {
	}


/***/ },

/***/ 45:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// decode-buffer.js
	
	exports.DecodeBuffer = DecodeBuffer;
	
	var preset = __webpack_require__(29).codec.preset;
	
	var BufferShortageError = __webpack_require__(44).BufferShortageError;
	
	function DecodeBuffer(options) {
	  if (!(this instanceof DecodeBuffer)) return new DecodeBuffer(options);
	
	  if (options) {
	    this.options = options;
	    if (options.codec) {
	      this.codec = options.codec;
	    }
	  }
	}
	
	DecodeBuffer.prototype.offset = 0;
	
	DecodeBuffer.prototype.push = function(chunk) {
	  var buffers = this.buffers || (this.buffers = []);
	  buffers.push(chunk);
	};
	
	DecodeBuffer.prototype.codec = preset;
	
	DecodeBuffer.prototype.write = function(chunk) {
	  var prev = this.offset ? this.buffer.slice(this.offset) : this.buffer;
	  this.buffer = prev ? (chunk ? Buffer.concat([prev, chunk]) : prev) : chunk;
	  this.offset = 0;
	};
	
	DecodeBuffer.prototype.read = function() {
	  var length = this.buffers && this.buffers.length;
	
	  // fetch the first result
	  if (!length) return this.fetch();
	
	  // flush current buffer
	  this.flush();
	
	  // read from the results
	  return this.pull();
	};
	
	DecodeBuffer.prototype.pull = function() {
	  var buffers = this.buffers || (this.buffers = []);
	  return buffers.shift();
	};
	
	DecodeBuffer.prototype.fetch = function() {
	  return this.codec.decode(this);
	};
	
	DecodeBuffer.prototype.flush = function() {
	  while (this.offset < this.buffer.length) {
	    var start = this.offset;
	    var value;
	    try {
	      value = this.fetch();
	    } catch (e) {
	      if (!(e instanceof BufferShortageError)) throw e;
	      // rollback
	      this.offset = start;
	      break;
	    }
	    this.push(value);
	  }
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8).Buffer))

/***/ },

/***/ 46:
/***/ function(module, exports, __webpack_require__) {

	// decode.js
	
	exports.decode = decode;
	
	var DecodeBuffer = __webpack_require__(45).DecodeBuffer;
	
	function decode(input, options) {
	  var decoder = new DecodeBuffer(options);
	  decoder.write(input);
	  return decoder.read();
	}

/***/ },

/***/ 47:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// encode-buffer.js
	
	exports.EncodeBuffer = EncodeBuffer;
	
	var preset = __webpack_require__(29).codec.preset;
	
	var MIN_BUFFER_SIZE = 2048;
	var MAX_BUFFER_SIZE = 65536;
	
	function EncodeBuffer(options) {
	  if (!(this instanceof EncodeBuffer)) return new EncodeBuffer(options);
	
	  if (options) {
	    this.options = options;
	    if (options.codec) {
	      this.codec = options.codec;
	    }
	  }
	}
	
	EncodeBuffer.prototype.offset = 0;
	EncodeBuffer.prototype.start = 0;
	
	EncodeBuffer.prototype.push = function(chunk) {
	  var buffers = this.buffers || (this.buffers = []);
	  buffers.push(chunk);
	};
	
	EncodeBuffer.prototype.codec = preset;
	
	EncodeBuffer.prototype.write = function(input) {
	  this.codec.encode(this, input);
	};
	
	EncodeBuffer.prototype.read = function() {
	  var length = this.buffers && this.buffers.length;
	
	  // fetch the first result
	  if (!length) return this.fetch();
	
	  // flush current buffer
	  this.flush();
	
	  // read from the results
	  return this.pull();
	};
	
	EncodeBuffer.prototype.pull = function() {
	  var buffers = this.buffers || (this.buffers = []);
	  var chunk = buffers.length > 1 ? Buffer.concat(buffers) : buffers[0];
	  buffers.length = 0; // buffer exhausted
	  return chunk;
	};
	
	EncodeBuffer.prototype.fetch = function() {
	  var start = this.start;
	  if (start < this.offset) {
	    this.start = this.offset;
	    return this.buffer.slice(start, this.offset);
	  }
	};
	
	EncodeBuffer.prototype.flush = function() {
	  var buffer = this.fetch();
	  if (buffer) this.push(buffer);
	};
	
	EncodeBuffer.prototype.reserve = function(length) {
	  if (this.buffer) {
	    var size = this.buffer.length;
	
	    // is it long enough?
	    if (this.offset + length < size) return;
	
	    // flush current buffer
	    this.flush();
	
	    // resize it to 2x current length
	    length = Math.max(length, Math.min(size * 2, MAX_BUFFER_SIZE));
	  }
	
	  // minimum buffer size
	  length = length > MIN_BUFFER_SIZE ? length : MIN_BUFFER_SIZE;
	
	  // allocate new buffer
	  this.buffer = new Buffer(length);
	  this.start = 0;
	  this.offset = 0;
	};
	
	EncodeBuffer.prototype.send = function(buffer) {
	  var end = this.offset + buffer.length;
	  if (this.buffer && end < this.buffer.length) {
	    buffer.copy(this.buffer, this.offset);
	    this.offset = end;
	  } else {
	    this.flush();
	    this.push(buffer);
	  }
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8).Buffer))

/***/ },

/***/ 48:
/***/ function(module, exports, __webpack_require__) {

	// encode.js
	
	exports.encode = encode;
	
	var EncodeBuffer = __webpack_require__(47).EncodeBuffer;
	
	function encode(input, options) {
	  var encoder = new EncodeBuffer(options);
	  encoder.write(input);
	  return encoder.read();
	}


/***/ },

/***/ 49:
/***/ function(module, exports) {

	// ext-buffer.js
	
	exports.ExtBuffer = ExtBuffer;
	
	function ExtBuffer(buffer, type) {
	  if (!(this instanceof ExtBuffer)) return new ExtBuffer(buffer, type);
	  this.buffer = buffer;
	  this.type = type;
	}


/***/ },

/***/ 50:
/***/ function(module, exports, __webpack_require__) {

	// ext.js
	
	var IS_ARRAY = __webpack_require__(27);
	
	exports.createCodec = createCodec;
	
	var ExtBuffer = __webpack_require__(49).ExtBuffer;
	var ExtPreset = __webpack_require__(92);
	var ReadCore = __webpack_require__(93);
	var WriteCore = __webpack_require__(95);
	
	function Codec(options) {
	  if (!(this instanceof Codec)) return new Codec(options);
	  this.extPackers = {};
	  this.extUnpackers = [];
	  this.encode = WriteCore.getEncoder(options);
	  this.decode = ReadCore.getDecoder(options);
	  if (options && options.preset) {
	    ExtPreset.setExtPreset(this);
	  }
	}
	
	function createCodec(options) {
	  return new Codec(options);
	}
	
	Codec.prototype.addExtPacker = function(etype, Class, packer) {
	  if (IS_ARRAY(packer)) {
	    packer = join(packer);
	  }
	  var name = Class.name;
	  if (name && name !== "Object") {
	    this.extPackers[name] = extPacker;
	  } else {
	    var list = this.extEncoderList || (this.extEncoderList = []);
	    list.unshift([Class, extPacker]);
	  }
	
	  function extPacker(value) {
	    var buffer = packer(value);
	    return new ExtBuffer(buffer, etype);
	  }
	};
	
	Codec.prototype.addExtUnpacker = function(etype, unpacker) {
	  this.extUnpackers[etype] = IS_ARRAY(unpacker) ? join(unpacker) : unpacker;
	};
	
	Codec.prototype.getExtPacker = function(value) {
	  var c = value.constructor;
	  var e = c && c.name && this.extPackers[c.name];
	  if (e) return e;
	  var list = this.extEncoderList;
	  if (!list) return;
	  var len = list.length;
	  for (var i = 0; i < len; i++) {
	    var pair = list[i];
	    if (c === pair[0]) return pair[1];
	  }
	};
	
	Codec.prototype.getExtUnpacker = function(type) {
	  return this.extUnpackers[type] || extUnpacker;
	
	  function extUnpacker(buffer) {
	    return new ExtBuffer(buffer, type);
	  }
	};
	
	function join(filters) {
	  filters = filters.slice();
	
	  return function(value) {
	    return filters.reduce(iterator, value);
	  };
	
	  function iterator(value, filter) {
	    return filter(value);
	  }
	}


/***/ },

/***/ 51:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// read-format.js
	
	var ieee754 = __webpack_require__(43);
	var Int64Buffer = __webpack_require__(26);
	var Uint64BE = Int64Buffer.Uint64BE;
	var Int64BE = Int64Buffer.Int64BE;
	
	exports.getReadFormat = getReadFormat;
	exports.readUint8 = uint8;
	
	var BufferLite = __webpack_require__(28);
	var BufferShortageError = __webpack_require__(44).BufferShortageError;
	
	var IS_BUFFER_SHIM = ("TYPED_ARRAY_SUPPORT" in Buffer);
	var NO_ASSERT = true;
	
	function getReadFormat(options) {
	  var readFormat = {
	    map: map,
	    array: array,
	    str: str,
	    bin: bin,
	    ext: ext,
	    uint8: uint8,
	    uint16: uint16,
	    uint32: read(4, Buffer.prototype.readUInt32BE),
	    uint64: read(8, readUInt64BE),
	    int8: read(1, Buffer.prototype.readInt8),
	    int16: read(2, Buffer.prototype.readInt16BE),
	    int32: read(4, Buffer.prototype.readInt32BE),
	    int64: read(8, readInt64BE),
	    float32: read(4, readFloatBE),
	    float64: read(8, readDoubleBE)
	  };
	
	  if (options && options.int64) {
	    readFormat.uint64 = read(8, readUInt64BE_int64);
	    readFormat.int64 = read(8, readInt64BE_int64);
	  }
	
	  return readFormat;
	}
	
	function map(decoder, len) {
	  var value = {};
	  var i;
	  var k = new Array(len);
	  var v = new Array(len);
	
	  var decode = decoder.codec.decode;
	  for (i = 0; i < len; i++) {
	    k[i] = decode(decoder);
	    v[i] = decode(decoder);
	  }
	  for (i = 0; i < len; i++) {
	    value[k[i]] = v[i];
	  }
	  return value;
	}
	
	function array(decoder, len) {
	  var value = new Array(len);
	  var decode = decoder.codec.decode;
	  for (var i = 0; i < len; i++) {
	    value[i] = decode(decoder);
	  }
	  return value;
	}
	
	function str(decoder, len) {
	  var start = decoder.offset;
	  var end = decoder.offset = start + len;
	  var buffer = decoder.buffer;
	  if (end > buffer.length) throw new BufferShortageError();
	  if (IS_BUFFER_SHIM || !Buffer.isBuffer(buffer)) {
	    // slower (compat)
	    return BufferLite.readString.call(buffer, start, end);
	  } else {
	    // 2x faster
	    return buffer.toString("utf-8", start, end);
	  }
	}
	
	function bin(decoder, len) {
	  var start = decoder.offset;
	  var end = decoder.offset = start + len;
	  if (end > decoder.buffer.length) throw new BufferShortageError();
	  return slice.call(decoder.buffer, start, end);
	}
	
	function ext(decoder, len) {
	  var start = decoder.offset;
	  var end = decoder.offset = start + len + 1;
	  if (end > decoder.buffer.length) throw new BufferShortageError();
	  var type = decoder.buffer[start];
	  var unpack = decoder.codec.getExtUnpacker(type);
	  if (!unpack) throw new Error("Invalid ext type: " + (type ? ("0x" + type.toString(16)) : type));
	  var buf = slice.call(decoder.buffer, start + 1, end);
	  return unpack(buf);
	}
	
	function uint8(decoder) {
	  var buffer = decoder.buffer;
	  if (decoder.offset >= buffer.length) throw new BufferShortageError();
	  return buffer[decoder.offset++];
	}
	
	function uint16(decoder) {
	  var buffer = decoder.buffer;
	  if (decoder.offset + 2 > buffer.length) throw new BufferShortageError();
	  return (buffer[decoder.offset++] << 8) | buffer[decoder.offset++];
	}
	
	function read(len, method) {
	  return function(decoder) {
	    var start = decoder.offset;
	    var end = decoder.offset = start + len;
	    if (end > decoder.buffer.length) throw new BufferShortageError();
	    return method.call(decoder.buffer, start, NO_ASSERT);
	  };
	}
	
	function readUInt64BE(start) {
	  return new Uint64BE(this, start).toNumber();
	}
	
	function readInt64BE(start) {
	  return new Int64BE(this, start).toNumber();
	}
	
	function readUInt64BE_int64(start) {
	  return new Uint64BE(this, start);
	}
	
	function readInt64BE_int64(start) {
	  return new Int64BE(this, start);
	}
	
	function readFloatBE(start) {
	  if (this.readFloatBE) return this.readFloatBE(start);
	  return ieee754.read(this, start, false, 23, 4);
	}
	
	function readDoubleBE(start) {
	  if (this.readDoubleBE) return this.readDoubleBE(start);
	  return ieee754.read(this, start, false, 52, 8);
	}
	
	function slice(start, end) {
	  var f = this.slice || Array.prototype.slice;
	  var buf = f.call(this, start, end);
	  if (!Buffer.isBuffer(buf)) buf = Buffer(buf);
	  return buf;
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8).Buffer))

/***/ },

/***/ 52:
/***/ function(module, exports) {

	// write-unit8.js
	
	var constant = exports.uint8 = new Array(256);
	
	for (var i = 0x00; i <= 0xFF; i++) {
	  constant[i] = write0(i);
	}
	
	function write0(type) {
	  return function(encoder) {
	    encoder.reserve(1);
	    encoder.buffer[encoder.offset++] = type;
	  };
	}


/***/ },

/***/ 54:
/***/ function(module, exports) {

	"use strict";
	var ApplicationErrorType;
	(function (ApplicationErrorType) {
	    ApplicationErrorType[ApplicationErrorType["None"] = 0] = "None";
	    ApplicationErrorType[ApplicationErrorType["ProductionMode"] = 1] = "ProductionMode";
	    ApplicationErrorType[ApplicationErrorType["NotNgApp"] = 2] = "NotNgApp";
	    ApplicationErrorType[ApplicationErrorType["UncaughtException"] = 3] = "UncaughtException";
	})(ApplicationErrorType = exports.ApplicationErrorType || (exports.ApplicationErrorType = {}));
	var ApplicationError = (function () {
	    function ApplicationError(errorType, error, details, stack) {
	        this.errorType = errorType;
	        this.error = error;
	        this.details = details || error ? error.message : null;
	        this.stackTrace = stack || error ? error.stack : new Error().stack;
	    }
	    return ApplicationError;
	}());
	exports.ApplicationError = ApplicationError;


/***/ },

/***/ 55:
/***/ function(module, exports) {

	"use strict";
	exports.getRandomHash = function () { return Math.random().toString(16).slice(2); };


/***/ },

/***/ 56:
/***/ function(module, exports) {

	"use strict";
	exports.functionName = function (fn) {
	    var extract = function (value) { return value.match(/^function ([^\(]*)\(/); };
	    var name = fn.name;
	    if (name == null || name.length === 0) {
	        var match = extract(fn.toString());
	        if (match != null && match.length > 1) {
	            return match[1];
	        }
	        return fn.toString();
	    }
	    return name;
	};


/***/ },

/***/ 57:
/***/ function(module, exports) {

	"use strict";
	exports.isScalar = function (value) {
	    switch (typeof value) {
	        case 'string':
	        case 'number':
	        case 'boolean':
	        case 'function':
	        case 'undefined':
	            return true;
	        default:
	            return false;
	    }
	};


/***/ },

/***/ 73:
/***/ function(module, exports) {

	"use strict";
	exports.isArray = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });
	//# sourceMappingURL=isArray.js.map

/***/ },

/***/ 74:
/***/ function(module, exports) {

	"use strict";
	exports.highlightTime = 1000;


/***/ },

/***/ 83:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var message_1 = __webpack_require__(30);
	var message_factory_1 = __webpack_require__(39);
	var message_type_1 = __webpack_require__(18);
	var subscriptions = new Set();
	var dispatchers = new Set();
	exports.browserSubscribeDispatch = function (handler) {
	    dispatchers.add(handler);
	    return {
	        unsubscribe: function () { return dispatchers.delete(handler); }
	    };
	};
	exports.browserSubscribe = function (handler) {
	    subscriptions.add(handler);
	    return {
	        unsubscribe: function () { return subscriptions.delete(handler); }
	    };
	};
	exports.browserSubscribeOnce = function (messageType, handler) {
	    var messageHandler = function (message) {
	        if (message.messageType === messageType) {
	            try {
	                message_1.deserializeMessage(message);
	                return handler(message);
	            }
	            finally {
	                subscription.unsubscribe();
	            }
	        }
	    };
	    var subscription = exports.browserSubscribe(messageHandler);
	};
	exports.browserSubscribeResponse = function (messageId, handler) {
	    var messageHandler = function (response) {
	        if (response.messageType === message_type_1.MessageType.Response &&
	            response.messageResponseId === messageId) {
	            try {
	                message_1.deserializeMessage(response);
	                return handler(response);
	            }
	            finally {
	                subscription.unsubscribe();
	            }
	        }
	    };
	    var subscription = exports.browserSubscribe(messageHandler);
	};
	exports.browserUnsubscribe = function (handler) {
	    return subscriptions.delete(handler);
	};
	exports.messageJumpContext = function (message) {
	    window.postMessage(message, '*');
	};
	exports.browserDispatch = function (message) {
	    if (message_1.checkSource(message) === false) {
	        return;
	    }
	    if (message.messageType === message_type_1.MessageType.DispatchWrapper) {
	        dispatchers.forEach(function (handler) { return handler(message); });
	    }
	    else if (message.messageType !== message_type_1.MessageType.Response) {
	        var dispatchResult_1;
	        subscriptions.forEach(function (handler) {
	            if (dispatchResult_1 == null) {
	                dispatchResult_1 = handler(message);
	            }
	            else {
	                handler(message);
	            }
	        });
	        if (dispatchResult_1 !== undefined) {
	            var response = message_factory_1.MessageFactory.dispatchWrapper(message_factory_1.MessageFactory.response(message, dispatchResult_1, false));
	            exports.messageJumpContext(response);
	        }
	    }
	    else {
	        subscriptions.forEach(function (handler) { return handler(message); });
	    }
	};
	window.addEventListener('message', function (event) {
	    if (event.source === window) {
	        exports.browserDispatch(event.data);
	    }
	});


/***/ },

/***/ 84:
/***/ function(module, exports) {

	'use strict'
	
	exports.byteLength = byteLength
	exports.toByteArray = toByteArray
	exports.fromByteArray = fromByteArray
	
	var lookup = []
	var revLookup = []
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array
	
	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	for (var i = 0, len = code.length; i < len; ++i) {
	  lookup[i] = code[i]
	  revLookup[code.charCodeAt(i)] = i
	}
	
	revLookup['-'.charCodeAt(0)] = 62
	revLookup['_'.charCodeAt(0)] = 63
	
	function placeHoldersCount (b64) {
	  var len = b64.length
	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }
	
	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
	}
	
	function byteLength (b64) {
	  // base64 is 4/3 + up to two characters of the original data
	  return b64.length * 3 / 4 - placeHoldersCount(b64)
	}
	
	function toByteArray (b64) {
	  var i, j, l, tmp, placeHolders, arr
	  var len = b64.length
	  placeHolders = placeHoldersCount(b64)
	
	  arr = new Arr(len * 3 / 4 - placeHolders)
	
	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len
	
	  var L = 0
	
	  for (i = 0, j = 0; i < l; i += 4, j += 3) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
	    arr[L++] = (tmp >> 16) & 0xFF
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }
	
	  if (placeHolders === 2) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
	    arr[L++] = tmp & 0xFF
	  } else if (placeHolders === 1) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }
	
	  return arr
	}
	
	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
	}
	
	function encodeChunk (uint8, start, end) {
	  var tmp
	  var output = []
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
	    output.push(tripletToBase64(tmp))
	  }
	  return output.join('')
	}
	
	function fromByteArray (uint8) {
	  var tmp
	  var len = uint8.length
	  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
	  var output = ''
	  var parts = []
	  var maxChunkLength = 16383 // must be multiple of 3
	
	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
	  }
	
	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1]
	    output += lookup[tmp >> 2]
	    output += lookup[(tmp << 4) & 0x3F]
	    output += '=='
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
	    output += lookup[tmp >> 10]
	    output += lookup[(tmp >> 4) & 0x3F]
	    output += lookup[(tmp << 2) & 0x3F]
	    output += '='
	  }
	
	  parts.push(output)
	
	  return parts.join('')
	}


/***/ },

/***/ 89:
/***/ function(module, exports, __webpack_require__) {

	// browser.js
	
	exports.encode = __webpack_require__(48).encode;
	exports.decode = __webpack_require__(46).decode;
	
	exports.Encoder = __webpack_require__(91).Encoder;
	exports.Decoder = __webpack_require__(90).Decoder;
	
	exports.createCodec = __webpack_require__(50).createCodec;
	exports.codec = __webpack_require__(29).codec;


/***/ },

/***/ 90:
/***/ function(module, exports, __webpack_require__) {

	// decoder.js
	
	exports.Decoder = Decoder;
	
	var EventLite = __webpack_require__(42);
	var DecodeBuffer = __webpack_require__(45).DecodeBuffer;
	
	function Decoder(options) {
	  if (!(this instanceof Decoder)) return new Decoder(options);
	  DecodeBuffer.call(this, options);
	}
	
	Decoder.prototype = new DecodeBuffer();
	
	EventLite.mixin(Decoder.prototype);
	
	Decoder.prototype.decode = function(chunk) {
	  if (arguments.length) this.write(chunk);
	  this.flush();
	};
	
	Decoder.prototype.push = function(chunk) {
	  this.emit("data", chunk);
	};
	
	Decoder.prototype.end = function(chunk) {
	  this.decode(chunk);
	  this.emit("end");
	};


/***/ },

/***/ 91:
/***/ function(module, exports, __webpack_require__) {

	// encoder.js
	
	exports.Encoder = Encoder;
	
	var EventLite = __webpack_require__(42);
	var EncodeBuffer = __webpack_require__(47).EncodeBuffer;
	
	function Encoder(options) {
	  if (!(this instanceof Encoder)) return new Encoder(options);
	  EncodeBuffer.call(this, options);
	}
	
	Encoder.prototype = new EncodeBuffer();
	
	EventLite.mixin(Encoder.prototype);
	
	Encoder.prototype.encode = function(chunk) {
	  this.write(chunk);
	  this.emit("data", this.read());
	};
	
	Encoder.prototype.end = function(chunk) {
	  if (arguments.length) this.encode(chunk);
	  this.flush();
	  this.emit("end");
	};


/***/ },

/***/ 92:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// ext-preset.js
	
	exports.setExtPreset = setExtPreset;
	
	var _encode, _decode;
	var hasUint8Array = ("undefined" !== typeof Uint8Array);
	var hasFloat64Array = ("undefined" !== typeof Float64Array);
	var hasUint8ClampedArray = ("undefined" !== typeof Uint8ClampedArray);
	
	var ERROR_COLUMNS = {name: 1, message: 1, stack: 1, columnNumber: 1, fileName: 1, lineNumber: 1};
	
	function setExtPreset(codec) {
	  setExtPackers(codec);
	  setExtUnpackers(codec);
	}
	
	function setExtPackers(preset) {
	  preset.addExtPacker(0x0E, Error, [packError, encode]);
	  preset.addExtPacker(0x01, EvalError, [packError, encode]);
	  preset.addExtPacker(0x02, RangeError, [packError, encode]);
	  preset.addExtPacker(0x03, ReferenceError, [packError, encode]);
	  preset.addExtPacker(0x04, SyntaxError, [packError, encode]);
	  preset.addExtPacker(0x05, TypeError, [packError, encode]);
	  preset.addExtPacker(0x06, URIError, [packError, encode]);
	
	  preset.addExtPacker(0x0A, RegExp, [packRegExp, encode]);
	  preset.addExtPacker(0x0B, Boolean, [packValueOf, encode]);
	  preset.addExtPacker(0x0C, String, [packValueOf, encode]);
	  preset.addExtPacker(0x0D, Date, [Number, encode]);
	  preset.addExtPacker(0x0F, Number, [packValueOf, encode]);
	
	  if (hasUint8Array) {
	    preset.addExtPacker(0x11, Int8Array, packBuffer);
	    preset.addExtPacker(0x12, Uint8Array, packBuffer);
	    preset.addExtPacker(0x13, Int16Array, packTypedArray);
	    preset.addExtPacker(0x14, Uint16Array, packTypedArray);
	    preset.addExtPacker(0x15, Int32Array, packTypedArray);
	    preset.addExtPacker(0x16, Uint32Array, packTypedArray);
	    preset.addExtPacker(0x17, Float32Array, packTypedArray);
	
	    if (hasFloat64Array) {
	      // PhantomJS/1.9.7 doesn't have Float64Array
	      preset.addExtPacker(0x18, Float64Array, packTypedArray);
	    }
	
	    if (hasUint8ClampedArray) {
	      // IE10 doesn't have Uint8ClampedArray
	      preset.addExtPacker(0x19, Uint8ClampedArray, packBuffer);
	      preset.addExtUnpacker(0x19, unpackClass(Uint8ClampedArray));
	    }
	
	    preset.addExtPacker(0x1A, ArrayBuffer, packArrayBuffer);
	    preset.addExtPacker(0x1D, DataView, packTypedArray);
	    preset.addExtUnpacker(0x1A, unpackArrayBuffer);
	    preset.addExtUnpacker(0x1D, [unpackArrayBuffer, unpackClass(DataView)]);
	  }
	}
	
	function setExtUnpackers(preset) {
	  preset.addExtPacker(0x0E, Error, [packError, encode]);
	  preset.addExtPacker(0x01, EvalError, [packError, encode]);
	  preset.addExtPacker(0x02, RangeError, [packError, encode]);
	  preset.addExtPacker(0x03, ReferenceError, [packError, encode]);
	  preset.addExtPacker(0x04, SyntaxError, [packError, encode]);
	  preset.addExtPacker(0x05, TypeError, [packError, encode]);
	  preset.addExtPacker(0x06, URIError, [packError, encode]);
	
	  preset.addExtUnpacker(0x0E, [decode, unpackError(Error)]);
	  preset.addExtUnpacker(0x01, [decode, unpackError(EvalError)]);
	  preset.addExtUnpacker(0x02, [decode, unpackError(RangeError)]);
	  preset.addExtUnpacker(0x03, [decode, unpackError(ReferenceError)]);
	  preset.addExtUnpacker(0x04, [decode, unpackError(SyntaxError)]);
	  preset.addExtUnpacker(0x05, [decode, unpackError(TypeError)]);
	  preset.addExtUnpacker(0x06, [decode, unpackError(URIError)]);
	
	  preset.addExtPacker(0x0A, RegExp, [packRegExp, encode]);
	  preset.addExtPacker(0x0B, Boolean, [packValueOf, encode]);
	  preset.addExtPacker(0x0C, String, [packValueOf, encode]);
	  preset.addExtPacker(0x0D, Date, [Number, encode]);
	  preset.addExtPacker(0x0F, Number, [packValueOf, encode]);
	
	  preset.addExtUnpacker(0x0A, [decode, unpackRegExp]);
	  preset.addExtUnpacker(0x0B, [decode, unpackClass(Boolean)]);
	  preset.addExtUnpacker(0x0C, [decode, unpackClass(String)]);
	  preset.addExtUnpacker(0x0D, [decode, unpackClass(Date)]);
	  preset.addExtUnpacker(0x0F, [decode, unpackClass(Number)]);
	
	  if (hasUint8Array) {
	    preset.addExtPacker(0x11, Int8Array, packBuffer);
	    preset.addExtPacker(0x12, Uint8Array, packBuffer);
	    preset.addExtPacker(0x13, Int16Array, packTypedArray);
	    preset.addExtPacker(0x14, Uint16Array, packTypedArray);
	    preset.addExtPacker(0x15, Int32Array, packTypedArray);
	    preset.addExtPacker(0x16, Uint32Array, packTypedArray);
	    preset.addExtPacker(0x17, Float32Array, packTypedArray);
	
	    preset.addExtUnpacker(0x11, unpackClass(Int8Array));
	    preset.addExtUnpacker(0x12, unpackClass(Uint8Array));
	    preset.addExtUnpacker(0x13, [unpackArrayBuffer, unpackClass(Int16Array)]);
	    preset.addExtUnpacker(0x14, [unpackArrayBuffer, unpackClass(Uint16Array)]);
	    preset.addExtUnpacker(0x15, [unpackArrayBuffer, unpackClass(Int32Array)]);
	    preset.addExtUnpacker(0x16, [unpackArrayBuffer, unpackClass(Uint32Array)]);
	    preset.addExtUnpacker(0x17, [unpackArrayBuffer, unpackClass(Float32Array)]);
	
	    if (hasFloat64Array) {
	      // PhantomJS/1.9.7 doesn't have Float64Array
	      preset.addExtPacker(0x18, Float64Array, packTypedArray);
	      preset.addExtUnpacker(0x18, [unpackArrayBuffer, unpackClass(Float64Array)]);
	    }
	
	    if (hasUint8ClampedArray) {
	      // IE10 doesn't have Uint8ClampedArray
	      preset.addExtPacker(0x19, Uint8ClampedArray, packBuffer);
	      preset.addExtUnpacker(0x19, unpackClass(Uint8ClampedArray));
	    }
	
	    preset.addExtPacker(0x1A, ArrayBuffer, packArrayBuffer);
	    preset.addExtPacker(0x1D, DataView, packTypedArray);
	    preset.addExtUnpacker(0x1A, unpackArrayBuffer);
	    preset.addExtUnpacker(0x1D, [unpackArrayBuffer, unpackClass(DataView)]);
	  }
	}
	
	function encode(input) {
	  if (!_encode) _encode = __webpack_require__(48).encode; // lazy load
	  return _encode(input);
	}
	
	function decode(input) {
	  if (!_decode) _decode = __webpack_require__(46).decode; // lazy load
	  return _decode(input);
	}
	
	function packBuffer(value) {
	  return new Buffer(value);
	}
	
	function packValueOf(value) {
	  return (value).valueOf();
	}
	
	function packRegExp(value) {
	  value = RegExp.prototype.toString.call(value).split("/");
	  value.shift();
	  var out = [value.pop()];
	  out.unshift(value.join("/"));
	  return out;
	}
	
	function unpackRegExp(value) {
	  return RegExp.apply(null, value);
	}
	
	function packError(value) {
	  var out = {};
	  for (var key in ERROR_COLUMNS) {
	    out[key] = value[key];
	  }
	  return out;
	}
	
	function unpackError(Class) {
	  return function(value) {
	    var out = new Class();
	    for (var key in ERROR_COLUMNS) {
	      out[key] = value[key];
	    }
	    return out;
	  };
	}
	
	function unpackClass(Class) {
	  return function(value) {
	    return new Class(value);
	  };
	}
	
	function packTypedArray(value) {
	  return new Buffer(new Uint8Array(value.buffer));
	}
	
	function packArrayBuffer(value) {
	  return new Buffer(new Uint8Array(value));
	}
	
	function unpackArrayBuffer(value) {
	  return (new Uint8Array(value)).buffer;
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8).Buffer))

/***/ },

/***/ 93:
/***/ function(module, exports, __webpack_require__) {

	// read-core.js
	
	exports.getDecoder = getDecoder;
	
	var readUint8 = __webpack_require__(51).readUint8;
	var ReadToken = __webpack_require__(94);
	
	function getDecoder(options) {
	  var readToken = ReadToken.getReadToken(options);
	  return decode;
	
	  function decode(decoder) {
	    var type = readUint8(decoder);
	    var func = readToken[type];
	    if (!func) throw new Error("Invalid type: " + (type ? ("0x" + type.toString(16)) : type));
	    return func(decoder);
	  }
	}


/***/ },

/***/ 94:
/***/ function(module, exports, __webpack_require__) {

	// read-token.js
	
	var ReadFormat = __webpack_require__(51);
	
	exports.getReadToken = getReadToken;
	
	function getReadToken(options) {
	  var format = ReadFormat.getReadFormat(options);
	
	  if (options && options.useraw) {
	    return init_useraw(format);
	  } else {
	    return init_token(format);
	  }
	}
	
	function init_token(format) {
	  var i;
	  var token = new Array(256);
	
	  // positive fixint -- 0x00 - 0x7f
	  for (i = 0x00; i <= 0x7f; i++) {
	    token[i] = constant(i);
	  }
	
	  // fixmap -- 0x80 - 0x8f
	  for (i = 0x80; i <= 0x8f; i++) {
	    token[i] = fix(i - 0x80, format.map);
	  }
	
	  // fixarray -- 0x90 - 0x9f
	  for (i = 0x90; i <= 0x9f; i++) {
	    token[i] = fix(i - 0x90, format.array);
	  }
	
	  // fixstr -- 0xa0 - 0xbf
	  for (i = 0xa0; i <= 0xbf; i++) {
	    token[i] = fix(i - 0xa0, format.str);
	  }
	
	  // nil -- 0xc0
	  token[0xc0] = constant(null);
	
	  // (never used) -- 0xc1
	  token[0xc1] = null;
	
	  // false -- 0xc2
	  // true -- 0xc3
	  token[0xc2] = constant(false);
	  token[0xc3] = constant(true);
	
	  // bin 8 -- 0xc4
	  // bin 16 -- 0xc5
	  // bin 32 -- 0xc6
	  token[0xc4] = flex(format.uint8, format.bin);
	  token[0xc5] = flex(format.uint16, format.bin);
	  token[0xc6] = flex(format.uint32, format.bin);
	
	  // ext 8 -- 0xc7
	  // ext 16 -- 0xc8
	  // ext 32 -- 0xc9
	  token[0xc7] = flex(format.uint8, format.ext);
	  token[0xc8] = flex(format.uint16, format.ext);
	  token[0xc9] = flex(format.uint32, format.ext);
	
	  // float 32 -- 0xca
	  // float 64 -- 0xcb
	  token[0xca] = format.float32;
	  token[0xcb] = format.float64;
	
	  // uint 8 -- 0xcc
	  // uint 16 -- 0xcd
	  // uint 32 -- 0xce
	  // uint 64 -- 0xcf
	  token[0xcc] = format.uint8;
	  token[0xcd] = format.uint16;
	  token[0xce] = format.uint32;
	  token[0xcf] = format.uint64;
	
	  // int 8 -- 0xd0
	  // int 16 -- 0xd1
	  // int 32 -- 0xd2
	  // int 64 -- 0xd3
	  token[0xd0] = format.int8;
	  token[0xd1] = format.int16;
	  token[0xd2] = format.int32;
	  token[0xd3] = format.int64;
	
	  // fixext 1 -- 0xd4
	  // fixext 2 -- 0xd5
	  // fixext 4 -- 0xd6
	  // fixext 8 -- 0xd7
	  // fixext 16 -- 0xd8
	  token[0xd4] = fix(1, format.ext);
	  token[0xd5] = fix(2, format.ext);
	  token[0xd6] = fix(4, format.ext);
	  token[0xd7] = fix(8, format.ext);
	  token[0xd8] = fix(16, format.ext);
	
	  // str 8 -- 0xd9
	  // str 16 -- 0xda
	  // str 32 -- 0xdb
	  token[0xd9] = flex(format.uint8, format.str);
	  token[0xda] = flex(format.uint16, format.str);
	  token[0xdb] = flex(format.uint32, format.str);
	
	  // array 16 -- 0xdc
	  // array 32 -- 0xdd
	  token[0xdc] = flex(format.uint16, format.array);
	  token[0xdd] = flex(format.uint32, format.array);
	
	  // map 16 -- 0xde
	  // map 32 -- 0xdf
	  token[0xde] = flex(format.uint16, format.map);
	  token[0xdf] = flex(format.uint32, format.map);
	
	  // negative fixint -- 0xe0 - 0xff
	  for (i = 0xe0; i <= 0xff; i++) {
	    token[i] = constant(i - 0x100);
	  }
	
	  return token;
	}
	
	function init_useraw(format) {
	  var i;
	  var token = getReadToken(format).slice();
	
	  // raw 8 -- 0xd9
	  // raw 16 -- 0xda
	  // raw 32 -- 0xdb
	  token[0xd9] = token[0xc4];
	  token[0xda] = token[0xc5];
	  token[0xdb] = token[0xc6];
	
	  // fixraw -- 0xa0 - 0xbf
	  for (i = 0xa0; i <= 0xbf; i++) {
	    token[i] = fix(i - 0xa0, format.bin);
	  }
	
	  return token;
	}
	
	function constant(value) {
	  return function() {
	    return value;
	  };
	}
	
	function flex(lenFunc, decodeFunc) {
	  return function(decoder) {
	    var len = lenFunc(decoder);
	    return decodeFunc(decoder, len);
	  };
	}
	
	function fix(len, method) {
	  return function(decoder) {
	    return method(decoder, len);
	  };
	}


/***/ },

/***/ 95:
/***/ function(module, exports, __webpack_require__) {

	// write-core.js
	
	exports.getEncoder = getEncoder;
	
	var WriteType = __webpack_require__(97);
	
	function getEncoder(options) {
	  var writeType = WriteType.getWriteType(options);
	  return encode;
	
	  function encode(encoder, value) {
	    var func = writeType[typeof value];
	    if (!func) throw new Error("Unsupported type \"" + (typeof value) + "\": " + value);
	    func(encoder, value);
	  }
	}


/***/ },

/***/ 96:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// write-token.js
	
	var BufferLite = __webpack_require__(28);
	var uint8 = __webpack_require__(52).uint8;
	
	var IS_BUFFER_SHIM = ("TYPED_ARRAY_SUPPORT" in Buffer);
	var NO_TYPED_ARRAY = IS_BUFFER_SHIM && !Buffer.TYPED_ARRAY_SUPPORT;
	
	exports.getWriteToken = getWriteToken;
	
	function getWriteToken(options) {
	  if (NO_TYPED_ARRAY || (options && options.safe)) {
	    return init_safe();
	  } else {
	    return init_token();
	  }
	}
	
	// Node.js and browsers with TypedArray
	
	function init_token() {
	  // (immediate values)
	  // positive fixint -- 0x00 - 0x7f
	  // nil -- 0xc0
	  // false -- 0xc2
	  // true -- 0xc3
	  // negative fixint -- 0xe0 - 0xff
	  var token = uint8.slice();
	
	  // bin 8 -- 0xc4
	  // bin 16 -- 0xc5
	  // bin 32 -- 0xc6
	  token[0xc4] = write1(0xc4);
	  token[0xc5] = write2(0xc5);
	  token[0xc6] = write4(0xc6);
	
	  // ext 8 -- 0xc7
	  // ext 16 -- 0xc8
	  // ext 32 -- 0xc9
	  token[0xc7] = write1(0xc7);
	  token[0xc8] = write2(0xc8);
	  token[0xc9] = write4(0xc9);
	
	  // float 32 -- 0xca
	  // float 64 -- 0xcb
	  token[0xca] = writeN(0xca, 4, Buffer.prototype.writeFloatBE, true);
	  token[0xcb] = writeN(0xcb, 8, Buffer.prototype.writeDoubleBE, true);
	
	  // uint 8 -- 0xcc
	  // uint 16 -- 0xcd
	  // uint 32 -- 0xce
	  // uint 64 -- 0xcf
	  token[0xcc] = write1(0xcc);
	  token[0xcd] = write2(0xcd);
	  token[0xce] = write4(0xce);
	  token[0xcf] = writeN(0xcf, 8, BufferLite.writeUint64BE);
	
	  // int 8 -- 0xd0
	  // int 16 -- 0xd1
	  // int 32 -- 0xd2
	  // int 64 -- 0xd3
	  token[0xd0] = write1(0xd0);
	  token[0xd1] = write2(0xd1);
	  token[0xd2] = write4(0xd2);
	  token[0xd3] = writeN(0xd3, 8, BufferLite.writeUint64BE);
	
	  // str 8 -- 0xd9
	  // str 16 -- 0xda
	  // str 32 -- 0xdb
	  token[0xd9] = write1(0xd9);
	  token[0xda] = write2(0xda);
	  token[0xdb] = write4(0xdb);
	
	  // array 16 -- 0xdc
	  // array 32 -- 0xdd
	  token[0xdc] = write2(0xdc);
	  token[0xdd] = write4(0xdd);
	
	  // map 16 -- 0xde
	  // map 32 -- 0xdf
	  token[0xde] = write2(0xde);
	  token[0xdf] = write4(0xdf);
	
	  return token;
	}
	
	// safe mode: for old browsers and who needs asserts
	
	function init_safe() {
	  // (immediate values)
	  // positive fixint -- 0x00 - 0x7f
	  // nil -- 0xc0
	  // false -- 0xc2
	  // true -- 0xc3
	  // negative fixint -- 0xe0 - 0xff
	  var token = uint8.slice();
	
	  // bin 8 -- 0xc4
	  // bin 16 -- 0xc5
	  // bin 32 -- 0xc6
	  token[0xc4] = writeN(0xc4, 1, Buffer.prototype.writeUInt8);
	  token[0xc5] = writeN(0xc5, 2, Buffer.prototype.writeUInt16BE);
	  token[0xc6] = writeN(0xc6, 4, Buffer.prototype.writeUInt32BE);
	
	  // ext 8 -- 0xc7
	  // ext 16 -- 0xc8
	  // ext 32 -- 0xc9
	  token[0xc7] = writeN(0xc7, 1, Buffer.prototype.writeUInt8);
	  token[0xc8] = writeN(0xc8, 2, Buffer.prototype.writeUInt16BE);
	  token[0xc9] = writeN(0xc9, 4, Buffer.prototype.writeUInt32BE);
	
	  // float 32 -- 0xca
	  // float 64 -- 0xcb
	  token[0xca] = writeN(0xca, 4, Buffer.prototype.writeFloatBE);
	  token[0xcb] = writeN(0xcb, 8, Buffer.prototype.writeDoubleBE);
	
	  // uint 8 -- 0xcc
	  // uint 16 -- 0xcd
	  // uint 32 -- 0xce
	  // uint 64 -- 0xcf
	  token[0xcc] = writeN(0xcc, 1, Buffer.prototype.writeUInt8);
	  token[0xcd] = writeN(0xcd, 2, Buffer.prototype.writeUInt16BE);
	  token[0xce] = writeN(0xce, 4, Buffer.prototype.writeUInt32BE);
	  token[0xcf] = writeN(0xcf, 8, BufferLite.writeUint64BE);
	
	  // int 8 -- 0xd0
	  // int 16 -- 0xd1
	  // int 32 -- 0xd2
	  // int 64 -- 0xd3
	  token[0xd0] = writeN(0xd0, 1, Buffer.prototype.writeInt8);
	  token[0xd1] = writeN(0xd1, 2, Buffer.prototype.writeInt16BE);
	  token[0xd2] = writeN(0xd2, 4, Buffer.prototype.writeInt32BE);
	  token[0xd3] = writeN(0xd3, 8, BufferLite.writeUint64BE);
	
	  // str 8 -- 0xd9
	  // str 16 -- 0xda
	  // str 32 -- 0xdb
	  token[0xd9] = writeN(0xd9, 1, Buffer.prototype.writeUInt8);
	  token[0xda] = writeN(0xda, 2, Buffer.prototype.writeUInt16BE);
	  token[0xdb] = writeN(0xdb, 4, Buffer.prototype.writeUInt32BE);
	
	  // array 16 -- 0xdc
	  // array 32 -- 0xdd
	  token[0xdc] = writeN(0xdc, 2, Buffer.prototype.writeUInt16BE);
	  token[0xdd] = writeN(0xdd, 4, Buffer.prototype.writeUInt32BE);
	
	  // map 16 -- 0xde
	  // map 32 -- 0xdf
	  token[0xde] = writeN(0xde, 2, Buffer.prototype.writeUInt16BE);
	  token[0xdf] = writeN(0xdf, 4, Buffer.prototype.writeUInt32BE);
	
	  return token;
	}
	
	function write1(type) {
	  return function(encoder, value) {
	    encoder.reserve(2);
	    var buffer = encoder.buffer;
	    var offset = encoder.offset;
	    buffer[offset++] = type;
	    buffer[offset++] = value;
	    encoder.offset = offset;
	  };
	}
	
	function write2(type) {
	  return function(encoder, value) {
	    encoder.reserve(3);
	    var buffer = encoder.buffer;
	    var offset = encoder.offset;
	    buffer[offset++] = type;
	    buffer[offset++] = value >>> 8;
	    buffer[offset++] = value;
	    encoder.offset = offset;
	  };
	}
	
	function write4(type) {
	  return function(encoder, value) {
	    encoder.reserve(5);
	    var buffer = encoder.buffer;
	    var offset = encoder.offset;
	    buffer[offset++] = type;
	    buffer[offset++] = value >>> 24;
	    buffer[offset++] = value >>> 16;
	    buffer[offset++] = value >>> 8;
	    buffer[offset++] = value;
	    encoder.offset = offset;
	  };
	}
	
	function writeN(type, len, method, noAssert) {
	  return function(encoder, value) {
	    encoder.reserve(len + 1);
	    encoder.buffer[encoder.offset++] = type;
	    method.call(encoder.buffer, value, encoder.offset, noAssert);
	    encoder.offset += len;
	  };
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8).Buffer))

/***/ },

/***/ 97:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// write-type.js
	
	var IS_ARRAY = __webpack_require__(27);
	var Int64Buffer = __webpack_require__(26);
	var Uint64BE = Int64Buffer.Uint64BE;
	var Int64BE = Int64Buffer.Int64BE;
	
	var BufferLite = __webpack_require__(28);
	var WriteToken = __webpack_require__(96);
	var uint8 = __webpack_require__(52).uint8;
	var ExtBuffer = __webpack_require__(49).ExtBuffer;
	
	var IS_BUFFER_SHIM = ("TYPED_ARRAY_SUPPORT" in Buffer);
	
	var extmap = [];
	extmap[1] = 0xd4;
	extmap[2] = 0xd5;
	extmap[4] = 0xd6;
	extmap[8] = 0xd7;
	extmap[16] = 0xd8;
	
	exports.getWriteType = getWriteType;
	
	function getWriteType(options) {
	  var token = WriteToken.getWriteToken(options);
	
	  var writeType = {
	    "boolean": bool,
	    "function": nil,
	    "number": number,
	    "object": object,
	    "string": string,
	    "symbol": nil,
	    "undefined": nil
	  };
	
	  if (options && options.useraw) {
	    writeType.object = object_raw;
	    writeType.string = string_raw;
	  }
	
	  return writeType;
	
	  // false -- 0xc2
	  // true -- 0xc3
	  function bool(encoder, value) {
	    var type = value ? 0xc3 : 0xc2;
	    token[type](encoder, value);
	  }
	
	  function number(encoder, value) {
	    var ivalue = value | 0;
	    var type;
	    if (value !== ivalue) {
	      // float 64 -- 0xcb
	      type = 0xcb;
	      token[type](encoder, value);
	      return;
	    } else if (-0x20 <= ivalue && ivalue <= 0x7F) {
	      // positive fixint -- 0x00 - 0x7f
	      // negative fixint -- 0xe0 - 0xff
	      type = ivalue & 0xFF;
	    } else if (0 <= ivalue) {
	      // uint 8 -- 0xcc
	      // uint 16 -- 0xcd
	      // uint 32 -- 0xce
	      type = (ivalue <= 0xFF) ? 0xcc : (ivalue <= 0xFFFF) ? 0xcd : 0xce;
	    } else {
	      // int 8 -- 0xd0
	      // int 16 -- 0xd1
	      // int 32 -- 0xd2
	      type = (-0x80 <= ivalue) ? 0xd0 : (-0x8000 <= ivalue) ? 0xd1 : 0xd2;
	    }
	    token[type](encoder, ivalue);
	  }
	
	  // uint 64 -- 0xcf
	  function uint64(encoder, value) {
	    var type = 0xcf;
	    token[type](encoder, value.toArray());
	  }
	
	  // int 64 -- 0xd3
	  function int64(encoder, value) {
	    var type = 0xd3;
	    token[type](encoder, value.toArray());
	  }
	
	  // str 8 -- 0xd9
	  // str 16 -- 0xda
	  // str 32 -- 0xdb
	  // fixstr -- 0xa0 - 0xbf
	  function string(encoder, value) {
	    // prepare buffer
	    var length = value.length;
	    var maxsize = 5 + length * 3;
	    encoder.reserve(maxsize);
	
	    // expected header size
	    var expected = (length < 32) ? 1 : (length <= 0xFF) ? 2 : (length <= 0xFFFF) ? 3 : 5;
	
	    // expected start point
	    var start = encoder.offset + expected;
	
	    // write string
	    length = BufferLite.writeString.call(encoder.buffer, value, start);
	
	    // actual header size
	    var actual = (length < 32) ? 1 : (length <= 0xFF) ? 2 : (length <= 0xFFFF) ? 3 : 5;
	
	    // move content when needed
	    if (expected !== actual) move(encoder, start, length, actual - expected);
	
	    // write header
	    var type = (actual === 1) ? (0xa0 + length) : (actual <= 3) ? 0xd7 + actual : 0xdb;
	    token[type](encoder, length);
	
	    // move cursor
	    encoder.offset += length;
	  }
	
	  function object(encoder, value) {
	    // null
	    if (value === null) return nil(encoder, value);
	
	    // Buffer
	    if (Buffer.isBuffer(value)) return bin(encoder, value);
	
	    // Array
	    if (IS_ARRAY(value)) return array(encoder, value);
	
	    // int64-buffer objects
	    if (Uint64BE.isUint64BE(value)) return uint64(encoder, value);
	    if (Int64BE.isInt64BE(value)) return int64(encoder, value);
	
	    // ext formats
	    var packer = encoder.codec.getExtPacker(value);
	    if (packer) value = packer(value);
	    if (value instanceof ExtBuffer) return ext(encoder, value);
	
	    // plain old objects
	    map(encoder, value);
	  }
	
	  // nil -- 0xc0
	  function nil(encoder, value) {
	    var type = 0xc0;
	    token[type](encoder, value);
	  }
	
	  // fixarray -- 0x90 - 0x9f
	  // array 16 -- 0xdc
	  // array 32 -- 0xdd
	  function array(encoder, value) {
	    var length = value.length;
	    var type = (length < 16) ? (0x90 + length) : (length <= 0xFFFF) ? 0xdc : 0xdd;
	    token[type](encoder, length);
	
	    var encode = encoder.codec.encode;
	    for (var i = 0; i < length; i++) {
	      encode(encoder, value[i]);
	    }
	  }
	
	  // bin 8 -- 0xc4
	  // bin 16 -- 0xc5
	  // bin 32 -- 0xc6
	  function bin(encoder, value) {
	    var length = value.length;
	    var type = (length < 0xFF) ? 0xc4 : (length <= 0xFFFF) ? 0xc5 : 0xc6;
	    token[type](encoder, length);
	    encoder.send(value);
	  }
	
	  // fixext 1 -- 0xd4
	  // fixext 2 -- 0xd5
	  // fixext 4 -- 0xd6
	  // fixext 8 -- 0xd7
	  // fixext 16 -- 0xd8
	  // ext 8 -- 0xc7
	  // ext 16 -- 0xc8
	  // ext 32 -- 0xc9
	  function ext(encoder, value) {
	    var buffer = value.buffer;
	    var length = buffer.length;
	    var type = extmap[length] || ((length < 0xFF) ? 0xc7 : (length <= 0xFFFF) ? 0xc8 : 0xc9);
	    token[type](encoder, length);
	    uint8[value.type](encoder);
	    encoder.send(buffer);
	  }
	
	  // fixmap -- 0x80 - 0x8f
	  // map 16 -- 0xde
	  // map 32 -- 0xdf
	  function map(encoder, value) {
	    var keys = Object.keys(value);
	    var length = keys.length;
	    var type = (length < 16) ? (0x80 + length) : (length <= 0xFFFF) ? 0xde : 0xdf;
	    token[type](encoder, length);
	
	    var encode = encoder.codec.encode;
	    keys.forEach(function(key) {
	      encode(encoder, key);
	      encode(encoder, value[key]);
	    });
	  }
	
	  // raw 16 -- 0xda
	  // raw 32 -- 0xdb
	  // fixraw -- 0xa0 - 0xbf
	  function string_raw(encoder, value) {
	    // prepare buffer
	    var length = value.length;
	    var maxsize = 5 + length * 3;
	    encoder.reserve(maxsize);
	
	    // expected header size
	    var expected = (length < 32) ? 1 : (length <= 0xFFFF) ? 3 : 5;
	
	    // expected start point
	    var start = encoder.offset + expected;
	
	    // write string
	    length = BufferLite.writeString.call(encoder.buffer, value, start);
	
	    // actual header size
	    var actual = (length < 32) ? 1 : (length <= 0xFFFF) ? 3 : 5;
	
	    // move content when needed
	    if (expected !== actual) move(encoder, start, length, actual - expected);
	
	    // write header
	    var type = (length < 32) ? (0xa0 + length) : (length <= 0xFFFF) ? 0xda : 0xdb;
	    token[type](encoder, length);
	
	    // move cursor
	    encoder.offset += length;
	  }
	
	  // raw 16 -- 0xda
	  // raw 32 -- 0xdb
	  // fixraw -- 0xa0 - 0xbf
	  function object_raw(encoder, value) {
	    if (!Buffer.isBuffer(value)) return object(encoder, value);
	
	    var length = value.length;
	    var type = (length < 32) ? (0xa0 + length) : (length <= 0xFFFF) ? 0xda : 0xdb;
	    token[type](encoder, length);
	    encoder.send(value);
	  }
	}
	
	function move(encoder, start, length, diff) {
	  var targetStart = start + diff;
	  var end = start + length;
	  if (IS_BUFFER_SHIM) {
	    BufferLite.copy.call(encoder.buffer, encoder.buffer, targetStart, start, end);
	  } else {
	    encoder.buffer.copy(encoder.buffer, targetStart, start, end);
	  }
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8).Buffer))

/***/ },

/***/ 100:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var scalar_1 = __webpack_require__(57);
	exports.recurse = function (object, apply) {
	    var visited = new Set();
	    var visit = function (value) {
	        if (value == null ||
	            scalar_1.isScalar(value) ||
	            /Element/.test(Object.prototype.toString.call(value)) ||
	            value.top === window) {
	            return;
	        }
	        if (visited.has(value)) {
	            return;
	        }
	        visited.add(value);
	        apply(value);
	        if (Array.isArray(value) || value instanceof Set) {
	            value.forEach(function (v, k) { return visit(v); });
	        }
	        else if (value instanceof Map) {
	            value.forEach(function (v, k) { return visit(v); });
	        }
	        else {
	            Object.keys(value).forEach(function (k) { return visit(value[k]); });
	        }
	    };
	    visit(object);
	};


/***/ },

/***/ 101:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var msgpack = __webpack_require__(89);
	exports.serializeBinary = function (object) {
	    return msgpack.encode(object);
	};
	exports.deserializeBinary = function (buffer) {
	    return msgpack.decode(buffer);
	};


/***/ },

/***/ 102:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var function_name_1 = __webpack_require__(56);
	var Operation = (function () {
	    function Operation() {
	        this.arrays = new Array();
	        this.hashes = new Array();
	        this.objref = new Array();
	        this.sets = new Array();
	        this.maps = new Array();
	        this.visits = new Map();
	        this.tails = new Array();
	    }
	    return Operation;
	}());
	var serializer = function (object) {
	    switch (typeof object) {
	        case 'object':
	            if (object) {
	                break;
	            }
	        case 'string':
	        case 'number':
	        case 'boolean':
	        case 'undefined':
	            return JSON.stringify(object);
	        case 'function':
	            return object.toString();
	    }
	    var operation = new Operation();
	    map(operation, object);
	    while (operation.tails.length > 0) {
	        var run = operation.tails.length;
	        for (var index = 0; index < run; ++index) {
	            operation.tails[index]();
	        }
	        operation.tails.splice(0, run);
	    }
	    var encode = function (v) { return JSON.stringify(v); };
	    var mapString = function (link) {
	        var source = encode(link.source);
	        var key = link.key instanceof Reference ? "_[" + encode(link.key.target) + "]" : "" + link.key;
	        var v = link.target !== null ? "_[" + encode(link.target) + "]" : "" + link.value;
	        return "_[" + source + "].set(" + key + ", " + v + ");";
	    };
	    return "function() {\n    var _ = [" + operation.objref.join(',') + "];\n\n    " + operation.arrays.map(function (link) {
	        return "_[" + encode(link.source) + "][" + encode(link.key) + "] = _[" + encode(link.target) + "];";
	    }).join('') + "\n\n    " + operation.hashes.map(function (link) {
	        return "_[" + encode(link.source) + "][" + encode(link.key) + "] = _[" + encode(link.target) + "];";
	    }).join('') + "\n\n    " + operation.maps.map(function (link) { return "" + mapString(link); }).join('') + "\n\n    " + operation.sets.map(function (link) {
	        return "_[" + encode(link.source) + "].add(_[" + encode(link.target) + "]);";
	    }).join('') + "\n\n      return _[0];\n    }();";
	};
	exports.serialize = function (value) { return "return " + serializer(value); };
	exports.deserialize = function (value) { return (new Function(value))(); };
	function Reference(to, value) {
	    if (to === void 0) { to = null; }
	    if (value === void 0) { value = undefined; }
	    this.source = null;
	    this.target = to;
	    this.value = value;
	}
	function map(operation, value) {
	    switch (typeof value) {
	        case 'string':
	            return JSON.stringify(value);
	        case 'number':
	        case 'boolean':
	            return value;
	        case 'undefined':
	            return 'undefined';
	        default:
	            if (value === null) {
	                return 'null';
	            }
	            var objectType = Object.prototype.toString.call(value);
	            switch (objectType) {
	                case '[object RegExp]':
	                    return value.toString();
	                case '[object Date]':
	                    return "new Date(" + value.valueOf() + ")";
	                default:
	                    if (/Element/.test(objectType)) {
	                        return null;
	                    }
	                    if (typeof value === 'function') {
	                        return "function " + function_name_1.functionName(value).split(' ').join('_') + "() {}";
	                    }
	                    var index_1 = operation.visits.get(value);
	                    if (index_1 != null) {
	                        return new Reference(index_1);
	                    }
	                    else {
	                        index_1 = operation.visits.size;
	                        operation.visits.set(value, index_1);
	                    }
	                    var mapArray_1 = function (collection, array) {
	                        return "[" + array.map(function (v, i) {
	                            var ref = map(operation, v);
	                            if (ref instanceof Reference) {
	                                ref.source = index_1;
	                                ref.key = i;
	                                collection.push(ref);
	                            }
	                            return ref;
	                        }).map(function (v) { return v instanceof Reference === false ? v : undefined; }).join(',') + "]";
	                    };
	                    switch (objectType) {
	                        case '[object Array]':
	                            operation.tails.push(function () {
	                                operation.objref[index_1] = mapArray_1(operation.arrays, value);
	                            });
	                            break;
	                        case '[object Set]':
	                            operation.tails.push(function () {
	                                operation.objref[index_1] = "new Set()";
	                                value.forEach(function (v, key) {
	                                    var ref = map(operation, v);
	                                    if (ref instanceof Reference) {
	                                        ref.source = index_1;
	                                        operation.sets.push(ref);
	                                    }
	                                });
	                            });
	                            break;
	                        case '[object Map]':
	                            operation.tails.push(function () {
	                                operation.objref[index_1] = "new Map()";
	                                value.forEach(function (v, key) {
	                                    var ref = map(operation, v);
	                                    var keyRef = map(operation, key);
	                                    if (ref instanceof Reference === false) {
	                                        ref = new Reference(null, ref);
	                                    }
	                                    ref.source = index_1;
	                                    ref.key = ref instanceof Reference ? keyRef : key;
	                                    operation.maps.push(ref);
	                                });
	                            });
	                            break;
	                        default:
	                            operation.tails.push(function () {
	                                var constructor = value && value.constructor ?
	                                    value.constructor : ({}).constructor;
	                                var ctor = function_name_1.functionName(constructor) || '';
	                                var mapProps = function (key) {
	                                    var mapped = map(operation, value[key]);
	                                    if (mapped instanceof Reference) {
	                                        mapped.source = index_1;
	                                        mapped.key = key;
	                                        operation.hashes.push(mapped);
	                                        return mapped;
	                                    }
	                                    return JSON.stringify(key) + ": " + mapped;
	                                };
	                                var keys = Object.keys(value)
	                                    .map(function (key) { return mapProps(key); })
	                                    .filter(function (v) { return v instanceof Reference === false; }).join(',');
	                                if (nonstandardType(ctor)) {
	                                    operation.objref[index_1] = "new (function " + ctor + "() {Object.assign(this, {" + keys + "});})()";
	                                }
	                                else {
	                                    operation.objref[index_1] = "{" + keys + "}";
	                                }
	                            });
	                            break;
	                    }
	                    return new Reference(index_1);
	            }
	    }
	}
	var nonstandardType = function (type) {
	    switch (type.toLowerCase()) {
	        case 'object':
	        case 'function':
	        case 'string':
	        case 'number':
	        case 'regexp':
	        case 'date':
	            return false;
	        default:
	            return true;
	    }
	};


/***/ },

/***/ 108:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var root_1 = __webpack_require__(22);
	var Action_1 = __webpack_require__(265);
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var AsyncAction = (function (_super) {
	    __extends(AsyncAction, _super);
	    function AsyncAction(scheduler, work) {
	        _super.call(this, scheduler, work);
	        this.scheduler = scheduler;
	        this.work = work;
	        this.pending = false;
	    }
	    AsyncAction.prototype.schedule = function (state, delay) {
	        if (delay === void 0) { delay = 0; }
	        if (this.closed) {
	            return this;
	        }
	        // Always replace the current state with the new state.
	        this.state = state;
	        // Set the pending flag indicating that this action has been scheduled, or
	        // has recursively rescheduled itself.
	        this.pending = true;
	        var id = this.id;
	        var scheduler = this.scheduler;
	        //
	        // Important implementation note:
	        //
	        // Actions only execute once by default, unless rescheduled from within the
	        // scheduled callback. This allows us to implement single and repeat
	        // actions via the same code path, without adding API surface area, as well
	        // as mimic traditional recursion but across asynchronous boundaries.
	        //
	        // However, JS runtimes and timers distinguish between intervals achieved by
	        // serial `setTimeout` calls vs. a single `setInterval` call. An interval of
	        // serial `setTimeout` calls can be individually delayed, which delays
	        // scheduling the next `setTimeout`, and so on. `setInterval` attempts to
	        // guarantee the interval callback will be invoked more precisely to the
	        // interval period, regardless of load.
	        //
	        // Therefore, we use `setInterval` to schedule single and repeat actions.
	        // If the action reschedules itself with the same delay, the interval is not
	        // canceled. If the action doesn't reschedule, or reschedules with a
	        // different delay, the interval will be canceled after scheduled callback
	        // execution.
	        //
	        if (id != null) {
	            this.id = this.recycleAsyncId(scheduler, id, delay);
	        }
	        this.delay = delay;
	        // If this action has already an async Id, don't request a new one.
	        this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
	        return this;
	    };
	    AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
	        if (delay === void 0) { delay = 0; }
	        return root_1.root.setInterval(scheduler.flush.bind(scheduler, this), delay);
	    };
	    AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
	        if (delay === void 0) { delay = 0; }
	        // If this action is rescheduled with the same delay time, don't clear the interval id.
	        if (delay !== null && this.delay === delay) {
	            return id;
	        }
	        // Otherwise, if the action's delay time is different from the current delay,
	        // clear the interval id
	        return root_1.root.clearInterval(id) && undefined || undefined;
	    };
	    /**
	     * Immediately executes this action and the `work` it contains.
	     * @return {any}
	     */
	    AsyncAction.prototype.execute = function (state, delay) {
	        if (this.closed) {
	            return new Error('executing a cancelled action');
	        }
	        this.pending = false;
	        var error = this._execute(state, delay);
	        if (error) {
	            return error;
	        }
	        else if (this.pending === false && this.id != null) {
	            // Dequeue if the action didn't reschedule itself. Don't call
	            // unsubscribe(), because the action could reschedule later.
	            // For example:
	            // ```
	            // scheduler.schedule(function doWork(counter) {
	            //   /* ... I'm a busy worker bee ... */
	            //   var originalAction = this;
	            //   /* wait 100ms before rescheduling the action */
	            //   setTimeout(function () {
	            //     originalAction.schedule(counter + 1);
	            //   }, 100);
	            // }, 1000);
	            // ```
	            this.id = this.recycleAsyncId(this.scheduler, this.id, null);
	        }
	    };
	    AsyncAction.prototype._execute = function (state, delay) {
	        var errored = false;
	        var errorValue = undefined;
	        try {
	            this.work(state);
	        }
	        catch (e) {
	            errored = true;
	            errorValue = !!e && e || new Error(e);
	        }
	        if (errored) {
	            this.unsubscribe();
	            return errorValue;
	        }
	    };
	    AsyncAction.prototype._unsubscribe = function () {
	        var id = this.id;
	        var scheduler = this.scheduler;
	        var actions = scheduler.actions;
	        var index = actions.indexOf(this);
	        this.work = null;
	        this.delay = null;
	        this.state = null;
	        this.pending = false;
	        this.scheduler = null;
	        if (index !== -1) {
	            actions.splice(index, 1);
	        }
	        if (id != null) {
	            this.id = this.recycleAsyncId(scheduler, id, null);
	        }
	    };
	    return AsyncAction;
	}(Action_1.Action));
	exports.AsyncAction = AsyncAction;
	//# sourceMappingURL=AsyncAction.js.map

/***/ },

/***/ 109:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Scheduler_1 = __webpack_require__(255);
	var AsyncScheduler = (function (_super) {
	    __extends(AsyncScheduler, _super);
	    function AsyncScheduler() {
	        _super.apply(this, arguments);
	        this.actions = [];
	        /**
	         * A flag to indicate whether the Scheduler is currently executing a batch of
	         * queued actions.
	         * @type {boolean}
	         */
	        this.active = false;
	        /**
	         * An internal ID used to track the latest asynchronous task such as those
	         * coming from `setTimeout`, `setInterval`, `requestAnimationFrame`, and
	         * others.
	         * @type {any}
	         */
	        this.scheduled = undefined;
	    }
	    AsyncScheduler.prototype.flush = function (action) {
	        var actions = this.actions;
	        if (this.active) {
	            actions.push(action);
	            return;
	        }
	        var error;
	        this.active = true;
	        do {
	            if (error = action.execute(action.state, action.delay)) {
	                break;
	            }
	        } while (action = actions.shift()); // exhaust the scheduler queue
	        this.active = false;
	        if (error) {
	            while (action = actions.shift()) {
	                action.unsubscribe();
	            }
	            throw error;
	        }
	    };
	    return AsyncScheduler;
	}(Scheduler_1.Scheduler));
	exports.AsyncScheduler = AsyncScheduler;
	//# sourceMappingURL=AsyncScheduler.js.map

/***/ },

/***/ 110:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var root_1 = __webpack_require__(22);
	var Symbol = root_1.root.Symbol;
	exports.rxSubscriber = (typeof Symbol === 'function' && typeof Symbol.for === 'function') ?
	    Symbol.for('rxSubscriber') : '@@rxSubscriber';
	/**
	 * @deprecated use rxSubscriber instead
	 */
	exports.$$rxSubscriber = exports.rxSubscriber;
	//# sourceMappingURL=rxSubscriber.js.map

/***/ },

/***/ 111:
/***/ function(module, exports) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	/**
	 * An error thrown when an action is invalid because the object has been
	 * unsubscribed.
	 *
	 * @see {@link Subject}
	 * @see {@link BehaviorSubject}
	 *
	 * @class ObjectUnsubscribedError
	 */
	var ObjectUnsubscribedError = (function (_super) {
	    __extends(ObjectUnsubscribedError, _super);
	    function ObjectUnsubscribedError() {
	        var err = _super.call(this, 'object unsubscribed');
	        this.name = err.name = 'ObjectUnsubscribedError';
	        this.stack = err.stack;
	        this.message = err.message;
	    }
	    return ObjectUnsubscribedError;
	}(Error));
	exports.ObjectUnsubscribedError = ObjectUnsubscribedError;
	//# sourceMappingURL=ObjectUnsubscribedError.js.map

/***/ },

/***/ 112:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var decorators_1 = __webpack_require__(113);
	exports.AUGURY_TOKEN_ID_METADATA_KEY = '__augury_token_id';
	var resolveNgModuleDecoratorConfig = function (m) {
	    if (m.decorators) {
	        return m.decorators.reduce(function (prev, curr, idx, decorators) {
	            return prev ? prev : decorators[idx].type.prototype.toString() === '@NgModule' ?
	                (decorators[idx].args || [])[0] : null;
	        }, null);
	    }
	    return (Reflect.getMetadata('annotations', m) || [])
	        .find(function (decorator) { return decorator.toString() === '@NgModule'; });
	};
	exports.parseModulesFromRouter = function (router, existingModules) {
	    var foundModules = [];
	    var _parse = function (config) {
	        config.forEach(function (route) {
	            if (route._loadedConfig) {
	                foundModules.push(route._loadedConfig.module ?
	                    route._loadedConfig.module.instance :
	                    route._loadedConfig.injector.instance);
	                _parse(route._loadedConfig.routes || []);
	            }
	            _parse(route.children || []);
	        });
	    };
	    _parse(router.config);
	    foundModules.forEach(function (module) {
	        _parseModule(module.constructor, existingModules.modules, existingModules.names, existingModules.tokenIdMap);
	        updateRegistryConfigs(existingModules);
	    });
	};
	exports.parseModulesFromRootElement = function (firstRootDebugElement, registry) {
	    var bootstrappedModule = firstRootDebugElement.injector.get(ng.coreTokens.ApplicationRef)._injector.instance;
	    if (bootstrappedModule) {
	        _parseModule(bootstrappedModule.constructor, registry.modules, registry.names, registry.tokenIdMap);
	        updateRegistryConfigs(registry);
	    }
	};
	var updateRegistryConfigs = function (registry) {
	    for (var m in registry.modules) {
	        if (registry.modules.hasOwnProperty(m)) {
	            registry.configs[registry.modules[m].name] = registry.modules[m];
	        }
	    }
	};
	var parseModuleName = function (m) {
	    return m.ngModule ? m.ngModule.name : m.name || (m.constructor ? m.constructor.name : null);
	};
	var randomId = function () {
	    return Math.random().toString(36).substring(7);
	};
	var resolveTokenIdMetaData = function (token, tokenIdMap) {
	    var tokenId = null;
	    if (typeof token === 'string') {
	        tokenId = token;
	    }
	    else {
	        if (!Reflect.getMetadata(exports.AUGURY_TOKEN_ID_METADATA_KEY, token)) {
	            tokenId = randomId();
	            while (tokenIdMap[tokenId]) {
	                tokenId = randomId();
	            }
	            Reflect.defineMetadata(exports.AUGURY_TOKEN_ID_METADATA_KEY, tokenId, token);
	        }
	    }
	    return { token: token, augury_token_id: tokenId || Reflect.getMetadata(exports.AUGURY_TOKEN_ID_METADATA_KEY, token) };
	};
	var parseProviderName = function (p) {
	    if (typeof p === 'object' && p.provide) {
	        return p.provide.name || p.provide.toString().replace(' ', ':');
	    }
	    return p.name;
	};
	var buildModuleDescription = function (module, config) {
	    var flattenedDeclarations = flatten(config.declarations || []);
	    var flattenedProvidersFromDeclarations = flattenedDeclarations.reduce(function (prev, curr, i, declarations) {
	        var componentDecoratorConfig = decorators_1.componentMetadata(declarations[i]);
	        return componentDecoratorConfig ? prev.concat(flatten(componentDecoratorConfig.providers || [])) : prev;
	    }, []);
	    return {
	        name: parseModuleName(module),
	        imports: flatten(config.imports || []).map(function (im) { return parseModuleName(im); }),
	        exports: flatten(config.exports || []).map(function (ex) { return parseModuleName(ex); }),
	        declarations: flattenedDeclarations.map(function (d) { return d.name; }),
	        providers: flatten((config.providers || [])).map(parseProviderName),
	        providersInDeclarations: flattenedProvidersFromDeclarations.map(parseProviderName),
	    };
	};
	var flattenProviders = function (providers) {
	    if (providers === void 0) { providers = []; }
	    var flatArray = [];
	    providers.forEach(function (item) {
	        if (Array.isArray(item)) {
	            Array.prototype.push.apply(flatArray, flattenProviders(item));
	        }
	        else if (typeof item === 'object') {
	            if (Array.isArray(item.provide)) {
	                Array.prototype.push.apply(flatArray, flattenProviders(item.provide || []));
	            }
	            else {
	                flatArray.push(item.provide);
	            }
	        }
	        else {
	            flatArray.push(item);
	        }
	    });
	    return flatArray;
	};
	var flatten = function (l) {
	    var flatArray = [];
	    l.forEach(function (item) {
	        if (Array.isArray(item)) {
	            Array.prototype.push.apply(flatArray, flatten(item));
	        }
	        else {
	            flatArray.push(item);
	        }
	    });
	    return flatArray;
	};
	var _parseModule = function (module, modules, moduleNames, tokenIdMap) {
	    if (modules === void 0) { modules = {}; }
	    if (moduleNames === void 0) { moduleNames = []; }
	    if (tokenIdMap === void 0) { tokenIdMap = {}; }
	    var auguryModuleId = resolveTokenIdMetaData(module, tokenIdMap)["augury_token_id"];
	    if (!modules[auguryModuleId]) {
	        var ngModuleDecoratorConfig = resolveNgModuleDecoratorConfig(module) || {};
	        moduleNames.push(parseModuleName(module));
	        modules[auguryModuleId] = buildModuleDescription(module, ngModuleDecoratorConfig);
	        var moduleComponents = flatten(ngModuleDecoratorConfig.declarations || [])
	            .filter(function (declaration) { return decorators_1.componentMetadata(declaration); });
	        var moduleComponentProviders = moduleComponents.reduce(function (prev, curr, i, components) {
	            return prev.concat(flattenProviders(decorators_1.componentMetadata(components[i]).providers || []));
	        }, []);
	        var providersFromModuleImports_1 = [];
	        var flatImports = flatten(ngModuleDecoratorConfig.imports || []);
	        flatImports.forEach(function (im) {
	            var importedModule = im.ngModule || im;
	            if (im.ngModule) {
	                Array.prototype.push.apply(providersFromModuleImports_1, flattenProviders(im.providers));
	            }
	            var importModuleDecorator = resolveNgModuleDecoratorConfig(importedModule);
	            if (importModuleDecorator) {
	                _parseModule(importedModule, modules, moduleNames, tokenIdMap);
	            }
	        });
	        providersFromModuleImports_1.forEach(function (p) { return modules[auguryModuleId].providers.push(parseProviderName(p)); });
	        flattenProviders(ngModuleDecoratorConfig.providers || [])
	            .concat(providersFromModuleImports_1)
	            .concat(moduleComponentProviders)
	            .concat(moduleComponents)
	            .map(function (t) { return resolveTokenIdMetaData(t, tokenIdMap); })
	            .map(function (tokenAndId) {
	            var isString = (typeof tokenAndId.token) === 'string';
	            tokenIdMap[tokenAndId.augury_token_id] = {
	                name: !isString ? tokenAndId.token.name : tokenAndId.token,
	                type: !isString && decorators_1.componentMetadata(tokenAndId.token) ? 'Component' : 'Injectable',
	                module: module.name,
	            };
	        });
	    }
	    return [modules, moduleNames, tokenIdMap];
	};


/***/ },

/***/ 113:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var utils_1 = __webpack_require__(16);
	exports.classDecorators = function (token) {
	    return Reflect.getOwnMetadata('annotations', token) || [];
	};
	exports.propertyDecorators = function (instance) {
	    return Reflect.getOwnMetadata('propMetadata', instance.constructor) || [];
	};
	exports.parameterTypes = function (instance) {
	    return Reflect.getOwnMetadata('design:paramtypes', instance.constructor) || [];
	};
	exports.injectedParameterDecorators = function (instance) {
	    return Reflect.getOwnMetadata('parameters', instance.constructor) || [];
	};
	exports.iteratePropertyDecorators = function (instance, fn) {
	    if (instance == null) {
	        return;
	    }
	    var decorators = exports.propertyDecorators(instance);
	    for (var _i = 0, _a = Object.keys(decorators); _i < _a.length; _i++) {
	        var key = _a[_i];
	        for (var _b = 0, _c = decorators[key]; _b < _c.length; _b++) {
	            var meta = _c[_b];
	            fn(key, meta);
	        }
	    }
	};
	exports.componentMetadata = function (token) {
	    if (!token) {
	        return null;
	    }
	    return exports.classDecorators(token).find(function (d) { return d.toString() === '@Component'; });
	};
	exports.componentInputs = function (metadata, instance) {
	    var inputs = ((metadata && metadata.inputs) || []).map(function (p) { return ({ propertyKey: p }); });
	    exports.iteratePropertyDecorators(instance, function (key, meta) {
	        if (inputs.find(function (i) { return i.propertyKey === key; }) == null) {
	            if (meta.toString() === '@Input') {
	                inputs.push({ propertyKey: key, bindingPropertyName: meta.bindingPropertyName });
	            }
	        }
	    });
	    return inputs;
	};
	exports.componentOutputs = function (metadata, instance) {
	    var outputs = ((metadata && metadata.outputs) || []).map(function (p) { return ({ propertyKey: p }); });
	    exports.iteratePropertyDecorators(instance, function (key, meta) {
	        if (meta.toString() === '@Output') {
	            outputs.push({ propertyKey: key, bindingPropertyName: meta.bindingPropertyName });
	        }
	    });
	    return Array.from(outputs);
	};
	exports.componentQueryChildren = function (type, metadata, instance) {
	    var queries = new Array();
	    exports.iteratePropertyDecorators(instance, function (key, meta) {
	        if (meta.toString() === type) {
	            queries.push({ propertyKey: key, selector: utils_1.functionName(meta.selector) });
	        }
	    });
	    return queries;
	};


/***/ },

/***/ 123:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subject_1 = __webpack_require__(13);
	var Subscription_1 = __webpack_require__(17);
	/**
	 * @class AsyncSubject<T>
	 */
	var AsyncSubject = (function (_super) {
	    __extends(AsyncSubject, _super);
	    function AsyncSubject() {
	        _super.apply(this, arguments);
	        this.value = null;
	        this.hasNext = false;
	        this.hasCompleted = false;
	    }
	    AsyncSubject.prototype._subscribe = function (subscriber) {
	        if (this.hasError) {
	            subscriber.error(this.thrownError);
	            return Subscription_1.Subscription.EMPTY;
	        }
	        else if (this.hasCompleted && this.hasNext) {
	            subscriber.next(this.value);
	            subscriber.complete();
	            return Subscription_1.Subscription.EMPTY;
	        }
	        return _super.prototype._subscribe.call(this, subscriber);
	    };
	    AsyncSubject.prototype.next = function (value) {
	        if (!this.hasCompleted) {
	            this.value = value;
	            this.hasNext = true;
	        }
	    };
	    AsyncSubject.prototype.error = function (error) {
	        if (!this.hasCompleted) {
	            _super.prototype.error.call(this, error);
	        }
	    };
	    AsyncSubject.prototype.complete = function () {
	        this.hasCompleted = true;
	        if (this.hasNext) {
	            _super.prototype.next.call(this, this.value);
	        }
	        _super.prototype.complete.call(this);
	    };
	    return AsyncSubject;
	}(Subject_1.Subject));
	exports.AsyncSubject = AsyncSubject;
	//# sourceMappingURL=AsyncSubject.js.map

/***/ },

/***/ 124:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Observable_1 = __webpack_require__(1);
	/**
	 * Represents a push-based event or value that an {@link Observable} can emit.
	 * This class is particularly useful for operators that manage notifications,
	 * like {@link materialize}, {@link dematerialize}, {@link observeOn}, and
	 * others. Besides wrapping the actual delivered value, it also annotates it
	 * with metadata of, for instance, what type of push message it is (`next`,
	 * `error`, or `complete`).
	 *
	 * @see {@link materialize}
	 * @see {@link dematerialize}
	 * @see {@link observeOn}
	 *
	 * @class Notification<T>
	 */
	var Notification = (function () {
	    function Notification(kind, value, error) {
	        this.kind = kind;
	        this.value = value;
	        this.error = error;
	        this.hasValue = kind === 'N';
	    }
	    /**
	     * Delivers to the given `observer` the value wrapped by this Notification.
	     * @param {Observer} observer
	     * @return
	     */
	    Notification.prototype.observe = function (observer) {
	        switch (this.kind) {
	            case 'N':
	                return observer.next && observer.next(this.value);
	            case 'E':
	                return observer.error && observer.error(this.error);
	            case 'C':
	                return observer.complete && observer.complete();
	        }
	    };
	    /**
	     * Given some {@link Observer} callbacks, deliver the value represented by the
	     * current Notification to the correctly corresponding callback.
	     * @param {function(value: T): void} next An Observer `next` callback.
	     * @param {function(err: any): void} [error] An Observer `error` callback.
	     * @param {function(): void} [complete] An Observer `complete` callback.
	     * @return {any}
	     */
	    Notification.prototype.do = function (next, error, complete) {
	        var kind = this.kind;
	        switch (kind) {
	            case 'N':
	                return next && next(this.value);
	            case 'E':
	                return error && error(this.error);
	            case 'C':
	                return complete && complete();
	        }
	    };
	    /**
	     * Takes an Observer or its individual callback functions, and calls `observe`
	     * or `do` methods accordingly.
	     * @param {Observer|function(value: T): void} nextOrObserver An Observer or
	     * the `next` callback.
	     * @param {function(err: any): void} [error] An Observer `error` callback.
	     * @param {function(): void} [complete] An Observer `complete` callback.
	     * @return {any}
	     */
	    Notification.prototype.accept = function (nextOrObserver, error, complete) {
	        if (nextOrObserver && typeof nextOrObserver.next === 'function') {
	            return this.observe(nextOrObserver);
	        }
	        else {
	            return this.do(nextOrObserver, error, complete);
	        }
	    };
	    /**
	     * Returns a simple Observable that just delivers the notification represented
	     * by this Notification instance.
	     * @return {any}
	     */
	    Notification.prototype.toObservable = function () {
	        var kind = this.kind;
	        switch (kind) {
	            case 'N':
	                return Observable_1.Observable.of(this.value);
	            case 'E':
	                return Observable_1.Observable.throw(this.error);
	            case 'C':
	                return Observable_1.Observable.empty();
	        }
	        throw new Error('unexpected notification kind value');
	    };
	    /**
	     * A shortcut to create a Notification instance of the type `next` from a
	     * given value.
	     * @param {T} value The `next` value.
	     * @return {Notification<T>} The "next" Notification representing the
	     * argument.
	     */
	    Notification.createNext = function (value) {
	        if (typeof value !== 'undefined') {
	            return new Notification('N', value);
	        }
	        return this.undefinedValueNotification;
	    };
	    /**
	     * A shortcut to create a Notification instance of the type `error` from a
	     * given error.
	     * @param {any} [err] The `error` error.
	     * @return {Notification<T>} The "error" Notification representing the
	     * argument.
	     */
	    Notification.createError = function (err) {
	        return new Notification('E', undefined, err);
	    };
	    /**
	     * A shortcut to create a Notification instance of the type `complete`.
	     * @return {Notification<any>} The valueless "complete" Notification.
	     */
	    Notification.createComplete = function () {
	        return this.completeNotification;
	    };
	    Notification.completeNotification = new Notification('C');
	    Notification.undefinedValueNotification = new Notification('N', undefined);
	    return Notification;
	}());
	exports.Notification = Notification;
	//# sourceMappingURL=Notification.js.map

/***/ },

/***/ 125:
/***/ function(module, exports) {

	"use strict";
	function isFunction(x) {
	    return typeof x === 'function';
	}
	exports.isFunction = isFunction;
	//# sourceMappingURL=isFunction.js.map

/***/ },

/***/ 126:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var parse_modules_1 = __webpack_require__(112);
	var property_path_1 = __webpack_require__(285);
	var utils_1 = __webpack_require__(16);
	exports.isDebugElementComponent = function (element) { return !!element.componentInstance &&
	    !componentInstanceExistsInParentChain(element); };
	exports.getComponentName = function (element) {
	    if (element.componentInstance &&
	        element.componentInstance.constructor &&
	        !componentInstanceExistsInParentChain(element)) {
	        return utils_1.functionName(element.componentInstance.constructor);
	    }
	    else if (element.name) {
	        return element.name;
	    }
	    return element.nativeElement.tagName.toLowerCase();
	};
	var componentInstanceExistsInParentChain = function (debugElement) {
	    var componentInstanceRef = debugElement.componentInstance;
	    while (componentInstanceRef && debugElement.parent) {
	        if (componentInstanceRef === debugElement.parent.componentInstance) {
	            return true;
	        }
	        debugElement = debugElement.parent;
	    }
	    return false;
	};
	var getPropsIfTheyExist = function (object, props) {
	    var properties = [];
	    props.forEach(function (prop) {
	        var label = prop[0];
	        var path = prop.length > 1 ? prop.slice(1, prop.length) : prop[0];
	        if (property_path_1.pathExists.apply(void 0, [object].concat(path))) {
	            properties.push({ key: label, value: property_path_1.getAtPath.apply(void 0, [object].concat(path)).value });
	        }
	    });
	    return properties;
	};
	var Description = (function () {
	    function Description() {
	    }
	    Description.getProviderDescription = function (provider, instance) {
	        return {
	            id: Reflect.getMetadata(parse_modules_1.AUGURY_TOKEN_ID_METADATA_KEY, provider),
	            key: provider.name,
	            value: null,
	        };
	    };
	    Description.getComponentDescription = function (debugElement) {
	        if (debugElement == null) {
	            return [];
	        }
	        var componentName;
	        var element = property_path_1.pathExists(debugElement, 'nativeElement') ? debugElement.nativeElement : null;
	        if (debugElement.componentInstance && !componentInstanceExistsInParentChain(debugElement)) {
	            componentName = property_path_1.pathExists(debugElement, 'componentInstance', 'constructor', 'name') ?
	                debugElement.componentInstance.constructor.name : null;
	        }
	        else {
	            componentName = property_path_1.pathExists(element, 'tagName') ?
	                element.tagName.toLowerCase() : null;
	        }
	        var properties = [];
	        switch (componentName) {
	            case 'a':
	                return getPropsIfTheyExist(element, [
	                    ['text'],
	                    ['hash'],
	                ]);
	            case 'form':
	                return getPropsIfTheyExist(element, [
	                    ['method']
	                ]);
	            case 'input':
	                return getPropsIfTheyExist(element, [
	                    ['id'],
	                    ['name'],
	                    ['type'],
	                    ['required']
	                ]);
	            case 'router-outlet':
	                var routerOutletProvider = debugElement.providerTokens.reduce(function (prev, curr) {
	                    return prev ? prev : curr.name === 'RouterOutlet' ? curr : null;
	                }, null);
	                return getPropsIfTheyExist(debugElement.injector.get(routerOutletProvider), [['name']]);
	            case 'NgSelectOption':
	                return (element) ? Description._getSelectOptionDesc(element) : [];
	            case 'NgIf':
	                return Description._getNgIfDesc(debugElement.componentInstance);
	            case 'NgControlName':
	                return Description._getControlNameDesc(debugElement.componentInstance);
	            case 'NgSwitch':
	                return Description._getNgSwitchDesc(debugElement.componentInstance);
	            case 'NgSwitchWhen':
	            case 'NgSwitchDefault':
	                return Description._getNgSwitchWhenDesc(debugElement.componentInstance);
	        }
	        return properties;
	    };
	    Description._getSelectOptionDesc = function (element) {
	        return getPropsIfTheyExist(element, [
	            ['label', 'innerText'],
	        ]).concat([{ key: 'value', value: element.getAttribute('value') }]);
	    };
	    Description._getControlNameDesc = function (instance) {
	        return getPropsIfTheyExist(instance, [
	            ['name'],
	            ['value'],
	            ['valid'],
	        ]);
	    };
	    Description._getNgSwitchDesc = function (instance) {
	        var properties = getPropsIfTheyExist(instance, [
	            ['useDefault', '_useDefault'],
	            ['switchDefault', '_switchValue'],
	            ['valuesCount', '_valueViews'],
	        ]);
	        properties
	            .filter(function (element) { return element.key === 'valuesCount'; })
	            .forEach(function (element) { return element.value = element.value ? element.value.size : 0; });
	        return properties;
	    };
	    Description._getNgSwitchWhenDesc = function (instance) {
	        return getPropsIfTheyExist(instance, [
	            ['value', '_value'],
	        ]);
	    };
	    Description._getNgIfDesc = function (instance) {
	        return getPropsIfTheyExist(instance, [
	            ['condition', '_prevCondition'],
	        ]);
	    };
	    return Description;
	}());
	exports.Description = Description;


/***/ },

/***/ 127:
/***/ function(module, exports) {

	"use strict";
	var Theme;
	(function (Theme) {
	    Theme[Theme["Light"] = 0] = "Light";
	    Theme[Theme["Dark"] = 1] = "Dark";
	})(Theme = exports.Theme || (exports.Theme = {}));
	var ComponentView;
	(function (ComponentView) {
	    ComponentView[ComponentView["Hybrid"] = 0] = "Hybrid";
	    ComponentView[ComponentView["All"] = 1] = "All";
	    ComponentView[ComponentView["Components"] = 2] = "Components";
	})(ComponentView = exports.ComponentView || (exports.ComponentView = {}));
	var AnalyticsConsent;
	(function (AnalyticsConsent) {
	    AnalyticsConsent[AnalyticsConsent["NotSet"] = 0] = "NotSet";
	    AnalyticsConsent[AnalyticsConsent["Yes"] = 1] = "Yes";
	    AnalyticsConsent[AnalyticsConsent["No"] = 2] = "No";
	})(AnalyticsConsent = exports.AnalyticsConsent || (exports.AnalyticsConsent = {}));
	exports.defaultOptions = function () {
	    return {
	        theme: Theme.Light,
	        componentView: ComponentView.Hybrid,
	        analyticsConsent: AnalyticsConsent.NotSet,
	    };
	};
	exports.loadOptions = function () {
	    return loadFromStorage()
	        .then(function (result) {
	        var combined = Object.assign({}, exports.defaultOptions(), result);
	        switch (combined.theme) {
	            case 'light':
	                combined.theme = Theme.Light;
	                break;
	            case 'dark':
	                combined.theme = Theme.Dark;
	                break;
	        }
	        return combined;
	    });
	};
	var loadFromStorage = function () {
	    return new Promise(function (resolve) {
	        var keys = ['componentView', 'theme', 'analyticsConsent'];
	        chrome.storage.sync.get(keys, function (result) {
	            resolve(result);
	        });
	    });
	};
	exports.saveOptions = function (options) {
	    for (var _i = 0, _a = Object.keys(options); _i < _a.length; _i++) {
	        var key = _a[_i];
	        chrome.storage.sync.set((_b = {},
	            _b[key] = options[key],
	            _b));
	    }
	    var _b;
	};


/***/ },

/***/ 137:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subject_1 = __webpack_require__(13);
	var ObjectUnsubscribedError_1 = __webpack_require__(111);
	/**
	 * @class BehaviorSubject<T>
	 */
	var BehaviorSubject = (function (_super) {
	    __extends(BehaviorSubject, _super);
	    function BehaviorSubject(_value) {
	        _super.call(this);
	        this._value = _value;
	    }
	    Object.defineProperty(BehaviorSubject.prototype, "value", {
	        get: function () {
	            return this.getValue();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    BehaviorSubject.prototype._subscribe = function (subscriber) {
	        var subscription = _super.prototype._subscribe.call(this, subscriber);
	        if (subscription && !subscription.closed) {
	            subscriber.next(this._value);
	        }
	        return subscription;
	    };
	    BehaviorSubject.prototype.getValue = function () {
	        if (this.hasError) {
	            throw this.thrownError;
	        }
	        else if (this.closed) {
	            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
	        }
	        else {
	            return this._value;
	        }
	    };
	    BehaviorSubject.prototype.next = function (value) {
	        _super.prototype.next.call(this, this._value = value);
	    };
	    return BehaviorSubject;
	}(Subject_1.Subject));
	exports.BehaviorSubject = BehaviorSubject;
	//# sourceMappingURL=BehaviorSubject.js.map

/***/ },

/***/ 138:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subject_1 = __webpack_require__(13);
	var queue_1 = __webpack_require__(195);
	var Subscription_1 = __webpack_require__(17);
	var observeOn_1 = __webpack_require__(155);
	var ObjectUnsubscribedError_1 = __webpack_require__(111);
	var SubjectSubscription_1 = __webpack_require__(153);
	/**
	 * @class ReplaySubject<T>
	 */
	var ReplaySubject = (function (_super) {
	    __extends(ReplaySubject, _super);
	    function ReplaySubject(bufferSize, windowTime, scheduler) {
	        if (bufferSize === void 0) { bufferSize = Number.POSITIVE_INFINITY; }
	        if (windowTime === void 0) { windowTime = Number.POSITIVE_INFINITY; }
	        _super.call(this);
	        this.scheduler = scheduler;
	        this._events = [];
	        this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
	        this._windowTime = windowTime < 1 ? 1 : windowTime;
	    }
	    ReplaySubject.prototype.next = function (value) {
	        var now = this._getNow();
	        this._events.push(new ReplayEvent(now, value));
	        this._trimBufferThenGetEvents();
	        _super.prototype.next.call(this, value);
	    };
	    ReplaySubject.prototype._subscribe = function (subscriber) {
	        var _events = this._trimBufferThenGetEvents();
	        var scheduler = this.scheduler;
	        var subscription;
	        if (this.closed) {
	            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
	        }
	        else if (this.hasError) {
	            subscription = Subscription_1.Subscription.EMPTY;
	        }
	        else if (this.isStopped) {
	            subscription = Subscription_1.Subscription.EMPTY;
	        }
	        else {
	            this.observers.push(subscriber);
	            subscription = new SubjectSubscription_1.SubjectSubscription(this, subscriber);
	        }
	        if (scheduler) {
	            subscriber.add(subscriber = new observeOn_1.ObserveOnSubscriber(subscriber, scheduler));
	        }
	        var len = _events.length;
	        for (var i = 0; i < len && !subscriber.closed; i++) {
	            subscriber.next(_events[i].value);
	        }
	        if (this.hasError) {
	            subscriber.error(this.thrownError);
	        }
	        else if (this.isStopped) {
	            subscriber.complete();
	        }
	        return subscription;
	    };
	    ReplaySubject.prototype._getNow = function () {
	        return (this.scheduler || queue_1.queue).now();
	    };
	    ReplaySubject.prototype._trimBufferThenGetEvents = function () {
	        var now = this._getNow();
	        var _bufferSize = this._bufferSize;
	        var _windowTime = this._windowTime;
	        var _events = this._events;
	        var eventsCount = _events.length;
	        var spliceCount = 0;
	        // Trim events that fall out of the time window.
	        // Start at the front of the list. Break early once
	        // we encounter an event that falls within the window.
	        while (spliceCount < eventsCount) {
	            if ((now - _events[spliceCount].time) < _windowTime) {
	                break;
	            }
	            spliceCount++;
	        }
	        if (eventsCount > _bufferSize) {
	            spliceCount = Math.max(spliceCount, eventsCount - _bufferSize);
	        }
	        if (spliceCount > 0) {
	            _events.splice(0, spliceCount);
	        }
	        return _events;
	    };
	    return ReplaySubject;
	}(Subject_1.Subject));
	exports.ReplaySubject = ReplaySubject;
	var ReplayEvent = (function () {
	    function ReplayEvent(time, value) {
	        this.time = time;
	        this.value = value;
	    }
	    return ReplayEvent;
	}());
	//# sourceMappingURL=ReplaySubject.js.map

/***/ },

/***/ 140:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var root_1 = __webpack_require__(22);
	function getSymbolObservable(context) {
	    var $$observable;
	    var Symbol = context.Symbol;
	    if (typeof Symbol === 'function') {
	        if (Symbol.observable) {
	            $$observable = Symbol.observable;
	        }
	        else {
	            $$observable = Symbol('observable');
	            Symbol.observable = $$observable;
	        }
	    }
	    else {
	        $$observable = '@@observable';
	    }
	    return $$observable;
	}
	exports.getSymbolObservable = getSymbolObservable;
	exports.observable = getSymbolObservable(root_1.root);
	/**
	 * @deprecated use observable instead
	 */
	exports.$$observable = exports.observable;
	//# sourceMappingURL=observable.js.map

/***/ },

/***/ 152:
/***/ function(module, exports) {

	"use strict";
	exports.empty = {
	    closed: true,
	    next: function (value) { },
	    error: function (err) { throw err; },
	    complete: function () { }
	};
	//# sourceMappingURL=Observer.js.map

/***/ },

/***/ 153:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subscription_1 = __webpack_require__(17);
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var SubjectSubscription = (function (_super) {
	    __extends(SubjectSubscription, _super);
	    function SubjectSubscription(subject, subscriber) {
	        _super.call(this);
	        this.subject = subject;
	        this.subscriber = subscriber;
	        this.closed = false;
	    }
	    SubjectSubscription.prototype.unsubscribe = function () {
	        if (this.closed) {
	            return;
	        }
	        this.closed = true;
	        var subject = this.subject;
	        var observers = subject.observers;
	        this.subject = null;
	        if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
	            return;
	        }
	        var subscriberIndex = observers.indexOf(this.subscriber);
	        if (subscriberIndex !== -1) {
	            observers.splice(subscriberIndex, 1);
	        }
	    };
	    return SubjectSubscription;
	}(Subscription_1.Subscription));
	exports.SubjectSubscription = SubjectSubscription;
	//# sourceMappingURL=SubjectSubscription.js.map

/***/ },

/***/ 155:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subscriber_1 = __webpack_require__(4);
	var Notification_1 = __webpack_require__(124);
	/**
	 * @see {@link Notification}
	 *
	 * @param scheduler
	 * @param delay
	 * @return {Observable<R>|WebSocketSubject<T>|Observable<T>}
	 * @method observeOn
	 * @owner Observable
	 */
	function observeOn(scheduler, delay) {
	    if (delay === void 0) { delay = 0; }
	    return this.lift(new ObserveOnOperator(scheduler, delay));
	}
	exports.observeOn = observeOn;
	var ObserveOnOperator = (function () {
	    function ObserveOnOperator(scheduler, delay) {
	        if (delay === void 0) { delay = 0; }
	        this.scheduler = scheduler;
	        this.delay = delay;
	    }
	    ObserveOnOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new ObserveOnSubscriber(subscriber, this.scheduler, this.delay));
	    };
	    return ObserveOnOperator;
	}());
	exports.ObserveOnOperator = ObserveOnOperator;
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var ObserveOnSubscriber = (function (_super) {
	    __extends(ObserveOnSubscriber, _super);
	    function ObserveOnSubscriber(destination, scheduler, delay) {
	        if (delay === void 0) { delay = 0; }
	        _super.call(this, destination);
	        this.scheduler = scheduler;
	        this.delay = delay;
	    }
	    ObserveOnSubscriber.dispatch = function (arg) {
	        var notification = arg.notification, destination = arg.destination;
	        notification.observe(destination);
	        this.unsubscribe();
	    };
	    ObserveOnSubscriber.prototype.scheduleMessage = function (notification) {
	        this.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
	    };
	    ObserveOnSubscriber.prototype._next = function (value) {
	        this.scheduleMessage(Notification_1.Notification.createNext(value));
	    };
	    ObserveOnSubscriber.prototype._error = function (err) {
	        this.scheduleMessage(Notification_1.Notification.createError(err));
	    };
	    ObserveOnSubscriber.prototype._complete = function () {
	        this.scheduleMessage(Notification_1.Notification.createComplete());
	    };
	    return ObserveOnSubscriber;
	}(Subscriber_1.Subscriber));
	exports.ObserveOnSubscriber = ObserveOnSubscriber;
	var ObserveOnMessage = (function () {
	    function ObserveOnMessage(notification, destination) {
	        this.notification = notification;
	        this.destination = destination;
	    }
	    return ObserveOnMessage;
	}());
	exports.ObserveOnMessage = ObserveOnMessage;
	//# sourceMappingURL=observeOn.js.map

/***/ },

/***/ 158:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var path_1 = __webpack_require__(41);
	var patch_1 = __webpack_require__(204);
	var MutableTree = (function () {
	    function MutableTree() {
	    }
	    MutableTree.prototype.diff = function (nextTree) {
	        var changes = patch_1.compare(this, nextTree);
	        var exclude = /nativeElement$/;
	        return changes.filter(function (c) { return exclude.test(c.path) === false; });
	    };
	    MutableTree.prototype.patch = function (changes) {
	        patch_1.apply(this, changes);
	    };
	    MutableTree.prototype.lookup = function (id) {
	        return this.traverse(path_1.deserializePath(id));
	    };
	    MutableTree.prototype.traverse = function (path) {
	        path = path.slice(0);
	        var root = this.roots[path.shift()];
	        if (root == null) {
	            return null;
	        }
	        if (path.length === 0) {
	            return root;
	        }
	        var iterator = root;
	        for (var _i = 0, path_2 = path; _i < path_2.length; _i++) {
	            var index = path_2[_i];
	            if (iterator == null) {
	                return null;
	            }
	            switch (typeof index) {
	                case 'number':
	                    if (iterator.children.length <= index) {
	                        return null;
	                    }
	                    iterator = iterator.children[index];
	                    break;
	                case 'string':
	                    iterator = iterator[index];
	                    break;
	            }
	        }
	        return iterator;
	    };
	    MutableTree.prototype.recurse = function (rootIndex, fn) {
	        var applyfn = function (node) {
	            fn(node);
	            for (var _i = 0, _a = node.children || []; _i < _a.length; _i++) {
	                var child = _a[_i];
	                if (applyfn(child) === false) {
	                    return false;
	                }
	            }
	        };
	        return applyfn(this.roots[rootIndex]);
	    };
	    MutableTree.prototype.recurseAll = function (fn) {
	        for (var index = 0; index < this.roots.length; ++index) {
	            if (this.recurse(index, fn) === false) {
	                return false;
	            }
	        }
	    };
	    MutableTree.prototype.filter = function (fn) {
	        var results = new Array();
	        this.recurseAll(function (node) {
	            if (fn(node)) {
	                results.push(node);
	            }
	        });
	        return results;
	    };
	    return MutableTree;
	}());
	exports.MutableTree = MutableTree;


/***/ },

/***/ 193:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subscriber_1 = __webpack_require__(4);
	var Subscription_1 = __webpack_require__(17);
	var Observable_1 = __webpack_require__(1);
	var Subject_1 = __webpack_require__(13);
	var Map_1 = __webpack_require__(269);
	var FastMap_1 = __webpack_require__(268);
	/* tslint:enable:max-line-length */
	/**
	 * Groups the items emitted by an Observable according to a specified criterion,
	 * and emits these grouped items as `GroupedObservables`, one
	 * {@link GroupedObservable} per group.
	 *
	 * <img src="./img/groupBy.png" width="100%">
	 *
	 * @example <caption>Group objects by id and return as array</caption>
	 * Observable.of<Obj>({id: 1, name: 'aze1'},
	 *                    {id: 2, name: 'sf2'},
	 *                    {id: 2, name: 'dg2'},
	 *                    {id: 1, name: 'erg1'},
	 *                    {id: 1, name: 'df1'},
	 *                    {id: 2, name: 'sfqfb2'},
	 *                    {id: 3, name: 'qfs3'},
	 *                    {id: 2, name: 'qsgqsfg2'}
	 *     )
	 *     .groupBy(p => p.id)
	 *     .flatMap( (group$) => group$.reduce((acc, cur) => [...acc, cur], []))
	 *     .subscribe(p => console.log(p));
	 *
	 * // displays:
	 * // [ { id: 1, name: 'aze1' },
	 * //   { id: 1, name: 'erg1' },
	 * //   { id: 1, name: 'df1' } ]
	 * //
	 * // [ { id: 2, name: 'sf2' },
	 * //   { id: 2, name: 'dg2' },
	 * //   { id: 2, name: 'sfqfb2' },
	 * //   { id: 2, name: 'qsgqsfg2' } ]
	 * //
	 * // [ { id: 3, name: 'qfs3' } ]
	 *
	 * @example <caption>Pivot data on the id field</caption>
	 * Observable.of<Obj>({id: 1, name: 'aze1'},
	 *                    {id: 2, name: 'sf2'},
	 *                    {id: 2, name: 'dg2'},
	 *                    {id: 1, name: 'erg1'},
	 *                    {id: 1, name: 'df1'},
	 *                    {id: 2, name: 'sfqfb2'},
	 *                    {id: 3, name: 'qfs1'},
	 *                    {id: 2, name: 'qsgqsfg2'}
	 *                   )
	 *     .groupBy(p => p.id, p => p.anme)
	 *     .flatMap( (group$) => group$.reduce((acc, cur) => [...acc, cur], ["" + group$.key]))
	 *     .map(arr => ({'id': parseInt(arr[0]), 'values': arr.slice(1)}))
	 *     .subscribe(p => console.log(p));
	 *
	 * // displays:
	 * // { id: 1, values: [ 'aze1', 'erg1', 'df1' ] }
	 * // { id: 2, values: [ 'sf2', 'dg2', 'sfqfb2', 'qsgqsfg2' ] }
	 * // { id: 3, values: [ 'qfs1' ] }
	 *
	 * @param {function(value: T): K} keySelector A function that extracts the key
	 * for each item.
	 * @param {function(value: T): R} [elementSelector] A function that extracts the
	 * return element for each item.
	 * @param {function(grouped: GroupedObservable<K,R>): Observable<any>} [durationSelector]
	 * A function that returns an Observable to determine how long each group should
	 * exist.
	 * @return {Observable<GroupedObservable<K,R>>} An Observable that emits
	 * GroupedObservables, each of which corresponds to a unique key value and each
	 * of which emits those items from the source Observable that share that key
	 * value.
	 * @method groupBy
	 * @owner Observable
	 */
	function groupBy(keySelector, elementSelector, durationSelector, subjectSelector) {
	    return this.lift(new GroupByOperator(keySelector, elementSelector, durationSelector, subjectSelector));
	}
	exports.groupBy = groupBy;
	var GroupByOperator = (function () {
	    function GroupByOperator(keySelector, elementSelector, durationSelector, subjectSelector) {
	        this.keySelector = keySelector;
	        this.elementSelector = elementSelector;
	        this.durationSelector = durationSelector;
	        this.subjectSelector = subjectSelector;
	    }
	    GroupByOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new GroupBySubscriber(subscriber, this.keySelector, this.elementSelector, this.durationSelector, this.subjectSelector));
	    };
	    return GroupByOperator;
	}());
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var GroupBySubscriber = (function (_super) {
	    __extends(GroupBySubscriber, _super);
	    function GroupBySubscriber(destination, keySelector, elementSelector, durationSelector, subjectSelector) {
	        _super.call(this, destination);
	        this.keySelector = keySelector;
	        this.elementSelector = elementSelector;
	        this.durationSelector = durationSelector;
	        this.subjectSelector = subjectSelector;
	        this.groups = null;
	        this.attemptedToUnsubscribe = false;
	        this.count = 0;
	    }
	    GroupBySubscriber.prototype._next = function (value) {
	        var key;
	        try {
	            key = this.keySelector(value);
	        }
	        catch (err) {
	            this.error(err);
	            return;
	        }
	        this._group(value, key);
	    };
	    GroupBySubscriber.prototype._group = function (value, key) {
	        var groups = this.groups;
	        if (!groups) {
	            groups = this.groups = typeof key === 'string' ? new FastMap_1.FastMap() : new Map_1.Map();
	        }
	        var group = groups.get(key);
	        var element;
	        if (this.elementSelector) {
	            try {
	                element = this.elementSelector(value);
	            }
	            catch (err) {
	                this.error(err);
	            }
	        }
	        else {
	            element = value;
	        }
	        if (!group) {
	            group = this.subjectSelector ? this.subjectSelector() : new Subject_1.Subject();
	            groups.set(key, group);
	            var groupedObservable = new GroupedObservable(key, group, this);
	            this.destination.next(groupedObservable);
	            if (this.durationSelector) {
	                var duration = void 0;
	                try {
	                    duration = this.durationSelector(new GroupedObservable(key, group));
	                }
	                catch (err) {
	                    this.error(err);
	                    return;
	                }
	                this.add(duration.subscribe(new GroupDurationSubscriber(key, group, this)));
	            }
	        }
	        if (!group.closed) {
	            group.next(element);
	        }
	    };
	    GroupBySubscriber.prototype._error = function (err) {
	        var groups = this.groups;
	        if (groups) {
	            groups.forEach(function (group, key) {
	                group.error(err);
	            });
	            groups.clear();
	        }
	        this.destination.error(err);
	    };
	    GroupBySubscriber.prototype._complete = function () {
	        var groups = this.groups;
	        if (groups) {
	            groups.forEach(function (group, key) {
	                group.complete();
	            });
	            groups.clear();
	        }
	        this.destination.complete();
	    };
	    GroupBySubscriber.prototype.removeGroup = function (key) {
	        this.groups.delete(key);
	    };
	    GroupBySubscriber.prototype.unsubscribe = function () {
	        if (!this.closed) {
	            this.attemptedToUnsubscribe = true;
	            if (this.count === 0) {
	                _super.prototype.unsubscribe.call(this);
	            }
	        }
	    };
	    return GroupBySubscriber;
	}(Subscriber_1.Subscriber));
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var GroupDurationSubscriber = (function (_super) {
	    __extends(GroupDurationSubscriber, _super);
	    function GroupDurationSubscriber(key, group, parent) {
	        _super.call(this);
	        this.key = key;
	        this.group = group;
	        this.parent = parent;
	    }
	    GroupDurationSubscriber.prototype._next = function (value) {
	        this._complete();
	    };
	    GroupDurationSubscriber.prototype._error = function (err) {
	        var group = this.group;
	        if (!group.closed) {
	            group.error(err);
	        }
	        this.parent.removeGroup(this.key);
	    };
	    GroupDurationSubscriber.prototype._complete = function () {
	        var group = this.group;
	        if (!group.closed) {
	            group.complete();
	        }
	        this.parent.removeGroup(this.key);
	    };
	    return GroupDurationSubscriber;
	}(Subscriber_1.Subscriber));
	/**
	 * An Observable representing values belonging to the same group represented by
	 * a common key. The values emitted by a GroupedObservable come from the source
	 * Observable. The common key is available as the field `key` on a
	 * GroupedObservable instance.
	 *
	 * @class GroupedObservable<K, T>
	 */
	var GroupedObservable = (function (_super) {
	    __extends(GroupedObservable, _super);
	    function GroupedObservable(key, groupSubject, refCountSubscription) {
	        _super.call(this);
	        this.key = key;
	        this.groupSubject = groupSubject;
	        this.refCountSubscription = refCountSubscription;
	    }
	    GroupedObservable.prototype._subscribe = function (subscriber) {
	        var subscription = new Subscription_1.Subscription();
	        var _a = this, refCountSubscription = _a.refCountSubscription, groupSubject = _a.groupSubject;
	        if (refCountSubscription && !refCountSubscription.closed) {
	            subscription.add(new InnerRefCountSubscription(refCountSubscription));
	        }
	        subscription.add(groupSubject.subscribe(subscriber));
	        return subscription;
	    };
	    return GroupedObservable;
	}(Observable_1.Observable));
	exports.GroupedObservable = GroupedObservable;
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var InnerRefCountSubscription = (function (_super) {
	    __extends(InnerRefCountSubscription, _super);
	    function InnerRefCountSubscription(parent) {
	        _super.call(this);
	        this.parent = parent;
	        parent.count++;
	    }
	    InnerRefCountSubscription.prototype.unsubscribe = function () {
	        var parent = this.parent;
	        if (!parent.closed && !this.closed) {
	            _super.prototype.unsubscribe.call(this);
	            parent.count -= 1;
	            if (parent.count === 0 && parent.attemptedToUnsubscribe) {
	                parent.unsubscribe();
	            }
	        }
	    };
	    return InnerRefCountSubscription;
	}(Subscription_1.Subscription));
	//# sourceMappingURL=groupBy.js.map

/***/ },

/***/ 195:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var QueueAction_1 = __webpack_require__(266);
	var QueueScheduler_1 = __webpack_require__(267);
	/**
	 *
	 * Queue Scheduler
	 *
	 * <span class="informal">Put every next task on a queue, instead of executing it immediately</span>
	 *
	 * `queue` scheduler, when used with delay, behaves the same as {@link async} scheduler.
	 *
	 * When used without delay, it schedules given task synchronously - executes it right when
	 * it is scheduled. However when called recursively, that is when inside the scheduled task,
	 * another task is scheduled with queue scheduler, instead of executing immediately as well,
	 * that task will be put on a queue and wait for current one to finish.
	 *
	 * This means that when you execute task with `queue` scheduler, you are sure it will end
	 * before any other task scheduled with that scheduler will start.
	 *
	 * @examples <caption>Schedule recursively first, then do something</caption>
	 *
	 * Rx.Scheduler.queue.schedule(() => {
	 *   Rx.Scheduler.queue.schedule(() => console.log('second')); // will not happen now, but will be put on a queue
	 *
	 *   console.log('first');
	 * });
	 *
	 * // Logs:
	 * // "first"
	 * // "second"
	 *
	 *
	 * @example <caption>Reschedule itself recursively</caption>
	 *
	 * Rx.Scheduler.queue.schedule(function(state) {
	 *   if (state !== 0) {
	 *     console.log('before', state);
	 *     this.schedule(state - 1); // `this` references currently executing Action,
	 *                               // which we reschedule with new state
	 *     console.log('after', state);
	 *   }
	 * }, 0, 3);
	 *
	 * // In scheduler that runs recursively, you would expect:
	 * // "before", 3
	 * // "before", 2
	 * // "before", 1
	 * // "after", 1
	 * // "after", 2
	 * // "after", 3
	 *
	 * // But with queue it logs:
	 * // "before", 3
	 * // "after", 3
	 * // "before", 2
	 * // "after", 2
	 * // "before", 1
	 * // "after", 1
	 *
	 *
	 * @static true
	 * @name queue
	 * @owner Scheduler
	 */
	exports.queue = new QueueScheduler_1.QueueScheduler(QueueAction_1.QueueAction);
	//# sourceMappingURL=queue.js.map

/***/ },

/***/ 198:
/***/ function(module, exports) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	/**
	 * An error thrown when one or more errors have occurred during the
	 * `unsubscribe` of a {@link Subscription}.
	 */
	var UnsubscriptionError = (function (_super) {
	    __extends(UnsubscriptionError, _super);
	    function UnsubscriptionError(errors) {
	        _super.call(this);
	        this.errors = errors;
	        var err = Error.call(this, errors ?
	            errors.length + " errors occurred during unsubscription:\n  " + errors.map(function (err, i) { return ((i + 1) + ") " + err.toString()); }).join('\n  ') : '');
	        this.name = err.name = 'UnsubscriptionError';
	        this.stack = err.stack;
	        this.message = err.message;
	    }
	    return UnsubscriptionError;
	}(Error));
	exports.UnsubscriptionError = UnsubscriptionError;
	//# sourceMappingURL=UnsubscriptionError.js.map

/***/ },

/***/ 201:
/***/ function(module, exports) {

	"use strict";
	function isObject(x) {
	    return x != null && typeof x === 'object';
	}
	exports.isObject = isObject;
	//# sourceMappingURL=isObject.js.map

/***/ },

/***/ 202:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var communication_1 = __webpack_require__(23);
	exports.send = function (message) {
	    return new Promise(function (resolve, reject) {
	        communication_1.browserSubscribeResponse(message.messageId, function (response) { return resolve(response); });
	        communication_1.messageJumpContext(communication_1.MessageFactory.dispatchWrapper(message));
	    });
	};


/***/ },

/***/ 203:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var styles = __webpack_require__(272);
	var highlights = new Map();
	var offsets = function (node) {
	    var vals = {
	        x: node.offsetLeft,
	        y: node.offsetTop,
	        w: node.offsetWidth,
	        h: node.offsetHeight
	    };
	    while (node = node.offsetParent) {
	        vals.x += node.offsetLeft;
	        vals.y += node.offsetTop;
	    }
	    return vals;
	};
	var highlightNode = function (node, label) {
	    if (node == null) {
	        return;
	    }
	    var overlay = document.createElement('div');
	    overlay.setAttribute('style', styles);
	    if (label) {
	        overlay.textContent = label;
	    }
	    var pos = offsets(node);
	    overlay.style.left = pos.x + "px";
	    overlay.style.top = pos.y + "px";
	    overlay.style.width = pos.w + "px";
	    overlay.style.height = pos.h + "px";
	    document.body.appendChild(overlay);
	    return overlay;
	};
	exports.clear = function (map) {
	    if (!map) {
	        return;
	    }
	    map.forEach(function (value, key) {
	        try {
	            value.remove();
	        }
	        catch (e) {
	        }
	    });
	};
	exports.highlight = function (nodes) {
	    if (nodes == null || nodes.length === 0) {
	        exports.clear(highlights);
	        return;
	    }
	    var elements = new Array();
	    var map = new Map();
	    for (var _i = 0, _a = nodes.filter(function (n) { return n != null; }); _i < _a.length; _i++) {
	        var node = _a[_i];
	        var element = highlightNode(node.nativeElement(), node.name);
	        elements.push(element);
	        map.set(node.id, element);
	    }
	    highlights = map;
	    return {
	        elements: elements,
	        map: map
	    };
	};


/***/ },

/***/ 204:
/***/ function(module, exports) {

	"use strict";
	function equals(a, b) {
	    switch (typeof a) {
	        case 'undefined':
	        case 'boolean':
	        case 'string':
	        case 'number':
	            return a === b;
	        case 'object':
	            if (a == null) {
	                return b == null;
	            }
	            if (Array.isArray(a)) {
	                if (!Array.isArray(b) || a.length !== b.length) {
	                    return false;
	                }
	                for (var i = 0, l = a.length; i < l; i++) {
	                    if (!equals(a[i], b[i])) {
	                        return false;
	                    }
	                }
	                return true;
	            }
	            var keys = Object.keys(b);
	            var length_1 = keys.length;
	            if (Object.keys(a).length !== length_1) {
	                return false;
	            }
	            for (var i = 0; i < length_1; i++) {
	                if (!equals(a[i], b[i])) {
	                    return false;
	                }
	            }
	            return true;
	        default:
	            return false;
	    }
	}
	var objectOperations = {
	    add: function (obj, key) {
	        obj[key] = this.value;
	    },
	    remove: function (obj, key) {
	        var removed = obj[key];
	        delete obj[key];
	        return removed;
	    },
	    replace: function (obj, key) {
	        var removed = obj[key];
	        obj[key] = this.value;
	        return removed;
	    },
	    move: function (obj, key, tree) {
	        var destination = { op: '_get', path: this.path };
	        apply(tree, [destination]);
	        var original = destination.value === undefined
	            ? undefined
	            : JSON.parse(JSON.stringify(destination.value));
	        var tempOperation = { op: '_get', path: this.from };
	        apply(tree, [tempOperation]);
	        apply(tree, [
	            { op: 'remove', path: this.from }
	        ]);
	        apply(tree, [
	            { op: 'add', path: this.path, value: tempOperation.value }
	        ]);
	        return original;
	    },
	    copy: function (obj, key, tree) {
	        var temp = { op: '_get', path: this.from };
	        apply(tree, [temp]);
	        apply(tree, [
	            { op: 'add', path: this.path, value: temp.value }
	        ]);
	    },
	    test: function (obj, key) {
	        return equals(obj[key], this.value);
	    },
	    _get: function (obj, key) {
	        this.value = obj[key];
	    }
	};
	var arrayOperations = {
	    add: function (arr, i) {
	        arr.splice(i, 0, this.value);
	        return i;
	    },
	    remove: function (arr, i) {
	        var removedList = arr.splice(i, 1);
	        return removedList[0];
	    },
	    replace: function (arr, i) {
	        var removed = arr[i];
	        arr[i] = this.value;
	        return removed;
	    },
	    move: objectOperations.move,
	    copy: objectOperations.copy,
	    test: objectOperations.test,
	    _get: objectOperations._get
	};
	var rootOperations = {
	    add: function (obj) {
	        rootOperations.remove.call(this, obj);
	        for (var key in this.value) {
	            if (this.value.hasOwnProperty(key)) {
	                obj[key] = this.value[key];
	            }
	        }
	    },
	    remove: function (obj) {
	        var removed = {};
	        for (var key in obj) {
	            if (obj.hasOwnProperty(key)) {
	                removed[key] = obj[key];
	                objectOperations.remove.call(this, obj, key);
	            }
	        }
	        return removed;
	    },
	    replace: function (obj) {
	        var removed = apply(obj, [
	            { op: 'remove', path: this.path }
	        ]);
	        apply(obj, [
	            { op: 'add', path: this.path, value: this.value }
	        ]);
	        return removed[0];
	    },
	    move: objectOperations.move,
	    copy: objectOperations.copy,
	    test: function (obj) {
	        return (JSON.stringify(obj) === JSON.stringify(this.value));
	    },
	    _get: function (obj) {
	        this.value = obj;
	    }
	};
	function apply(tree, patches, validate) {
	    var results = new Array(patches.length);
	    var plen = patches.length;
	    var p = 0, patch, key;
	    while (p < plen) {
	        patch = patches[p];
	        p++;
	        var path = patch.path || '';
	        var keys = path.split('/');
	        var len = keys.length;
	        var obj = tree;
	        var t = 1;
	        var existingPathFragment = undefined;
	        while (true) {
	            key = keys[t];
	            t++;
	            if (key === undefined) {
	                if (t >= len) {
	                    results[p - 1] = rootOperations[patch.op].call(patch, obj, key, tree);
	                    break;
	                }
	            }
	            if (Array.isArray(obj)) {
	                if (key === '-') {
	                    key = obj.length;
	                }
	                else {
	                    key = parseInt(key, 10);
	                }
	                if (t >= len) {
	                    results[p - 1] = arrayOperations[patch.op].call(patch, obj, key, tree);
	                    break;
	                }
	            }
	            else {
	                if (key && key.indexOf('~') >= 0) {
	                    key = key.replace(/~1/g, '/').replace(/~0/g, '~');
	                }
	                if (t >= len) {
	                    results[p - 1] = objectOperations[patch.op].call(patch, obj, key, tree);
	                    break;
	                }
	            }
	            obj = obj[key];
	        }
	    }
	    return results;
	}
	exports.apply = apply;
	function escapePathComponent(str) {
	    if (str.indexOf('/') < 0 &&
	        str.indexOf('~') < 0) {
	        return str;
	    }
	    return str.replace(/~/g, '~0').replace(/\//g, '~1');
	}
	function generatePatch(mirror, obj, patches, path) {
	    var newKeys = Object.keys(obj);
	    var oldKeys = Object.keys(mirror);
	    var changed = false;
	    var deleted = false;
	    for (var t = oldKeys.length - 1; t >= 0; t--) {
	        var key = oldKeys[t];
	        var oldVal = mirror[key];
	        if (obj.hasOwnProperty(key) && !(obj[key] == null && Array.isArray(obj) === false)) {
	            var newVal = obj[key];
	            if (typeof oldVal === 'object' && oldVal != null && typeof newVal === 'object' && newVal != null) {
	                generatePatch(oldVal, newVal, patches, path + '/' + escapePathComponent(key));
	            }
	            else {
	                if (oldVal == null && newVal == null) {
	                    continue;
	                }
	                else if (oldVal !== newVal) {
	                    changed = true;
	                    patches.push({ op: 'replace', path: path + '/' + escapePathComponent(key), value: newVal });
	                }
	            }
	        }
	        else {
	            if (oldVal != null) {
	                patches.push({ op: 'remove', path: path + '/' + escapePathComponent(key) });
	                deleted = true;
	            }
	        }
	    }
	    if (!deleted && newKeys.length === oldKeys.length) {
	        return;
	    }
	    for (var t = 0; t < newKeys.length; t++) {
	        var key = newKeys[t];
	        if (!mirror.hasOwnProperty(key) && obj[key] !== undefined) {
	            patches.push({ op: 'add', path: path + '/' + escapePathComponent(key), value: obj[key] });
	        }
	    }
	}
	function compare(tree1, tree2) {
	    var patches = [];
	    generatePatch(tree1, tree2, patches, '');
	    return patches;
	}
	exports.compare = compare;


/***/ },

/***/ 206:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var clone = (function() {
	'use strict';
	
	var nativeMap;
	try {
	  nativeMap = Map;
	} catch(_) {
	  // maybe a reference error because no `Map`. Give it a dummy value that no
	  // value will ever be an instanceof.
	  nativeMap = function() {};
	}
	
	var nativeSet;
	try {
	  nativeSet = Set;
	} catch(_) {
	  nativeSet = function() {};
	}
	
	var nativePromise;
	try {
	  nativePromise = Promise;
	} catch(_) {
	  nativePromise = function() {};
	}
	
	/**
	 * Clones (copies) an Object using deep copying.
	 *
	 * This function supports circular references by default, but if you are certain
	 * there are no circular references in your object, you can save some CPU time
	 * by calling clone(obj, false).
	 *
	 * Caution: if `circular` is false and `parent` contains circular references,
	 * your program may enter an infinite loop and crash.
	 *
	 * @param `parent` - the object to be cloned
	 * @param `circular` - set to true if the object to be cloned may contain
	 *    circular references. (optional - true by default)
	 * @param `depth` - set to a number if the object is only to be cloned to
	 *    a particular depth. (optional - defaults to Infinity)
	 * @param `prototype` - sets the prototype to be used when cloning an object.
	 *    (optional - defaults to parent prototype).
	 * @param `includeNonEnumerable` - set to true if the non-enumerable properties
	 *    should be cloned as well. Non-enumerable properties on the prototype
	 *    chain will be ignored. (optional - false by default)
	*/
	function clone(parent, circular, depth, prototype, includeNonEnumerable) {
	  if (typeof circular === 'object') {
	    depth = circular.depth;
	    prototype = circular.prototype;
	    includeNonEnumerable = circular.includeNonEnumerable;
	    circular = circular.circular;
	  }
	  // maintain two arrays for circular references, where corresponding parents
	  // and children have the same index
	  var allParents = [];
	  var allChildren = [];
	
	  var useBuffer = typeof Buffer != 'undefined';
	
	  if (typeof circular == 'undefined')
	    circular = true;
	
	  if (typeof depth == 'undefined')
	    depth = Infinity;
	
	  // recurse this function so we don't reset allParents and allChildren
	  function _clone(parent, depth) {
	    // cloning null always returns null
	    if (parent === null)
	      return null;
	
	    if (depth === 0)
	      return parent;
	
	    var child;
	    var proto;
	    if (typeof parent != 'object') {
	      return parent;
	    }
	
	    if (parent instanceof nativeMap) {
	      child = new nativeMap();
	    } else if (parent instanceof nativeSet) {
	      child = new nativeSet();
	    } else if (parent instanceof nativePromise) {
	      child = new nativePromise(function (resolve, reject) {
	        parent.then(function(value) {
	          resolve(_clone(value, depth - 1));
	        }, function(err) {
	          reject(_clone(err, depth - 1));
	        });
	      });
	    } else if (clone.__isArray(parent)) {
	      child = [];
	    } else if (clone.__isRegExp(parent)) {
	      child = new RegExp(parent.source, __getRegExpFlags(parent));
	      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
	    } else if (clone.__isDate(parent)) {
	      child = new Date(parent.getTime());
	    } else if (useBuffer && Buffer.isBuffer(parent)) {
	      child = new Buffer(parent.length);
	      parent.copy(child);
	      return child;
	    } else if (parent instanceof Error) {
	      child = Object.create(parent);
	    } else {
	      if (typeof prototype == 'undefined') {
	        proto = Object.getPrototypeOf(parent);
	        child = Object.create(proto);
	      }
	      else {
	        child = Object.create(prototype);
	        proto = prototype;
	      }
	    }
	
	    if (circular) {
	      var index = allParents.indexOf(parent);
	
	      if (index != -1) {
	        return allChildren[index];
	      }
	      allParents.push(parent);
	      allChildren.push(child);
	    }
	
	    if (parent instanceof nativeMap) {
	      var keyIterator = parent.keys();
	      while(true) {
	        var next = keyIterator.next();
	        if (next.done) {
	          break;
	        }
	        var keyChild = _clone(next.value, depth - 1);
	        var valueChild = _clone(parent.get(next.value), depth - 1);
	        child.set(keyChild, valueChild);
	      }
	    }
	    if (parent instanceof nativeSet) {
	      var iterator = parent.keys();
	      while(true) {
	        var next = iterator.next();
	        if (next.done) {
	          break;
	        }
	        var entryChild = _clone(next.value, depth - 1);
	        child.add(entryChild);
	      }
	    }
	
	    for (var i in parent) {
	      var attrs;
	      if (proto) {
	        attrs = Object.getOwnPropertyDescriptor(proto, i);
	      }
	
	      if (attrs && attrs.set == null) {
	        continue;
	      }
	      child[i] = _clone(parent[i], depth - 1);
	    }
	
	    if (Object.getOwnPropertySymbols) {
	      var symbols = Object.getOwnPropertySymbols(parent);
	      for (var i = 0; i < symbols.length; i++) {
	        // Don't need to worry about cloning a symbol because it is a primitive,
	        // like a number or string.
	        var symbol = symbols[i];
	        var descriptor = Object.getOwnPropertyDescriptor(parent, symbol);
	        if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
	          continue;
	        }
	        child[symbol] = _clone(parent[symbol], depth - 1);
	        if (!descriptor.enumerable) {
	          Object.defineProperty(child, symbol, {
	            enumerable: false
	          });
	        }
	      }
	    }
	
	    if (includeNonEnumerable) {
	      var allPropertyNames = Object.getOwnPropertyNames(parent);
	      for (var i = 0; i < allPropertyNames.length; i++) {
	        var propertyName = allPropertyNames[i];
	        var descriptor = Object.getOwnPropertyDescriptor(parent, propertyName);
	        if (descriptor && descriptor.enumerable) {
	          continue;
	        }
	        child[propertyName] = _clone(parent[propertyName], depth - 1);
	        Object.defineProperty(child, propertyName, {
	          enumerable: false
	        });
	      }
	    }
	
	    return child;
	  }
	
	  return _clone(parent, depth);
	}
	
	/**
	 * Simple flat clone using prototype, accepts only objects, usefull for property
	 * override on FLAT configuration object (no nested props).
	 *
	 * USE WITH CAUTION! This may not behave as you wish if you do not know how this
	 * works.
	 */
	clone.clonePrototype = function clonePrototype(parent) {
	  if (parent === null)
	    return null;
	
	  var c = function () {};
	  c.prototype = parent;
	  return new c();
	};
	
	// private utility functions
	
	function __objToStr(o) {
	  return Object.prototype.toString.call(o);
	}
	clone.__objToStr = __objToStr;
	
	function __isDate(o) {
	  return typeof o === 'object' && __objToStr(o) === '[object Date]';
	}
	clone.__isDate = __isDate;
	
	function __isArray(o) {
	  return typeof o === 'object' && __objToStr(o) === '[object Array]';
	}
	clone.__isArray = __isArray;
	
	function __isRegExp(o) {
	  return typeof o === 'object' && __objToStr(o) === '[object RegExp]';
	}
	clone.__isRegExp = __isRegExp;
	
	function __getRegExpFlags(re) {
	  var flags = '';
	  if (re.global) flags += 'g';
	  if (re.ignoreCase) flags += 'i';
	  if (re.multiline) flags += 'm';
	  return flags;
	}
	clone.__getRegExpFlags = __getRegExpFlags;
	
	return clone;
	})();
	
	if (typeof module === 'object' && module.exports) {
	  module.exports = clone;
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8).Buffer))

/***/ },

/***/ 255:
/***/ function(module, exports) {

	"use strict";
	/**
	 * An execution context and a data structure to order tasks and schedule their
	 * execution. Provides a notion of (potentially virtual) time, through the
	 * `now()` getter method.
	 *
	 * Each unit of work in a Scheduler is called an {@link Action}.
	 *
	 * ```ts
	 * class Scheduler {
	 *   now(): number;
	 *   schedule(work, delay?, state?): Subscription;
	 * }
	 * ```
	 *
	 * @class Scheduler
	 */
	var Scheduler = (function () {
	    function Scheduler(SchedulerAction, now) {
	        if (now === void 0) { now = Scheduler.now; }
	        this.SchedulerAction = SchedulerAction;
	        this.now = now;
	    }
	    /**
	     * Schedules a function, `work`, for execution. May happen at some point in
	     * the future, according to the `delay` parameter, if specified. May be passed
	     * some context object, `state`, which will be passed to the `work` function.
	     *
	     * The given arguments will be processed an stored as an Action object in a
	     * queue of actions.
	     *
	     * @param {function(state: ?T): ?Subscription} work A function representing a
	     * task, or some unit of work to be executed by the Scheduler.
	     * @param {number} [delay] Time to wait before executing the work, where the
	     * time unit is implicit and defined by the Scheduler itself.
	     * @param {T} [state] Some contextual data that the `work` function uses when
	     * called by the Scheduler.
	     * @return {Subscription} A subscription in order to be able to unsubscribe
	     * the scheduled work.
	     */
	    Scheduler.prototype.schedule = function (work, delay, state) {
	        if (delay === void 0) { delay = 0; }
	        return new this.SchedulerAction(this, work).schedule(state, delay);
	    };
	    Scheduler.now = Date.now ? Date.now : function () { return +new Date(); };
	    return Scheduler;
	}());
	exports.Scheduler = Scheduler;
	//# sourceMappingURL=Scheduler.js.map

/***/ },

/***/ 256:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Observable_1 = __webpack_require__(1);
	var debounceTime_1 = __webpack_require__(261);
	Observable_1.Observable.prototype.debounceTime = debounceTime_1.debounceTime;
	//# sourceMappingURL=debounceTime.js.map

/***/ },

/***/ 261:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subscriber_1 = __webpack_require__(4);
	var async_1 = __webpack_require__(36);
	/**
	 * Emits a value from the source Observable only after a particular time span
	 * has passed without another source emission.
	 *
	 * <span class="informal">It's like {@link delay}, but passes only the most
	 * recent value from each burst of emissions.</span>
	 *
	 * <img src="./img/debounceTime.png" width="100%">
	 *
	 * `debounceTime` delays values emitted by the source Observable, but drops
	 * previous pending delayed emissions if a new value arrives on the source
	 * Observable. This operator keeps track of the most recent value from the
	 * source Observable, and emits that only when `dueTime` enough time has passed
	 * without any other value appearing on the source Observable. If a new value
	 * appears before `dueTime` silence occurs, the previous value will be dropped
	 * and will not be emitted on the output Observable.
	 *
	 * This is a rate-limiting operator, because it is impossible for more than one
	 * value to be emitted in any time window of duration `dueTime`, but it is also
	 * a delay-like operator since output emissions do not occur at the same time as
	 * they did on the source Observable. Optionally takes a {@link IScheduler} for
	 * managing timers.
	 *
	 * @example <caption>Emit the most recent click after a burst of clicks</caption>
	 * var clicks = Rx.Observable.fromEvent(document, 'click');
	 * var result = clicks.debounceTime(1000);
	 * result.subscribe(x => console.log(x));
	 *
	 * @see {@link auditTime}
	 * @see {@link debounce}
	 * @see {@link delay}
	 * @see {@link sampleTime}
	 * @see {@link throttleTime}
	 *
	 * @param {number} dueTime The timeout duration in milliseconds (or the time
	 * unit determined internally by the optional `scheduler`) for the window of
	 * time required to wait for emission silence before emitting the most recent
	 * source value.
	 * @param {Scheduler} [scheduler=async] The {@link IScheduler} to use for
	 * managing the timers that handle the timeout for each value.
	 * @return {Observable} An Observable that delays the emissions of the source
	 * Observable by the specified `dueTime`, and may drop some values if they occur
	 * too frequently.
	 * @method debounceTime
	 * @owner Observable
	 */
	function debounceTime(dueTime, scheduler) {
	    if (scheduler === void 0) { scheduler = async_1.async; }
	    return this.lift(new DebounceTimeOperator(dueTime, scheduler));
	}
	exports.debounceTime = debounceTime;
	var DebounceTimeOperator = (function () {
	    function DebounceTimeOperator(dueTime, scheduler) {
	        this.dueTime = dueTime;
	        this.scheduler = scheduler;
	    }
	    DebounceTimeOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new DebounceTimeSubscriber(subscriber, this.dueTime, this.scheduler));
	    };
	    return DebounceTimeOperator;
	}());
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var DebounceTimeSubscriber = (function (_super) {
	    __extends(DebounceTimeSubscriber, _super);
	    function DebounceTimeSubscriber(destination, dueTime, scheduler) {
	        _super.call(this, destination);
	        this.dueTime = dueTime;
	        this.scheduler = scheduler;
	        this.debouncedSubscription = null;
	        this.lastValue = null;
	        this.hasValue = false;
	    }
	    DebounceTimeSubscriber.prototype._next = function (value) {
	        this.clearDebounce();
	        this.lastValue = value;
	        this.hasValue = true;
	        this.add(this.debouncedSubscription = this.scheduler.schedule(dispatchNext, this.dueTime, this));
	    };
	    DebounceTimeSubscriber.prototype._complete = function () {
	        this.debouncedNext();
	        this.destination.complete();
	    };
	    DebounceTimeSubscriber.prototype.debouncedNext = function () {
	        this.clearDebounce();
	        if (this.hasValue) {
	            this.destination.next(this.lastValue);
	            this.lastValue = null;
	            this.hasValue = false;
	        }
	    };
	    DebounceTimeSubscriber.prototype.clearDebounce = function () {
	        var debouncedSubscription = this.debouncedSubscription;
	        if (debouncedSubscription !== null) {
	            this.remove(debouncedSubscription);
	            debouncedSubscription.unsubscribe();
	            this.debouncedSubscription = null;
	        }
	    };
	    return DebounceTimeSubscriber;
	}(Subscriber_1.Subscriber));
	function dispatchNext(subscriber) {
	    subscriber.debouncedNext();
	}
	//# sourceMappingURL=debounceTime.js.map

/***/ },

/***/ 265:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subscription_1 = __webpack_require__(17);
	/**
	 * A unit of work to be executed in a {@link Scheduler}. An action is typically
	 * created from within a Scheduler and an RxJS user does not need to concern
	 * themselves about creating and manipulating an Action.
	 *
	 * ```ts
	 * class Action<T> extends Subscription {
	 *   new (scheduler: Scheduler, work: (state?: T) => void);
	 *   schedule(state?: T, delay: number = 0): Subscription;
	 * }
	 * ```
	 *
	 * @class Action<T>
	 */
	var Action = (function (_super) {
	    __extends(Action, _super);
	    function Action(scheduler, work) {
	        _super.call(this);
	    }
	    /**
	     * Schedules this action on its parent Scheduler for execution. May be passed
	     * some context object, `state`. May happen at some point in the future,
	     * according to the `delay` parameter, if specified.
	     * @param {T} [state] Some contextual data that the `work` function uses when
	     * called by the Scheduler.
	     * @param {number} [delay] Time to wait before executing the work, where the
	     * time unit is implicit and defined by the Scheduler.
	     * @return {void}
	     */
	    Action.prototype.schedule = function (state, delay) {
	        if (delay === void 0) { delay = 0; }
	        return this;
	    };
	    return Action;
	}(Subscription_1.Subscription));
	exports.Action = Action;
	//# sourceMappingURL=Action.js.map

/***/ },

/***/ 266:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var AsyncAction_1 = __webpack_require__(108);
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var QueueAction = (function (_super) {
	    __extends(QueueAction, _super);
	    function QueueAction(scheduler, work) {
	        _super.call(this, scheduler, work);
	        this.scheduler = scheduler;
	        this.work = work;
	    }
	    QueueAction.prototype.schedule = function (state, delay) {
	        if (delay === void 0) { delay = 0; }
	        if (delay > 0) {
	            return _super.prototype.schedule.call(this, state, delay);
	        }
	        this.delay = delay;
	        this.state = state;
	        this.scheduler.flush(this);
	        return this;
	    };
	    QueueAction.prototype.execute = function (state, delay) {
	        return (delay > 0 || this.closed) ?
	            _super.prototype.execute.call(this, state, delay) :
	            this._execute(state, delay);
	    };
	    QueueAction.prototype.requestAsyncId = function (scheduler, id, delay) {
	        if (delay === void 0) { delay = 0; }
	        // If delay exists and is greater than 0, or if the delay is null (the
	        // action wasn't rescheduled) but was originally scheduled as an async
	        // action, then recycle as an async action.
	        if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
	            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
	        }
	        // Otherwise flush the scheduler starting with this action.
	        return scheduler.flush(this);
	    };
	    return QueueAction;
	}(AsyncAction_1.AsyncAction));
	exports.QueueAction = QueueAction;
	//# sourceMappingURL=QueueAction.js.map

/***/ },

/***/ 267:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var AsyncScheduler_1 = __webpack_require__(109);
	var QueueScheduler = (function (_super) {
	    __extends(QueueScheduler, _super);
	    function QueueScheduler() {
	        _super.apply(this, arguments);
	    }
	    return QueueScheduler;
	}(AsyncScheduler_1.AsyncScheduler));
	exports.QueueScheduler = QueueScheduler;
	//# sourceMappingURL=QueueScheduler.js.map

/***/ },

/***/ 268:
/***/ function(module, exports) {

	"use strict";
	var FastMap = (function () {
	    function FastMap() {
	        this.values = {};
	    }
	    FastMap.prototype.delete = function (key) {
	        this.values[key] = null;
	        return true;
	    };
	    FastMap.prototype.set = function (key, value) {
	        this.values[key] = value;
	        return this;
	    };
	    FastMap.prototype.get = function (key) {
	        return this.values[key];
	    };
	    FastMap.prototype.forEach = function (cb, thisArg) {
	        var values = this.values;
	        for (var key in values) {
	            if (values.hasOwnProperty(key) && values[key] !== null) {
	                cb.call(thisArg, values[key], key);
	            }
	        }
	    };
	    FastMap.prototype.clear = function () {
	        this.values = {};
	    };
	    return FastMap;
	}());
	exports.FastMap = FastMap;
	//# sourceMappingURL=FastMap.js.map

/***/ },

/***/ 269:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var root_1 = __webpack_require__(22);
	var MapPolyfill_1 = __webpack_require__(270);
	exports.Map = root_1.root.Map || (function () { return MapPolyfill_1.MapPolyfill; })();
	//# sourceMappingURL=Map.js.map

/***/ },

/***/ 270:
/***/ function(module, exports) {

	"use strict";
	var MapPolyfill = (function () {
	    function MapPolyfill() {
	        this.size = 0;
	        this._values = [];
	        this._keys = [];
	    }
	    MapPolyfill.prototype.get = function (key) {
	        var i = this._keys.indexOf(key);
	        return i === -1 ? undefined : this._values[i];
	    };
	    MapPolyfill.prototype.set = function (key, value) {
	        var i = this._keys.indexOf(key);
	        if (i === -1) {
	            this._keys.push(key);
	            this._values.push(value);
	            this.size++;
	        }
	        else {
	            this._values[i] = value;
	        }
	        return this;
	    };
	    MapPolyfill.prototype.delete = function (key) {
	        var i = this._keys.indexOf(key);
	        if (i === -1) {
	            return false;
	        }
	        this._values.splice(i, 1);
	        this._keys.splice(i, 1);
	        this.size--;
	        return true;
	    };
	    MapPolyfill.prototype.clear = function () {
	        this._keys.length = 0;
	        this._values.length = 0;
	        this.size = 0;
	    };
	    MapPolyfill.prototype.forEach = function (cb, thisArg) {
	        for (var i = 0; i < this.size; i++) {
	            cb.call(thisArg, this._values[i], this._keys[i]);
	        }
	    };
	    return MapPolyfill;
	}());
	exports.MapPolyfill = MapPolyfill;
	//# sourceMappingURL=MapPolyfill.js.map

/***/ },

/***/ 271:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Subscriber_1 = __webpack_require__(4);
	var rxSubscriber_1 = __webpack_require__(110);
	var Observer_1 = __webpack_require__(152);
	function toSubscriber(nextOrObserver, error, complete) {
	    if (nextOrObserver) {
	        if (nextOrObserver instanceof Subscriber_1.Subscriber) {
	            return nextOrObserver;
	        }
	        if (nextOrObserver[rxSubscriber_1.rxSubscriber]) {
	            return nextOrObserver[rxSubscriber_1.rxSubscriber]();
	        }
	    }
	    if (!nextOrObserver && !error && !complete) {
	        return new Subscriber_1.Subscriber(Observer_1.empty);
	    }
	    return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
	}
	exports.toSubscriber = toSubscriber;
	//# sourceMappingURL=toSubscriber.js.map

/***/ },

/***/ 272:
/***/ function(module, exports) {

	module.exports = "padding: 5px;\nfont-size: 11px;\nline-height: 11px;\nposition: absolute;\ntext-align: right;\nz-index: 9999999999999 !important;\npointer-events: none;\nmin-height: 5px;\nbackground: rgba(126, 183, 253, 0.3);\nborder: 1px solid rgba(126, 183, 253, 0.7) !important;\ncolor: #6da9d7 !important;"

/***/ },

/***/ 273:
/***/ function(module, exports) {

	"use strict";
	exports.isAngular = function () {
	    return typeof getAllAngularTestabilities === 'function'
	        && typeof getAllAngularRootElements === 'function';
	};
	exports.isDebugMode = function () {
	    if (typeof getAllAngularRootElements === 'function'
	        && typeof ng !== 'undefined') {
	        var rootElements = getAllAngularRootElements();
	        var firstRootDebugElement = rootElements && rootElements.length ?
	            ng.probe(rootElements[0]) : null;
	        return firstRootDebugElement !== null
	            && firstRootDebugElement !== void 0
	            && firstRootDebugElement.injector;
	    }
	    return false;
	};


/***/ },

/***/ 274:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(126));
	__export(__webpack_require__(203));
	__export(__webpack_require__(276));
	__export(__webpack_require__(112));
	__export(__webpack_require__(275));


/***/ },

/***/ 275:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var tree_1 = __webpack_require__(40);
	exports.getNodeFromPartialPath = function (tree, path) {
	    var pindex = exports.propertyIndex(path);
	    return tree.traverse(path.slice(0, pindex));
	};
	exports.getPropertyPath = function (path) {
	    var index = exports.propertyIndex(path);
	    if (index === path.length) {
	        return [];
	    }
	    return path.slice(index);
	};
	exports.getInstanceFromPath = function (instance, path) {
	    if (instance == null) {
	        return null;
	    }
	    var propertyPath = path.slice(0);
	    while (propertyPath.length > 0) {
	        instance = instance[propertyPath.shift()];
	        if (instance == null) {
	            return null;
	        }
	    }
	    return instance;
	};
	exports.getNodeProvider = function (element, providerToken, propertyPath) {
	    var token = element.providerTokens.find(function (t) { return tree_1.tokenName(t) === providerToken; });
	    if (token == null) {
	        return null;
	    }
	    var path = exports.getPropertyPath(propertyPath.slice(0, propertyPath.length - 1));
	    return exports.getInstanceFromPath(element.injector.get(token), path);
	};
	exports.getNodeInstanceParent = function (element, path) {
	    if (path.length === 0) {
	        return null;
	    }
	    var propertyPath = exports.getPropertyPath(path.slice(0, path.length - 1));
	    if (propertyPath.length > 0) {
	        return exports.getInstanceFromPath(element.componentInstance, propertyPath);
	    }
	    else {
	        return element.componentInstance;
	    }
	};
	exports.propertyIndex = function (path) {
	    var index = 0;
	    while (index < path.length) {
	        if (typeof path[index] !== 'number') {
	            break;
	        }
	        ++index;
	    }
	    return index;
	};


/***/ },

/***/ 276:
/***/ function(module, exports) {

	"use strict";
	function parseRoutes(router) {
	    var rootName = router.rootComponentType ? router.rootComponentType.name : 'no-name';
	    var rootChildren = router.config;
	    var root = {
	        handler: rootName,
	        name: rootName,
	        path: '/',
	        children: rootChildren ? assignChildrenToParent(null, rootChildren) : [],
	        isAux: false,
	        specificity: null,
	        data: null,
	        hash: null,
	    };
	    return root;
	}
	exports.parseRoutes = parseRoutes;
	function assignChildrenToParent(parentPath, children) {
	    return children.map(function (child) {
	        var childName = childRouteName(child);
	        var childDescendents = child._loadedConfig ? child._loadedConfig.routes : child.children;
	        var isAuxRoute = !!child.outlet;
	        var pathFragment = child.outlet ? "(" + child.outlet + ":" + child.path + ")" : child.path;
	        var routeConfig = {
	            handler: childName,
	            data: [],
	            hash: null,
	            specificity: null,
	            name: childName,
	            path: ((parentPath ? parentPath : '') + "/" + pathFragment).split('//').join('/'),
	            isAux: isAuxRoute,
	            children: [],
	        };
	        if (childDescendents) {
	            routeConfig.children = assignChildrenToParent(routeConfig.path, childDescendents);
	        }
	        if (child.data) {
	            for (var el in child.data) {
	                if (child.data.hasOwnProperty(el)) {
	                    routeConfig.data.push({
	                        key: el,
	                        value: child.data[el],
	                    });
	                }
	            }
	        }
	        return routeConfig;
	    });
	}
	function childRouteName(child) {
	    if (child.component) {
	        return child.component.name;
	    }
	    else if (child.loadChildren) {
	        return child.path + " [Lazy]";
	    }
	    else {
	        return 'no-name-route';
	    }
	}


/***/ },

/***/ 279:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(281));
	__export(__webpack_require__(280));


/***/ },

/***/ 280:
/***/ function(module, exports) {

	"use strict";
	var MessageQueue = (function () {
	    function MessageQueue() {
	        this.queue = new Array();
	    }
	    MessageQueue.prototype.clear = function () {
	        this.queue = [];
	    };
	    MessageQueue.prototype.enqueue = function (element) {
	        this.queue.push(element);
	    };
	    MessageQueue.prototype.dequeue = function () {
	        var q = this.queue;
	        this.queue = [];
	        return q;
	    };
	    return MessageQueue;
	}());
	exports.MessageQueue = MessageQueue;


/***/ },

/***/ 281:
/***/ function(module, exports) {

	"use strict";
	var Stack = (function () {
	    function Stack() {
	        this.elements = [];
	    }
	    Object.defineProperty(Stack.prototype, "size", {
	        get: function () {
	            return this.elements.length;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Stack.prototype.clear = function () {
	        this.elements = [];
	    };
	    Stack.prototype.push = function (element) {
	        this.elements.push(element);
	    };
	    Stack.prototype.pop = function () {
	        if (this.elements.length === 0) {
	            return null;
	        }
	        return this.elements.pop();
	    };
	    return Stack;
	}());
	exports.Stack = Stack;


/***/ },

/***/ 282:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Subscriber_1 = __webpack_require__(4);
	var Observable_1 = __webpack_require__(1);
	var Subject_1 = __webpack_require__(13);
	var AsyncSubject_1 = __webpack_require__(123);
	var BehaviorSubject_1 = __webpack_require__(137);
	var ReplaySubject_1 = __webpack_require__(138);
	var groupBy_1 = __webpack_require__(193);
	var decorators_1 = __webpack_require__(113);
	var utils_1 = __webpack_require__(16);
	var description_1 = __webpack_require__(126);
	var ObjectType;
	(function (ObjectType) {
	    ObjectType[ObjectType["Input"] = 1] = "Input";
	    ObjectType[ObjectType["Output"] = 2] = "Output";
	    ObjectType[ObjectType["Subject"] = 4] = "Subject";
	    ObjectType[ObjectType["Observable"] = 8] = "Observable";
	    ObjectType[ObjectType["EventEmitter"] = 16] = "EventEmitter";
	    ObjectType[ObjectType["ViewChild"] = 32] = "ViewChild";
	    ObjectType[ObjectType["ViewChildren"] = 64] = "ViewChildren";
	    ObjectType[ObjectType["ContentChild"] = 128] = "ContentChild";
	    ObjectType[ObjectType["ContentChildren"] = 256] = "ContentChildren";
	})(ObjectType = exports.ObjectType || (exports.ObjectType = {}));
	exports.instanceWithMetadata = function (debugElement, node, instance) {
	    if (node == null) {
	        return null;
	    }
	    var isComponent = description_1.isDebugElementComponent(debugElement);
	    var objectMetadata = new Map();
	    var components = new Map();
	    var providers = debugElement.providerTokens
	        .map(function (t) { return [exports.tokenName(t), debugElement.injector.get(t)]; })
	        .filter(function (provider) { return provider[1] !== instance; });
	    var result = {
	        instance: isComponent ? instance : null,
	        providers: providers,
	        metadata: objectMetadata,
	        componentMetadata: components,
	    };
	    if (!isComponent) {
	        return result;
	    }
	    utils_1.recurse(instance, function (obj) {
	        var update = function (key, flag, additionalProps) {
	            var existing = components.get(obj);
	            if (existing) {
	                existing.push([key, flag, additionalProps]);
	            }
	            else {
	                components.set(obj, [[key, flag, additionalProps]]);
	            }
	        };
	        var component = obj ? decorators_1.componentMetadata(obj.constructor) : null;
	        if (component) {
	            for (var _i = 0, _a = decorators_1.componentInputs(component, obj); _i < _a.length; _i++) {
	                var input = _a[_i];
	                update(input.propertyKey, ObjectType.Input, { alias: input.bindingPropertyName });
	            }
	            for (var _b = 0, _c = decorators_1.componentOutputs(component, obj); _b < _c.length; _b++) {
	                var output = _c[_b];
	                update(output.propertyKey, ObjectType.Output, { alias: output.bindingPropertyName });
	            }
	            var addQuery = function (decoratorType, objectType) {
	                for (var _i = 0, _a = decorators_1.componentQueryChildren(decoratorType, component, obj); _i < _a.length; _i++) {
	                    var vc = _a[_i];
	                    update(vc.propertyKey, objectType, { selector: vc.selector });
	                }
	            };
	            addQuery('@ViewChild', ObjectType.ViewChild);
	            addQuery('@ViewChildren', ObjectType.ViewChildren);
	            addQuery('@ContentChild', ObjectType.ContentChild);
	            addQuery('@ContentChildren', ObjectType.ContentChildren);
	        }
	        var type = objectType(obj);
	        if (type !== 0) {
	            var existing = objectMetadata.get(obj);
	            if (existing) {
	                objectMetadata.set(obj, [existing[0] | type, existing[1]]);
	            }
	            else {
	                objectMetadata.set(obj, [type, null]);
	            }
	        }
	    });
	    result.metadata = Array.from(objectMetadata);
	    result.componentMetadata = Array.from(components);
	    return result;
	};
	exports.tokenName = function (token) { return utils_1.functionName(token) || token.toString(); };
	var objectType = function (object) {
	    if (object != null && !utils_1.isScalar(object)) {
	        var constructor = object && object.constructor ?
	            object.constructor : ({}).constructor;
	        switch (utils_1.functionName(constructor)) {
	            case 'EventEmitter':
	                return ObjectType.EventEmitter;
	            case utils_1.functionName(AsyncSubject_1.AsyncSubject):
	            case utils_1.functionName(Subject_1.AnonymousSubject):
	            case utils_1.functionName(BehaviorSubject_1.BehaviorSubject):
	            case utils_1.functionName(ReplaySubject_1.ReplaySubject):
	            case utils_1.functionName(Subject_1.Subject):
	            case utils_1.functionName(Subscriber_1.Subscriber):
	            case utils_1.functionName(Subject_1.SubjectSubscriber):
	                return ObjectType.Subject | ObjectType.Observable;
	            case utils_1.functionName(Observable_1.Observable):
	            case utils_1.functionName(groupBy_1.GroupedObservable):
	                return ObjectType.Observable;
	        }
	    }
	    return 0;
	};


/***/ },

/***/ 283:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var mutable_tree_1 = __webpack_require__(158);
	var transformer_1 = __webpack_require__(284);
	exports.transformToTree = function (root, index, options, increment) {
	    var map = new Map();
	    try {
	        return transformer_1.transform([index], root, options, map, increment);
	    }
	    finally {
	        map.clear();
	    }
	};
	exports.createTree = function (roots) {
	    var tree = new mutable_tree_1.MutableTree();
	    tree.roots = roots;
	    return tree;
	};
	exports.createTreeFromElements = function (roots, options) {
	    var tree = new mutable_tree_1.MutableTree();
	    var count = 0;
	    tree.roots = roots.map(function (r, index) { return exports.transformToTree(r, index, options, function (n) { return count += n; }); });
	    return { tree: tree, count: count };
	};


/***/ },

/***/ 284:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var clone = __webpack_require__(206);
	var description_1 = __webpack_require__(126);
	var options_1 = __webpack_require__(127);
	var path_1 = __webpack_require__(41);
	var utils_1 = __webpack_require__(16);
	var decorators_1 = __webpack_require__(113);
	var parse_modules_1 = __webpack_require__(112);
	exports.transform = function (path, element, options, cache, count) {
	    if (element == null) {
	        return null;
	    }
	    var serializedPath = path_1.serializePath(path);
	    var existing = cache.get(serializedPath);
	    if (existing) {
	        return existing;
	    }
	    var listeners = element.listeners.map(function (l) { return clone(l); });
	    var name = description_1.getComponentName(element);
	    var isComponent = description_1.isDebugElementComponent(element);
	    var metadata = element.componentInstance ? decorators_1.componentMetadata(element.componentInstance.constructor) : null;
	    var changeDetection = isComponent
	        ? getChangeDetection(metadata)
	        : null;
	    var node = {
	        id: serializedPath,
	        augury_token_id: element.componentInstance ?
	            Reflect.getMetadata(parse_modules_1.AUGURY_TOKEN_ID_METADATA_KEY, element.componentInstance.constructor) : null,
	        name: name,
	        listeners: listeners,
	        isComponent: isComponent,
	        providers: getComponentProviders(element, name).filter(function (p) { return p.key != null; }),
	        attributes: clone(element.attributes),
	        classes: clone(element.classes),
	        styles: clone(element.styles),
	        children: null,
	        directives: [],
	        source: element.source,
	        changeDetection: changeDetection,
	        nativeElement: function () { return element.nativeElement; },
	        description: description_1.Description.getComponentDescription(element),
	        input: decorators_1.componentInputs(metadata, element.componentInstance),
	        output: decorators_1.componentOutputs(metadata, element.componentInstance),
	        properties: clone(element.properties),
	        dependencies: description_1.isDebugElementComponent(element) ? getDependencies(element.componentInstance) : [],
	    };
	    cache.set(serializedPath, node);
	    node.children = [];
	    var transformChildren = function (children) {
	        var subindex = 0;
	        children.forEach(function (c) {
	            return node.children.push(exports.transform(path.concat([subindex++]), c, options, cache, count));
	        });
	    };
	    var getChildren = function (test) {
	        var children = element.children.map(function (c) { return exports.matchingChildren(c, test); });
	        return children.reduce(function (previous, current) { return previous.concat(current); }, []);
	    };
	    var childComponents = function () {
	        return getChildren(function (e) { return e.componentInstance != null; });
	    };
	    var childHybridComponents = function () {
	        return getChildren(function (e) { return e.providerTokens && e.providerTokens.length > 0; });
	    };
	    switch (options.componentView) {
	        case options_1.ComponentView.Hybrid:
	            transformChildren(childHybridComponents());
	            break;
	        case options_1.ComponentView.All:
	            transformChildren(element.children);
	            break;
	        case options_1.ComponentView.Components:
	            transformChildren(childComponents());
	            break;
	    }
	    count(1 + node.children.length);
	    return node;
	};
	exports.recursiveSearch = function (children, test) {
	    var result = new Array();
	    for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
	        var c = children_1[_i];
	        if (test(c)) {
	            result.push(c);
	        }
	        else {
	            Array.prototype.splice.apply(result, [result.length, 0].concat(exports.recursiveSearch(c.children, test)));
	        }
	    }
	    return result;
	};
	exports.matchingChildren = function (element, test) {
	    if (test(element)) {
	        return [element];
	    }
	    return exports.recursiveSearch(element.children, test);
	};
	var getComponentProviders = function (element, name) {
	    var providers = new Array();
	    if (element.providerTokens && element.providerTokens.length > 0) {
	        providers = element.providerTokens.map(function (provider) {
	            return description_1.Description.getProviderDescription(provider, element.injector.get(provider));
	        });
	    }
	    if (name) {
	        return providers.filter(function (provider) { return provider.key !== name; });
	    }
	    else {
	        return providers;
	    }
	};
	var getChangeDetection = function (metadata) {
	    if (metadata &&
	        metadata.changeDetection !== undefined &&
	        metadata.changeDetection !== null) {
	        return metadata.changeDetection;
	    }
	    else {
	        return 1;
	    }
	};
	var getDependencies = function (instance) {
	    var parameterDecorators = decorators_1.injectedParameterDecorators(instance);
	    var normalizedParamTypes = decorators_1.parameterTypes(instance).map(function (type, i) {
	        return type ? type : parameterDecorators[i].filter(function (decorator) { return decorator.toString() === '@Inject'; })[0].token;
	    });
	    return normalizedParamTypes.map(function (paramType, i) { return ({
	        id: Reflect.getMetadata(parse_modules_1.AUGURY_TOKEN_ID_METADATA_KEY, paramType),
	        name: utils_1.functionName(paramType) || paramType.toString(),
	        decorators: parameterDecorators[i] ? parameterDecorators[i].map(function (d) { return d.toString(); }) : [],
	    }); });
	};


/***/ },

/***/ 285:
/***/ function(module, exports) {

	"use strict";
	exports.pathExists = function (object) {
	    var args = [];
	    for (var _i = 1; _i < arguments.length; _i++) {
	        args[_i - 1] = arguments[_i];
	    }
	    return exports.getAtPath.apply(void 0, [object].concat(args)).exists;
	};
	exports.getAtPath = function (obj) {
	    var args = [];
	    for (var _i = 1; _i < arguments.length; _i++) {
	        args[_i - 1] = arguments[_i];
	    }
	    for (var i = 0; i < args.length; i++) {
	        if (!obj || !(args[i] in obj)) {
	            return { exists: false, value: void 0 };
	        }
	        obj = obj[args[i]];
	    }
	    return {
	        exists: true,
	        value: obj,
	    };
	};


/***/ },

/***/ 1137:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";
	var _this = this;
	var Subject_1 = __webpack_require__(13);
	__webpack_require__(256);
	var patch_1 = __webpack_require__(204);
	var app_check_1 = __webpack_require__(273);
	var tree_1 = __webpack_require__(40);
	var find_element_1 = __webpack_require__(1139);
	var parse_modules_1 = __webpack_require__(112);
	var parse_ng_version_1 = __webpack_require__(1140);
	var mutable_tree_factory_1 = __webpack_require__(283);
	var communication_1 = __webpack_require__(23);
	var decorators_1 = __webpack_require__(113);
	var indirect_connection_1 = __webpack_require__(202);
	var utils_1 = __webpack_require__(274);
	var utils_2 = __webpack_require__(16);
	var structures_1 = __webpack_require__(279);
	var deltaThreshold = 512;
	var messageBuffer = new structures_1.MessageQueue();
	var previousTree, previousRoutes, previousCount, onMouseOver, onMouseDown;
	var parsedModulesData = {
	    modules: {},
	    names: [],
	    configs: {},
	    tokenIdMap: {},
	};
	var runAndHandleUncaughtExceptions = function (fn) {
	    try {
	        return fn();
	    }
	    catch (e) {
	        indirect_connection_1.send(communication_1.MessageFactory.uncaughtApplicationError({
	            name: e.name,
	            stack: e.stack,
	            message: e.message,
	        }));
	    }
	};
	var sendNgVersionMessage = function () {
	    var ngVersion = parse_ng_version_1.parseNgVersion();
	    indirect_connection_1.send(communication_1.MessageFactory.ngVersion(ngVersion));
	};
	var sendNgModulesMessage = function () {
	    var ngModulesMessage = {
	        names: parsedModulesData.names,
	        tokenIdMap: parsedModulesData.tokenIdMap,
	        configs: parsedModulesData.configs,
	    };
	    messageBuffer.enqueue(communication_1.MessageFactory.ngModules(ngModulesMessage));
	    indirect_connection_1.send(communication_1.MessageFactory.push());
	};
	var parseInitialModules = function () {
	    runAndHandleUncaughtExceptions(function () {
	        var roots = getAllAngularRootElements().map(function (r) { return ng.probe(r); });
	        if (roots.length) {
	            parse_modules_1.parseModulesFromRootElement(roots[0], parsedModulesData);
	            sendNgModulesMessage();
	        }
	    });
	};
	var updateComponentTree = function (roots) {
	    var _a = mutable_tree_factory_1.createTreeFromElements(roots, treeRenderOptions), tree = _a.tree, count = _a.count;
	    if (previousTree == null || Math.abs(previousCount - count) > deltaThreshold) {
	        messageBuffer.enqueue(communication_1.MessageFactory.completeTree(tree));
	    }
	    else {
	        var changes = previousTree.diff(tree);
	        if (changes.length > 0) {
	            messageBuffer.enqueue(communication_1.MessageFactory.treeDiff(previousTree.diff(tree)));
	        }
	        else {
	            return;
	        }
	    }
	    indirect_connection_1.send(communication_1.MessageFactory.push());
	    previousTree = tree;
	    previousCount = count;
	};
	var updateLazyLoadedNgModules = function (routers) {
	    routers.forEach(function (router) {
	        parse_modules_1.parseModulesFromRouter(router, parsedModulesData);
	    });
	    sendNgModulesMessage();
	};
	var updateRouterTree = function () {
	    var routers = exports.routerTree();
	    var parsedRoutes = routers.map(utils_1.parseRoutes);
	    var routesChanged = !previousRoutes ? true : false;
	    if (previousRoutes) {
	        var changes = patch_1.compare(previousRoutes, parsedRoutes);
	        if (changes.length > 0) {
	            routesChanged = true;
	        }
	    }
	    previousRoutes = parsedRoutes;
	    if (routesChanged) {
	        updateLazyLoadedNgModules(routers);
	        messageBuffer.enqueue(communication_1.MessageFactory.routerTree(parsedRoutes));
	    }
	};
	var subject = new Subject_1.Subject();
	var subscriptions = new Array();
	var bind = function (root) {
	    var ngZone = root.injector.get(ng.coreTokens.NgZone);
	    if (ngZone) {
	        subscriptions.push(ngZone.onStable.subscribe(function () { return subject.next(void 0); }));
	    }
	    subscriptions.push(subject.debounceTime(0).subscribe(function () {
	        updateComponentTree(getAllAngularRootElements().map(function (r) { return ng.probe(r); }));
	        updateRouterTree();
	    }));
	    subject.next(void 0);
	};
	var resubscribe = function () {
	    runAndHandleUncaughtExceptions(function () {
	        sendNgVersionMessage();
	        messageBuffer.clear();
	        for (var _i = 0, subscriptions_1 = subscriptions; _i < subscriptions_1.length; _i++) {
	            var subscription = subscriptions_1[_i];
	            subscription.unsubscribe();
	        }
	        subscriptions.splice(0, subscriptions.length);
	        getAllAngularRootElements().forEach(function (root) { return bind(ng.probe(root)); });
	        setTimeout(function () { return runAndHandleUncaughtExceptions(function () { return parseInitialModules(); }); });
	        previousRoutes = null;
	        setTimeout(function () { return runAndHandleUncaughtExceptions(function () { return updateRouterTree(); }); });
	    });
	};
	indirect_connection_1.send(communication_1.MessageFactory.ping()).then(resubscribe);
	var selectedComponentPropertyKey = '$$el';
	var noSelectedComponentWarningText = 'There is no component selected.';
	Object.defineProperty(window, selectedComponentPropertyKey, { value: noSelectedComponentWarningText });
	var messageHandler = function (message) {
	    return runAndHandleUncaughtExceptions(function () {
	        switch (message.messageType) {
	            case communication_1.MessageType.Initialize:
	                Object.assign(treeRenderOptions, message.content);
	                previousTree = null;
	                if (!app_check_1.isAngular()) {
	                    indirect_connection_1.send(communication_1.MessageFactory.notNgApp());
	                }
	                else if (!app_check_1.isDebugMode()) {
	                    indirect_connection_1.send(communication_1.MessageFactory.applicationError(new communication_1.ApplicationError(communication_1.ApplicationErrorType.ProductionMode)));
	                }
	                else {
	                    resubscribe();
	                }
	                return true;
	            case communication_1.MessageType.SelectComponent:
	                var path = message.content.path;
	                if (previousTree) {
	                    var node = previousTree.traverse(path);
	                    _this.consoleReference(node);
	                    return getComponentInstance(previousTree, node);
	                }
	                return;
	            case communication_1.MessageType.UpdateProperty:
	                return updateProperty(previousTree, message.content.path, message.content.newValue);
	            case communication_1.MessageType.UpdateProviderProperty:
	                return updateProviderProperty(previousTree, message.content.path, message.content.token, message.content.propertyPath, message.content.newValue);
	            case communication_1.MessageType.EmitValue:
	                return emitValue(previousTree, message.content.path, message.content.value);
	            case communication_1.MessageType.Highlight:
	                if (previousTree == null) {
	                    return;
	                }
	                utils_1.highlight(message.content.nodes.map(function (id) { return previousTree.lookup(id); }));
	            case communication_1.MessageType.FindElement:
	                if (previousTree == null) {
	                    return;
	                }
	                findElement(message);
	        }
	        return undefined;
	    });
	};
	communication_1.browserSubscribe(messageHandler);
	var getComponentInstance = function (tree, node) {
	    if (node) {
	        var probed = ng.probe(node.nativeElement());
	        if (probed) {
	            return tree_1.instanceWithMetadata(probed, node, probed.componentInstance);
	        }
	    }
	    return null;
	};
	var updateNode = function (tree, path, fn) {
	    var node = utils_1.getNodeFromPartialPath(tree, path);
	    if (node) {
	        var probed_1 = ng.probe(node.nativeElement());
	        if (probed_1) {
	            var ngZone_1 = probed_1.injector.get(ng.coreTokens.NgZone);
	            setTimeout(function () { return ngZone_1.run(function () { return fn(probed_1); }); });
	        }
	    }
	};
	var updateProperty = function (tree, path, newValue) {
	    updateNode(tree, path, function (probed) {
	        var instanceParent = utils_1.getNodeInstanceParent(probed, path);
	        if (instanceParent) {
	            instanceParent[path[path.length - 1]] = newValue;
	        }
	    });
	};
	var updateProviderProperty = function (tree, path, token, propertyPath, newValue) {
	    updateNode(tree, path, function (probed) {
	        var provider = utils_1.getNodeProvider(probed, token, propertyPath);
	        if (provider) {
	            provider[propertyPath[propertyPath.length - 1]] = newValue;
	        }
	    });
	};
	var emitValue = function (tree, path, newValue) {
	    var node = utils_1.getNodeFromPartialPath(tree, path);
	    if (node) {
	        var probed = ng.probe(node.nativeElement());
	        if (probed) {
	            var instanceParent_1 = utils_1.getNodeInstanceParent(probed, path);
	            if (instanceParent_1) {
	                var ngZone_2 = probed.injector.get(ng.coreTokens.NgZone);
	                setTimeout(function () {
	                    ngZone_2.run(function () {
	                        var emittable = instanceParent_1[path[path.length - 1]];
	                        if (typeof emittable.emit === 'function') {
	                            emittable.emit(newValue);
	                        }
	                        else if (typeof emittable.next === 'function') {
	                            emittable.next(newValue);
	                        }
	                        else {
	                            throw new Error("Cannot emit value for " + tree_1.serializePath(path));
	                        }
	                    });
	                });
	            }
	        }
	    }
	};
	exports.routersFromRoots = function () {
	    var routers = [];
	    for (var _i = 0, _a = getAllAngularRootElements().map(function (e) { return ng.probe(e); }); _i < _a.length; _i++) {
	        var element = _a[_i];
	        var routerFn = decorators_1.parameterTypes(element.componentInstance).reduce(function (prev, curr, idx, p) {
	            return prev ? prev : p[idx].name === 'Router' ? p[idx] : null;
	        }, null);
	        if (routerFn &&
	            element.componentInstance.router &&
	            element.componentInstance.router instanceof routerFn) {
	            routers.push(element.componentInstance.router);
	        }
	    }
	    return routers;
	};
	exports.routerTree = function () {
	    var routers = new Array();
	    if (ng.coreTokens.Router) {
	        for (var _i = 0, _a = getAllAngularRootElements(); _i < _a.length; _i++) {
	            var rootElement = _a[_i];
	            routers = routers.concat(ng.probe(rootElement).injector.get(ng.coreTokens.Router));
	        }
	    }
	    else {
	        for (var _b = 0, _c = exports.routersFromRoots(); _b < _c.length; _b++) {
	            var router = _c[_b];
	            routers = routers.concat(router);
	        }
	    }
	    return routers;
	};
	exports.consoleReference = function (node) {
	    Object.defineProperty(window, selectedComponentPropertyKey, {
	        get: function () {
	            if (node) {
	                return ng.probe(node.nativeElement());
	            }
	            return null;
	        }
	    });
	};
	exports.extendWindowOperations = function (target, classImpl) {
	    for (var _i = 0, _a = Object.keys(classImpl); _i < _a.length; _i++) {
	        var key = _a[_i];
	        if (target[key] != null) {
	            throw new Error("A window function or object named " + key + " would be overwritten");
	        }
	    }
	    Object.assign(target, classImpl);
	};
	exports.applicationOperations = {
	    nodeFromPath: function (id) {
	        if (previousTree == null) {
	            throw new Error('No tree exists');
	        }
	        var node = previousTree.lookup(id);
	        if (node == null) {
	            console.error("Cannot find element associated with node " + id);
	            return null;
	        }
	        return node.nativeElement();
	    },
	    response: function (response) {
	        communication_1.browserDispatch(response);
	    },
	    handleImmediate: function (message) {
	        var result = messageHandler(message);
	        if (result) {
	            return utils_2.serialize(result);
	        }
	        return null;
	    },
	    readMessageQueue: function () {
	        return messageBuffer.dequeue();
	    }
	};
	var findElement = function (message) {
	    var currentNode, currentHighlights;
	    if (message.content.start) {
	        onMouseOver = function (e) {
	            if (currentHighlights) {
	                utils_1.clear(currentHighlights.map);
	            }
	            currentNode = find_element_1.onFindElement(e, previousTree);
	            if (currentNode) {
	                currentHighlights = utils_1.highlight([currentNode]);
	            }
	        };
	        onMouseDown = function () {
	            find_element_1.onElementFound(currentNode, currentHighlights, messageBuffer);
	        };
	        window.addEventListener('mouseover', onMouseOver, false);
	        window.addEventListener('mousedown', onMouseDown, false);
	    }
	    if (message.content.stop) {
	        window.removeEventListener('mouseover', onMouseOver, false);
	        window.removeEventListener('mousedown', onMouseDown, false);
	    }
	};
	exports.extendWindowOperations(window || global || this, { inspectedApplication: exports.applicationOperations });
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },

/***/ 1139:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var highlighter_1 = __webpack_require__(203);
	var communication_1 = __webpack_require__(23);
	var indirect_connection_1 = __webpack_require__(202);
	function onFindElement(e, tree) {
	    var foundNode = null;
	    var findNode = function (node) {
	        if (node.nativeElement() === e.target) {
	            foundNode = node;
	        }
	    };
	    tree.recurseAll(findNode);
	    return foundNode;
	}
	exports.onFindElement = onFindElement;
	function onElementFound(node, highlights, buffer) {
	    if (node) {
	        buffer.enqueue(communication_1.MessageFactory.foundDOMElement(node));
	        indirect_connection_1.send(communication_1.MessageFactory.push());
	    }
	    if (highlights) {
	        highlighter_1.clear(highlights.map);
	    }
	}
	exports.onElementFound = onElementFound;


/***/ },

/***/ 1140:
/***/ function(module, exports) {

	"use strict";
	exports.parseNgVersion = function () {
	    var rootElements = getAllAngularRootElements();
	    if (rootElements && rootElements[0]) {
	        return rootElements[0].getAttribute('ng-version');
	    }
	};


/***/ }

/******/ });
//# sourceMappingURL=backend.js.map