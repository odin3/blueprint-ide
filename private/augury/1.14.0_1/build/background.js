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

	__webpack_require__(1141);
	__webpack_require__(1185);
	module.exports = __webpack_require__(1184);


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

/***/ 374:
/***/ function(module, exports) {

	'use strict';
	
	function isObject(what) {
	    return typeof what === 'object' && what !== null;
	}
	
	// Yanked from https://git.io/vS8DV re-used under CC0
	// with some tiny modifications
	function isError(value) {
	  switch ({}.toString.call(value)) {
	    case '[object Error]': return true;
	    case '[object Exception]': return true;
	    case '[object DOMException]': return true;
	    default: return value instanceof Error;
	  }
	}
	
	module.exports = {
	    isObject: isObject,
	    isError: isError
	};


/***/ },

/***/ 826:
/***/ function(module, exports) {

	'use strict';
	
	function RavenConfigError(message) {
	    this.name = 'RavenConfigError';
	    this.message = message;
	}
	RavenConfigError.prototype = new Error();
	RavenConfigError.prototype.constructor = RavenConfigError;
	
	module.exports = RavenConfigError;


/***/ },

/***/ 827:
/***/ function(module, exports) {

	'use strict';
	
	var wrapMethod = function(console, level, callback) {
	    var originalConsoleLevel = console[level];
	    var originalConsole = console;
	
	    if (!(level in console)) {
	        return;
	    }
	
	    var sentryLevel = level === 'warn'
	        ? 'warning'
	        : level;
	
	    console[level] = function () {
	        var args = [].slice.call(arguments);
	
	        var msg = '' + args.join(' ');
	        var data = {level: sentryLevel, logger: 'console', extra: {'arguments': args}};
	        callback && callback(msg, data);
	
	        // this fails for some browsers. :(
	        if (originalConsoleLevel) {
	            // IE9 doesn't allow calling apply on console functions directly
	            // See: https://stackoverflow.com/questions/5472938/does-ie9-support-console-log-and-is-it-a-real-function#answer-5473193
	            Function.prototype.apply.call(
	                originalConsoleLevel,
	                originalConsole,
	                args
	            );
	        }
	    };
	};
	
	module.exports = {
	    wrapMethod: wrapMethod
	};


/***/ },

/***/ 828:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*global XDomainRequest:false, __DEV__:false*/
	'use strict';
	
	var TraceKit = __webpack_require__(830);
	var stringify = __webpack_require__(831);
	var RavenConfigError = __webpack_require__(826);
	var utils = __webpack_require__(374);
	
	var isError = utils.isError,
	    isObject = utils.isObject;
	
	var wrapConsoleMethod = __webpack_require__(827).wrapMethod;
	
	var dsnKeys = 'source protocol user pass host port path'.split(' '),
	    dsnPattern = /^(?:(\w+):)?\/\/(?:(\w+)(:\w+)?@)?([\w\.-]+)(?::(\d+))?(\/.*)/;
	
	function now() {
	    return +new Date();
	}
	
	// This is to be defensive in environments where window does not exist (see https://github.com/getsentry/raven-js/pull/785)
	var _window = typeof window !== 'undefined' ? window
	            : typeof global !== 'undefined' ? global
	            : typeof self !== 'undefined' ? self
	            : {};
	var _document = _window.document;
	var _navigator = _window.navigator;
	
	// First, check for JSON support
	// If there is no JSON, we no-op the core features of Raven
	// since JSON is required to encode the payload
	function Raven() {
	    this._hasJSON = !!(typeof JSON === 'object' && JSON.stringify);
	    // Raven can run in contexts where there's no document (react-native)
	    this._hasDocument = !isUndefined(_document);
	    this._hasNavigator = !isUndefined(_navigator);
	    this._lastCapturedException = null;
	    this._lastData = null;
	    this._lastEventId = null;
	    this._globalServer = null;
	    this._globalKey = null;
	    this._globalProject = null;
	    this._globalContext = {};
	    this._globalOptions = {
	        logger: 'javascript',
	        ignoreErrors: [],
	        ignoreUrls: [],
	        whitelistUrls: [],
	        includePaths: [],
	        crossOrigin: 'anonymous',
	        collectWindowErrors: true,
	        maxMessageLength: 0,
	
	        // By default, truncates URL values to 250 chars
	        maxUrlLength: 250,
	        stackTraceLimit: 50,
	        autoBreadcrumbs: true,
	        sampleRate: 1
	    };
	    this._ignoreOnError = 0;
	    this._isRavenInstalled = false;
	    this._originalErrorStackTraceLimit = Error.stackTraceLimit;
	    // capture references to window.console *and* all its methods first
	    // before the console plugin has a chance to monkey patch
	    this._originalConsole = _window.console || {};
	    this._originalConsoleMethods = {};
	    this._plugins = [];
	    this._startTime = now();
	    this._wrappedBuiltIns = [];
	    this._breadcrumbs = [];
	    this._lastCapturedEvent = null;
	    this._keypressTimeout;
	    this._location = _window.location;
	    this._lastHref = this._location && this._location.href;
	    this._resetBackoff();
	
	    for (var method in this._originalConsole) {  // eslint-disable-line guard-for-in
	      this._originalConsoleMethods[method] = this._originalConsole[method];
	    }
	}
	
	/*
	 * The core Raven singleton
	 *
	 * @this {Raven}
	 */
	
	Raven.prototype = {
	    // Hardcode version string so that raven source can be loaded directly via
	    // webpack (using a build step causes webpack #1617). Grunt verifies that
	    // this value matches package.json during build.
	    //   See: https://github.com/getsentry/raven-js/issues/465
	    VERSION: '3.14.2',
	
	    debug: false,
	
	    TraceKit: TraceKit, // alias to TraceKit
	
	    /*
	     * Configure Raven with a DSN and extra options
	     *
	     * @param {string} dsn The public Sentry DSN
	     * @param {object} options Optional set of of global options [optional]
	     * @return {Raven}
	     */
	    config: function(dsn, options) {
	        var self = this;
	
	        if (self._globalServer) {
	                this._logDebug('error', 'Error: Raven has already been configured');
	            return self;
	        }
	        if (!dsn) return self;
	
	        var globalOptions = self._globalOptions;
	
	        // merge in options
	        if (options) {
	            each(options, function(key, value){
	                // tags and extra are special and need to be put into context
	                if (key === 'tags' || key === 'extra' || key === 'user') {
	                    self._globalContext[key] = value;
	                } else {
	                    globalOptions[key] = value;
	                }
	            });
	        }
	
	        self.setDSN(dsn);
	
	        // "Script error." is hard coded into browsers for errors that it can't read.
	        // this is the result of a script being pulled in from an external domain and CORS.
	        globalOptions.ignoreErrors.push(/^Script error\.?$/);
	        globalOptions.ignoreErrors.push(/^Javascript error: Script error\.? on line 0$/);
	
	        // join regexp rules into one big rule
	        globalOptions.ignoreErrors = joinRegExp(globalOptions.ignoreErrors);
	        globalOptions.ignoreUrls = globalOptions.ignoreUrls.length ? joinRegExp(globalOptions.ignoreUrls) : false;
	        globalOptions.whitelistUrls = globalOptions.whitelistUrls.length ? joinRegExp(globalOptions.whitelistUrls) : false;
	        globalOptions.includePaths = joinRegExp(globalOptions.includePaths);
	        globalOptions.maxBreadcrumbs = Math.max(0, Math.min(globalOptions.maxBreadcrumbs || 100, 100)); // default and hard limit is 100
	
	        var autoBreadcrumbDefaults = {
	            xhr: true,
	            console: true,
	            dom: true,
	            location: true
	        };
	
	        var autoBreadcrumbs = globalOptions.autoBreadcrumbs;
	        if ({}.toString.call(autoBreadcrumbs) === '[object Object]') {
	            autoBreadcrumbs = objectMerge(autoBreadcrumbDefaults, autoBreadcrumbs);
	        } else if (autoBreadcrumbs !== false) {
	            autoBreadcrumbs = autoBreadcrumbDefaults;
	        }
	        globalOptions.autoBreadcrumbs = autoBreadcrumbs;
	
	        TraceKit.collectWindowErrors = !!globalOptions.collectWindowErrors;
	
	        // return for chaining
	        return self;
	    },
	
	    /*
	     * Installs a global window.onerror error handler
	     * to capture and report uncaught exceptions.
	     * At this point, install() is required to be called due
	     * to the way TraceKit is set up.
	     *
	     * @return {Raven}
	     */
	    install: function() {
	        var self = this;
	        if (self.isSetup() && !self._isRavenInstalled) {
	            TraceKit.report.subscribe(function () {
	                self._handleOnErrorStackInfo.apply(self, arguments);
	            });
	            self._instrumentTryCatch();
	            if (self._globalOptions.autoBreadcrumbs)
	                self._instrumentBreadcrumbs();
	
	            // Install all of the plugins
	            self._drainPlugins();
	
	            self._isRavenInstalled = true;
	        }
	
	        Error.stackTraceLimit = self._globalOptions.stackTraceLimit;
	        return this;
	    },
	
	    /*
	     * Set the DSN (can be called multiple time unlike config)
	     *
	     * @param {string} dsn The public Sentry DSN
	     */
	    setDSN: function(dsn) {
	        var self = this,
	            uri = self._parseDSN(dsn),
	          lastSlash = uri.path.lastIndexOf('/'),
	          path = uri.path.substr(1, lastSlash);
	
	        self._dsn = dsn;
	        self._globalKey = uri.user;
	        self._globalSecret = uri.pass && uri.pass.substr(1);
	        self._globalProject = uri.path.substr(lastSlash + 1);
	
	        self._globalServer = self._getGlobalServer(uri);
	
	        self._globalEndpoint = self._globalServer +
	            '/' + path + 'api/' + self._globalProject + '/store/';
	
	        // Reset backoff state since we may be pointing at a
	        // new project/server
	        this._resetBackoff();
	    },
	
	    /*
	     * Wrap code within a context so Raven can capture errors
	     * reliably across domains that is executed immediately.
	     *
	     * @param {object} options A specific set of options for this context [optional]
	     * @param {function} func The callback to be immediately executed within the context
	     * @param {array} args An array of arguments to be called with the callback [optional]
	     */
	    context: function(options, func, args) {
	        if (isFunction(options)) {
	            args = func || [];
	            func = options;
	            options = undefined;
	        }
	
	        return this.wrap(options, func).apply(this, args);
	    },
	
	    /*
	     * Wrap code within a context and returns back a new function to be executed
	     *
	     * @param {object} options A specific set of options for this context [optional]
	     * @param {function} func The function to be wrapped in a new context
	     * @param {function} func A function to call before the try/catch wrapper [optional, private]
	     * @return {function} The newly wrapped functions with a context
	     */
	    wrap: function(options, func, _before) {
	        var self = this;
	        // 1 argument has been passed, and it's not a function
	        // so just return it
	        if (isUndefined(func) && !isFunction(options)) {
	            return options;
	        }
	
	        // options is optional
	        if (isFunction(options)) {
	            func = options;
	            options = undefined;
	        }
	
	        // At this point, we've passed along 2 arguments, and the second one
	        // is not a function either, so we'll just return the second argument.
	        if (!isFunction(func)) {
	            return func;
	        }
	
	        // We don't wanna wrap it twice!
	        try {
	            if (func.__raven__) {
	                return func;
	            }
	
	            // If this has already been wrapped in the past, return that
	            if (func.__raven_wrapper__ ){
	                return func.__raven_wrapper__ ;
	            }
	        } catch (e) {
	            // Just accessing custom props in some Selenium environments
	            // can cause a "Permission denied" exception (see raven-js#495).
	            // Bail on wrapping and return the function as-is (defers to window.onerror).
	            return func;
	        }
	
	        function wrapped() {
	            var args = [], i = arguments.length,
	                deep = !options || options && options.deep !== false;
	
	            if (_before && isFunction(_before)) {
	                _before.apply(this, arguments);
	            }
	
	            // Recursively wrap all of a function's arguments that are
	            // functions themselves.
	            while(i--) args[i] = deep ? self.wrap(options, arguments[i]) : arguments[i];
	
	            try {
	                // Attempt to invoke user-land function
	                // NOTE: If you are a Sentry user, and you are seeing this stack frame, it
	                //       means Raven caught an error invoking your application code. This is
	                //       expected behavior and NOT indicative of a bug with Raven.js.
	                return func.apply(this, args);
	            } catch(e) {
	                self._ignoreNextOnError();
	                self.captureException(e, options);
	                throw e;
	            }
	        }
	
	        // copy over properties of the old function
	        for (var property in func) {
	            if (hasKey(func, property)) {
	                wrapped[property] = func[property];
	            }
	        }
	        wrapped.prototype = func.prototype;
	
	        func.__raven_wrapper__ = wrapped;
	        // Signal that this function has been wrapped already
	        // for both debugging and to prevent it to being wrapped twice
	        wrapped.__raven__ = true;
	        wrapped.__inner__ = func;
	
	        return wrapped;
	    },
	
	    /*
	     * Uninstalls the global error handler.
	     *
	     * @return {Raven}
	     */
	    uninstall: function() {
	        TraceKit.report.uninstall();
	
	        this._restoreBuiltIns();
	
	        Error.stackTraceLimit = this._originalErrorStackTraceLimit;
	        this._isRavenInstalled = false;
	
	        return this;
	    },
	
	    /*
	     * Manually capture an exception and send it over to Sentry
	     *
	     * @param {error} ex An exception to be logged
	     * @param {object} options A specific set of options for this error [optional]
	     * @return {Raven}
	     */
	    captureException: function(ex, options) {
	        // If not an Error is passed through, recall as a message instead
	        if (!isError(ex)) {
	            return this.captureMessage(ex, objectMerge({
	                trimHeadFrames: 1,
	                stacktrace: true // if we fall back to captureMessage, default to attempting a new trace
	            }, options));
	        }
	
	        // Store the raw exception object for potential debugging and introspection
	        this._lastCapturedException = ex;
	
	        // TraceKit.report will re-raise any exception passed to it,
	        // which means you have to wrap it in try/catch. Instead, we
	        // can wrap it here and only re-raise if TraceKit.report
	        // raises an exception different from the one we asked to
	        // report on.
	        try {
	            var stack = TraceKit.computeStackTrace(ex);
	            this._handleStackInfo(stack, options);
	        } catch(ex1) {
	            if(ex !== ex1) {
	                throw ex1;
	            }
	        }
	
	        return this;
	    },
	
	    /*
	     * Manually send a message to Sentry
	     *
	     * @param {string} msg A plain message to be captured in Sentry
	     * @param {object} options A specific set of options for this message [optional]
	     * @return {Raven}
	     */
	    captureMessage: function(msg, options) {
	        // config() automagically converts ignoreErrors from a list to a RegExp so we need to test for an
	        // early call; we'll error on the side of logging anything called before configuration since it's
	        // probably something you should see:
	        if (!!this._globalOptions.ignoreErrors.test && this._globalOptions.ignoreErrors.test(msg)) {
	            return;
	        }
	
	        options = options || {};
	
	        var data = objectMerge({
	            message: msg + ''  // Make sure it's actually a string
	        }, options);
	
	        if (this._globalOptions.stacktrace || (options && options.stacktrace)) {
	            var ex;
	            // Generate a "synthetic" stack trace from this point.
	            // NOTE: If you are a Sentry user, and you are seeing this stack frame, it is NOT indicative
	            //       of a bug with Raven.js. Sentry generates synthetic traces either by configuration,
	            //       or if it catches a thrown object without a "stack" property.
	            try {
	                throw new Error(msg);
	            } catch (ex1) {
	                ex = ex1;
	            }
	
	            // null exception name so `Error` isn't prefixed to msg
	            ex.name = null;
	
	            options = objectMerge({
	                // fingerprint on msg, not stack trace (legacy behavior, could be
	                // revisited)
	                fingerprint: msg,
	                // since we know this is a synthetic trace, the top N-most frames
	                // MUST be from Raven.js, so mark them as in_app later by setting
	                // trimHeadFrames
	                trimHeadFrames: (options.trimHeadFrames || 0) + 1
	            }, options);
	
	            var stack = TraceKit.computeStackTrace(ex);
	            var frames = this._prepareFrames(stack, options);
	            data.stacktrace = {
	                // Sentry expects frames oldest to newest
	                frames: frames.reverse()
	            }
	        }
	
	        // Fire away!
	        this._send(data);
	
	        return this;
	    },
	
	    captureBreadcrumb: function (obj) {
	        var crumb = objectMerge({
	            timestamp: now() / 1000
	        }, obj);
	
	        if (isFunction(this._globalOptions.breadcrumbCallback)) {
	            var result = this._globalOptions.breadcrumbCallback(crumb);
	
	            if (isObject(result) && !isEmptyObject(result)) {
	                crumb = result;
	            } else if (result === false) {
	                return this;
	            }
	        }
	
	        this._breadcrumbs.push(crumb);
	        if (this._breadcrumbs.length > this._globalOptions.maxBreadcrumbs) {
	            this._breadcrumbs.shift();
	        }
	        return this;
	    },
	
	    addPlugin: function(plugin /*arg1, arg2, ... argN*/) {
	        var pluginArgs = [].slice.call(arguments, 1);
	
	        this._plugins.push([plugin, pluginArgs]);
	        if (this._isRavenInstalled) {
	            this._drainPlugins();
	        }
	
	        return this;
	    },
	
	    /*
	     * Set/clear a user to be sent along with the payload.
	     *
	     * @param {object} user An object representing user data [optional]
	     * @return {Raven}
	     */
	    setUserContext: function(user) {
	        // Intentionally do not merge here since that's an unexpected behavior.
	        this._globalContext.user = user;
	
	        return this;
	    },
	
	    /*
	     * Merge extra attributes to be sent along with the payload.
	     *
	     * @param {object} extra An object representing extra data [optional]
	     * @return {Raven}
	     */
	    setExtraContext: function(extra) {
	        this._mergeContext('extra', extra);
	
	        return this;
	    },
	
	    /*
	     * Merge tags to be sent along with the payload.
	     *
	     * @param {object} tags An object representing tags [optional]
	     * @return {Raven}
	     */
	    setTagsContext: function(tags) {
	        this._mergeContext('tags', tags);
	
	        return this;
	    },
	
	    /*
	     * Clear all of the context.
	     *
	     * @return {Raven}
	     */
	    clearContext: function() {
	        this._globalContext = {};
	
	        return this;
	    },
	
	    /*
	     * Get a copy of the current context. This cannot be mutated.
	     *
	     * @return {object} copy of context
	     */
	    getContext: function() {
	        // lol javascript
	        return JSON.parse(stringify(this._globalContext));
	    },
	
	
	    /*
	     * Set environment of application
	     *
	     * @param {string} environment Typically something like 'production'.
	     * @return {Raven}
	     */
	    setEnvironment: function(environment) {
	        this._globalOptions.environment = environment;
	
	        return this;
	    },
	
	    /*
	     * Set release version of application
	     *
	     * @param {string} release Typically something like a git SHA to identify version
	     * @return {Raven}
	     */
	    setRelease: function(release) {
	        this._globalOptions.release = release;
	
	        return this;
	    },
	
	    /*
	     * Set the dataCallback option
	     *
	     * @param {function} callback The callback to run which allows the
	     *                            data blob to be mutated before sending
	     * @return {Raven}
	     */
	    setDataCallback: function(callback) {
	        var original = this._globalOptions.dataCallback;
	        this._globalOptions.dataCallback = isFunction(callback)
	          ? function (data) { return callback(data, original); }
	          : callback;
	
	        return this;
	    },
	
	    /*
	     * Set the breadcrumbCallback option
	     *
	     * @param {function} callback The callback to run which allows filtering
	     *                            or mutating breadcrumbs
	     * @return {Raven}
	     */
	    setBreadcrumbCallback: function(callback) {
	        var original = this._globalOptions.breadcrumbCallback;
	        this._globalOptions.breadcrumbCallback = isFunction(callback)
	          ? function (data) { return callback(data, original); }
	          : callback;
	
	        return this;
	    },
	
	    /*
	     * Set the shouldSendCallback option
	     *
	     * @param {function} callback The callback to run which allows
	     *                            introspecting the blob before sending
	     * @return {Raven}
	     */
	    setShouldSendCallback: function(callback) {
	        var original = this._globalOptions.shouldSendCallback;
	        this._globalOptions.shouldSendCallback = isFunction(callback)
	            ? function (data) { return callback(data, original); }
	            : callback;
	
	        return this;
	    },
	
	    /**
	     * Override the default HTTP transport mechanism that transmits data
	     * to the Sentry server.
	     *
	     * @param {function} transport Function invoked instead of the default
	     *                             `makeRequest` handler.
	     *
	     * @return {Raven}
	     */
	    setTransport: function(transport) {
	        this._globalOptions.transport = transport;
	
	        return this;
	    },
	
	    /*
	     * Get the latest raw exception that was captured by Raven.
	     *
	     * @return {error}
	     */
	    lastException: function() {
	        return this._lastCapturedException;
	    },
	
	    /*
	     * Get the last event id
	     *
	     * @return {string}
	     */
	    lastEventId: function() {
	        return this._lastEventId;
	    },
	
	    /*
	     * Determine if Raven is setup and ready to go.
	     *
	     * @return {boolean}
	     */
	    isSetup: function() {
	        if (!this._hasJSON) return false;  // needs JSON support
	        if (!this._globalServer) {
	            if (!this.ravenNotConfiguredError) {
	              this.ravenNotConfiguredError = true;
	              this._logDebug('error', 'Error: Raven has not been configured.');
	            }
	            return false;
	        }
	        return true;
	    },
	
	    afterLoad: function () {
	        // TODO: remove window dependence?
	
	        // Attempt to initialize Raven on load
	        var RavenConfig = _window.RavenConfig;
	        if (RavenConfig) {
	            this.config(RavenConfig.dsn, RavenConfig.config).install();
	        }
	    },
	
	    showReportDialog: function (options) {
	        if (!_document) // doesn't work without a document (React native)
	            return;
	
	        options = options || {};
	
	        var lastEventId = options.eventId || this.lastEventId();
	        if (!lastEventId) {
	            throw new RavenConfigError('Missing eventId');
	        }
	
	        var dsn = options.dsn || this._dsn;
	        if (!dsn) {
	            throw new RavenConfigError('Missing DSN');
	        }
	
	        var encode = encodeURIComponent;
	        var qs = '';
	        qs += '?eventId=' + encode(lastEventId);
	        qs += '&dsn=' + encode(dsn);
	
	        var user = options.user || this._globalContext.user;
	        if (user) {
	            if (user.name)  qs += '&name=' + encode(user.name);
	            if (user.email) qs += '&email=' + encode(user.email);
	        }
	
	        var globalServer = this._getGlobalServer(this._parseDSN(dsn));
	
	        var script = _document.createElement('script');
	        script.async = true;
	        script.src = globalServer + '/api/embed/error-page/' + qs;
	        (_document.head || _document.body).appendChild(script);
	    },
	
	    /**** Private functions ****/
	    _ignoreNextOnError: function () {
	        var self = this;
	        this._ignoreOnError += 1;
	        setTimeout(function () {
	            // onerror should trigger before setTimeout
	            self._ignoreOnError -= 1;
	        });
	    },
	
	    _triggerEvent: function(eventType, options) {
	        // NOTE: `event` is a native browser thing, so let's avoid conflicting wiht it
	        var evt, key;
	
	        if (!this._hasDocument)
	            return;
	
	        options = options || {};
	
	        eventType = 'raven' + eventType.substr(0,1).toUpperCase() + eventType.substr(1);
	
	        if (_document.createEvent) {
	            evt = _document.createEvent('HTMLEvents');
	            evt.initEvent(eventType, true, true);
	        } else {
	            evt = _document.createEventObject();
	            evt.eventType = eventType;
	        }
	
	        for (key in options) if (hasKey(options, key)) {
	            evt[key] = options[key];
	        }
	
	        if (_document.createEvent) {
	            // IE9 if standards
	            _document.dispatchEvent(evt);
	        } else {
	            // IE8 regardless of Quirks or Standards
	            // IE9 if quirks
	            try {
	                _document.fireEvent('on' + evt.eventType.toLowerCase(), evt);
	            } catch(e) {
	                // Do nothing
	            }
	        }
	    },
	
	    /**
	     * Wraps addEventListener to capture UI breadcrumbs
	     * @param evtName the event name (e.g. "click")
	     * @returns {Function}
	     * @private
	     */
	    _breadcrumbEventHandler: function(evtName) {
	        var self = this;
	        return function (evt) {
	            // reset keypress timeout; e.g. triggering a 'click' after
	            // a 'keypress' will reset the keypress debounce so that a new
	            // set of keypresses can be recorded
	            self._keypressTimeout = null;
	
	            // It's possible this handler might trigger multiple times for the same
	            // event (e.g. event propagation through node ancestors). Ignore if we've
	            // already captured the event.
	            if (self._lastCapturedEvent === evt)
	                return;
	
	            self._lastCapturedEvent = evt;
	
	            // try/catch both:
	            // - accessing evt.target (see getsentry/raven-js#838, #768)
	            // - `htmlTreeAsString` because it's complex, and just accessing the DOM incorrectly
	            //   can throw an exception in some circumstances.
	            var target;
	            try {
	                target = htmlTreeAsString(evt.target);
	            } catch (e) {
	                target = '<unknown>';
	            }
	
	            self.captureBreadcrumb({
	                category: 'ui.' + evtName, // e.g. ui.click, ui.input
	                message: target
	            });
	        };
	    },
	
	    /**
	     * Wraps addEventListener to capture keypress UI events
	     * @returns {Function}
	     * @private
	     */
	    _keypressEventHandler: function() {
	        var self = this,
	            debounceDuration = 1000; // milliseconds
	
	        // TODO: if somehow user switches keypress target before
	        //       debounce timeout is triggered, we will only capture
	        //       a single breadcrumb from the FIRST target (acceptable?)
	        return function (evt) {
	            var target;
	            try {
	                target = evt.target;
	            } catch (e) {
	                // just accessing event properties can throw an exception in some rare circumstances
	                // see: https://github.com/getsentry/raven-js/issues/838
	                return;
	            }
	            var tagName = target && target.tagName;
	
	            // only consider keypress events on actual input elements
	            // this will disregard keypresses targeting body (e.g. tabbing
	            // through elements, hotkeys, etc)
	            if (!tagName || tagName !== 'INPUT' && tagName !== 'TEXTAREA' && !target.isContentEditable)
	                return;
	
	            // record first keypress in a series, but ignore subsequent
	            // keypresses until debounce clears
	            var timeout = self._keypressTimeout;
	            if (!timeout) {
	                self._breadcrumbEventHandler('input')(evt);
	            }
	            clearTimeout(timeout);
	            self._keypressTimeout = setTimeout(function () {
	                self._keypressTimeout = null;
	            }, debounceDuration);
	        };
	    },
	
	    /**
	     * Captures a breadcrumb of type "navigation", normalizing input URLs
	     * @param to the originating URL
	     * @param from the target URL
	     * @private
	     */
	    _captureUrlChange: function(from, to) {
	        var parsedLoc = parseUrl(this._location.href);
	        var parsedTo = parseUrl(to);
	        var parsedFrom = parseUrl(from);
	
	        // because onpopstate only tells you the "new" (to) value of location.href, and
	        // not the previous (from) value, we need to track the value of the current URL
	        // state ourselves
	        this._lastHref = to;
	
	        // Use only the path component of the URL if the URL matches the current
	        // document (almost all the time when using pushState)
	        if (parsedLoc.protocol === parsedTo.protocol && parsedLoc.host === parsedTo.host)
	            to = parsedTo.relative;
	        if (parsedLoc.protocol === parsedFrom.protocol && parsedLoc.host === parsedFrom.host)
	            from = parsedFrom.relative;
	
	        this.captureBreadcrumb({
	            category: 'navigation',
	            data: {
	                to: to,
	                from: from
	            }
	        });
	    },
	
	    /**
	     * Install any queued plugins
	     */
	    _instrumentTryCatch: function() {
	        var self = this;
	
	        var wrappedBuiltIns = self._wrappedBuiltIns;
	
	        function wrapTimeFn(orig) {
	            return function (fn, t) { // preserve arity
	                // Make a copy of the arguments to prevent deoptimization
	                // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
	                var args = new Array(arguments.length);
	                for(var i = 0; i < args.length; ++i) {
	                    args[i] = arguments[i];
	                }
	                var originalCallback = args[0];
	                if (isFunction(originalCallback)) {
	                    args[0] = self.wrap(originalCallback);
	                }
	
	                // IE < 9 doesn't support .call/.apply on setInterval/setTimeout, but it
	                // also supports only two arguments and doesn't care what this is, so we
	                // can just call the original function directly.
	                if (orig.apply) {
	                    return orig.apply(this, args);
	                } else {
	                    return orig(args[0], args[1]);
	                }
	            };
	        }
	
	        var autoBreadcrumbs = this._globalOptions.autoBreadcrumbs;
	
	        function wrapEventTarget(global) {
	            var proto = _window[global] && _window[global].prototype;
	            if (proto && proto.hasOwnProperty && proto.hasOwnProperty('addEventListener')) {
	                fill(proto, 'addEventListener', function(orig) {
	                    return function (evtName, fn, capture, secure) { // preserve arity
	                        try {
	                            if (fn && fn.handleEvent) {
	                                fn.handleEvent = self.wrap(fn.handleEvent);
	                            }
	                        } catch (err) {
	                            // can sometimes get 'Permission denied to access property "handle Event'
	                        }
	
	                        // More breadcrumb DOM capture ... done here and not in `_instrumentBreadcrumbs`
	                        // so that we don't have more than one wrapper function
	                        var before,
	                            clickHandler,
	                            keypressHandler;
	
	                        if (autoBreadcrumbs && autoBreadcrumbs.dom && (global === 'EventTarget' || global === 'Node')) {
	                            // NOTE: generating multiple handlers per addEventListener invocation, should
	                            //       revisit and verify we can just use one (almost certainly)
	                            clickHandler = self._breadcrumbEventHandler('click');
	                            keypressHandler = self._keypressEventHandler();
	                            before = function (evt) {
	                                // need to intercept every DOM event in `before` argument, in case that
	                                // same wrapped method is re-used for different events (e.g. mousemove THEN click)
	                                // see #724
	                                if (!evt) return;
	
	                                var eventType;
	                                try {
	                                    eventType = evt.type
	                                } catch (e) {
	                                    // just accessing event properties can throw an exception in some rare circumstances
	                                    // see: https://github.com/getsentry/raven-js/issues/838
	                                    return;
	                                }
	                                if (eventType === 'click')
	                                    return clickHandler(evt);
	                                else if (eventType === 'keypress')
	                                    return keypressHandler(evt);
	                            };
	                        }
	                        return orig.call(this, evtName, self.wrap(fn, undefined, before), capture, secure);
	                    };
	                }, wrappedBuiltIns);
	                fill(proto, 'removeEventListener', function (orig) {
	                    return function (evt, fn, capture, secure) {
	                        try {
	                            fn = fn && (fn.__raven_wrapper__ ? fn.__raven_wrapper__  : fn);
	                        } catch (e) {
	                            // ignore, accessing __raven_wrapper__ will throw in some Selenium environments
	                        }
	                        return orig.call(this, evt, fn, capture, secure);
	                    };
	                }, wrappedBuiltIns);
	            }
	        }
	
	        fill(_window, 'setTimeout', wrapTimeFn, wrappedBuiltIns);
	        fill(_window, 'setInterval', wrapTimeFn, wrappedBuiltIns);
	        if (_window.requestAnimationFrame) {
	            fill(_window, 'requestAnimationFrame', function (orig) {
	                return function (cb) {
	                    return orig(self.wrap(cb));
	                };
	            }, wrappedBuiltIns);
	        }
	
	        // event targets borrowed from bugsnag-js:
	        // https://github.com/bugsnag/bugsnag-js/blob/master/src/bugsnag.js#L666
	        var eventTargets = ['EventTarget', 'Window', 'Node', 'ApplicationCache', 'AudioTrackList', 'ChannelMergerNode', 'CryptoOperation', 'EventSource', 'FileReader', 'HTMLUnknownElement', 'IDBDatabase', 'IDBRequest', 'IDBTransaction', 'KeyOperation', 'MediaController', 'MessagePort', 'ModalWindow', 'Notification', 'SVGElementInstance', 'Screen', 'TextTrack', 'TextTrackCue', 'TextTrackList', 'WebSocket', 'WebSocketWorker', 'Worker', 'XMLHttpRequest', 'XMLHttpRequestEventTarget', 'XMLHttpRequestUpload'];
	        for (var i = 0; i < eventTargets.length; i++) {
	            wrapEventTarget(eventTargets[i]);
	        }
	    },
	
	
	    /**
	     * Instrument browser built-ins w/ breadcrumb capturing
	     *  - XMLHttpRequests
	     *  - DOM interactions (click/typing)
	     *  - window.location changes
	     *  - console
	     *
	     * Can be disabled or individually configured via the `autoBreadcrumbs` config option
	     */
	    _instrumentBreadcrumbs: function () {
	        var self = this;
	        var autoBreadcrumbs = this._globalOptions.autoBreadcrumbs;
	
	        var wrappedBuiltIns = self._wrappedBuiltIns;
	
	        function wrapProp(prop, xhr) {
	            if (prop in xhr && isFunction(xhr[prop])) {
	                fill(xhr, prop, function (orig) {
	                    return self.wrap(orig);
	                }); // intentionally don't track filled methods on XHR instances
	            }
	        }
	
	        if (autoBreadcrumbs.xhr && 'XMLHttpRequest' in _window) {
	            var xhrproto = XMLHttpRequest.prototype;
	            fill(xhrproto, 'open', function(origOpen) {
	                return function (method, url) { // preserve arity
	
	                    // if Sentry key appears in URL, don't capture
	                    if (isString(url) && url.indexOf(self._globalKey) === -1) {
	                        this.__raven_xhr = {
	                            method: method,
	                            url: url,
	                            status_code: null
	                        };
	                    }
	
	                    return origOpen.apply(this, arguments);
	                };
	            }, wrappedBuiltIns);
	
	            fill(xhrproto, 'send', function(origSend) {
	                return function (data) { // preserve arity
	                    var xhr = this;
	
	                    function onreadystatechangeHandler() {
	                        if (xhr.__raven_xhr && (xhr.readyState === 1 || xhr.readyState === 4)) {
	                            try {
	                                // touching statusCode in some platforms throws
	                                // an exception
	                                xhr.__raven_xhr.status_code = xhr.status;
	                            } catch (e) { /* do nothing */ }
	                            self.captureBreadcrumb({
	                                type: 'http',
	                                category: 'xhr',
	                                data: xhr.__raven_xhr
	                            });
	                        }
	                    }
	
	                    var props = ['onload', 'onerror', 'onprogress'];
	                    for (var j = 0; j < props.length; j++) {
	                        wrapProp(props[j], xhr);
	                    }
	
	                    if ('onreadystatechange' in xhr && isFunction(xhr.onreadystatechange)) {
	                        fill(xhr, 'onreadystatechange', function (orig) {
	                            return self.wrap(orig, undefined, onreadystatechangeHandler);
	                        } /* intentionally don't track this instrumentation */);
	                    } else {
	                        // if onreadystatechange wasn't actually set by the page on this xhr, we
	                        // are free to set our own and capture the breadcrumb
	                        xhr.onreadystatechange = onreadystatechangeHandler;
	                    }
	
	                    return origSend.apply(this, arguments);
	                };
	            }, wrappedBuiltIns);
	        }
	
	        if (autoBreadcrumbs.xhr && 'fetch' in _window) {
	            fill(_window, 'fetch', function(origFetch) {
	                return function (fn, t) { // preserve arity
	                    // Make a copy of the arguments to prevent deoptimization
	                    // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
	                    var args = new Array(arguments.length);
	                    for (var i = 0; i < args.length; ++i) {
	                        args[i] = arguments[i];
	                    }
	
	                    var fetchInput = args[0];
	                    var method = 'GET';
	                    var url;
	
	                    if (typeof fetchInput === 'string') {
	                        url = fetchInput;
	                    } else {
	                        url = fetchInput.url;
	                        if (fetchInput.method) {
	                            method = fetchInput.method;
	                        }
	                    }
	
	                    if (args[1] && args[1].method) {
	                        method = args[1].method;
	                    }
	
	                    var fetchData = {
	                        method: method,
	                        url: url,
	                        status_code: null
	                    };
	
	                    self.captureBreadcrumb({
	                        type: 'http',
	                        category: 'fetch',
	                        data: fetchData
	                    });
	
	                    return origFetch.apply(this, args).then(function (response) {
	                        fetchData.status_code = response.status;
	
	                        return response;
	                    });
	                };
	            }, wrappedBuiltIns);
	        }
	
	        // Capture breadcrumbs from any click that is unhandled / bubbled up all the way
	        // to the document. Do this before we instrument addEventListener.
	        if (autoBreadcrumbs.dom && this._hasDocument) {
	            if (_document.addEventListener) {
	                _document.addEventListener('click', self._breadcrumbEventHandler('click'), false);
	                _document.addEventListener('keypress', self._keypressEventHandler(), false);
	            }
	            else {
	                // IE8 Compatibility
	                _document.attachEvent('onclick', self._breadcrumbEventHandler('click'));
	                _document.attachEvent('onkeypress', self._keypressEventHandler());
	            }
	        }
	
	        // record navigation (URL) changes
	        // NOTE: in Chrome App environment, touching history.pushState, *even inside
	        //       a try/catch block*, will cause Chrome to output an error to console.error
	        // borrowed from: https://github.com/angular/angular.js/pull/13945/files
	        var chrome = _window.chrome;
	        var isChromePackagedApp = chrome && chrome.app && chrome.app.runtime;
	        var hasPushState = !isChromePackagedApp && _window.history && history.pushState;
	        if (autoBreadcrumbs.location && hasPushState) {
	            // TODO: remove onpopstate handler on uninstall()
	            var oldOnPopState = _window.onpopstate;
	            _window.onpopstate = function () {
	                var currentHref = self._location.href;
	                self._captureUrlChange(self._lastHref, currentHref);
	
	                if (oldOnPopState) {
	                    return oldOnPopState.apply(this, arguments);
	                }
	            };
	
	            fill(history, 'pushState', function (origPushState) {
	                // note history.pushState.length is 0; intentionally not declaring
	                // params to preserve 0 arity
	                return function (/* state, title, url */) {
	                    var url = arguments.length > 2 ? arguments[2] : undefined;
	
	                    // url argument is optional
	                    if (url) {
	                        // coerce to string (this is what pushState does)
	                        self._captureUrlChange(self._lastHref, url + '');
	                    }
	
	                    return origPushState.apply(this, arguments);
	                };
	            }, wrappedBuiltIns);
	        }
	
	        if (autoBreadcrumbs.console && 'console' in _window && console.log) {
	            // console
	            var consoleMethodCallback = function (msg, data) {
	                self.captureBreadcrumb({
	                    message: msg,
	                    level: data.level,
	                    category: 'console'
	                });
	            };
	
	            each(['debug', 'info', 'warn', 'error', 'log'], function (_, level) {
	                wrapConsoleMethod(console, level, consoleMethodCallback);
	            });
	        }
	
	    },
	
	    _restoreBuiltIns: function () {
	        // restore any wrapped builtins
	        var builtin;
	        while (this._wrappedBuiltIns.length) {
	            builtin = this._wrappedBuiltIns.shift();
	
	            var obj = builtin[0],
	              name = builtin[1],
	              orig = builtin[2];
	
	            obj[name] = orig;
	        }
	    },
	
	    _drainPlugins: function() {
	        var self = this;
	
	        // FIX ME TODO
	        each(this._plugins, function(_, plugin) {
	            var installer = plugin[0];
	            var args = plugin[1];
	            installer.apply(self, [self].concat(args));
	        });
	    },
	
	    _parseDSN: function(str) {
	        var m = dsnPattern.exec(str),
	            dsn = {},
	            i = 7;
	
	        try {
	            while (i--) dsn[dsnKeys[i]] = m[i] || '';
	        } catch(e) {
	            throw new RavenConfigError('Invalid DSN: ' + str);
	        }
	
	        if (dsn.pass && !this._globalOptions.allowSecretKey) {
	            throw new RavenConfigError('Do not specify your secret key in the DSN. See: http://bit.ly/raven-secret-key');
	        }
	
	        return dsn;
	    },
	
	    _getGlobalServer: function(uri) {
	        // assemble the endpoint from the uri pieces
	        var globalServer = '//' + uri.host +
	            (uri.port ? ':' + uri.port : '');
	
	        if (uri.protocol) {
	            globalServer = uri.protocol + ':' + globalServer;
	        }
	        return globalServer;
	    },
	
	    _handleOnErrorStackInfo: function() {
	        // if we are intentionally ignoring errors via onerror, bail out
	        if (!this._ignoreOnError) {
	            this._handleStackInfo.apply(this, arguments);
	        }
	    },
	
	    _handleStackInfo: function(stackInfo, options) {
	        var frames = this._prepareFrames(stackInfo, options);
	
	        this._triggerEvent('handle', {
	            stackInfo: stackInfo,
	            options: options
	        });
	
	        this._processException(
	            stackInfo.name,
	            stackInfo.message,
	            stackInfo.url,
	            stackInfo.lineno,
	            frames,
	            options
	        );
	    },
	
	    _prepareFrames: function(stackInfo, options) {
	        var self = this;
	        var frames = [];
	        if (stackInfo.stack && stackInfo.stack.length) {
	            each(stackInfo.stack, function(i, stack) {
	                var frame = self._normalizeFrame(stack);
	                if (frame) {
	                    frames.push(frame);
	                }
	            });
	
	            // e.g. frames captured via captureMessage throw
	            if (options && options.trimHeadFrames) {
	                for (var j = 0; j < options.trimHeadFrames && j < frames.length; j++) {
	                    frames[j].in_app = false;
	                }
	            }
	        }
	        frames = frames.slice(0, this._globalOptions.stackTraceLimit);
	        return frames;
	    },
	
	
	    _normalizeFrame: function(frame) {
	        if (!frame.url) return;
	
	        // normalize the frames data
	        var normalized = {
	            filename:   frame.url,
	            lineno:     frame.line,
	            colno:      frame.column,
	            'function': frame.func || '?'
	        };
	
	        normalized.in_app = !( // determine if an exception came from outside of our app
	            // first we check the global includePaths list.
	            !!this._globalOptions.includePaths.test && !this._globalOptions.includePaths.test(normalized.filename) ||
	            // Now we check for fun, if the function name is Raven or TraceKit
	            /(Raven|TraceKit)\./.test(normalized['function']) ||
	            // finally, we do a last ditch effort and check for raven.min.js
	            /raven\.(min\.)?js$/.test(normalized.filename)
	        );
	
	        return normalized;
	    },
	
	    _processException: function(type, message, fileurl, lineno, frames, options) {
	        var stacktrace;
	        if (!!this._globalOptions.ignoreErrors.test && this._globalOptions.ignoreErrors.test(message)) return;
	
	        message += '';
	
	        if (frames && frames.length) {
	            fileurl = frames[0].filename || fileurl;
	            // Sentry expects frames oldest to newest
	            // and JS sends them as newest to oldest
	            frames.reverse();
	            stacktrace = {frames: frames};
	        } else if (fileurl) {
	            stacktrace = {
	                frames: [{
	                    filename: fileurl,
	                    lineno: lineno,
	                    in_app: true
	                }]
	            };
	        }
	
	        if (!!this._globalOptions.ignoreUrls.test && this._globalOptions.ignoreUrls.test(fileurl)) return;
	        if (!!this._globalOptions.whitelistUrls.test && !this._globalOptions.whitelistUrls.test(fileurl)) return;
	
	        var data = objectMerge({
	            // sentry.interfaces.Exception
	            exception: {
	                values: [{
	                    type: type,
	                    value: message,
	                    stacktrace: stacktrace
	                }]
	            },
	            culprit: fileurl
	        }, options);
	
	        // Fire away!
	        this._send(data);
	    },
	
	    _trimPacket: function(data) {
	        // For now, we only want to truncate the two different messages
	        // but this could/should be expanded to just trim everything
	        var max = this._globalOptions.maxMessageLength;
	        if (data.message) {
	            data.message = truncate(data.message, max);
	        }
	        if (data.exception) {
	            var exception = data.exception.values[0];
	            exception.value = truncate(exception.value, max);
	        }
	
	        var request = data.request;
	        if (request) {
	            if (request.url) {
	                request.url = truncate(request.url, this._globalOptions.maxUrlLength);
	            }
	            if (request.Referer) {
	                request.Referer = truncate(request.Referer, this._globalOptions.maxUrlLength);
	            }
	        }
	
	        if (data.breadcrumbs && data.breadcrumbs.values)
	            this._trimBreadcrumbs(data.breadcrumbs);
	
	        return data;
	    },
	
	    /**
	     * Truncate breadcrumb values (right now just URLs)
	     */
	    _trimBreadcrumbs: function (breadcrumbs) {
	        // known breadcrumb properties with urls
	        // TODO: also consider arbitrary prop values that start with (https?)?://
	        var urlProps = ['to', 'from', 'url'],
	            urlProp,
	            crumb,
	            data;
	
	        for (var i = 0; i < breadcrumbs.values.length; ++i) {
	            crumb = breadcrumbs.values[i];
	            if (!crumb.hasOwnProperty('data') || !isObject(crumb.data))
	                continue;
	
	            data = crumb.data;
	            for (var j = 0; j < urlProps.length; ++j) {
	                urlProp = urlProps[j];
	                if (data.hasOwnProperty(urlProp)) {
	                    data[urlProp] = truncate(data[urlProp], this._globalOptions.maxUrlLength);
	                }
	            }
	        }
	    },
	
	    _getHttpData: function() {
	        if (!this._hasNavigator && !this._hasDocument) return;
	        var httpData = {};
	
	        if (this._hasNavigator && _navigator.userAgent) {
	            httpData.headers = {
	              'User-Agent': navigator.userAgent
	            };
	        }
	
	        if (this._hasDocument) {
	            if (_document.location && _document.location.href) {
	                httpData.url = _document.location.href;
	            }
	            if (_document.referrer) {
	                if (!httpData.headers) httpData.headers = {};
	                httpData.headers.Referer = _document.referrer;
	            }
	        }
	
	        return httpData;
	    },
	
	    _resetBackoff: function() {
	        this._backoffDuration = 0;
	        this._backoffStart = null;
	    },
	
	    _shouldBackoff: function() {
	        return this._backoffDuration && now() - this._backoffStart < this._backoffDuration;
	    },
	
	    /**
	     * Returns true if the in-process data payload matches the signature
	     * of the previously-sent data
	     *
	     * NOTE: This has to be done at this level because TraceKit can generate
	     *       data from window.onerror WITHOUT an exception object (IE8, IE9,
	     *       other old browsers). This can take the form of an "exception"
	     *       data object with a single frame (derived from the onerror args).
	     */
	    _isRepeatData: function (current) {
	        var last = this._lastData;
	
	        if (!last ||
	            current.message !== last.message || // defined for captureMessage
	            current.culprit !== last.culprit)   // defined for captureException/onerror
	            return false;
	
	        // Stacktrace interface (i.e. from captureMessage)
	        if (current.stacktrace || last.stacktrace) {
	            return isSameStacktrace(current.stacktrace, last.stacktrace);
	        }
	        // Exception interface (i.e. from captureException/onerror)
	        else if (current.exception || last.exception) {
	            return isSameException(current.exception, last.exception);
	        }
	
	        return true;
	    },
	
	    _setBackoffState: function(request) {
	        // If we are already in a backoff state, don't change anything
	        if (this._shouldBackoff()) {
	            return;
	        }
	
	        var status = request.status;
	
	        // 400 - project_id doesn't exist or some other fatal
	        // 401 - invalid/revoked dsn
	        // 429 - too many requests
	        if (!(status === 400 || status === 401 || status === 429))
	            return;
	
	        var retry;
	        try {
	            // If Retry-After is not in Access-Control-Expose-Headers, most
	            // browsers will throw an exception trying to access it
	            retry = request.getResponseHeader('Retry-After');
	            retry = parseInt(retry, 10) * 1000; // Retry-After is returned in seconds
	        } catch (e) {
	            /* eslint no-empty:0 */
	        }
	
	
	        this._backoffDuration = retry
	            // If Sentry server returned a Retry-After value, use it
	            ? retry
	            // Otherwise, double the last backoff duration (starts at 1 sec)
	            : this._backoffDuration * 2 || 1000;
	
	        this._backoffStart = now();
	    },
	
	    _send: function(data) {
	        var globalOptions = this._globalOptions;
	
	        var baseData = {
	            project: this._globalProject,
	            logger: globalOptions.logger,
	            platform: 'javascript'
	        }, httpData = this._getHttpData();
	
	        if (httpData) {
	            baseData.request = httpData;
	        }
	
	        // HACK: delete `trimHeadFrames` to prevent from appearing in outbound payload
	        if (data.trimHeadFrames) delete data.trimHeadFrames;
	
	        data = objectMerge(baseData, data);
	
	        // Merge in the tags and extra separately since objectMerge doesn't handle a deep merge
	        data.tags = objectMerge(objectMerge({}, this._globalContext.tags), data.tags);
	        data.extra = objectMerge(objectMerge({}, this._globalContext.extra), data.extra);
	
	        // Send along our own collected metadata with extra
	        data.extra['session:duration'] = now() - this._startTime;
	
	        if (this._breadcrumbs && this._breadcrumbs.length > 0) {
	            // intentionally make shallow copy so that additions
	            // to breadcrumbs aren't accidentally sent in this request
	            data.breadcrumbs = {
	                values: [].slice.call(this._breadcrumbs, 0)
	            };
	        }
	
	        // If there are no tags/extra, strip the key from the payload alltogther.
	        if (isEmptyObject(data.tags)) delete data.tags;
	
	        if (this._globalContext.user) {
	            // sentry.interfaces.User
	            data.user = this._globalContext.user;
	        }
	
	        // Include the environment if it's defined in globalOptions
	        if (globalOptions.environment) data.environment = globalOptions.environment;
	
	        // Include the release if it's defined in globalOptions
	        if (globalOptions.release) data.release = globalOptions.release;
	
	        // Include server_name if it's defined in globalOptions
	        if (globalOptions.serverName) data.server_name = globalOptions.serverName;
	
	        if (isFunction(globalOptions.dataCallback)) {
	            data = globalOptions.dataCallback(data) || data;
	        }
	
	        // Why??????????
	        if (!data || isEmptyObject(data)) {
	            return;
	        }
	
	        // Check if the request should be filtered or not
	        if (isFunction(globalOptions.shouldSendCallback) && !globalOptions.shouldSendCallback(data)) {
	            return;
	        }
	
	        // Backoff state: Sentry server previously responded w/ an error (e.g. 429 - too many requests),
	        // so drop requests until "cool-off" period has elapsed.
	        if (this._shouldBackoff()) {
	            this._logDebug('warn', 'Raven dropped error due to backoff: ', data);
	            return;
	        }
	
	        if (typeof globalOptions.sampleRate === 'number') {
	            if (Math.random() < globalOptions.sampleRate) {
	                this._sendProcessedPayload(data);
	            }
	        } else {
	            this._sendProcessedPayload(data);
	        }
	    },
	
	    _getUuid: function () {
	      return uuid4();
	    },
	
	    _sendProcessedPayload: function(data, callback) {
	        var self = this;
	        var globalOptions = this._globalOptions;
	
	        if (!this.isSetup()) return;
	
	        // Send along an event_id if not explicitly passed.
	        // This event_id can be used to reference the error within Sentry itself.
	        // Set lastEventId after we know the error should actually be sent
	        this._lastEventId = data.event_id || (data.event_id = this._getUuid());
	
	        // Try and clean up the packet before sending by truncating long values
	        data = this._trimPacket(data);
	
	        // ideally duplicate error testing should occur *before* dataCallback/shouldSendCallback,
	        // but this would require copying an un-truncated copy of the data packet, which can be
	        // arbitrarily deep (extra_data) -- could be worthwhile? will revisit
	        if (!this._globalOptions.allowDuplicates && this._isRepeatData(data)) {
	            this._logDebug('warn', 'Raven dropped repeat event: ', data);
	            return;
	        }
	
	        // Store outbound payload after trim
	        this._lastData = data;
	
	        this._logDebug('debug', 'Raven about to send:', data);
	
	        var auth = {
	            sentry_version: '7',
	            sentry_client: 'raven-js/' + this.VERSION,
	            sentry_key: this._globalKey
	        };
	        if (this._globalSecret) {
	            auth.sentry_secret = this._globalSecret;
	        }
	
	        var exception = data.exception && data.exception.values[0];
	        this.captureBreadcrumb({
	            category: 'sentry',
	            message: exception
	                ? (exception.type ? exception.type + ': ' : '') + exception.value
	                : data.message,
	            event_id: data.event_id,
	            level: data.level || 'error' // presume error unless specified
	        });
	
	        var url = this._globalEndpoint;
	        (globalOptions.transport || this._makeRequest).call(this, {
	            url: url,
	            auth: auth,
	            data: data,
	            options: globalOptions,
	            onSuccess: function success() {
	                self._resetBackoff();
	
	                self._triggerEvent('success', {
	                    data: data,
	                    src: url
	                });
	                callback && callback();
	            },
	            onError: function failure(error) {
	                self._logDebug('error', 'Raven transport failed to send: ', error);
	
	                if (error.request) {
	                    self._setBackoffState(error.request);
	                }
	
	                self._triggerEvent('failure', {
	                    data: data,
	                    src: url
	                });
	                error = error || new Error('Raven send failed (no additional details provided)');
	                callback && callback(error);
	            }
	        });
	    },
	
	    _makeRequest: function(opts) {
	        var request = new XMLHttpRequest();
	
	        // if browser doesn't support CORS (e.g. IE7), we are out of luck
	        var hasCORS =
	            'withCredentials' in request ||
	            typeof XDomainRequest !== 'undefined';
	
	        if (!hasCORS) return;
	
	        var url = opts.url;
	
	        if ('withCredentials' in request) {
	            request.onreadystatechange = function () {
	                if (request.readyState !== 4) {
	                    return;
	                } else if (request.status === 200) {
	                    opts.onSuccess && opts.onSuccess();
	                } else if (opts.onError) {
	                    var err = new Error('Sentry error code: ' + request.status);
	                    err.request = request;
	                    opts.onError(err);
	                }
	            };
	        } else {
	            request = new XDomainRequest();
	            // xdomainrequest cannot go http -> https (or vice versa),
	            // so always use protocol relative
	            url = url.replace(/^https?:/, '');
	
	            // onreadystatechange not supported by XDomainRequest
	            if (opts.onSuccess) {
	                request.onload = opts.onSuccess;
	            }
	            if (opts.onError) {
	                request.onerror = function () {
	                    var err = new Error('Sentry error code: XDomainRequest');
	                    err.request = request;
	                    opts.onError(err);
	                }
	            }
	        }
	
	        // NOTE: auth is intentionally sent as part of query string (NOT as custom
	        //       HTTP header) so as to avoid preflight CORS requests
	        request.open('POST', url + '?' + urlencode(opts.auth));
	        request.send(stringify(opts.data));
	    },
	
	    _logDebug: function(level) {
	        if (this._originalConsoleMethods[level] && this.debug) {
	            // In IE<10 console methods do not have their own 'apply' method
	            Function.prototype.apply.call(
	                this._originalConsoleMethods[level],
	                this._originalConsole,
	                [].slice.call(arguments, 1)
	            );
	        }
	    },
	
	    _mergeContext: function(key, context) {
	        if (isUndefined(context)) {
	            delete this._globalContext[key];
	        } else {
	            this._globalContext[key] = objectMerge(this._globalContext[key] || {}, context);
	        }
	    }
	};
	
	/*------------------------------------------------
	 * utils
	 *
	 * conditionally exported for test via Raven.utils
	 =================================================
	 */
	var objectPrototype = Object.prototype;
	
	function isUndefined(what) {
	    return what === void 0;
	}
	
	function isFunction(what) {
	    return typeof what === 'function';
	}
	
	function isString(what) {
	    return objectPrototype.toString.call(what) === '[object String]';
	}
	
	
	function isEmptyObject(what) {
	    for (var _ in what) return false;  // eslint-disable-line guard-for-in, no-unused-vars
	    return true;
	}
	
	function each(obj, callback) {
	    var i, j;
	
	    if (isUndefined(obj.length)) {
	        for (i in obj) {
	            if (hasKey(obj, i)) {
	                callback.call(null, i, obj[i]);
	            }
	        }
	    } else {
	        j = obj.length;
	        if (j) {
	            for (i = 0; i < j; i++) {
	                callback.call(null, i, obj[i]);
	            }
	        }
	    }
	}
	
	function objectMerge(obj1, obj2) {
	    if (!obj2) {
	        return obj1;
	    }
	    each(obj2, function(key, value){
	        obj1[key] = value;
	    });
	    return obj1;
	}
	
	function truncate(str, max) {
	    return !max || str.length <= max ? str : str.substr(0, max) + '\u2026';
	}
	
	/**
	 * hasKey, a better form of hasOwnProperty
	 * Example: hasKey(MainHostObject, property) === true/false
	 *
	 * @param {Object} host object to check property
	 * @param {string} key to check
	 */
	function hasKey(object, key) {
	    return objectPrototype.hasOwnProperty.call(object, key);
	}
	
	function joinRegExp(patterns) {
	    // Combine an array of regular expressions and strings into one large regexp
	    // Be mad.
	    var sources = [],
	        i = 0, len = patterns.length,
	        pattern;
	
	    for (; i < len; i++) {
	        pattern = patterns[i];
	        if (isString(pattern)) {
	            // If it's a string, we need to escape it
	            // Taken from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
	            sources.push(pattern.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'));
	        } else if (pattern && pattern.source) {
	            // If it's a regexp already, we want to extract the source
	            sources.push(pattern.source);
	        }
	        // Intentionally skip other cases
	    }
	    return new RegExp(sources.join('|'), 'i');
	}
	
	function urlencode(o) {
	    var pairs = [];
	    each(o, function(key, value) {
	        pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
	    });
	    return pairs.join('&');
	}
	
	// borrowed from https://tools.ietf.org/html/rfc3986#appendix-B
	// intentionally using regex and not <a/> href parsing trick because React Native and other
	// environments where DOM might not be available
	function parseUrl(url) {
	    var match = url.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
	    if (!match) return {};
	
	    // coerce to undefined values to empty string so we don't get 'undefined'
	    var query = match[6] || '';
	    var fragment = match[8] || '';
	    return {
	        protocol: match[2],
	        host: match[4],
	        path: match[5],
	        relative: match[5] + query + fragment // everything minus origin
	    };
	}
	function uuid4() {
	    var crypto = _window.crypto || _window.msCrypto;
	
	    if (!isUndefined(crypto) && crypto.getRandomValues) {
	        // Use window.crypto API if available
	        var arr = new Uint16Array(8);
	        crypto.getRandomValues(arr);
	
	        // set 4 in byte 7
	        arr[3] = arr[3] & 0xFFF | 0x4000;
	        // set 2 most significant bits of byte 9 to '10'
	        arr[4] = arr[4] & 0x3FFF | 0x8000;
	
	        var pad = function(num) {
	            var v = num.toString(16);
	            while (v.length < 4) {
	                v = '0' + v;
	            }
	            return v;
	        };
	
	        return pad(arr[0]) + pad(arr[1]) + pad(arr[2]) + pad(arr[3]) + pad(arr[4]) +
	        pad(arr[5]) + pad(arr[6]) + pad(arr[7]);
	    } else {
	        // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
	        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	            var r = Math.random()*16|0,
	                v = c === 'x' ? r : r&0x3|0x8;
	            return v.toString(16);
	        });
	    }
	}
	
	/**
	 * Given a child DOM element, returns a query-selector statement describing that
	 * and its ancestors
	 * e.g. [HTMLElement] => body > div > input#foo.btn[name=baz]
	 * @param elem
	 * @returns {string}
	 */
	function htmlTreeAsString(elem) {
	    /* eslint no-extra-parens:0*/
	    var MAX_TRAVERSE_HEIGHT = 5,
	        MAX_OUTPUT_LEN = 80,
	        out = [],
	        height = 0,
	        len = 0,
	        separator = ' > ',
	        sepLength = separator.length,
	        nextStr;
	
	    while (elem && height++ < MAX_TRAVERSE_HEIGHT) {
	
	        nextStr = htmlElementAsString(elem);
	        // bail out if
	        // - nextStr is the 'html' element
	        // - the length of the string that would be created exceeds MAX_OUTPUT_LEN
	        //   (ignore this limit if we are on the first iteration)
	        if (nextStr === 'html' || height > 1 && len + (out.length * sepLength) + nextStr.length >= MAX_OUTPUT_LEN) {
	            break;
	        }
	
	        out.push(nextStr);
	
	        len += nextStr.length;
	        elem = elem.parentNode;
	    }
	
	    return out.reverse().join(separator);
	}
	
	/**
	 * Returns a simple, query-selector representation of a DOM element
	 * e.g. [HTMLElement] => input#foo.btn[name=baz]
	 * @param HTMLElement
	 * @returns {string}
	 */
	function htmlElementAsString(elem) {
	    var out = [],
	        className,
	        classes,
	        key,
	        attr,
	        i;
	
	    if (!elem || !elem.tagName) {
	        return '';
	    }
	
	    out.push(elem.tagName.toLowerCase());
	    if (elem.id) {
	        out.push('#' + elem.id);
	    }
	
	    className = elem.className;
	    if (className && isString(className)) {
	        classes = className.split(/\s+/);
	        for (i = 0; i < classes.length; i++) {
	            out.push('.' + classes[i]);
	        }
	    }
	    var attrWhitelist = ['type', 'name', 'title', 'alt'];
	    for (i = 0; i < attrWhitelist.length; i++) {
	        key = attrWhitelist[i];
	        attr = elem.getAttribute(key);
	        if (attr) {
	            out.push('[' + key + '="' + attr + '"]');
	        }
	    }
	    return out.join('');
	}
	
	/**
	 * Returns true if either a OR b is truthy, but not both
	 */
	function isOnlyOneTruthy(a, b) {
	    return !!(!!a ^ !!b);
	}
	
	/**
	 * Returns true if the two input exception interfaces have the same content
	 */
	function isSameException(ex1, ex2) {
	    if (isOnlyOneTruthy(ex1, ex2))
	        return false;
	
	    ex1 = ex1.values[0];
	    ex2 = ex2.values[0];
	
	    if (ex1.type !== ex2.type ||
	        ex1.value !== ex2.value)
	        return false;
	
	    return isSameStacktrace(ex1.stacktrace, ex2.stacktrace);
	}
	
	/**
	 * Returns true if the two input stack trace interfaces have the same content
	 */
	function isSameStacktrace(stack1, stack2) {
	    if (isOnlyOneTruthy(stack1, stack2))
	        return false;
	
	    var frames1 = stack1.frames;
	    var frames2 = stack2.frames;
	
	    // Exit early if frame count differs
	    if (frames1.length !== frames2.length)
	        return false;
	
	    // Iterate through every frame; bail out if anything differs
	    var a, b;
	    for (var i = 0; i < frames1.length; i++) {
	        a = frames1[i];
	        b = frames2[i];
	        if (a.filename !== b.filename ||
	            a.lineno !== b.lineno ||
	            a.colno !== b.colno ||
	            a['function'] !== b['function'])
	            return false;
	    }
	    return true;
	}
	
	/**
	 * Polyfill a method
	 * @param obj object e.g. `document`
	 * @param name method name present on object e.g. `addEventListener`
	 * @param replacement replacement function
	 * @param track {optional} record instrumentation to an array
	 */
	function fill(obj, name, replacement, track) {
	    var orig = obj[name];
	    obj[name] = replacement(orig);
	    if (track) {
	        track.push([obj, name, orig]);
	    }
	}
	
	if (typeof __DEV__ !== 'undefined' && __DEV__) {
	    Raven.utils = {
	        isUndefined: isUndefined,
	        isFunction: isFunction,
	        isString: isString,
	        isObject: isObject,
	        isEmptyObject: isEmptyObject,
	        isError: isError,
	        each: each,
	        objectMerge: objectMerge,
	        truncate: truncate,
	        hasKey: hasKey,
	        joinRegExp: joinRegExp,
	        urlencode: urlencode,
	        uuid4: uuid4,
	        htmlTreeAsString: htmlTreeAsString,
	        htmlElementAsString: htmlElementAsString,
	        parseUrl: parseUrl,
	        fill: fill
	    };
	};
	
	// Deprecations
	Raven.prototype.setUser = Raven.prototype.setUserContext;
	Raven.prototype.setReleaseContext = Raven.prototype.setRelease;
	
	module.exports = Raven;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },

/***/ 829:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Enforces a single instance of the Raven client, and the
	 * main entry point for Raven. If you are a consumer of the
	 * Raven library, you SHOULD load this file (vs raven.js).
	 **/
	
	'use strict';
	
	var RavenConstructor = __webpack_require__(828);
	
	// This is to be defensive in environments where window does not exist (see https://github.com/getsentry/raven-js/pull/785)
	var _window = typeof window !== 'undefined' ? window
	            : typeof global !== 'undefined' ? global
	            : typeof self !== 'undefined' ? self
	            : {};
	var _Raven = _window.Raven;
	
	var Raven = new RavenConstructor();
	
	/*
	 * Allow multiple versions of Raven to be installed.
	 * Strip Raven from the global context and returns the instance.
	 *
	 * @return {Raven}
	 */
	Raven.noConflict = function () {
		_window.Raven = _Raven;
		return Raven;
	};
	
	Raven.afterLoad();
	
	module.exports = Raven;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },

/***/ 830:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	var utils = __webpack_require__(374);
	
	/*
	 TraceKit - Cross brower stack traces
	
	 This was originally forked from github.com/occ/TraceKit, but has since been
	 largely re-written and is now maintained as part of raven-js.  Tests for
	 this are in test/vendor.
	
	 MIT license
	*/
	
	var TraceKit = {
	    collectWindowErrors: true,
	    debug: false
	};
	
	// This is to be defensive in environments where window does not exist (see https://github.com/getsentry/raven-js/pull/785)
	var _window = typeof window !== 'undefined' ? window
	            : typeof global !== 'undefined' ? global
	            : typeof self !== 'undefined' ? self
	            : {};
	
	// global reference to slice
	var _slice = [].slice;
	var UNKNOWN_FUNCTION = '?';
	
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Error_types
	var ERROR_TYPES_RE = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/;
	
	function getLocationHref() {
	    if (typeof document === 'undefined' || typeof document.location === 'undefined')
	        return '';
	
	    return document.location.href;
	}
	
	
	/**
	 * TraceKit.report: cross-browser processing of unhandled exceptions
	 *
	 * Syntax:
	 *   TraceKit.report.subscribe(function(stackInfo) { ... })
	 *   TraceKit.report.unsubscribe(function(stackInfo) { ... })
	 *   TraceKit.report(exception)
	 *   try { ...code... } catch(ex) { TraceKit.report(ex); }
	 *
	 * Supports:
	 *   - Firefox: full stack trace with line numbers, plus column number
	 *              on top frame; column number is not guaranteed
	 *   - Opera:   full stack trace with line and column numbers
	 *   - Chrome:  full stack trace with line and column numbers
	 *   - Safari:  line and column number for the top frame only; some frames
	 *              may be missing, and column number is not guaranteed
	 *   - IE:      line and column number for the top frame only; some frames
	 *              may be missing, and column number is not guaranteed
	 *
	 * In theory, TraceKit should work on all of the following versions:
	 *   - IE5.5+ (only 8.0 tested)
	 *   - Firefox 0.9+ (only 3.5+ tested)
	 *   - Opera 7+ (only 10.50 tested; versions 9 and earlier may require
	 *     Exceptions Have Stacktrace to be enabled in opera:config)
	 *   - Safari 3+ (only 4+ tested)
	 *   - Chrome 1+ (only 5+ tested)
	 *   - Konqueror 3.5+ (untested)
	 *
	 * Requires TraceKit.computeStackTrace.
	 *
	 * Tries to catch all unhandled exceptions and report them to the
	 * subscribed handlers. Please note that TraceKit.report will rethrow the
	 * exception. This is REQUIRED in order to get a useful stack trace in IE.
	 * If the exception does not reach the top of the browser, you will only
	 * get a stack trace from the point where TraceKit.report was called.
	 *
	 * Handlers receive a stackInfo object as described in the
	 * TraceKit.computeStackTrace docs.
	 */
	TraceKit.report = (function reportModuleWrapper() {
	    var handlers = [],
	        lastArgs = null,
	        lastException = null,
	        lastExceptionStack = null;
	
	    /**
	     * Add a crash handler.
	     * @param {Function} handler
	     */
	    function subscribe(handler) {
	        installGlobalHandler();
	        handlers.push(handler);
	    }
	
	    /**
	     * Remove a crash handler.
	     * @param {Function} handler
	     */
	    function unsubscribe(handler) {
	        for (var i = handlers.length - 1; i >= 0; --i) {
	            if (handlers[i] === handler) {
	                handlers.splice(i, 1);
	            }
	        }
	    }
	
	    /**
	     * Remove all crash handlers.
	     */
	    function unsubscribeAll() {
	        uninstallGlobalHandler();
	        handlers = [];
	    }
	
	    /**
	     * Dispatch stack information to all handlers.
	     * @param {Object.<string, *>} stack
	     */
	    function notifyHandlers(stack, isWindowError) {
	        var exception = null;
	        if (isWindowError && !TraceKit.collectWindowErrors) {
	          return;
	        }
	        for (var i in handlers) {
	            if (handlers.hasOwnProperty(i)) {
	                try {
	                    handlers[i].apply(null, [stack].concat(_slice.call(arguments, 2)));
	                } catch (inner) {
	                    exception = inner;
	                }
	            }
	        }
	
	        if (exception) {
	            throw exception;
	        }
	    }
	
	    var _oldOnerrorHandler, _onErrorHandlerInstalled;
	
	    /**
	     * Ensures all global unhandled exceptions are recorded.
	     * Supported by Gecko and IE.
	     * @param {string} message Error message.
	     * @param {string} url URL of script that generated the exception.
	     * @param {(number|string)} lineNo The line number at which the error
	     * occurred.
	     * @param {?(number|string)} colNo The column number at which the error
	     * occurred.
	     * @param {?Error} ex The actual Error object.
	     */
	    function traceKitWindowOnError(message, url, lineNo, colNo, ex) {
	        var stack = null;
	
	        if (lastExceptionStack) {
	            TraceKit.computeStackTrace.augmentStackTraceWithInitialElement(lastExceptionStack, url, lineNo, message);
	            processLastException();
	        } else if (ex && utils.isError(ex)) {
	            // non-string `ex` arg; attempt to extract stack trace
	
	            // New chrome and blink send along a real error object
	            // Let's just report that like a normal error.
	            // See: https://mikewest.org/2013/08/debugging-runtime-errors-with-window-onerror
	            stack = TraceKit.computeStackTrace(ex);
	            notifyHandlers(stack, true);
	        } else {
	            var location = {
	                'url': url,
	                'line': lineNo,
	                'column': colNo
	            };
	
	            var name = undefined;
	            var msg = message; // must be new var or will modify original `arguments`
	            var groups;
	            if ({}.toString.call(message) === '[object String]') {
	                var groups = message.match(ERROR_TYPES_RE);
	                if (groups) {
	                    name = groups[1];
	                    msg = groups[2];
	                }
	            }
	
	            location.func = UNKNOWN_FUNCTION;
	
	            stack = {
	                'name': name,
	                'message': msg,
	                'url': getLocationHref(),
	                'stack': [location]
	            };
	            notifyHandlers(stack, true);
	        }
	
	        if (_oldOnerrorHandler) {
	            return _oldOnerrorHandler.apply(this, arguments);
	        }
	
	        return false;
	    }
	
	    function installGlobalHandler ()
	    {
	        if (_onErrorHandlerInstalled) {
	            return;
	        }
	        _oldOnerrorHandler = _window.onerror;
	        _window.onerror = traceKitWindowOnError;
	        _onErrorHandlerInstalled = true;
	    }
	
	    function uninstallGlobalHandler ()
	    {
	        if (!_onErrorHandlerInstalled) {
	            return;
	        }
	        _window.onerror = _oldOnerrorHandler;
	        _onErrorHandlerInstalled = false;
	        _oldOnerrorHandler = undefined;
	    }
	
	    function processLastException() {
	        var _lastExceptionStack = lastExceptionStack,
	            _lastArgs = lastArgs;
	        lastArgs = null;
	        lastExceptionStack = null;
	        lastException = null;
	        notifyHandlers.apply(null, [_lastExceptionStack, false].concat(_lastArgs));
	    }
	
	    /**
	     * Reports an unhandled Error to TraceKit.
	     * @param {Error} ex
	     * @param {?boolean} rethrow If false, do not re-throw the exception.
	     * Only used for window.onerror to not cause an infinite loop of
	     * rethrowing.
	     */
	    function report(ex, rethrow) {
	        var args = _slice.call(arguments, 1);
	        if (lastExceptionStack) {
	            if (lastException === ex) {
	                return; // already caught by an inner catch block, ignore
	            } else {
	              processLastException();
	            }
	        }
	
	        var stack = TraceKit.computeStackTrace(ex);
	        lastExceptionStack = stack;
	        lastException = ex;
	        lastArgs = args;
	
	        // If the stack trace is incomplete, wait for 2 seconds for
	        // slow slow IE to see if onerror occurs or not before reporting
	        // this exception; otherwise, we will end up with an incomplete
	        // stack trace
	        setTimeout(function () {
	            if (lastException === ex) {
	                processLastException();
	            }
	        }, (stack.incomplete ? 2000 : 0));
	
	        if (rethrow !== false) {
	            throw ex; // re-throw to propagate to the top level (and cause window.onerror)
	        }
	    }
	
	    report.subscribe = subscribe;
	    report.unsubscribe = unsubscribe;
	    report.uninstall = unsubscribeAll;
	    return report;
	}());
	
	/**
	 * TraceKit.computeStackTrace: cross-browser stack traces in JavaScript
	 *
	 * Syntax:
	 *   s = TraceKit.computeStackTrace(exception) // consider using TraceKit.report instead (see below)
	 * Returns:
	 *   s.name              - exception name
	 *   s.message           - exception message
	 *   s.stack[i].url      - JavaScript or HTML file URL
	 *   s.stack[i].func     - function name, or empty for anonymous functions (if guessing did not work)
	 *   s.stack[i].args     - arguments passed to the function, if known
	 *   s.stack[i].line     - line number, if known
	 *   s.stack[i].column   - column number, if known
	 *
	 * Supports:
	 *   - Firefox:  full stack trace with line numbers and unreliable column
	 *               number on top frame
	 *   - Opera 10: full stack trace with line and column numbers
	 *   - Opera 9-: full stack trace with line numbers
	 *   - Chrome:   full stack trace with line and column numbers
	 *   - Safari:   line and column number for the topmost stacktrace element
	 *               only
	 *   - IE:       no line numbers whatsoever
	 *
	 * Tries to guess names of anonymous functions by looking for assignments
	 * in the source code. In IE and Safari, we have to guess source file names
	 * by searching for function bodies inside all page scripts. This will not
	 * work for scripts that are loaded cross-domain.
	 * Here be dragons: some function names may be guessed incorrectly, and
	 * duplicate functions may be mismatched.
	 *
	 * TraceKit.computeStackTrace should only be used for tracing purposes.
	 * Logging of unhandled exceptions should be done with TraceKit.report,
	 * which builds on top of TraceKit.computeStackTrace and provides better
	 * IE support by utilizing the window.onerror event to retrieve information
	 * about the top of the stack.
	 *
	 * Note: In IE and Safari, no stack trace is recorded on the Error object,
	 * so computeStackTrace instead walks its *own* chain of callers.
	 * This means that:
	 *  * in Safari, some methods may be missing from the stack trace;
	 *  * in IE, the topmost function in the stack trace will always be the
	 *    caller of computeStackTrace.
	 *
	 * This is okay for tracing (because you are likely to be calling
	 * computeStackTrace from the function you want to be the topmost element
	 * of the stack trace anyway), but not okay for logging unhandled
	 * exceptions (because your catch block will likely be far away from the
	 * inner function that actually caused the exception).
	 *
	 */
	TraceKit.computeStackTrace = (function computeStackTraceWrapper() {
	    // Contents of Exception in various browsers.
	    //
	    // SAFARI:
	    // ex.message = Can't find variable: qq
	    // ex.line = 59
	    // ex.sourceId = 580238192
	    // ex.sourceURL = http://...
	    // ex.expressionBeginOffset = 96
	    // ex.expressionCaretOffset = 98
	    // ex.expressionEndOffset = 98
	    // ex.name = ReferenceError
	    //
	    // FIREFOX:
	    // ex.message = qq is not defined
	    // ex.fileName = http://...
	    // ex.lineNumber = 59
	    // ex.columnNumber = 69
	    // ex.stack = ...stack trace... (see the example below)
	    // ex.name = ReferenceError
	    //
	    // CHROME:
	    // ex.message = qq is not defined
	    // ex.name = ReferenceError
	    // ex.type = not_defined
	    // ex.arguments = ['aa']
	    // ex.stack = ...stack trace...
	    //
	    // INTERNET EXPLORER:
	    // ex.message = ...
	    // ex.name = ReferenceError
	    //
	    // OPERA:
	    // ex.message = ...message... (see the example below)
	    // ex.name = ReferenceError
	    // ex.opera#sourceloc = 11  (pretty much useless, duplicates the info in ex.message)
	    // ex.stacktrace = n/a; see 'opera:config#UserPrefs|Exceptions Have Stacktrace'
	
	    /**
	     * Computes stack trace information from the stack property.
	     * Chrome and Gecko use this property.
	     * @param {Error} ex
	     * @return {?Object.<string, *>} Stack trace information.
	     */
	    function computeStackTraceFromStackProp(ex) {
	        if (typeof ex.stack === 'undefined' || !ex.stack) return;
	
	        var chrome = /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
	            gecko = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|\[native).*?)(?::(\d+))?(?::(\d+))?\s*$/i,
	            winjs = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i,
	
	            // Used to additionally parse URL/line/column from eval frames
	            geckoEval = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i,
	            chromeEval = /\((\S*)(?::(\d+))(?::(\d+))\)/,
	
	            lines = ex.stack.split('\n'),
	            stack = [],
	            submatch,
	            parts,
	            element,
	            reference = /^(.*) is undefined$/.exec(ex.message);
	
	        for (var i = 0, j = lines.length; i < j; ++i) {
	            if ((parts = chrome.exec(lines[i]))) {
	                var isNative = parts[2] && parts[2].indexOf('native') === 0; // start of line
	                var isEval = parts[2] && parts[2].indexOf('eval') === 0; // start of line
	                if (isEval && (submatch = chromeEval.exec(parts[2]))) {
	                    // throw out eval line/column and use top-most line/column number
	                    parts[2] = submatch[1]; // url
	                    parts[3] = submatch[2]; // line
	                    parts[4] = submatch[3]; // column
	                }
	                element = {
	                    'url': !isNative ? parts[2] : null,
	                    'func': parts[1] || UNKNOWN_FUNCTION,
	                    'args': isNative ? [parts[2]] : [],
	                    'line': parts[3] ? +parts[3] : null,
	                    'column': parts[4] ? +parts[4] : null
	                };
	            } else if ( parts = winjs.exec(lines[i]) ) {
	                element = {
	                    'url': parts[2],
	                    'func': parts[1] || UNKNOWN_FUNCTION,
	                    'args': [],
	                    'line': +parts[3],
	                    'column': parts[4] ? +parts[4] : null
	                };
	            } else if ((parts = gecko.exec(lines[i]))) {
	                var isEval = parts[3] && parts[3].indexOf(' > eval') > -1;
	                if (isEval && (submatch = geckoEval.exec(parts[3]))) {
	                    // throw out eval line/column and use top-most line number
	                    parts[3] = submatch[1];
	                    parts[4] = submatch[2];
	                    parts[5] = null; // no column when eval
	                } else if (i === 0 && !parts[5] && typeof ex.columnNumber !== 'undefined') {
	                    // FireFox uses this awesome columnNumber property for its top frame
	                    // Also note, Firefox's column number is 0-based and everything else expects 1-based,
	                    // so adding 1
	                    // NOTE: this hack doesn't work if top-most frame is eval
	                    stack[0].column = ex.columnNumber + 1;
	                }
	                element = {
	                    'url': parts[3],
	                    'func': parts[1] || UNKNOWN_FUNCTION,
	                    'args': parts[2] ? parts[2].split(',') : [],
	                    'line': parts[4] ? +parts[4] : null,
	                    'column': parts[5] ? +parts[5] : null
	                };
	            } else {
	                continue;
	            }
	
	            if (!element.func && element.line) {
	                element.func = UNKNOWN_FUNCTION;
	            }
	
	            stack.push(element);
	        }
	
	        if (!stack.length) {
	            return null;
	        }
	
	        return {
	            'name': ex.name,
	            'message': ex.message,
	            'url': getLocationHref(),
	            'stack': stack
	        };
	    }
	
	    /**
	     * Adds information about the first frame to incomplete stack traces.
	     * Safari and IE require this to get complete data on the first frame.
	     * @param {Object.<string, *>} stackInfo Stack trace information from
	     * one of the compute* methods.
	     * @param {string} url The URL of the script that caused an error.
	     * @param {(number|string)} lineNo The line number of the script that
	     * caused an error.
	     * @param {string=} message The error generated by the browser, which
	     * hopefully contains the name of the object that caused the error.
	     * @return {boolean} Whether or not the stack information was
	     * augmented.
	     */
	    function augmentStackTraceWithInitialElement(stackInfo, url, lineNo, message) {
	        var initial = {
	            'url': url,
	            'line': lineNo
	        };
	
	        if (initial.url && initial.line) {
	            stackInfo.incomplete = false;
	
	            if (!initial.func) {
	                initial.func = UNKNOWN_FUNCTION;
	            }
	
	            if (stackInfo.stack.length > 0) {
	                if (stackInfo.stack[0].url === initial.url) {
	                    if (stackInfo.stack[0].line === initial.line) {
	                        return false; // already in stack trace
	                    } else if (!stackInfo.stack[0].line && stackInfo.stack[0].func === initial.func) {
	                        stackInfo.stack[0].line = initial.line;
	                        return false;
	                    }
	                }
	            }
	
	            stackInfo.stack.unshift(initial);
	            stackInfo.partial = true;
	            return true;
	        } else {
	            stackInfo.incomplete = true;
	        }
	
	        return false;
	    }
	
	    /**
	     * Computes stack trace information by walking the arguments.caller
	     * chain at the time the exception occurred. This will cause earlier
	     * frames to be missed but is the only way to get any stack trace in
	     * Safari and IE. The top frame is restored by
	     * {@link augmentStackTraceWithInitialElement}.
	     * @param {Error} ex
	     * @return {?Object.<string, *>} Stack trace information.
	     */
	    function computeStackTraceByWalkingCallerChain(ex, depth) {
	        var functionName = /function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i,
	            stack = [],
	            funcs = {},
	            recursion = false,
	            parts,
	            item,
	            source;
	
	        for (var curr = computeStackTraceByWalkingCallerChain.caller; curr && !recursion; curr = curr.caller) {
	            if (curr === computeStackTrace || curr === TraceKit.report) {
	                // console.log('skipping internal function');
	                continue;
	            }
	
	            item = {
	                'url': null,
	                'func': UNKNOWN_FUNCTION,
	                'line': null,
	                'column': null
	            };
	
	            if (curr.name) {
	                item.func = curr.name;
	            } else if ((parts = functionName.exec(curr.toString()))) {
	                item.func = parts[1];
	            }
	
	            if (typeof item.func === 'undefined') {
	              try {
	                item.func = parts.input.substring(0, parts.input.indexOf('{'));
	              } catch (e) { }
	            }
	
	            if (funcs['' + curr]) {
	                recursion = true;
	            }else{
	                funcs['' + curr] = true;
	            }
	
	            stack.push(item);
	        }
	
	        if (depth) {
	            // console.log('depth is ' + depth);
	            // console.log('stack is ' + stack.length);
	            stack.splice(0, depth);
	        }
	
	        var result = {
	            'name': ex.name,
	            'message': ex.message,
	            'url': getLocationHref(),
	            'stack': stack
	        };
	        augmentStackTraceWithInitialElement(result, ex.sourceURL || ex.fileName, ex.line || ex.lineNumber, ex.message || ex.description);
	        return result;
	    }
	
	    /**
	     * Computes a stack trace for an exception.
	     * @param {Error} ex
	     * @param {(string|number)=} depth
	     */
	    function computeStackTrace(ex, depth) {
	        var stack = null;
	        depth = (depth == null ? 0 : +depth);
	
	        try {
	            stack = computeStackTraceFromStackProp(ex);
	            if (stack) {
	                return stack;
	            }
	        } catch (e) {
	            if (TraceKit.debug) {
	                throw e;
	            }
	        }
	
	        try {
	            stack = computeStackTraceByWalkingCallerChain(ex, depth + 1);
	            if (stack) {
	                return stack;
	            }
	        } catch (e) {
	            if (TraceKit.debug) {
	                throw e;
	            }
	        }
	        return {
	            'name': ex.name,
	            'message': ex.message,
	            'url': getLocationHref()
	        };
	    }
	
	    computeStackTrace.augmentStackTraceWithInitialElement = augmentStackTraceWithInitialElement;
	    computeStackTrace.computeStackTraceFromStackProp = computeStackTraceFromStackProp;
	
	    return computeStackTrace;
	}());
	
	module.exports = TraceKit;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },

/***/ 831:
/***/ function(module, exports) {

	'use strict';
	
	/*
	 json-stringify-safe
	 Like JSON.stringify, but doesn't throw on circular references.
	
	 Originally forked from https://github.com/isaacs/json-stringify-safe
	 version 5.0.1 on 3/8/2017 and modified for IE8 compatibility.
	 Tests for this are in test/vendor.
	
	 ISC license: https://github.com/isaacs/json-stringify-safe/blob/master/LICENSE
	*/
	
	exports = module.exports = stringify
	exports.getSerialize = serializer
	
	function indexOf(haystack, needle) {
	  for (var i = 0; i < haystack.length; ++i) {
	    if (haystack[i] === needle) return i;
	  }
	  return -1;
	}
	
	function stringify(obj, replacer, spaces, cycleReplacer) {
	  return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
	}
	
	function serializer(replacer, cycleReplacer) {
	  var stack = [], keys = []
	
	  if (cycleReplacer == null) cycleReplacer = function(key, value) {
	    if (stack[0] === value) return '[Circular ~]'
	    return '[Circular ~.' + keys.slice(0, indexOf(stack, value)).join('.') + ']'
	  }
	
	  return function(key, value) {
	    if (stack.length > 0) {
	      var thisPos = indexOf(stack, this);
	      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
	      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
	      if (~indexOf(stack, value)) value = cycleReplacer.call(this, key, value)
	    }
	    else stack.push(value)
	
	    return replacer == null ? value : replacer.call(this, key, value)
	  }
	}


/***/ },

/***/ 1141:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var communication_1 = __webpack_require__(23);
	var connections = new Map();
	var messageBuffer = new Map();
	var drainQueue = function (port, buffer) {
	    if (buffer == null || buffer.length === 0) {
	        return;
	    }
	    var removed = 0;
	    var send = function (m, index) {
	        port.postMessage(m);
	        ++removed;
	    };
	    try {
	        buffer.forEach(send);
	    }
	    catch (error) {
	    }
	    buffer.splice(0, removed);
	};
	chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	    if (message.messageType === communication_1.MessageType.Initialize) {
	        sendResponse({
	            extensionId: chrome.runtime.id
	        });
	    }
	    if (sender.tab) {
	        var sent = false;
	        var connection = connections.get(sender.tab.id);
	        if (connection) {
	            try {
	                connection.postMessage(message);
	                sent = true;
	            }
	            catch (err) { }
	        }
	        if (sent === false) {
	            var queue = messageBuffer.get(sender.tab.id);
	            if (queue == null) {
	                queue = new Array();
	                messageBuffer.set(sender.tab.id, queue);
	            }
	            queue.push(message);
	        }
	    }
	    return true;
	});
	chrome.runtime.onConnect.addListener(function (port) {
	    var listener = function (message, sender) {
	        if (connections.has(message.tabId) === false) {
	            connections.set(message.tabId, port);
	        }
	        drainQueue(message.tabId, messageBuffer.get(message.tabId));
	        chrome.tabs.sendMessage(message.tabId, message);
	    };
	    port.onMessage.addListener(listener);
	    port.onDisconnect.addListener(function () {
	        port.onMessage.removeListener(listener);
	        connections.forEach(function (value, key, map) {
	            if (value === port) {
	                map.delete(key);
	            }
	        });
	    });
	});


/***/ },

/***/ 1184:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var communication_1 = __webpack_require__(23);
	var initializeGTM = function (w, d, s, l, i) {
	    w[l] = w[l] || [];
	    w[l].push({
	        'gtm.start': new Date().getTime(),
	        'event': 'gtm.js'
	    });
	    var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l !== 'dataLayer' ? '&l=' + l : '';
	    j.async = true;
	    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
	    f.parentNode.insertBefore(j, f);
	    chrome.runtime.onMessage.addListener(function (message) {
	        if (message && message.messageType === communication_1.MessageType.GoogleTagManagerSend) {
	            pushTag(message.content);
	        }
	    });
	};
	var pushTag = function (tag) { return window.dataLayer.push(tag); };
	initializeGTM(window, document, 'script', 'dataLayer', 'GTM-NTK59FH');


/***/ },

/***/ 1185:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var communication_1 = __webpack_require__(23);
	var Raven = __webpack_require__(829);
	if (("https://c90bb58b1f5d4ff6a43d2afd3da58f56@sentry.io/159772") && ("https://c90bb58b1f5d4ff6a43d2afd3da58f56@sentry.io/159772").length > 0) {
	    Raven
	        .config(("https://c90bb58b1f5d4ff6a43d2afd3da58f56@sentry.io/159772"), { release: chrome.runtime.getManifest().version })
	        .install();
	    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	        if (message && message.messageType === communication_1.MessageType.SendUncaughtError) {
	            communication_1.deserializeMessage(message);
	            reportError(message.content);
	        }
	    });
	}
	var reportError = function (errMsg) {
	    var e = new Error(errMsg.error.message);
	    e.name = errMsg.error.name;
	    e.stack = errMsg.error.stack;
	    Raven.captureException(e, {
	        tags: {
	            ngVersion: errMsg.ngVersion,
	        },
	    });
	};


/***/ }

/******/ });
//# sourceMappingURL=background.js.map