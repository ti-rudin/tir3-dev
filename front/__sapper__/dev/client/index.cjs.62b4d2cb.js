import { t as tslib_es6 } from './client.702590eb.js';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    }
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var index_cjs = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', { value: true });



/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview Firebase constants.  Some of these (@defines) can be overridden at compile-time.
 */
var CONSTANTS = {
    /**
     * @define {boolean} Whether this is the client Node.js SDK.
     */
    NODE_CLIENT: false,
    /**
     * @define {boolean} Whether this is the Admin Node.js SDK.
     */
    NODE_ADMIN: false,
    /**
     * Firebase SDK Version
     */
    SDK_VERSION: '${JSCORE_VERSION}'
};

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Throws an error if the provided assertion is falsy
 */
var assert = function (assertion, message) {
    if (!assertion) {
        throw assertionError(message);
    }
};
/**
 * Returns an Error object suitable for throwing.
 */
var assertionError = function (message) {
    return new Error('Firebase Database (' +
        CONSTANTS.SDK_VERSION +
        ') INTERNAL ASSERT FAILED: ' +
        message);
};

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var stringToByteArray = function (str) {
    // TODO(user): Use native implementations if/when available
    var out = [];
    var p = 0;
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if (c < 128) {
            out[p++] = c;
        }
        else if (c < 2048) {
            out[p++] = (c >> 6) | 192;
            out[p++] = (c & 63) | 128;
        }
        else if ((c & 0xfc00) === 0xd800 &&
            i + 1 < str.length &&
            (str.charCodeAt(i + 1) & 0xfc00) === 0xdc00) {
            // Surrogate Pair
            c = 0x10000 + ((c & 0x03ff) << 10) + (str.charCodeAt(++i) & 0x03ff);
            out[p++] = (c >> 18) | 240;
            out[p++] = ((c >> 12) & 63) | 128;
            out[p++] = ((c >> 6) & 63) | 128;
            out[p++] = (c & 63) | 128;
        }
        else {
            out[p++] = (c >> 12) | 224;
            out[p++] = ((c >> 6) & 63) | 128;
            out[p++] = (c & 63) | 128;
        }
    }
    return out;
};
/**
 * Turns an array of numbers into the string given by the concatenation of the
 * characters to which the numbers correspond.
 * @param bytes Array of numbers representing characters.
 * @return Stringification of the array.
 */
var byteArrayToString = function (bytes) {
    // TODO(user): Use native implementations if/when available
    var out = [];
    var pos = 0, c = 0;
    while (pos < bytes.length) {
        var c1 = bytes[pos++];
        if (c1 < 128) {
            out[c++] = String.fromCharCode(c1);
        }
        else if (c1 > 191 && c1 < 224) {
            var c2 = bytes[pos++];
            out[c++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
        }
        else if (c1 > 239 && c1 < 365) {
            // Surrogate Pair
            var c2 = bytes[pos++];
            var c3 = bytes[pos++];
            var c4 = bytes[pos++];
            var u = (((c1 & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63)) -
                0x10000;
            out[c++] = String.fromCharCode(0xd800 + (u >> 10));
            out[c++] = String.fromCharCode(0xdc00 + (u & 1023));
        }
        else {
            var c2 = bytes[pos++];
            var c3 = bytes[pos++];
            out[c++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        }
    }
    return out.join('');
};
// We define it as an object literal instead of a class because a class compiled down to es5 can't
// be treeshaked. https://github.com/rollup/rollup/issues/1691
// Static lookup maps, lazily populated by init_()
var base64 = {
    /**
     * Maps bytes to characters.
     */
    byteToCharMap_: null,
    /**
     * Maps characters to bytes.
     */
    charToByteMap_: null,
    /**
     * Maps bytes to websafe characters.
     * @private
     */
    byteToCharMapWebSafe_: null,
    /**
     * Maps websafe characters to bytes.
     * @private
     */
    charToByteMapWebSafe_: null,
    /**
     * Our default alphabet, shared between
     * ENCODED_VALS and ENCODED_VALS_WEBSAFE
     */
    ENCODED_VALS_BASE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789',
    /**
     * Our default alphabet. Value 64 (=) is special; it means "nothing."
     */
    get ENCODED_VALS() {
        return this.ENCODED_VALS_BASE + '+/=';
    },
    /**
     * Our websafe alphabet.
     */
    get ENCODED_VALS_WEBSAFE() {
        return this.ENCODED_VALS_BASE + '-_.';
    },
    /**
     * Whether this browser supports the atob and btoa functions. This extension
     * started at Mozilla but is now implemented by many browsers. We use the
     * ASSUME_* variables to avoid pulling in the full useragent detection library
     * but still allowing the standard per-browser compilations.
     *
     */
    HAS_NATIVE_SUPPORT: typeof atob === 'function',
    /**
     * Base64-encode an array of bytes.
     *
     * @param input An array of bytes (numbers with
     *     value in [0, 255]) to encode.
     * @param webSafe Boolean indicating we should use the
     *     alternative alphabet.
     * @return The base64 encoded string.
     */
    encodeByteArray: function (input, webSafe) {
        if (!Array.isArray(input)) {
            throw Error('encodeByteArray takes an array as a parameter');
        }
        this.init_();
        var byteToCharMap = webSafe
            ? this.byteToCharMapWebSafe_
            : this.byteToCharMap_;
        var output = [];
        for (var i = 0; i < input.length; i += 3) {
            var byte1 = input[i];
            var haveByte2 = i + 1 < input.length;
            var byte2 = haveByte2 ? input[i + 1] : 0;
            var haveByte3 = i + 2 < input.length;
            var byte3 = haveByte3 ? input[i + 2] : 0;
            var outByte1 = byte1 >> 2;
            var outByte2 = ((byte1 & 0x03) << 4) | (byte2 >> 4);
            var outByte3 = ((byte2 & 0x0f) << 2) | (byte3 >> 6);
            var outByte4 = byte3 & 0x3f;
            if (!haveByte3) {
                outByte4 = 64;
                if (!haveByte2) {
                    outByte3 = 64;
                }
            }
            output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
        }
        return output.join('');
    },
    /**
     * Base64-encode a string.
     *
     * @param input A string to encode.
     * @param webSafe If true, we should use the
     *     alternative alphabet.
     * @return The base64 encoded string.
     */
    encodeString: function (input, webSafe) {
        // Shortcut for Mozilla browsers that implement
        // a native base64 encoder in the form of "btoa/atob"
        if (this.HAS_NATIVE_SUPPORT && !webSafe) {
            return btoa(input);
        }
        return this.encodeByteArray(stringToByteArray(input), webSafe);
    },
    /**
     * Base64-decode a string.
     *
     * @param input to decode.
     * @param webSafe True if we should use the
     *     alternative alphabet.
     * @return string representing the decoded value.
     */
    decodeString: function (input, webSafe) {
        // Shortcut for Mozilla browsers that implement
        // a native base64 encoder in the form of "btoa/atob"
        if (this.HAS_NATIVE_SUPPORT && !webSafe) {
            return atob(input);
        }
        return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
    },
    /**
     * Base64-decode a string.
     *
     * In base-64 decoding, groups of four characters are converted into three
     * bytes.  If the encoder did not apply padding, the input length may not
     * be a multiple of 4.
     *
     * In this case, the last group will have fewer than 4 characters, and
     * padding will be inferred.  If the group has one or two characters, it decodes
     * to one byte.  If the group has three characters, it decodes to two bytes.
     *
     * @param input Input to decode.
     * @param webSafe True if we should use the web-safe alphabet.
     * @return bytes representing the decoded value.
     */
    decodeStringToByteArray: function (input, webSafe) {
        this.init_();
        var charToByteMap = webSafe
            ? this.charToByteMapWebSafe_
            : this.charToByteMap_;
        var output = [];
        for (var i = 0; i < input.length;) {
            var byte1 = charToByteMap[input.charAt(i++)];
            var haveByte2 = i < input.length;
            var byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
            ++i;
            var haveByte3 = i < input.length;
            var byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
            ++i;
            var haveByte4 = i < input.length;
            var byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
            ++i;
            if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
                throw Error();
            }
            var outByte1 = (byte1 << 2) | (byte2 >> 4);
            output.push(outByte1);
            if (byte3 !== 64) {
                var outByte2 = ((byte2 << 4) & 0xf0) | (byte3 >> 2);
                output.push(outByte2);
                if (byte4 !== 64) {
                    var outByte3 = ((byte3 << 6) & 0xc0) | byte4;
                    output.push(outByte3);
                }
            }
        }
        return output;
    },
    /**
     * Lazy static initialization function. Called before
     * accessing any of the static map variables.
     * @private
     */
    init_: function () {
        if (!this.byteToCharMap_) {
            this.byteToCharMap_ = {};
            this.charToByteMap_ = {};
            this.byteToCharMapWebSafe_ = {};
            this.charToByteMapWebSafe_ = {};
            // We want quick mappings back and forth, so we precompute two maps.
            for (var i = 0; i < this.ENCODED_VALS.length; i++) {
                this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
                this.charToByteMap_[this.byteToCharMap_[i]] = i;
                this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
                this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
                // Be forgiving when decoding and correctly decode both encodings.
                if (i >= this.ENCODED_VALS_BASE.length) {
                    this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
                    this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
                }
            }
        }
    }
};
/**
 * URL-safe base64 encoding
 */
var base64Encode = function (str) {
    var utf8Bytes = stringToByteArray(str);
    return base64.encodeByteArray(utf8Bytes, true);
};
/**
 * URL-safe base64 decoding
 *
 * NOTE: DO NOT use the global atob() function - it does NOT support the
 * base64Url variant encoding.
 *
 * @param str To be decoded
 * @return Decoded result, if possible
 */
var base64Decode = function (str) {
    try {
        return base64.decodeString(str, true);
    }
    catch (e) {
        console.error('base64Decode failed: ', e);
    }
    return null;
};

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Do a deep-copy of basic JavaScript Objects or Arrays.
 */
function deepCopy(value) {
    return deepExtend(undefined, value);
}
/**
 * Copy properties from source to target (recursively allows extension
 * of Objects and Arrays).  Scalar values in the target are over-written.
 * If target is undefined, an object of the appropriate type will be created
 * (and returned).
 *
 * We recursively copy all child properties of plain Objects in the source- so
 * that namespace- like dictionaries are merged.
 *
 * Note that the target can be a function, in which case the properties in
 * the source Object are copied onto it as static properties of the Function.
 */
function deepExtend(target, source) {
    if (!(source instanceof Object)) {
        return source;
    }
    switch (source.constructor) {
        case Date:
            // Treat Dates like scalars; if the target date object had any child
            // properties - they will be lost!
            var dateValue = source;
            return new Date(dateValue.getTime());
        case Object:
            if (target === undefined) {
                target = {};
            }
            break;
        case Array:
            // Always copy the array source and overwrite the target.
            target = [];
            break;
        default:
            // Not a plain Object - treat it as a scalar.
            return source;
    }
    for (var prop in source) {
        if (!source.hasOwnProperty(prop)) {
            continue;
        }
        target[prop] = deepExtend(target[prop], source[prop]);
    }
    return target;
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Deferred = /** @class */ (function () {
    function Deferred() {
        var _this = this;
        this.reject = function () { };
        this.resolve = function () { };
        this.promise = new Promise(function (resolve, reject) {
            _this.resolve = resolve;
            _this.reject = reject;
        });
    }
    /**
     * Our API internals are not promiseified and cannot because our callback APIs have subtle expectations around
     * invoking promises inline, which Promises are forbidden to do. This method accepts an optional node-style callback
     * and returns a node-style callback which will resolve or reject the Deferred's promise.
     */
    Deferred.prototype.wrapCallback = function (callback) {
        var _this = this;
        return function (error, value) {
            if (error) {
                _this.reject(error);
            }
            else {
                _this.resolve(value);
            }
            if (typeof callback === 'function') {
                // Attaching noop handler just in case developer wasn't expecting
                // promises
                _this.promise.catch(function () { });
                // Some of our callbacks don't expect a value and our own tests
                // assert that the parameter length is 1
                if (callback.length === 1) {
                    callback(error);
                }
                else {
                    callback(error, value);
                }
            }
        };
    };
    return Deferred;
}());

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Returns navigator.userAgent string or '' if it's not defined.
 * @return user agent string
 */
function getUA() {
    if (typeof navigator !== 'undefined' &&
        typeof navigator['userAgent'] === 'string') {
        return navigator['userAgent'];
    }
    else {
        return '';
    }
}
/**
 * Detect Cordova / PhoneGap / Ionic frameworks on a mobile device.
 *
 * Deliberately does not rely on checking `file://` URLs (as this fails PhoneGap
 * in the Ripple emulator) nor Cordova `onDeviceReady`, which would normally
 * wait for a callback.
 */
function isMobileCordova() {
    return (typeof window !== 'undefined' &&
        // @ts-ignore Setting up an broadly applicable index signature for Window
        // just to deal with this case would probably be a bad idea.
        !!(window['cordova'] || window['phonegap'] || window['PhoneGap']) &&
        /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(getUA()));
}
/**
 * Detect Node.js.
 *
 * @return true if Node.js environment is detected.
 */
// Node detection logic from: https://github.com/iliakan/detect-node/
function isNode() {
    try {
        return (Object.prototype.toString.call(commonjsGlobal.process) === '[object process]');
    }
    catch (e) {
        return false;
    }
}
/**
 * Detect Browser Environment
 */
function isBrowser() {
    return typeof self === 'object' && self.self === self;
}
function isBrowserExtension() {
    var runtime = typeof chrome === 'object'
        ? chrome.runtime
        : typeof browser === 'object'
            ? browser.runtime
            : undefined;
    return typeof runtime === 'object' && runtime.id !== undefined;
}
/**
 * Detect React Native.
 *
 * @return true if ReactNative environment is detected.
 */
function isReactNative() {
    return (typeof navigator === 'object' && navigator['product'] === 'ReactNative');
}
/** Detects Electron apps. */
function isElectron() {
    return getUA().indexOf('Electron/') >= 0;
}
/** Detects Internet Explorer. */
function isIE() {
    var ua = getUA();
    return ua.indexOf('MSIE ') >= 0 || ua.indexOf('Trident/') >= 0;
}
/** Detects Universal Windows Platform apps. */
function isUWP() {
    return getUA().indexOf('MSAppHost/') >= 0;
}
/**
 * Detect whether the current SDK build is the Node version.
 *
 * @return true if it's the Node SDK build.
 */
function isNodeSdk() {
    return CONSTANTS.NODE_CLIENT === true || CONSTANTS.NODE_ADMIN === true;
}
/** Returns true if we are running in Safari. */
function isSafari() {
    return (!isNode() &&
        navigator.userAgent.includes('Safari') &&
        !navigator.userAgent.includes('Chrome'));
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var ERROR_NAME = 'FirebaseError';
// Based on code from:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types
var FirebaseError = /** @class */ (function (_super) {
    tslib_es6.__extends(FirebaseError, _super);
    function FirebaseError(code, message) {
        var _this = _super.call(this, message) || this;
        _this.code = code;
        _this.name = ERROR_NAME;
        // Fix For ES5
        // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(_this, FirebaseError.prototype);
        // Maintains proper stack trace for where our error was thrown.
        // Only available on V8.
        if (Error.captureStackTrace) {
            Error.captureStackTrace(_this, ErrorFactory.prototype.create);
        }
        return _this;
    }
    return FirebaseError;
}(Error));
var ErrorFactory = /** @class */ (function () {
    function ErrorFactory(service, serviceName, errors) {
        this.service = service;
        this.serviceName = serviceName;
        this.errors = errors;
    }
    ErrorFactory.prototype.create = function (code) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        var customData = data[0] || {};
        var fullCode = this.service + "/" + code;
        var template = this.errors[code];
        var message = template ? replaceTemplate(template, customData) : 'Error';
        // Service Name: Error message (service/code).
        var fullMessage = this.serviceName + ": " + message + " (" + fullCode + ").";
        var error = new FirebaseError(fullCode, fullMessage);
        // Keys with an underscore at the end of their name are not included in
        // error.data for some reason.
        // TODO: Replace with Object.entries when lib is updated to es2017.
        for (var _a = 0, _b = Object.keys(customData); _a < _b.length; _a++) {
            var key = _b[_a];
            if (key.slice(-1) !== '_') {
                if (key in error) {
                    console.warn("Overwriting FirebaseError base field \"" + key + "\" can cause unexpected behavior.");
                }
                error[key] = customData[key];
            }
        }
        return error;
    };
    return ErrorFactory;
}());
function replaceTemplate(template, data) {
    return template.replace(PATTERN, function (_, key) {
        var value = data[key];
        return value != null ? String(value) : "<" + key + "?>";
    });
}
var PATTERN = /\{\$([^}]+)}/g;

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Evaluates a JSON string into a javascript object.
 *
 * @param {string} str A string containing JSON.
 * @return {*} The javascript object representing the specified JSON.
 */
function jsonEval(str) {
    return JSON.parse(str);
}
/**
 * Returns JSON representing a javascript object.
 * @param {*} data Javascript object to be stringified.
 * @return {string} The JSON contents of the object.
 */
function stringify(data) {
    return JSON.stringify(data);
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Decodes a Firebase auth. token into constituent parts.
 *
 * Notes:
 * - May return with invalid / incomplete claims if there's no native base64 decoding support.
 * - Doesn't check if the token is actually valid.
 */
var decode = function (token) {
    var header = {}, claims = {}, data = {}, signature = '';
    try {
        var parts = token.split('.');
        header = jsonEval(base64Decode(parts[0]) || '');
        claims = jsonEval(base64Decode(parts[1]) || '');
        signature = parts[2];
        data = claims['d'] || {};
        delete claims['d'];
    }
    catch (e) { }
    return {
        header: header,
        claims: claims,
        data: data,
        signature: signature
    };
};
/**
 * Decodes a Firebase auth. token and checks the validity of its time-based claims. Will return true if the
 * token is within the time window authorized by the 'nbf' (not-before) and 'iat' (issued-at) claims.
 *
 * Notes:
 * - May return a false negative if there's no native base64 decoding support.
 * - Doesn't check if the token is actually valid.
 */
var isValidTimestamp = function (token) {
    var claims = decode(token).claims;
    var now = Math.floor(new Date().getTime() / 1000);
    var validSince = 0, validUntil = 0;
    if (typeof claims === 'object') {
        if (claims.hasOwnProperty('nbf')) {
            validSince = claims['nbf'];
        }
        else if (claims.hasOwnProperty('iat')) {
            validSince = claims['iat'];
        }
        if (claims.hasOwnProperty('exp')) {
            validUntil = claims['exp'];
        }
        else {
            // token will expire after 24h by default
            validUntil = validSince + 86400;
        }
    }
    return (!!now &&
        !!validSince &&
        !!validUntil &&
        now >= validSince &&
        now <= validUntil);
};
/**
 * Decodes a Firebase auth. token and returns its issued at time if valid, null otherwise.
 *
 * Notes:
 * - May return null if there's no native base64 decoding support.
 * - Doesn't check if the token is actually valid.
 */
var issuedAtTime = function (token) {
    var claims = decode(token).claims;
    if (typeof claims === 'object' && claims.hasOwnProperty('iat')) {
        return claims['iat'];
    }
    return null;
};
/**
 * Decodes a Firebase auth. token and checks the validity of its format. Expects a valid issued-at time.
 *
 * Notes:
 * - May return a false negative if there's no native base64 decoding support.
 * - Doesn't check if the token is actually valid.
 */
var isValidFormat = function (token) {
    var decoded = decode(token), claims = decoded.claims;
    return !!claims && typeof claims === 'object' && claims.hasOwnProperty('iat');
};
/**
 * Attempts to peer into an auth token and determine if it's an admin auth token by looking at the claims portion.
 *
 * Notes:
 * - May return a false negative if there's no native base64 decoding support.
 * - Doesn't check if the token is actually valid.
 */
var isAdmin = function (token) {
    var claims = decode(token).claims;
    return typeof claims === 'object' && claims['admin'] === true;
};

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function contains(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
function safeGet(obj, key) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return obj[key];
    }
    else {
        return undefined;
    }
}
function isEmpty(obj) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}
function map(obj, fn, contextObj) {
    var res = {};
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            res[key] = fn.call(contextObj, obj[key], key, obj);
        }
    }
    return res;
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Returns a querystring-formatted string (e.g. &arg=val&arg2=val2) from a
 * params object (e.g. {arg: 'val', arg2: 'val2'})
 * Note: You must prepend it with ? when adding it to a URL.
 */
function querystring(querystringParams) {
    var params = [];
    var _loop_1 = function (key, value) {
        if (Array.isArray(value)) {
            value.forEach(function (arrayVal) {
                params.push(encodeURIComponent(key) + '=' + encodeURIComponent(arrayVal));
            });
        }
        else {
            params.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        }
    };
    for (var _i = 0, _a = Object.entries(querystringParams); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        _loop_1(key, value);
    }
    return params.length ? '&' + params.join('&') : '';
}
/**
 * Decodes a querystring (e.g. ?arg=val&arg2=val2) into a params object
 * (e.g. {arg: 'val', arg2: 'val2'})
 */
function querystringDecode(querystring) {
    var obj = {};
    var tokens = querystring.replace(/^\?/, '').split('&');
    tokens.forEach(function (token) {
        if (token) {
            var key = token.split('=');
            obj[key[0]] = key[1];
        }
    });
    return obj;
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview SHA-1 cryptographic hash.
 * Variable names follow the notation in FIPS PUB 180-3:
 * http://csrc.nist.gov/publications/fips/fips180-3/fips180-3_final.pdf.
 *
 * Usage:
 *   var sha1 = new sha1();
 *   sha1.update(bytes);
 *   var hash = sha1.digest();
 *
 * Performance:
 *   Chrome 23:   ~400 Mbit/s
 *   Firefox 16:  ~250 Mbit/s
 *
 */
/**
 * SHA-1 cryptographic hash constructor.
 *
 * The properties declared here are discussed in the above algorithm document.
 * @constructor
 * @final
 * @struct
 */
var Sha1 = /** @class */ (function () {
    function Sha1() {
        /**
         * Holds the previous values of accumulated variables a-e in the compress_
         * function.
         * @private
         */
        this.chain_ = [];
        /**
         * A buffer holding the partially computed hash result.
         * @private
         */
        this.buf_ = [];
        /**
         * An array of 80 bytes, each a part of the message to be hashed.  Referred to
         * as the message schedule in the docs.
         * @private
         */
        this.W_ = [];
        /**
         * Contains data needed to pad messages less than 64 bytes.
         * @private
         */
        this.pad_ = [];
        /**
         * @private {number}
         */
        this.inbuf_ = 0;
        /**
         * @private {number}
         */
        this.total_ = 0;
        this.blockSize = 512 / 8;
        this.pad_[0] = 128;
        for (var i = 1; i < this.blockSize; ++i) {
            this.pad_[i] = 0;
        }
        this.reset();
    }
    Sha1.prototype.reset = function () {
        this.chain_[0] = 0x67452301;
        this.chain_[1] = 0xefcdab89;
        this.chain_[2] = 0x98badcfe;
        this.chain_[3] = 0x10325476;
        this.chain_[4] = 0xc3d2e1f0;
        this.inbuf_ = 0;
        this.total_ = 0;
    };
    /**
     * Internal compress helper function.
     * @param buf Block to compress.
     * @param offset Offset of the block in the buffer.
     * @private
     */
    Sha1.prototype.compress_ = function (buf, offset) {
        if (!offset) {
            offset = 0;
        }
        var W = this.W_;
        // get 16 big endian words
        if (typeof buf === 'string') {
            for (var i = 0; i < 16; i++) {
                // TODO(user): [bug 8140122] Recent versions of Safari for Mac OS and iOS
                // have a bug that turns the post-increment ++ operator into pre-increment
                // during JIT compilation.  We have code that depends heavily on SHA-1 for
                // correctness and which is affected by this bug, so I've removed all uses
                // of post-increment ++ in which the result value is used.  We can revert
                // this change once the Safari bug
                // (https://bugs.webkit.org/show_bug.cgi?id=109036) has been fixed and
                // most clients have been updated.
                W[i] =
                    (buf.charCodeAt(offset) << 24) |
                        (buf.charCodeAt(offset + 1) << 16) |
                        (buf.charCodeAt(offset + 2) << 8) |
                        buf.charCodeAt(offset + 3);
                offset += 4;
            }
        }
        else {
            for (var i = 0; i < 16; i++) {
                W[i] =
                    (buf[offset] << 24) |
                        (buf[offset + 1] << 16) |
                        (buf[offset + 2] << 8) |
                        buf[offset + 3];
                offset += 4;
            }
        }
        // expand to 80 words
        for (var i = 16; i < 80; i++) {
            var t = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
            W[i] = ((t << 1) | (t >>> 31)) & 0xffffffff;
        }
        var a = this.chain_[0];
        var b = this.chain_[1];
        var c = this.chain_[2];
        var d = this.chain_[3];
        var e = this.chain_[4];
        var f, k;
        // TODO(user): Try to unroll this loop to speed up the computation.
        for (var i = 0; i < 80; i++) {
            if (i < 40) {
                if (i < 20) {
                    f = d ^ (b & (c ^ d));
                    k = 0x5a827999;
                }
                else {
                    f = b ^ c ^ d;
                    k = 0x6ed9eba1;
                }
            }
            else {
                if (i < 60) {
                    f = (b & c) | (d & (b | c));
                    k = 0x8f1bbcdc;
                }
                else {
                    f = b ^ c ^ d;
                    k = 0xca62c1d6;
                }
            }
            var t = (((a << 5) | (a >>> 27)) + f + e + k + W[i]) & 0xffffffff;
            e = d;
            d = c;
            c = ((b << 30) | (b >>> 2)) & 0xffffffff;
            b = a;
            a = t;
        }
        this.chain_[0] = (this.chain_[0] + a) & 0xffffffff;
        this.chain_[1] = (this.chain_[1] + b) & 0xffffffff;
        this.chain_[2] = (this.chain_[2] + c) & 0xffffffff;
        this.chain_[3] = (this.chain_[3] + d) & 0xffffffff;
        this.chain_[4] = (this.chain_[4] + e) & 0xffffffff;
    };
    Sha1.prototype.update = function (bytes, length) {
        // TODO(johnlenz): tighten the function signature and remove this check
        if (bytes == null) {
            return;
        }
        if (length === undefined) {
            length = bytes.length;
        }
        var lengthMinusBlock = length - this.blockSize;
        var n = 0;
        // Using local instead of member variables gives ~5% speedup on Firefox 16.
        var buf = this.buf_;
        var inbuf = this.inbuf_;
        // The outer while loop should execute at most twice.
        while (n < length) {
            // When we have no data in the block to top up, we can directly process the
            // input buffer (assuming it contains sufficient data). This gives ~25%
            // speedup on Chrome 23 and ~15% speedup on Firefox 16, but requires that
            // the data is provided in large chunks (or in multiples of 64 bytes).
            if (inbuf === 0) {
                while (n <= lengthMinusBlock) {
                    this.compress_(bytes, n);
                    n += this.blockSize;
                }
            }
            if (typeof bytes === 'string') {
                while (n < length) {
                    buf[inbuf] = bytes.charCodeAt(n);
                    ++inbuf;
                    ++n;
                    if (inbuf === this.blockSize) {
                        this.compress_(buf);
                        inbuf = 0;
                        // Jump to the outer loop so we use the full-block optimization.
                        break;
                    }
                }
            }
            else {
                while (n < length) {
                    buf[inbuf] = bytes[n];
                    ++inbuf;
                    ++n;
                    if (inbuf === this.blockSize) {
                        this.compress_(buf);
                        inbuf = 0;
                        // Jump to the outer loop so we use the full-block optimization.
                        break;
                    }
                }
            }
        }
        this.inbuf_ = inbuf;
        this.total_ += length;
    };
    /** @override */
    Sha1.prototype.digest = function () {
        var digest = [];
        var totalBits = this.total_ * 8;
        // Add pad 0x80 0x00*.
        if (this.inbuf_ < 56) {
            this.update(this.pad_, 56 - this.inbuf_);
        }
        else {
            this.update(this.pad_, this.blockSize - (this.inbuf_ - 56));
        }
        // Add # bits.
        for (var i = this.blockSize - 1; i >= 56; i--) {
            this.buf_[i] = totalBits & 255;
            totalBits /= 256; // Don't use bit-shifting here!
        }
        this.compress_(this.buf_);
        var n = 0;
        for (var i = 0; i < 5; i++) {
            for (var j = 24; j >= 0; j -= 8) {
                digest[n] = (this.chain_[i] >> j) & 255;
                ++n;
            }
        }
        return digest;
    };
    return Sha1;
}());

/**
 * Helper to make a Subscribe function (just like Promise helps make a
 * Thenable).
 *
 * @param executor Function which can make calls to a single Observer
 *     as a proxy.
 * @param onNoObservers Callback when count of Observers goes to zero.
 */
function createSubscribe(executor, onNoObservers) {
    var proxy = new ObserverProxy(executor, onNoObservers);
    return proxy.subscribe.bind(proxy);
}
/**
 * Implement fan-out for any number of Observers attached via a subscribe
 * function.
 */
var ObserverProxy = /** @class */ (function () {
    /**
     * @param executor Function which can make calls to a single Observer
     *     as a proxy.
     * @param onNoObservers Callback when count of Observers goes to zero.
     */
    function ObserverProxy(executor, onNoObservers) {
        var _this = this;
        this.observers = [];
        this.unsubscribes = [];
        this.observerCount = 0;
        // Micro-task scheduling by calling task.then().
        this.task = Promise.resolve();
        this.finalized = false;
        this.onNoObservers = onNoObservers;
        // Call the executor asynchronously so subscribers that are called
        // synchronously after the creation of the subscribe function
        // can still receive the very first value generated in the executor.
        this.task
            .then(function () {
            executor(_this);
        })
            .catch(function (e) {
            _this.error(e);
        });
    }
    ObserverProxy.prototype.next = function (value) {
        this.forEachObserver(function (observer) {
            observer.next(value);
        });
    };
    ObserverProxy.prototype.error = function (error) {
        this.forEachObserver(function (observer) {
            observer.error(error);
        });
        this.close(error);
    };
    ObserverProxy.prototype.complete = function () {
        this.forEachObserver(function (observer) {
            observer.complete();
        });
        this.close();
    };
    /**
     * Subscribe function that can be used to add an Observer to the fan-out list.
     *
     * - We require that no event is sent to a subscriber sychronously to their
     *   call to subscribe().
     */
    ObserverProxy.prototype.subscribe = function (nextOrObserver, error, complete) {
        var _this = this;
        var observer;
        if (nextOrObserver === undefined &&
            error === undefined &&
            complete === undefined) {
            throw new Error('Missing Observer.');
        }
        // Assemble an Observer object when passed as callback functions.
        if (implementsAnyMethods(nextOrObserver, [
            'next',
            'error',
            'complete'
        ])) {
            observer = nextOrObserver;
        }
        else {
            observer = {
                next: nextOrObserver,
                error: error,
                complete: complete
            };
        }
        if (observer.next === undefined) {
            observer.next = noop;
        }
        if (observer.error === undefined) {
            observer.error = noop;
        }
        if (observer.complete === undefined) {
            observer.complete = noop;
        }
        var unsub = this.unsubscribeOne.bind(this, this.observers.length);
        // Attempt to subscribe to a terminated Observable - we
        // just respond to the Observer with the final error or complete
        // event.
        if (this.finalized) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.task.then(function () {
                try {
                    if (_this.finalError) {
                        observer.error(_this.finalError);
                    }
                    else {
                        observer.complete();
                    }
                }
                catch (e) {
                    // nothing
                }
                return;
            });
        }
        this.observers.push(observer);
        return unsub;
    };
    // Unsubscribe is synchronous - we guarantee that no events are sent to
    // any unsubscribed Observer.
    ObserverProxy.prototype.unsubscribeOne = function (i) {
        if (this.observers === undefined || this.observers[i] === undefined) {
            return;
        }
        delete this.observers[i];
        this.observerCount -= 1;
        if (this.observerCount === 0 && this.onNoObservers !== undefined) {
            this.onNoObservers(this);
        }
    };
    ObserverProxy.prototype.forEachObserver = function (fn) {
        if (this.finalized) {
            // Already closed by previous event....just eat the additional values.
            return;
        }
        // Since sendOne calls asynchronously - there is no chance that
        // this.observers will become undefined.
        for (var i = 0; i < this.observers.length; i++) {
            this.sendOne(i, fn);
        }
    };
    // Call the Observer via one of it's callback function. We are careful to
    // confirm that the observe has not been unsubscribed since this asynchronous
    // function had been queued.
    ObserverProxy.prototype.sendOne = function (i, fn) {
        var _this = this;
        // Execute the callback asynchronously
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.task.then(function () {
            if (_this.observers !== undefined && _this.observers[i] !== undefined) {
                try {
                    fn(_this.observers[i]);
                }
                catch (e) {
                    // Ignore exceptions raised in Observers or missing methods of an
                    // Observer.
                    // Log error to console. b/31404806
                    if (typeof console !== 'undefined' && console.error) {
                        console.error(e);
                    }
                }
            }
        });
    };
    ObserverProxy.prototype.close = function (err) {
        var _this = this;
        if (this.finalized) {
            return;
        }
        this.finalized = true;
        if (err !== undefined) {
            this.finalError = err;
        }
        // Proxy is no longer needed - garbage collect references
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.task.then(function () {
            _this.observers = undefined;
            _this.onNoObservers = undefined;
        });
    };
    return ObserverProxy;
}());
/** Turn synchronous function into one called asynchronously. */
function async(fn, onError) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        Promise.resolve(true)
            .then(function () {
            fn.apply(void 0, args);
        })
            .catch(function (error) {
            if (onError) {
                onError(error);
            }
        });
    };
}
/**
 * Return true if the object passed in implements any of the named methods.
 */
function implementsAnyMethods(obj, methods) {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }
    for (var _i = 0, methods_1 = methods; _i < methods_1.length; _i++) {
        var method = methods_1[_i];
        if (method in obj && typeof obj[method] === 'function') {
            return true;
        }
    }
    return false;
}
function noop() {
    // do nothing
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Check to make sure the appropriate number of arguments are provided for a public function.
 * Throws an error if it fails.
 *
 * @param fnName The function name
 * @param minCount The minimum number of arguments to allow for the function call
 * @param maxCount The maximum number of argument to allow for the function call
 * @param argCount The actual number of arguments provided.
 */
var validateArgCount = function (fnName, minCount, maxCount, argCount) {
    var argError;
    if (argCount < minCount) {
        argError = 'at least ' + minCount;
    }
    else if (argCount > maxCount) {
        argError = maxCount === 0 ? 'none' : 'no more than ' + maxCount;
    }
    if (argError) {
        var error = fnName +
            ' failed: Was called with ' +
            argCount +
            (argCount === 1 ? ' argument.' : ' arguments.') +
            ' Expects ' +
            argError +
            '.';
        throw new Error(error);
    }
};
/**
 * Generates a string to prefix an error message about failed argument validation
 *
 * @param fnName The function name
 * @param argumentNumber The index of the argument
 * @param optional Whether or not the argument is optional
 * @return The prefix to add to the error thrown for validation.
 */
function errorPrefix(fnName, argumentNumber, optional) {
    var argName = '';
    switch (argumentNumber) {
        case 1:
            argName = optional ? 'first' : 'First';
            break;
        case 2:
            argName = optional ? 'second' : 'Second';
            break;
        case 3:
            argName = optional ? 'third' : 'Third';
            break;
        case 4:
            argName = optional ? 'fourth' : 'Fourth';
            break;
        default:
            throw new Error('errorPrefix called with argumentNumber > 4.  Need to update it?');
    }
    var error = fnName + ' failed: ';
    error += argName + ' argument ';
    return error;
}
/**
 * @param fnName
 * @param argumentNumber
 * @param namespace
 * @param optional
 */
function validateNamespace(fnName, argumentNumber, namespace, optional) {
    if (optional && !namespace) {
        return;
    }
    if (typeof namespace !== 'string') {
        //TODO: I should do more validation here. We only allow certain chars in namespaces.
        throw new Error(errorPrefix(fnName, argumentNumber, optional) +
            'must be a valid firebase namespace.');
    }
}
function validateCallback(fnName, argumentNumber, callback, optional) {
    if (optional && !callback) {
        return;
    }
    if (typeof callback !== 'function') {
        throw new Error(errorPrefix(fnName, argumentNumber, optional) +
            'must be a valid function.');
    }
}
function validateContextObject(fnName, argumentNumber, context, optional) {
    if (optional && !context) {
        return;
    }
    if (typeof context !== 'object' || context === null) {
        throw new Error(errorPrefix(fnName, argumentNumber, optional) +
            'must be a valid context object.');
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Code originally came from goog.crypt.stringToUtf8ByteArray, but for some reason they
// automatically replaced '\r\n' with '\n', and they didn't handle surrogate pairs,
// so it's been modified.
// Note that not all Unicode characters appear as single characters in JavaScript strings.
// fromCharCode returns the UTF-16 encoding of a character - so some Unicode characters
// use 2 characters in Javascript.  All 4-byte UTF-8 characters begin with a first
// character in the range 0xD800 - 0xDBFF (the first character of a so-called surrogate
// pair).
// See http://www.ecma-international.org/ecma-262/5.1/#sec-15.1.3
/**
 * @param {string} str
 * @return {Array}
 */
var stringToByteArray$1 = function (str) {
    var out = [];
    var p = 0;
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        // Is this the lead surrogate in a surrogate pair?
        if (c >= 0xd800 && c <= 0xdbff) {
            var high = c - 0xd800; // the high 10 bits.
            i++;
            assert(i < str.length, 'Surrogate pair missing trail surrogate.');
            var low = str.charCodeAt(i) - 0xdc00; // the low 10 bits.
            c = 0x10000 + (high << 10) + low;
        }
        if (c < 128) {
            out[p++] = c;
        }
        else if (c < 2048) {
            out[p++] = (c >> 6) | 192;
            out[p++] = (c & 63) | 128;
        }
        else if (c < 65536) {
            out[p++] = (c >> 12) | 224;
            out[p++] = ((c >> 6) & 63) | 128;
            out[p++] = (c & 63) | 128;
        }
        else {
            out[p++] = (c >> 18) | 240;
            out[p++] = ((c >> 12) & 63) | 128;
            out[p++] = ((c >> 6) & 63) | 128;
            out[p++] = (c & 63) | 128;
        }
    }
    return out;
};
/**
 * Calculate length without actually converting; useful for doing cheaper validation.
 * @param {string} str
 * @return {number}
 */
var stringLength = function (str) {
    var p = 0;
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if (c < 128) {
            p++;
        }
        else if (c < 2048) {
            p += 2;
        }
        else if (c >= 0xd800 && c <= 0xdbff) {
            // Lead surrogate of a surrogate pair.  The pair together will take 4 bytes to represent.
            p += 4;
            i++; // skip trail surrogate.
        }
        else {
            p += 3;
        }
    }
    return p;
};

exports.CONSTANTS = CONSTANTS;
exports.Deferred = Deferred;
exports.ErrorFactory = ErrorFactory;
exports.FirebaseError = FirebaseError;
exports.Sha1 = Sha1;
exports.assert = assert;
exports.assertionError = assertionError;
exports.async = async;
exports.base64 = base64;
exports.base64Decode = base64Decode;
exports.base64Encode = base64Encode;
exports.contains = contains;
exports.createSubscribe = createSubscribe;
exports.decode = decode;
exports.deepCopy = deepCopy;
exports.deepExtend = deepExtend;
exports.errorPrefix = errorPrefix;
exports.getUA = getUA;
exports.isAdmin = isAdmin;
exports.isBrowser = isBrowser;
exports.isBrowserExtension = isBrowserExtension;
exports.isElectron = isElectron;
exports.isEmpty = isEmpty;
exports.isIE = isIE;
exports.isMobileCordova = isMobileCordova;
exports.isNode = isNode;
exports.isNodeSdk = isNodeSdk;
exports.isReactNative = isReactNative;
exports.isSafari = isSafari;
exports.isUWP = isUWP;
exports.isValidFormat = isValidFormat;
exports.isValidTimestamp = isValidTimestamp;
exports.issuedAtTime = issuedAtTime;
exports.jsonEval = jsonEval;
exports.map = map;
exports.querystring = querystring;
exports.querystringDecode = querystringDecode;
exports.safeGet = safeGet;
exports.stringLength = stringLength;
exports.stringToByteArray = stringToByteArray$1;
exports.stringify = stringify;
exports.validateArgCount = validateArgCount;
exports.validateCallback = validateCallback;
exports.validateContextObject = validateContextObject;
exports.validateNamespace = validateNamespace;

});

var index_cjs$1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', { value: true });




/**
 * Component for service name T, e.g. `auth`, `auth-internal`
 */
var Component = /** @class */ (function () {
    /**
     *
     * @param name The public service name, e.g. app, auth, firestore, database
     * @param instanceFactory Service factory responsible for creating the public interface
     * @param type whether the service provided by the component is public or private
     */
    function Component(name, instanceFactory, type) {
        this.name = name;
        this.instanceFactory = instanceFactory;
        this.type = type;
        this.multipleInstances = false;
        /**
         * Properties to be added to the service namespace
         */
        this.serviceProps = {};
        this.instantiationMode = "LAZY" /* LAZY */;
    }
    Component.prototype.setInstantiationMode = function (mode) {
        this.instantiationMode = mode;
        return this;
    };
    Component.prototype.setMultipleInstances = function (multipleInstances) {
        this.multipleInstances = multipleInstances;
        return this;
    };
    Component.prototype.setServiceProps = function (props) {
        this.serviceProps = props;
        return this;
    };
    return Component;
}());

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var DEFAULT_ENTRY_NAME = '[DEFAULT]';

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Provider for instance for service name T, e.g. 'auth', 'auth-internal'
 * NameServiceMapping[T] is an alias for the type of the instance
 */
var Provider = /** @class */ (function () {
    function Provider(name, container) {
        this.name = name;
        this.container = container;
        this.component = null;
        this.instances = new Map();
        this.instancesDeferred = new Map();
    }
    /**
     * @param identifier A provider can provide mulitple instances of a service
     * if this.component.multipleInstances is true.
     */
    Provider.prototype.get = function (identifier) {
        if (identifier === void 0) { identifier = DEFAULT_ENTRY_NAME; }
        // if multipleInstances is not supported, use the default name
        var normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
        if (!this.instancesDeferred.has(normalizedIdentifier)) {
            var deferred = new index_cjs.Deferred();
            this.instancesDeferred.set(normalizedIdentifier, deferred);
            // If the service instance is available, resolve the promise with it immediately
            try {
                var instance = this.getOrInitializeService(normalizedIdentifier);
                if (instance) {
                    deferred.resolve(instance);
                }
            }
            catch (e) {
                // when the instance factory throws an exception during get(), it should not cause
                // a fatal error. We just return the unresolved promise in this case.
            }
        }
        return this.instancesDeferred.get(normalizedIdentifier).promise;
    };
    Provider.prototype.getImmediate = function (options) {
        var _a = tslib_es6.__assign({ identifier: DEFAULT_ENTRY_NAME, optional: false }, options), identifier = _a.identifier, optional = _a.optional;
        // if multipleInstances is not supported, use the default name
        var normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
        try {
            var instance = this.getOrInitializeService(normalizedIdentifier);
            if (!instance) {
                if (optional) {
                    return null;
                }
                throw Error("Service " + this.name + " is not available");
            }
            return instance;
        }
        catch (e) {
            if (optional) {
                return null;
            }
            else {
                throw e;
            }
        }
    };
    Provider.prototype.getComponent = function () {
        return this.component;
    };
    Provider.prototype.setComponent = function (component) {
        var e_1, _a;
        if (component.name !== this.name) {
            throw Error("Mismatching Component " + component.name + " for Provider " + this.name + ".");
        }
        if (this.component) {
            throw Error("Component for " + this.name + " has already been provided");
        }
        this.component = component;
        // if the service is eager, initialize the default instance
        if (isComponentEager(component)) {
            try {
                this.getOrInitializeService(DEFAULT_ENTRY_NAME);
            }
            catch (e) {
                // when the instance factory for an eager Component throws an exception during the eager
                // initialization, it should not cause a fatal error.
                // TODO: Investigate if we need to make it configurable, because some component may want to cause
                // a fatal error in this case?
            }
        }
        try {
            // Create service instances for the pending promises and resolve them
            // NOTE: if this.multipleInstances is false, only the default instance will be created
            // and all promises with resolve with it regardless of the identifier.
            for (var _b = tslib_es6.__values(this.instancesDeferred.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = tslib_es6.__read(_c.value, 2), instanceIdentifier = _d[0], instanceDeferred = _d[1];
                var normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
                try {
                    // `getOrInitializeService()` should always return a valid instance since a component is guaranteed. use ! to make typescript happy.
                    var instance = this.getOrInitializeService(normalizedIdentifier);
                    instanceDeferred.resolve(instance);
                }
                catch (e) {
                    // when the instance factory throws an exception, it should not cause
                    // a fatal error. We just leave the promise unresolved.
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    Provider.prototype.clearInstance = function (identifier) {
        if (identifier === void 0) { identifier = DEFAULT_ENTRY_NAME; }
        this.instancesDeferred.delete(identifier);
        this.instances.delete(identifier);
    };
    // app.delete() will call this method on every provider to delete the services
    // TODO: should we mark the provider as deleted?
    Provider.prototype.delete = function () {
        return tslib_es6.__awaiter(this, void 0, void 0, function () {
            var services;
            return tslib_es6.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        services = Array.from(this.instances.values());
                        return [4 /*yield*/, Promise.all(services
                                .filter(function (service) { return 'INTERNAL' in service; })
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                .map(function (service) { return service.INTERNAL.delete(); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Provider.prototype.isComponentSet = function () {
        return this.component != null;
    };
    Provider.prototype.getOrInitializeService = function (identifier) {
        var instance = this.instances.get(identifier);
        if (!instance && this.component) {
            instance = this.component.instanceFactory(this.container, normalizeIdentifierForFactory(identifier));
            this.instances.set(identifier, instance);
        }
        return instance || null;
    };
    Provider.prototype.normalizeInstanceIdentifier = function (identifier) {
        if (this.component) {
            return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME;
        }
        else {
            return identifier; // assume multiple instances are supported before the component is provided.
        }
    };
    return Provider;
}());
// undefined should be passed to the service factory for the default instance
function normalizeIdentifierForFactory(identifier) {
    return identifier === DEFAULT_ENTRY_NAME ? undefined : identifier;
}
function isComponentEager(component) {
    return component.instantiationMode === "EAGER" /* EAGER */;
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * ComponentContainer that provides Providers for service name T, e.g. `auth`, `auth-internal`
 */
var ComponentContainer = /** @class */ (function () {
    function ComponentContainer(name) {
        this.name = name;
        this.providers = new Map();
    }
    /**
     *
     * @param component Component being added
     * @param overwrite When a component with the same name has already been registered,
     * if overwrite is true: overwrite the existing component with the new component and create a new
     * provider with the new component. It can be useful in tests where you want to use different mocks
     * for different tests.
     * if overwrite is false: throw an exception
     */
    ComponentContainer.prototype.addComponent = function (component) {
        var provider = this.getProvider(component.name);
        if (provider.isComponentSet()) {
            throw new Error("Component " + component.name + " has already been registered with " + this.name);
        }
        provider.setComponent(component);
    };
    ComponentContainer.prototype.addOrOverwriteComponent = function (component) {
        var provider = this.getProvider(component.name);
        if (provider.isComponentSet()) {
            // delete the existing provider from the container, so we can register the new component
            this.providers.delete(component.name);
        }
        this.addComponent(component);
    };
    /**
     * getProvider provides a type safe interface where it can only be called with a field name
     * present in NameServiceMapping interface.
     *
     * Firebase SDKs providing services should extend NameServiceMapping interface to register
     * themselves.
     */
    ComponentContainer.prototype.getProvider = function (name) {
        if (this.providers.has(name)) {
            return this.providers.get(name);
        }
        // create a Provider for a service that hasn't registered with Firebase
        var provider = new Provider(name, this);
        this.providers.set(name, provider);
        return provider;
    };
    ComponentContainer.prototype.getProviders = function () {
        return Array.from(this.providers.values());
    };
    return ComponentContainer;
}());

exports.Component = Component;
exports.ComponentContainer = ComponentContainer;
exports.Provider = Provider;

});

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var _a;
/**
 * A container for all of the Logger instances
 */
var instances = [];
/**
 * The JS SDK supports 5 log levels and also allows a user the ability to
 * silence the logs altogether.
 *
 * The order is a follows:
 * DEBUG < VERBOSE < INFO < WARN < ERROR
 *
 * All of the log types above the current log level will be captured (i.e. if
 * you set the log level to `INFO`, errors will still be logged, but `DEBUG` and
 * `VERBOSE` logs will not)
 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["VERBOSE"] = 1] = "VERBOSE";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["WARN"] = 3] = "WARN";
    LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
    LogLevel[LogLevel["SILENT"] = 5] = "SILENT";
})(LogLevel || (LogLevel = {}));
var levelStringToEnum = {
    'debug': LogLevel.DEBUG,
    'verbose': LogLevel.VERBOSE,
    'info': LogLevel.INFO,
    'warn': LogLevel.WARN,
    'error': LogLevel.ERROR,
    'silent': LogLevel.SILENT
};
/**
 * The default log level
 */
var defaultLogLevel = LogLevel.INFO;
/**
 * By default, `console.debug` is not displayed in the developer console (in
 * chrome). To avoid forcing users to have to opt-in to these logs twice
 * (i.e. once for firebase, and once in the console), we are sending `DEBUG`
 * logs to the `console.log` function.
 */
var ConsoleMethod = (_a = {},
    _a[LogLevel.DEBUG] = 'log',
    _a[LogLevel.VERBOSE] = 'log',
    _a[LogLevel.INFO] = 'info',
    _a[LogLevel.WARN] = 'warn',
    _a[LogLevel.ERROR] = 'error',
    _a);
/**
 * The default log handler will forward DEBUG, VERBOSE, INFO, WARN, and ERROR
 * messages on to their corresponding console counterparts (if the log method
 * is supported by the current log level)
 */
var defaultLogHandler = function (instance, logType) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (logType < instance.logLevel) {
        return;
    }
    var now = new Date().toISOString();
    var method = ConsoleMethod[logType];
    if (method) {
        console[method].apply(console, __spreadArrays(["[" + now + "]  " + instance.name + ":"], args));
    }
    else {
        throw new Error("Attempted to log a message with an invalid logType (value: " + logType + ")");
    }
};
var Logger = /** @class */ (function () {
    /**
     * Gives you an instance of a Logger to capture messages according to
     * Firebase's logging scheme.
     *
     * @param name The name that the logs will be associated with
     */
    function Logger(name) {
        this.name = name;
        /**
         * The log level of the given Logger instance.
         */
        this._logLevel = defaultLogLevel;
        /**
         * The main (internal) log handler for the Logger instance.
         * Can be set to a new function in internal package code but not by user.
         */
        this._logHandler = defaultLogHandler;
        /**
         * The optional, additional, user-defined log handler for the Logger instance.
         */
        this._userLogHandler = null;
        /**
         * Capture the current instance for later use
         */
        instances.push(this);
    }
    Object.defineProperty(Logger.prototype, "logLevel", {
        get: function () {
            return this._logLevel;
        },
        set: function (val) {
            if (!(val in LogLevel)) {
                throw new TypeError("Invalid value \"" + val + "\" assigned to `logLevel`");
            }
            this._logLevel = val;
        },
        enumerable: false,
        configurable: true
    });
    // Workaround for setter/getter having to be the same type.
    Logger.prototype.setLogLevel = function (val) {
        this._logLevel = typeof val === 'string' ? levelStringToEnum[val] : val;
    };
    Object.defineProperty(Logger.prototype, "logHandler", {
        get: function () {
            return this._logHandler;
        },
        set: function (val) {
            if (typeof val !== 'function') {
                throw new TypeError('Value assigned to `logHandler` must be a function');
            }
            this._logHandler = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Logger.prototype, "userLogHandler", {
        get: function () {
            return this._userLogHandler;
        },
        set: function (val) {
            this._userLogHandler = val;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * The functions below are all based on the `console` interface
     */
    Logger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._userLogHandler && this._userLogHandler.apply(this, __spreadArrays([this, LogLevel.DEBUG], args));
        this._logHandler.apply(this, __spreadArrays([this, LogLevel.DEBUG], args));
    };
    Logger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._userLogHandler && this._userLogHandler.apply(this, __spreadArrays([this, LogLevel.VERBOSE], args));
        this._logHandler.apply(this, __spreadArrays([this, LogLevel.VERBOSE], args));
    };
    Logger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._userLogHandler && this._userLogHandler.apply(this, __spreadArrays([this, LogLevel.INFO], args));
        this._logHandler.apply(this, __spreadArrays([this, LogLevel.INFO], args));
    };
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._userLogHandler && this._userLogHandler.apply(this, __spreadArrays([this, LogLevel.WARN], args));
        this._logHandler.apply(this, __spreadArrays([this, LogLevel.WARN], args));
    };
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._userLogHandler && this._userLogHandler.apply(this, __spreadArrays([this, LogLevel.ERROR], args));
        this._logHandler.apply(this, __spreadArrays([this, LogLevel.ERROR], args));
    };
    return Logger;
}());
function setLogLevel(level) {
    instances.forEach(function (inst) {
        inst.setLogLevel(level);
    });
}
function setUserLogHandler(logCallback, options) {
    var _loop_1 = function (instance) {
        var customLogLevel = null;
        if (options && options.level) {
            customLogLevel = levelStringToEnum[options.level];
        }
        if (logCallback === null) {
            instance.userLogHandler = null;
        }
        else {
            instance.userLogHandler = function (instance, level) {
                var args = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args[_i - 2] = arguments[_i];
                }
                var message = args
                    .map(function (arg) {
                    if (arg == null) {
                        return null;
                    }
                    else if (typeof arg === 'string') {
                        return arg;
                    }
                    else if (typeof arg === 'number' || typeof arg === 'boolean') {
                        return arg.toString();
                    }
                    else if (arg instanceof Error) {
                        return arg.message;
                    }
                    else {
                        try {
                            return JSON.stringify(arg);
                        }
                        catch (ignored) {
                            return null;
                        }
                    }
                })
                    .filter(function (arg) { return arg; })
                    .join(' ');
                if (level >= (customLogLevel !== null && customLogLevel !== void 0 ? customLogLevel : instance.logLevel)) {
                    logCallback({
                        level: LogLevel[level].toLowerCase(),
                        message: message,
                        args: args,
                        type: instance.name
                    });
                }
            };
        }
    };
    for (var _i = 0, instances_1 = instances; _i < instances_1.length; _i++) {
        var instance = instances_1[_i];
        _loop_1(instance);
    }
}

var index_esm = /*#__PURE__*/Object.freeze({
	__proto__: null,
	get LogLevel () { return LogLevel; },
	Logger: Logger,
	setLogLevel: setLogLevel,
	setUserLogHandler: setUserLogHandler
});

var index_cjs$2 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', { value: true });






/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var _a;
var ERRORS = (_a = {},
    _a["no-app" /* NO_APP */] = "No Firebase App '{$appName}' has been created - " +
        'call Firebase App.initializeApp()',
    _a["bad-app-name" /* BAD_APP_NAME */] = "Illegal App name: '{$appName}",
    _a["duplicate-app" /* DUPLICATE_APP */] = "Firebase App named '{$appName}' already exists",
    _a["app-deleted" /* APP_DELETED */] = "Firebase App named '{$appName}' already deleted",
    _a["invalid-app-argument" /* INVALID_APP_ARGUMENT */] = 'firebase.{$appName}() takes either no argument or a ' +
        'Firebase App instance.',
    _a["invalid-log-argument" /* INVALID_LOG_ARGUMENT */] = 'First argument to `onLog` must be null or a function.',
    _a);
var ERROR_FACTORY = new index_cjs.ErrorFactory('app', 'Firebase', ERRORS);

var name$1 = "@firebase/app";
var version = "0.6.8";

var name$2 = "@firebase/analytics";

var name$3 = "@firebase/auth";

var name$4 = "@firebase/database";

var name$5 = "@firebase/functions";

var name$6 = "@firebase/installations";

var name$7 = "@firebase/messaging";

var name$8 = "@firebase/performance";

var name$9 = "@firebase/remote-config";

var name$a = "@firebase/storage";

var name$b = "@firebase/firestore";

var name$c = "firebase-wrapper";

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var _a$1;
var DEFAULT_ENTRY_NAME = '[DEFAULT]';
var PLATFORM_LOG_STRING = (_a$1 = {},
    _a$1[name$1] = 'fire-core',
    _a$1[name$2] = 'fire-analytics',
    _a$1[name$3] = 'fire-auth',
    _a$1[name$4] = 'fire-rtdb',
    _a$1[name$5] = 'fire-fn',
    _a$1[name$6] = 'fire-iid',
    _a$1[name$7] = 'fire-fcm',
    _a$1[name$8] = 'fire-perf',
    _a$1[name$9] = 'fire-rc',
    _a$1[name$a] = 'fire-gcs',
    _a$1[name$b] = 'fire-fst',
    _a$1['fire-js'] = 'fire-js',
    _a$1[name$c] = 'fire-js-all',
    _a$1);

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var logger = new index_esm.Logger('@firebase/app');

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Global context object for a collection of services using
 * a shared authentication state.
 */
var FirebaseAppImpl = /** @class */ (function () {
    function FirebaseAppImpl(options, config, firebase_) {
        var e_1, _a;
        var _this = this;
        this.firebase_ = firebase_;
        this.isDeleted_ = false;
        this.name_ = config.name;
        this.automaticDataCollectionEnabled_ =
            config.automaticDataCollectionEnabled || false;
        this.options_ = index_cjs.deepCopy(options);
        this.container = new index_cjs$1.ComponentContainer(config.name);
        // add itself to container
        this._addComponent(new index_cjs$1.Component('app', function () { return _this; }, "PUBLIC" /* PUBLIC */));
        try {
            // populate ComponentContainer with existing components
            for (var _b = tslib_es6.__values(this.firebase_.INTERNAL.components.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var component$1 = _c.value;
                this._addComponent(component$1);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    Object.defineProperty(FirebaseAppImpl.prototype, "automaticDataCollectionEnabled", {
        get: function () {
            this.checkDestroyed_();
            return this.automaticDataCollectionEnabled_;
        },
        set: function (val) {
            this.checkDestroyed_();
            this.automaticDataCollectionEnabled_ = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FirebaseAppImpl.prototype, "name", {
        get: function () {
            this.checkDestroyed_();
            return this.name_;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FirebaseAppImpl.prototype, "options", {
        get: function () {
            this.checkDestroyed_();
            return this.options_;
        },
        enumerable: false,
        configurable: true
    });
    FirebaseAppImpl.prototype.delete = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.checkDestroyed_();
            resolve();
        })
            .then(function () {
            _this.firebase_.INTERNAL.removeApp(_this.name_);
            return Promise.all(_this.container.getProviders().map(function (provider) { return provider.delete(); }));
        })
            .then(function () {
            _this.isDeleted_ = true;
        });
    };
    /**
     * Return a service instance associated with this app (creating it
     * on demand), identified by the passed instanceIdentifier.
     *
     * NOTE: Currently storage and functions are the only ones that are leveraging this
     * functionality. They invoke it by calling:
     *
     * ```javascript
     * firebase.app().storage('STORAGE BUCKET ID')
     * ```
     *
     * The service name is passed to this already
     * @internal
     */
    FirebaseAppImpl.prototype._getService = function (name, instanceIdentifier) {
        if (instanceIdentifier === void 0) { instanceIdentifier = DEFAULT_ENTRY_NAME; }
        this.checkDestroyed_();
        // getImmediate will always succeed because _getService is only called for registered components.
        return this.container.getProvider(name).getImmediate({
            identifier: instanceIdentifier
        });
    };
    /**
     * Remove a service instance from the cache, so we will create a new instance for this service
     * when people try to get this service again.
     *
     * NOTE: currently only firestore is using this functionality to support firestore shutdown.
     *
     * @param name The service name
     * @param instanceIdentifier instance identifier in case multiple instances are allowed
     * @internal
     */
    FirebaseAppImpl.prototype._removeServiceInstance = function (name, instanceIdentifier) {
        if (instanceIdentifier === void 0) { instanceIdentifier = DEFAULT_ENTRY_NAME; }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.container.getProvider(name).clearInstance(instanceIdentifier);
    };
    /**
     * @param component the component being added to this app's container
     */
    FirebaseAppImpl.prototype._addComponent = function (component) {
        try {
            this.container.addComponent(component);
        }
        catch (e) {
            logger.debug("Component " + component.name + " failed to register with FirebaseApp " + this.name, e);
        }
    };
    FirebaseAppImpl.prototype._addOrOverwriteComponent = function (component) {
        this.container.addOrOverwriteComponent(component);
    };
    /**
     * This function will throw an Error if the App has already been deleted -
     * use before performing API actions on the App.
     */
    FirebaseAppImpl.prototype.checkDestroyed_ = function () {
        if (this.isDeleted_) {
            throw ERROR_FACTORY.create("app-deleted" /* APP_DELETED */, { appName: this.name_ });
        }
    };
    return FirebaseAppImpl;
}());
// Prevent dead-code elimination of these methods w/o invalid property
// copying.
(FirebaseAppImpl.prototype.name && FirebaseAppImpl.prototype.options) ||
    FirebaseAppImpl.prototype.delete ||
    console.log('dc');

var version$1 = "7.16.0";

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Because auth can't share code with other components, we attach the utility functions
 * in an internal namespace to share code.
 * This function return a firebase namespace object without
 * any utility functions, so it can be shared between the regular firebaseNamespace and
 * the lite version.
 */
function createFirebaseNamespaceCore(firebaseAppImpl) {
    var apps = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var components = new Map();
    // A namespace is a plain JavaScript Object.
    var namespace = {
        // Hack to prevent Babel from modifying the object returned
        // as the firebase namespace.
        // @ts-ignore
        __esModule: true,
        initializeApp: initializeApp,
        // @ts-ignore
        app: app,
        registerVersion: registerVersion,
        setLogLevel: index_esm.setLogLevel,
        onLog: onLog,
        // @ts-ignore
        apps: null,
        SDK_VERSION: version$1,
        INTERNAL: {
            registerComponent: registerComponent,
            removeApp: removeApp,
            components: components,
            useAsService: useAsService
        }
    };
    // Inject a circular default export to allow Babel users who were previously
    // using:
    //
    //   import firebase from 'firebase';
    //   which becomes: var firebase = require('firebase').default;
    //
    // instead of
    //
    //   import * as firebase from 'firebase';
    //   which becomes: var firebase = require('firebase');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    namespace['default'] = namespace;
    // firebase.apps is a read-only getter.
    Object.defineProperty(namespace, 'apps', {
        get: getApps
    });
    /**
     * Called by App.delete() - but before any services associated with the App
     * are deleted.
     */
    function removeApp(name) {
        delete apps[name];
    }
    /**
     * Get the App object for a given name (or DEFAULT).
     */
    function app(name) {
        name = name || DEFAULT_ENTRY_NAME;
        if (!index_cjs.contains(apps, name)) {
            throw ERROR_FACTORY.create("no-app" /* NO_APP */, { appName: name });
        }
        return apps[name];
    }
    // @ts-ignore
    app['App'] = firebaseAppImpl;
    function initializeApp(options, rawConfig) {
        if (rawConfig === void 0) { rawConfig = {}; }
        if (typeof rawConfig !== 'object' || rawConfig === null) {
            var name_1 = rawConfig;
            rawConfig = { name: name_1 };
        }
        var config = rawConfig;
        if (config.name === undefined) {
            config.name = DEFAULT_ENTRY_NAME;
        }
        var name = config.name;
        if (typeof name !== 'string' || !name) {
            throw ERROR_FACTORY.create("bad-app-name" /* BAD_APP_NAME */, {
                appName: String(name)
            });
        }
        if (index_cjs.contains(apps, name)) {
            throw ERROR_FACTORY.create("duplicate-app" /* DUPLICATE_APP */, { appName: name });
        }
        var app = new firebaseAppImpl(options, config, namespace);
        apps[name] = app;
        return app;
    }
    /*
     * Return an array of all the non-deleted FirebaseApps.
     */
    function getApps() {
        // Make a copy so caller cannot mutate the apps list.
        return Object.keys(apps).map(function (name) { return apps[name]; });
    }
    function registerComponent(component) {
        var e_1, _a;
        var componentName = component.name;
        if (components.has(componentName)) {
            logger.debug("There were multiple attempts to register component " + componentName + ".");
            return component.type === "PUBLIC" /* PUBLIC */
                ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    namespace[componentName]
                : null;
        }
        components.set(componentName, component);
        // create service namespace for public components
        if (component.type === "PUBLIC" /* PUBLIC */) {
            // The Service namespace is an accessor function ...
            var serviceNamespace = function (appArg) {
                if (appArg === void 0) { appArg = app(); }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (typeof appArg[componentName] !== 'function') {
                    // Invalid argument.
                    // This happens in the following case: firebase.storage('gs:/')
                    throw ERROR_FACTORY.create("invalid-app-argument" /* INVALID_APP_ARGUMENT */, {
                        appName: componentName
                    });
                }
                // Forward service instance lookup to the FirebaseApp.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return appArg[componentName]();
            };
            // ... and a container for service-level properties.
            if (component.serviceProps !== undefined) {
                index_cjs.deepExtend(serviceNamespace, component.serviceProps);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            namespace[componentName] = serviceNamespace;
            // Patch the FirebaseAppImpl prototype
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            firebaseAppImpl.prototype[componentName] =
                // TODO: The eslint disable can be removed and the 'ignoreRestArgs'
                // option added to the no-explicit-any rule when ESlint releases it.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var serviceFxn = this._getService.bind(this, componentName);
                    return serviceFxn.apply(this, component.multipleInstances ? args : []);
                };
        }
        try {
            // add the component to existing app instances
            for (var _b = tslib_es6.__values(Object.keys(apps)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var appName = _c.value;
                apps[appName]._addComponent(component);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return component.type === "PUBLIC" /* PUBLIC */
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                namespace[componentName]
            : null;
    }
    function registerVersion(libraryKeyOrName, version, variant) {
        var _a;
        // TODO: We can use this check to whitelist strings when/if we set up
        // a good whitelist system.
        var library = (_a = PLATFORM_LOG_STRING[libraryKeyOrName]) !== null && _a !== void 0 ? _a : libraryKeyOrName;
        if (variant) {
            library += "-" + variant;
        }
        var libraryMismatch = library.match(/\s|\//);
        var versionMismatch = version.match(/\s|\//);
        if (libraryMismatch || versionMismatch) {
            var warning = [
                "Unable to register library \"" + library + "\" with version \"" + version + "\":"
            ];
            if (libraryMismatch) {
                warning.push("library name \"" + library + "\" contains illegal characters (whitespace or \"/\")");
            }
            if (libraryMismatch && versionMismatch) {
                warning.push('and');
            }
            if (versionMismatch) {
                warning.push("version name \"" + version + "\" contains illegal characters (whitespace or \"/\")");
            }
            logger.warn(warning.join(' '));
            return;
        }
        registerComponent(new index_cjs$1.Component(library + "-version", function () { return ({ library: library, version: version }); }, "VERSION" /* VERSION */));
    }
    function onLog(logCallback, options) {
        if (logCallback !== null && typeof logCallback !== 'function') {
            throw ERROR_FACTORY.create("invalid-log-argument" /* INVALID_LOG_ARGUMENT */, {
                appName: name
            });
        }
        index_esm.setUserLogHandler(logCallback, options);
    }
    // Map the requested service to a registered service name
    // (used to map auth to serverAuth service when needed).
    function useAsService(app, name) {
        if (name === 'serverAuth') {
            return null;
        }
        var useService = name;
        return useService;
    }
    return namespace;
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Return a firebase namespace object.
 *
 * In production, this will be called exactly once and the result
 * assigned to the 'firebase' global.  It may be called multiple times
 * in unit tests.
 */
function createFirebaseNamespace() {
    var namespace = createFirebaseNamespaceCore(FirebaseAppImpl);
    namespace.INTERNAL = tslib_es6.__assign(tslib_es6.__assign({}, namespace.INTERNAL), { createFirebaseNamespace: createFirebaseNamespace,
        extendNamespace: extendNamespace,
        createSubscribe: index_cjs.createSubscribe,
        ErrorFactory: index_cjs.ErrorFactory,
        deepExtend: index_cjs.deepExtend });
    /**
     * Patch the top-level firebase namespace with additional properties.
     *
     * firebase.INTERNAL.extendNamespace()
     */
    function extendNamespace(props) {
        index_cjs.deepExtend(namespace, props);
    }
    return namespace;
}
var firebase = createFirebaseNamespace();

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var PlatformLoggerService = /** @class */ (function () {
    function PlatformLoggerService(container) {
        this.container = container;
    }
    // In initial implementation, this will be called by installations on
    // auth token refresh, and installations will send this string.
    PlatformLoggerService.prototype.getPlatformInfoString = function () {
        var providers = this.container.getProviders();
        // Loop through providers and get library/version pairs from any that are
        // version components.
        return providers
            .map(function (provider) {
            if (isVersionServiceProvider(provider)) {
                var service = provider.getImmediate();
                return service.library + "/" + service.version;
            }
            else {
                return null;
            }
        })
            .filter(function (logString) { return logString; })
            .join(' ');
    };
    return PlatformLoggerService;
}());
/**
 *
 * @param provider check if this provider provides a VersionService
 *
 * NOTE: Using Provider<'app-version'> is a hack to indicate that the provider
 * provides VersionService. The provider is not necessarily a 'app-version'
 * provider.
 */
function isVersionServiceProvider(provider) {
    var component = provider.getComponent();
    return (component === null || component === void 0 ? void 0 : component.type) === "VERSION" /* VERSION */;
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function registerCoreComponents(firebase, variant) {
    firebase.INTERNAL.registerComponent(new index_cjs$1.Component('platform-logger', function (container) { return new PlatformLoggerService(container); }, "PRIVATE" /* PRIVATE */));
    // Register `app` package.
    firebase.registerVersion(name$1, version, variant);
    // Register platform SDK identifier (no version).
    firebase.registerVersion('fire-js', '');
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Firebase Lite detection test
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (index_cjs.isBrowser() && self.firebase !== undefined) {
    logger.warn("\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  ");
    // eslint-disable-next-line
    var sdkVersion = self.firebase.SDK_VERSION;
    if (sdkVersion && sdkVersion.indexOf('LITE') >= 0) {
        logger.warn("\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    ");
    }
}
var initializeApp = firebase.initializeApp;
// TODO: This disable can be removed and the 'ignoreRestArgs' option added to
// the no-explicit-any rule when ESlint releases it.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
firebase.initializeApp = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    // Environment check before initializing app
    // Do the check in initializeApp, so people have a chance to disable it by setting logLevel
    // in @firebase/logger
    if (index_cjs.isNode()) {
        logger.warn("\n      Warning: This is a browser-targeted Firebase bundle but it appears it is being\n      run in a Node environment.  If running in a Node environment, make sure you\n      are using the bundle specified by the \"main\" field in package.json.\n      \n      If you are using Webpack, you can specify \"main\" as the first item in\n      \"resolve.mainFields\":\n      https://webpack.js.org/configuration/resolve/#resolvemainfields\n      \n      If using Rollup, use the rollup-plugin-node-resolve plugin and specify \"main\"\n      as the first item in \"mainFields\", e.g. ['main', 'module'].\n      https://github.com/rollup/rollup-plugin-node-resolve\n      ");
    }
    return initializeApp.apply(undefined, args);
};
var firebase$1 = firebase;
registerCoreComponents(firebase$1);

exports.default = firebase$1;
exports.firebase = firebase$1;

});

export { commonjsGlobal as c, index_cjs$2 as i };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguY2pzLjYyYjRkMmNiLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL3V0aWwvZGlzdC9pbmRleC5janMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL2NvbXBvbmVudC9kaXN0L2luZGV4LmNqcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvbG9nZ2VyL2Rpc3QvaW5kZXguZXNtLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9hcHAvZGlzdC9pbmRleC5janMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG52YXIgdHNsaWIgPSByZXF1aXJlKCd0c2xpYicpO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogQGZpbGVvdmVydmlldyBGaXJlYmFzZSBjb25zdGFudHMuICBTb21lIG9mIHRoZXNlIChAZGVmaW5lcykgY2FuIGJlIG92ZXJyaWRkZW4gYXQgY29tcGlsZS10aW1lLlxyXG4gKi9cclxudmFyIENPTlNUQU5UUyA9IHtcclxuICAgIC8qKlxyXG4gICAgICogQGRlZmluZSB7Ym9vbGVhbn0gV2hldGhlciB0aGlzIGlzIHRoZSBjbGllbnQgTm9kZS5qcyBTREsuXHJcbiAgICAgKi9cclxuICAgIE5PREVfQ0xJRU5UOiBmYWxzZSxcclxuICAgIC8qKlxyXG4gICAgICogQGRlZmluZSB7Ym9vbGVhbn0gV2hldGhlciB0aGlzIGlzIHRoZSBBZG1pbiBOb2RlLmpzIFNESy5cclxuICAgICAqL1xyXG4gICAgTk9ERV9BRE1JTjogZmFsc2UsXHJcbiAgICAvKipcclxuICAgICAqIEZpcmViYXNlIFNESyBWZXJzaW9uXHJcbiAgICAgKi9cclxuICAgIFNES19WRVJTSU9OOiAnJHtKU0NPUkVfVkVSU0lPTn0nXHJcbn07XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIHByb3ZpZGVkIGFzc2VydGlvbiBpcyBmYWxzeVxyXG4gKi9cclxudmFyIGFzc2VydCA9IGZ1bmN0aW9uIChhc3NlcnRpb24sIG1lc3NhZ2UpIHtcclxuICAgIGlmICghYXNzZXJ0aW9uKSB7XHJcbiAgICAgICAgdGhyb3cgYXNzZXJ0aW9uRXJyb3IobWVzc2FnZSk7XHJcbiAgICB9XHJcbn07XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGFuIEVycm9yIG9iamVjdCBzdWl0YWJsZSBmb3IgdGhyb3dpbmcuXHJcbiAqL1xyXG52YXIgYXNzZXJ0aW9uRXJyb3IgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xyXG4gICAgcmV0dXJuIG5ldyBFcnJvcignRmlyZWJhc2UgRGF0YWJhc2UgKCcgK1xyXG4gICAgICAgIENPTlNUQU5UUy5TREtfVkVSU0lPTiArXHJcbiAgICAgICAgJykgSU5URVJOQUwgQVNTRVJUIEZBSUxFRDogJyArXHJcbiAgICAgICAgbWVzc2FnZSk7XHJcbn07XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbnZhciBzdHJpbmdUb0J5dGVBcnJheSA9IGZ1bmN0aW9uIChzdHIpIHtcclxuICAgIC8vIFRPRE8odXNlcik6IFVzZSBuYXRpdmUgaW1wbGVtZW50YXRpb25zIGlmL3doZW4gYXZhaWxhYmxlXHJcbiAgICB2YXIgb3V0ID0gW107XHJcbiAgICB2YXIgcCA9IDA7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBjID0gc3RyLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgaWYgKGMgPCAxMjgpIHtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSBjO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjIDwgMjA0OCkge1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjID4+IDYpIHwgMTkyO1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjICYgNjMpIHwgMTI4O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICgoYyAmIDB4ZmMwMCkgPT09IDB4ZDgwMCAmJlxyXG4gICAgICAgICAgICBpICsgMSA8IHN0ci5sZW5ndGggJiZcclxuICAgICAgICAgICAgKHN0ci5jaGFyQ29kZUF0KGkgKyAxKSAmIDB4ZmMwMCkgPT09IDB4ZGMwMCkge1xyXG4gICAgICAgICAgICAvLyBTdXJyb2dhdGUgUGFpclxyXG4gICAgICAgICAgICBjID0gMHgxMDAwMCArICgoYyAmIDB4MDNmZikgPDwgMTApICsgKHN0ci5jaGFyQ29kZUF0KCsraSkgJiAweDAzZmYpO1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjID4+IDE4KSB8IDI0MDtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoKGMgPj4gMTIpICYgNjMpIHwgMTI4O1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9ICgoYyA+PiA2KSAmIDYzKSB8IDEyODtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyAmIDYzKSB8IDEyODtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgPj4gMTIpIHwgMjI0O1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9ICgoYyA+PiA2KSAmIDYzKSB8IDEyODtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyAmIDYzKSB8IDEyODtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0O1xyXG59O1xyXG4vKipcclxuICogVHVybnMgYW4gYXJyYXkgb2YgbnVtYmVycyBpbnRvIHRoZSBzdHJpbmcgZ2l2ZW4gYnkgdGhlIGNvbmNhdGVuYXRpb24gb2YgdGhlXHJcbiAqIGNoYXJhY3RlcnMgdG8gd2hpY2ggdGhlIG51bWJlcnMgY29ycmVzcG9uZC5cclxuICogQHBhcmFtIGJ5dGVzIEFycmF5IG9mIG51bWJlcnMgcmVwcmVzZW50aW5nIGNoYXJhY3RlcnMuXHJcbiAqIEByZXR1cm4gU3RyaW5naWZpY2F0aW9uIG9mIHRoZSBhcnJheS5cclxuICovXHJcbnZhciBieXRlQXJyYXlUb1N0cmluZyA9IGZ1bmN0aW9uIChieXRlcykge1xyXG4gICAgLy8gVE9ETyh1c2VyKTogVXNlIG5hdGl2ZSBpbXBsZW1lbnRhdGlvbnMgaWYvd2hlbiBhdmFpbGFibGVcclxuICAgIHZhciBvdXQgPSBbXTtcclxuICAgIHZhciBwb3MgPSAwLCBjID0gMDtcclxuICAgIHdoaWxlIChwb3MgPCBieXRlcy5sZW5ndGgpIHtcclxuICAgICAgICB2YXIgYzEgPSBieXRlc1twb3MrK107XHJcbiAgICAgICAgaWYgKGMxIDwgMTI4KSB7XHJcbiAgICAgICAgICAgIG91dFtjKytdID0gU3RyaW5nLmZyb21DaGFyQ29kZShjMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMxID4gMTkxICYmIGMxIDwgMjI0KSB7XHJcbiAgICAgICAgICAgIHZhciBjMiA9IGJ5dGVzW3BvcysrXTtcclxuICAgICAgICAgICAgb3V0W2MrK10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgoYzEgJiAzMSkgPDwgNikgfCAoYzIgJiA2MykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjMSA+IDIzOSAmJiBjMSA8IDM2NSkge1xyXG4gICAgICAgICAgICAvLyBTdXJyb2dhdGUgUGFpclxyXG4gICAgICAgICAgICB2YXIgYzIgPSBieXRlc1twb3MrK107XHJcbiAgICAgICAgICAgIHZhciBjMyA9IGJ5dGVzW3BvcysrXTtcclxuICAgICAgICAgICAgdmFyIGM0ID0gYnl0ZXNbcG9zKytdO1xyXG4gICAgICAgICAgICB2YXIgdSA9ICgoKGMxICYgNykgPDwgMTgpIHwgKChjMiAmIDYzKSA8PCAxMikgfCAoKGMzICYgNjMpIDw8IDYpIHwgKGM0ICYgNjMpKSAtXHJcbiAgICAgICAgICAgICAgICAweDEwMDAwO1xyXG4gICAgICAgICAgICBvdXRbYysrXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhkODAwICsgKHUgPj4gMTApKTtcclxuICAgICAgICAgICAgb3V0W2MrK10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4ZGMwMCArICh1ICYgMTAyMykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGMyID0gYnl0ZXNbcG9zKytdO1xyXG4gICAgICAgICAgICB2YXIgYzMgPSBieXRlc1twb3MrK107XHJcbiAgICAgICAgICAgIG91dFtjKytdID0gU3RyaW5nLmZyb21DaGFyQ29kZSgoKGMxICYgMTUpIDw8IDEyKSB8ICgoYzIgJiA2MykgPDwgNikgfCAoYzMgJiA2MykpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBvdXQuam9pbignJyk7XHJcbn07XHJcbi8vIFdlIGRlZmluZSBpdCBhcyBhbiBvYmplY3QgbGl0ZXJhbCBpbnN0ZWFkIG9mIGEgY2xhc3MgYmVjYXVzZSBhIGNsYXNzIGNvbXBpbGVkIGRvd24gdG8gZXM1IGNhbid0XHJcbi8vIGJlIHRyZWVzaGFrZWQuIGh0dHBzOi8vZ2l0aHViLmNvbS9yb2xsdXAvcm9sbHVwL2lzc3Vlcy8xNjkxXHJcbi8vIFN0YXRpYyBsb29rdXAgbWFwcywgbGF6aWx5IHBvcHVsYXRlZCBieSBpbml0XygpXHJcbnZhciBiYXNlNjQgPSB7XHJcbiAgICAvKipcclxuICAgICAqIE1hcHMgYnl0ZXMgdG8gY2hhcmFjdGVycy5cclxuICAgICAqL1xyXG4gICAgYnl0ZVRvQ2hhck1hcF86IG51bGwsXHJcbiAgICAvKipcclxuICAgICAqIE1hcHMgY2hhcmFjdGVycyB0byBieXRlcy5cclxuICAgICAqL1xyXG4gICAgY2hhclRvQnl0ZU1hcF86IG51bGwsXHJcbiAgICAvKipcclxuICAgICAqIE1hcHMgYnl0ZXMgdG8gd2Vic2FmZSBjaGFyYWN0ZXJzLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgYnl0ZVRvQ2hhck1hcFdlYlNhZmVfOiBudWxsLFxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXBzIHdlYnNhZmUgY2hhcmFjdGVycyB0byBieXRlcy5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGNoYXJUb0J5dGVNYXBXZWJTYWZlXzogbnVsbCxcclxuICAgIC8qKlxyXG4gICAgICogT3VyIGRlZmF1bHQgYWxwaGFiZXQsIHNoYXJlZCBiZXR3ZWVuXHJcbiAgICAgKiBFTkNPREVEX1ZBTFMgYW5kIEVOQ09ERURfVkFMU19XRUJTQUZFXHJcbiAgICAgKi9cclxuICAgIEVOQ09ERURfVkFMU19CQVNFOiAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVonICsgJ2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6JyArICcwMTIzNDU2Nzg5JyxcclxuICAgIC8qKlxyXG4gICAgICogT3VyIGRlZmF1bHQgYWxwaGFiZXQuIFZhbHVlIDY0ICg9KSBpcyBzcGVjaWFsOyBpdCBtZWFucyBcIm5vdGhpbmcuXCJcclxuICAgICAqL1xyXG4gICAgZ2V0IEVOQ09ERURfVkFMUygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5FTkNPREVEX1ZBTFNfQkFTRSArICcrLz0nO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICogT3VyIHdlYnNhZmUgYWxwaGFiZXQuXHJcbiAgICAgKi9cclxuICAgIGdldCBFTkNPREVEX1ZBTFNfV0VCU0FGRSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5FTkNPREVEX1ZBTFNfQkFTRSArICctXy4nO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciB0aGlzIGJyb3dzZXIgc3VwcG9ydHMgdGhlIGF0b2IgYW5kIGJ0b2EgZnVuY3Rpb25zLiBUaGlzIGV4dGVuc2lvblxyXG4gICAgICogc3RhcnRlZCBhdCBNb3ppbGxhIGJ1dCBpcyBub3cgaW1wbGVtZW50ZWQgYnkgbWFueSBicm93c2Vycy4gV2UgdXNlIHRoZVxyXG4gICAgICogQVNTVU1FXyogdmFyaWFibGVzIHRvIGF2b2lkIHB1bGxpbmcgaW4gdGhlIGZ1bGwgdXNlcmFnZW50IGRldGVjdGlvbiBsaWJyYXJ5XHJcbiAgICAgKiBidXQgc3RpbGwgYWxsb3dpbmcgdGhlIHN0YW5kYXJkIHBlci1icm93c2VyIGNvbXBpbGF0aW9ucy5cclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIEhBU19OQVRJVkVfU1VQUE9SVDogdHlwZW9mIGF0b2IgPT09ICdmdW5jdGlvbicsXHJcbiAgICAvKipcclxuICAgICAqIEJhc2U2NC1lbmNvZGUgYW4gYXJyYXkgb2YgYnl0ZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGlucHV0IEFuIGFycmF5IG9mIGJ5dGVzIChudW1iZXJzIHdpdGhcclxuICAgICAqICAgICB2YWx1ZSBpbiBbMCwgMjU1XSkgdG8gZW5jb2RlLlxyXG4gICAgICogQHBhcmFtIHdlYlNhZmUgQm9vbGVhbiBpbmRpY2F0aW5nIHdlIHNob3VsZCB1c2UgdGhlXHJcbiAgICAgKiAgICAgYWx0ZXJuYXRpdmUgYWxwaGFiZXQuXHJcbiAgICAgKiBAcmV0dXJuIFRoZSBiYXNlNjQgZW5jb2RlZCBzdHJpbmcuXHJcbiAgICAgKi9cclxuICAgIGVuY29kZUJ5dGVBcnJheTogZnVuY3Rpb24gKGlucHV0LCB3ZWJTYWZlKSB7XHJcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGlucHV0KSkge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcignZW5jb2RlQnl0ZUFycmF5IHRha2VzIGFuIGFycmF5IGFzIGEgcGFyYW1ldGVyJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW5pdF8oKTtcclxuICAgICAgICB2YXIgYnl0ZVRvQ2hhck1hcCA9IHdlYlNhZmVcclxuICAgICAgICAgICAgPyB0aGlzLmJ5dGVUb0NoYXJNYXBXZWJTYWZlX1xyXG4gICAgICAgICAgICA6IHRoaXMuYnl0ZVRvQ2hhck1hcF87XHJcbiAgICAgICAgdmFyIG91dHB1dCA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpICs9IDMpIHtcclxuICAgICAgICAgICAgdmFyIGJ5dGUxID0gaW5wdXRbaV07XHJcbiAgICAgICAgICAgIHZhciBoYXZlQnl0ZTIgPSBpICsgMSA8IGlucHV0Lmxlbmd0aDtcclxuICAgICAgICAgICAgdmFyIGJ5dGUyID0gaGF2ZUJ5dGUyID8gaW5wdXRbaSArIDFdIDogMDtcclxuICAgICAgICAgICAgdmFyIGhhdmVCeXRlMyA9IGkgKyAyIDwgaW5wdXQubGVuZ3RoO1xyXG4gICAgICAgICAgICB2YXIgYnl0ZTMgPSBoYXZlQnl0ZTMgPyBpbnB1dFtpICsgMl0gOiAwO1xyXG4gICAgICAgICAgICB2YXIgb3V0Qnl0ZTEgPSBieXRlMSA+PiAyO1xyXG4gICAgICAgICAgICB2YXIgb3V0Qnl0ZTIgPSAoKGJ5dGUxICYgMHgwMykgPDwgNCkgfCAoYnl0ZTIgPj4gNCk7XHJcbiAgICAgICAgICAgIHZhciBvdXRCeXRlMyA9ICgoYnl0ZTIgJiAweDBmKSA8PCAyKSB8IChieXRlMyA+PiA2KTtcclxuICAgICAgICAgICAgdmFyIG91dEJ5dGU0ID0gYnl0ZTMgJiAweDNmO1xyXG4gICAgICAgICAgICBpZiAoIWhhdmVCeXRlMykge1xyXG4gICAgICAgICAgICAgICAgb3V0Qnl0ZTQgPSA2NDtcclxuICAgICAgICAgICAgICAgIGlmICghaGF2ZUJ5dGUyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0Qnl0ZTMgPSA2NDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXRwdXQucHVzaChieXRlVG9DaGFyTWFwW291dEJ5dGUxXSwgYnl0ZVRvQ2hhck1hcFtvdXRCeXRlMl0sIGJ5dGVUb0NoYXJNYXBbb3V0Qnl0ZTNdLCBieXRlVG9DaGFyTWFwW291dEJ5dGU0XSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXRwdXQuam9pbignJyk7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiBCYXNlNjQtZW5jb2RlIGEgc3RyaW5nLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBpbnB1dCBBIHN0cmluZyB0byBlbmNvZGUuXHJcbiAgICAgKiBAcGFyYW0gd2ViU2FmZSBJZiB0cnVlLCB3ZSBzaG91bGQgdXNlIHRoZVxyXG4gICAgICogICAgIGFsdGVybmF0aXZlIGFscGhhYmV0LlxyXG4gICAgICogQHJldHVybiBUaGUgYmFzZTY0IGVuY29kZWQgc3RyaW5nLlxyXG4gICAgICovXHJcbiAgICBlbmNvZGVTdHJpbmc6IGZ1bmN0aW9uIChpbnB1dCwgd2ViU2FmZSkge1xyXG4gICAgICAgIC8vIFNob3J0Y3V0IGZvciBNb3ppbGxhIGJyb3dzZXJzIHRoYXQgaW1wbGVtZW50XHJcbiAgICAgICAgLy8gYSBuYXRpdmUgYmFzZTY0IGVuY29kZXIgaW4gdGhlIGZvcm0gb2YgXCJidG9hL2F0b2JcIlxyXG4gICAgICAgIGlmICh0aGlzLkhBU19OQVRJVkVfU1VQUE9SVCAmJiAhd2ViU2FmZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYnRvYShpbnB1dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmVuY29kZUJ5dGVBcnJheShzdHJpbmdUb0J5dGVBcnJheShpbnB1dCksIHdlYlNhZmUpO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICogQmFzZTY0LWRlY29kZSBhIHN0cmluZy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gaW5wdXQgdG8gZGVjb2RlLlxyXG4gICAgICogQHBhcmFtIHdlYlNhZmUgVHJ1ZSBpZiB3ZSBzaG91bGQgdXNlIHRoZVxyXG4gICAgICogICAgIGFsdGVybmF0aXZlIGFscGhhYmV0LlxyXG4gICAgICogQHJldHVybiBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBkZWNvZGVkIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICBkZWNvZGVTdHJpbmc6IGZ1bmN0aW9uIChpbnB1dCwgd2ViU2FmZSkge1xyXG4gICAgICAgIC8vIFNob3J0Y3V0IGZvciBNb3ppbGxhIGJyb3dzZXJzIHRoYXQgaW1wbGVtZW50XHJcbiAgICAgICAgLy8gYSBuYXRpdmUgYmFzZTY0IGVuY29kZXIgaW4gdGhlIGZvcm0gb2YgXCJidG9hL2F0b2JcIlxyXG4gICAgICAgIGlmICh0aGlzLkhBU19OQVRJVkVfU1VQUE9SVCAmJiAhd2ViU2FmZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYXRvYihpbnB1dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBieXRlQXJyYXlUb1N0cmluZyh0aGlzLmRlY29kZVN0cmluZ1RvQnl0ZUFycmF5KGlucHV0LCB3ZWJTYWZlKSk7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiBCYXNlNjQtZGVjb2RlIGEgc3RyaW5nLlxyXG4gICAgICpcclxuICAgICAqIEluIGJhc2UtNjQgZGVjb2RpbmcsIGdyb3VwcyBvZiBmb3VyIGNoYXJhY3RlcnMgYXJlIGNvbnZlcnRlZCBpbnRvIHRocmVlXHJcbiAgICAgKiBieXRlcy4gIElmIHRoZSBlbmNvZGVyIGRpZCBub3QgYXBwbHkgcGFkZGluZywgdGhlIGlucHV0IGxlbmd0aCBtYXkgbm90XHJcbiAgICAgKiBiZSBhIG11bHRpcGxlIG9mIDQuXHJcbiAgICAgKlxyXG4gICAgICogSW4gdGhpcyBjYXNlLCB0aGUgbGFzdCBncm91cCB3aWxsIGhhdmUgZmV3ZXIgdGhhbiA0IGNoYXJhY3RlcnMsIGFuZFxyXG4gICAgICogcGFkZGluZyB3aWxsIGJlIGluZmVycmVkLiAgSWYgdGhlIGdyb3VwIGhhcyBvbmUgb3IgdHdvIGNoYXJhY3RlcnMsIGl0IGRlY29kZXNcclxuICAgICAqIHRvIG9uZSBieXRlLiAgSWYgdGhlIGdyb3VwIGhhcyB0aHJlZSBjaGFyYWN0ZXJzLCBpdCBkZWNvZGVzIHRvIHR3byBieXRlcy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gaW5wdXQgSW5wdXQgdG8gZGVjb2RlLlxyXG4gICAgICogQHBhcmFtIHdlYlNhZmUgVHJ1ZSBpZiB3ZSBzaG91bGQgdXNlIHRoZSB3ZWItc2FmZSBhbHBoYWJldC5cclxuICAgICAqIEByZXR1cm4gYnl0ZXMgcmVwcmVzZW50aW5nIHRoZSBkZWNvZGVkIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICBkZWNvZGVTdHJpbmdUb0J5dGVBcnJheTogZnVuY3Rpb24gKGlucHV0LCB3ZWJTYWZlKSB7XHJcbiAgICAgICAgdGhpcy5pbml0XygpO1xyXG4gICAgICAgIHZhciBjaGFyVG9CeXRlTWFwID0gd2ViU2FmZVxyXG4gICAgICAgICAgICA/IHRoaXMuY2hhclRvQnl0ZU1hcFdlYlNhZmVfXHJcbiAgICAgICAgICAgIDogdGhpcy5jaGFyVG9CeXRlTWFwXztcclxuICAgICAgICB2YXIgb3V0cHV0ID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnB1dC5sZW5ndGg7KSB7XHJcbiAgICAgICAgICAgIHZhciBieXRlMSA9IGNoYXJUb0J5dGVNYXBbaW5wdXQuY2hhckF0KGkrKyldO1xyXG4gICAgICAgICAgICB2YXIgaGF2ZUJ5dGUyID0gaSA8IGlucHV0Lmxlbmd0aDtcclxuICAgICAgICAgICAgdmFyIGJ5dGUyID0gaGF2ZUJ5dGUyID8gY2hhclRvQnl0ZU1hcFtpbnB1dC5jaGFyQXQoaSldIDogMDtcclxuICAgICAgICAgICAgKytpO1xyXG4gICAgICAgICAgICB2YXIgaGF2ZUJ5dGUzID0gaSA8IGlucHV0Lmxlbmd0aDtcclxuICAgICAgICAgICAgdmFyIGJ5dGUzID0gaGF2ZUJ5dGUzID8gY2hhclRvQnl0ZU1hcFtpbnB1dC5jaGFyQXQoaSldIDogNjQ7XHJcbiAgICAgICAgICAgICsraTtcclxuICAgICAgICAgICAgdmFyIGhhdmVCeXRlNCA9IGkgPCBpbnB1dC5sZW5ndGg7XHJcbiAgICAgICAgICAgIHZhciBieXRlNCA9IGhhdmVCeXRlNCA/IGNoYXJUb0J5dGVNYXBbaW5wdXQuY2hhckF0KGkpXSA6IDY0O1xyXG4gICAgICAgICAgICArK2k7XHJcbiAgICAgICAgICAgIGlmIChieXRlMSA9PSBudWxsIHx8IGJ5dGUyID09IG51bGwgfHwgYnl0ZTMgPT0gbnVsbCB8fCBieXRlNCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBvdXRCeXRlMSA9IChieXRlMSA8PCAyKSB8IChieXRlMiA+PiA0KTtcclxuICAgICAgICAgICAgb3V0cHV0LnB1c2gob3V0Qnl0ZTEpO1xyXG4gICAgICAgICAgICBpZiAoYnl0ZTMgIT09IDY0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb3V0Qnl0ZTIgPSAoKGJ5dGUyIDw8IDQpICYgMHhmMCkgfCAoYnl0ZTMgPj4gMik7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChvdXRCeXRlMik7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnl0ZTQgIT09IDY0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG91dEJ5dGUzID0gKChieXRlMyA8PCA2KSAmIDB4YzApIHwgYnl0ZTQ7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2gob3V0Qnl0ZTMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiBMYXp5IHN0YXRpYyBpbml0aWFsaXphdGlvbiBmdW5jdGlvbi4gQ2FsbGVkIGJlZm9yZVxyXG4gICAgICogYWNjZXNzaW5nIGFueSBvZiB0aGUgc3RhdGljIG1hcCB2YXJpYWJsZXMuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBpbml0XzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5ieXRlVG9DaGFyTWFwXykge1xyXG4gICAgICAgICAgICB0aGlzLmJ5dGVUb0NoYXJNYXBfID0ge307XHJcbiAgICAgICAgICAgIHRoaXMuY2hhclRvQnl0ZU1hcF8gPSB7fTtcclxuICAgICAgICAgICAgdGhpcy5ieXRlVG9DaGFyTWFwV2ViU2FmZV8gPSB7fTtcclxuICAgICAgICAgICAgdGhpcy5jaGFyVG9CeXRlTWFwV2ViU2FmZV8gPSB7fTtcclxuICAgICAgICAgICAgLy8gV2Ugd2FudCBxdWljayBtYXBwaW5ncyBiYWNrIGFuZCBmb3J0aCwgc28gd2UgcHJlY29tcHV0ZSB0d28gbWFwcy5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLkVOQ09ERURfVkFMUy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ieXRlVG9DaGFyTWFwX1tpXSA9IHRoaXMuRU5DT0RFRF9WQUxTLmNoYXJBdChpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhclRvQnl0ZU1hcF9bdGhpcy5ieXRlVG9DaGFyTWFwX1tpXV0gPSBpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ieXRlVG9DaGFyTWFwV2ViU2FmZV9baV0gPSB0aGlzLkVOQ09ERURfVkFMU19XRUJTQUZFLmNoYXJBdChpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhclRvQnl0ZU1hcFdlYlNhZmVfW3RoaXMuYnl0ZVRvQ2hhck1hcFdlYlNhZmVfW2ldXSA9IGk7XHJcbiAgICAgICAgICAgICAgICAvLyBCZSBmb3JnaXZpbmcgd2hlbiBkZWNvZGluZyBhbmQgY29ycmVjdGx5IGRlY29kZSBib3RoIGVuY29kaW5ncy5cclxuICAgICAgICAgICAgICAgIGlmIChpID49IHRoaXMuRU5DT0RFRF9WQUxTX0JBU0UubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFyVG9CeXRlTWFwX1t0aGlzLkVOQ09ERURfVkFMU19XRUJTQUZFLmNoYXJBdChpKV0gPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhclRvQnl0ZU1hcFdlYlNhZmVfW3RoaXMuRU5DT0RFRF9WQUxTLmNoYXJBdChpKV0gPSBpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG4vKipcclxuICogVVJMLXNhZmUgYmFzZTY0IGVuY29kaW5nXHJcbiAqL1xyXG52YXIgYmFzZTY0RW5jb2RlID0gZnVuY3Rpb24gKHN0cikge1xyXG4gICAgdmFyIHV0ZjhCeXRlcyA9IHN0cmluZ1RvQnl0ZUFycmF5KHN0cik7XHJcbiAgICByZXR1cm4gYmFzZTY0LmVuY29kZUJ5dGVBcnJheSh1dGY4Qnl0ZXMsIHRydWUpO1xyXG59O1xyXG4vKipcclxuICogVVJMLXNhZmUgYmFzZTY0IGRlY29kaW5nXHJcbiAqXHJcbiAqIE5PVEU6IERPIE5PVCB1c2UgdGhlIGdsb2JhbCBhdG9iKCkgZnVuY3Rpb24gLSBpdCBkb2VzIE5PVCBzdXBwb3J0IHRoZVxyXG4gKiBiYXNlNjRVcmwgdmFyaWFudCBlbmNvZGluZy5cclxuICpcclxuICogQHBhcmFtIHN0ciBUbyBiZSBkZWNvZGVkXHJcbiAqIEByZXR1cm4gRGVjb2RlZCByZXN1bHQsIGlmIHBvc3NpYmxlXHJcbiAqL1xyXG52YXIgYmFzZTY0RGVjb2RlID0gZnVuY3Rpb24gKHN0cikge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gYmFzZTY0LmRlY29kZVN0cmluZyhzdHIsIHRydWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdiYXNlNjREZWNvZGUgZmFpbGVkOiAnLCBlKTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogRG8gYSBkZWVwLWNvcHkgb2YgYmFzaWMgSmF2YVNjcmlwdCBPYmplY3RzIG9yIEFycmF5cy5cclxuICovXHJcbmZ1bmN0aW9uIGRlZXBDb3B5KHZhbHVlKSB7XHJcbiAgICByZXR1cm4gZGVlcEV4dGVuZCh1bmRlZmluZWQsIHZhbHVlKTtcclxufVxyXG4vKipcclxuICogQ29weSBwcm9wZXJ0aWVzIGZyb20gc291cmNlIHRvIHRhcmdldCAocmVjdXJzaXZlbHkgYWxsb3dzIGV4dGVuc2lvblxyXG4gKiBvZiBPYmplY3RzIGFuZCBBcnJheXMpLiAgU2NhbGFyIHZhbHVlcyBpbiB0aGUgdGFyZ2V0IGFyZSBvdmVyLXdyaXR0ZW4uXHJcbiAqIElmIHRhcmdldCBpcyB1bmRlZmluZWQsIGFuIG9iamVjdCBvZiB0aGUgYXBwcm9wcmlhdGUgdHlwZSB3aWxsIGJlIGNyZWF0ZWRcclxuICogKGFuZCByZXR1cm5lZCkuXHJcbiAqXHJcbiAqIFdlIHJlY3Vyc2l2ZWx5IGNvcHkgYWxsIGNoaWxkIHByb3BlcnRpZXMgb2YgcGxhaW4gT2JqZWN0cyBpbiB0aGUgc291cmNlLSBzb1xyXG4gKiB0aGF0IG5hbWVzcGFjZS0gbGlrZSBkaWN0aW9uYXJpZXMgYXJlIG1lcmdlZC5cclxuICpcclxuICogTm90ZSB0aGF0IHRoZSB0YXJnZXQgY2FuIGJlIGEgZnVuY3Rpb24sIGluIHdoaWNoIGNhc2UgdGhlIHByb3BlcnRpZXMgaW5cclxuICogdGhlIHNvdXJjZSBPYmplY3QgYXJlIGNvcGllZCBvbnRvIGl0IGFzIHN0YXRpYyBwcm9wZXJ0aWVzIG9mIHRoZSBGdW5jdGlvbi5cclxuICovXHJcbmZ1bmN0aW9uIGRlZXBFeHRlbmQodGFyZ2V0LCBzb3VyY2UpIHtcclxuICAgIGlmICghKHNvdXJjZSBpbnN0YW5jZW9mIE9iamVjdCkpIHtcclxuICAgICAgICByZXR1cm4gc291cmNlO1xyXG4gICAgfVxyXG4gICAgc3dpdGNoIChzb3VyY2UuY29uc3RydWN0b3IpIHtcclxuICAgICAgICBjYXNlIERhdGU6XHJcbiAgICAgICAgICAgIC8vIFRyZWF0IERhdGVzIGxpa2Ugc2NhbGFyczsgaWYgdGhlIHRhcmdldCBkYXRlIG9iamVjdCBoYWQgYW55IGNoaWxkXHJcbiAgICAgICAgICAgIC8vIHByb3BlcnRpZXMgLSB0aGV5IHdpbGwgYmUgbG9zdCFcclxuICAgICAgICAgICAgdmFyIGRhdGVWYWx1ZSA9IHNvdXJjZTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGRhdGVWYWx1ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIGNhc2UgT2JqZWN0OlxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldCA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQXJyYXk6XHJcbiAgICAgICAgICAgIC8vIEFsd2F5cyBjb3B5IHRoZSBhcnJheSBzb3VyY2UgYW5kIG92ZXJ3cml0ZSB0aGUgdGFyZ2V0LlxyXG4gICAgICAgICAgICB0YXJnZXQgPSBbXTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgLy8gTm90IGEgcGxhaW4gT2JqZWN0IC0gdHJlYXQgaXQgYXMgYSBzY2FsYXIuXHJcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2U7XHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xyXG4gICAgICAgIGlmICghc291cmNlLmhhc093blByb3BlcnR5KHByb3ApKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0YXJnZXRbcHJvcF0gPSBkZWVwRXh0ZW5kKHRhcmdldFtwcm9wXSwgc291cmNlW3Byb3BdKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0YXJnZXQ7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxudmFyIERlZmVycmVkID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gRGVmZXJyZWQoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLnJlamVjdCA9IGZ1bmN0aW9uICgpIHsgfTtcclxuICAgICAgICB0aGlzLnJlc29sdmUgPSBmdW5jdGlvbiAoKSB7IH07XHJcbiAgICAgICAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICBfdGhpcy5yZXNvbHZlID0gcmVzb2x2ZTtcclxuICAgICAgICAgICAgX3RoaXMucmVqZWN0ID0gcmVqZWN0O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBPdXIgQVBJIGludGVybmFscyBhcmUgbm90IHByb21pc2VpZmllZCBhbmQgY2Fubm90IGJlY2F1c2Ugb3VyIGNhbGxiYWNrIEFQSXMgaGF2ZSBzdWJ0bGUgZXhwZWN0YXRpb25zIGFyb3VuZFxyXG4gICAgICogaW52b2tpbmcgcHJvbWlzZXMgaW5saW5lLCB3aGljaCBQcm9taXNlcyBhcmUgZm9yYmlkZGVuIHRvIGRvLiBUaGlzIG1ldGhvZCBhY2NlcHRzIGFuIG9wdGlvbmFsIG5vZGUtc3R5bGUgY2FsbGJhY2tcclxuICAgICAqIGFuZCByZXR1cm5zIGEgbm9kZS1zdHlsZSBjYWxsYmFjayB3aGljaCB3aWxsIHJlc29sdmUgb3IgcmVqZWN0IHRoZSBEZWZlcnJlZCdzIHByb21pc2UuXHJcbiAgICAgKi9cclxuICAgIERlZmVycmVkLnByb3RvdHlwZS53cmFwQ2FsbGJhY2sgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZXJyb3IsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMucmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLnJlc29sdmUodmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIC8vIEF0dGFjaGluZyBub29wIGhhbmRsZXIganVzdCBpbiBjYXNlIGRldmVsb3BlciB3YXNuJ3QgZXhwZWN0aW5nXHJcbiAgICAgICAgICAgICAgICAvLyBwcm9taXNlc1xyXG4gICAgICAgICAgICAgICAgX3RoaXMucHJvbWlzZS5jYXRjaChmdW5jdGlvbiAoKSB7IH0pO1xyXG4gICAgICAgICAgICAgICAgLy8gU29tZSBvZiBvdXIgY2FsbGJhY2tzIGRvbid0IGV4cGVjdCBhIHZhbHVlIGFuZCBvdXIgb3duIHRlc3RzXHJcbiAgICAgICAgICAgICAgICAvLyBhc3NlcnQgdGhhdCB0aGUgcGFyYW1ldGVyIGxlbmd0aCBpcyAxXHJcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2subGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIERlZmVycmVkO1xyXG59KCkpO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogUmV0dXJucyBuYXZpZ2F0b3IudXNlckFnZW50IHN0cmluZyBvciAnJyBpZiBpdCdzIG5vdCBkZWZpbmVkLlxyXG4gKiBAcmV0dXJuIHVzZXIgYWdlbnQgc3RyaW5nXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRVQSgpIHtcclxuICAgIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJlxyXG4gICAgICAgIHR5cGVvZiBuYXZpZ2F0b3JbJ3VzZXJBZ2VudCddID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3JbJ3VzZXJBZ2VudCddO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBEZXRlY3QgQ29yZG92YSAvIFBob25lR2FwIC8gSW9uaWMgZnJhbWV3b3JrcyBvbiBhIG1vYmlsZSBkZXZpY2UuXHJcbiAqXHJcbiAqIERlbGliZXJhdGVseSBkb2VzIG5vdCByZWx5IG9uIGNoZWNraW5nIGBmaWxlOi8vYCBVUkxzIChhcyB0aGlzIGZhaWxzIFBob25lR2FwXHJcbiAqIGluIHRoZSBSaXBwbGUgZW11bGF0b3IpIG5vciBDb3Jkb3ZhIGBvbkRldmljZVJlYWR5YCwgd2hpY2ggd291bGQgbm9ybWFsbHlcclxuICogd2FpdCBmb3IgYSBjYWxsYmFjay5cclxuICovXHJcbmZ1bmN0aW9uIGlzTW9iaWxlQ29yZG92YSgpIHtcclxuICAgIHJldHVybiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcclxuICAgICAgICAvLyBAdHMtaWdub3JlIFNldHRpbmcgdXAgYW4gYnJvYWRseSBhcHBsaWNhYmxlIGluZGV4IHNpZ25hdHVyZSBmb3IgV2luZG93XHJcbiAgICAgICAgLy8ganVzdCB0byBkZWFsIHdpdGggdGhpcyBjYXNlIHdvdWxkIHByb2JhYmx5IGJlIGEgYmFkIGlkZWEuXHJcbiAgICAgICAgISEod2luZG93Wydjb3Jkb3ZhJ10gfHwgd2luZG93WydwaG9uZWdhcCddIHx8IHdpbmRvd1snUGhvbmVHYXAnXSkgJiZcclxuICAgICAgICAvaW9zfGlwaG9uZXxpcG9kfGlwYWR8YW5kcm9pZHxibGFja2JlcnJ5fGllbW9iaWxlL2kudGVzdChnZXRVQSgpKSk7XHJcbn1cclxuLyoqXHJcbiAqIERldGVjdCBOb2RlLmpzLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHRydWUgaWYgTm9kZS5qcyBlbnZpcm9ubWVudCBpcyBkZXRlY3RlZC5cclxuICovXHJcbi8vIE5vZGUgZGV0ZWN0aW9uIGxvZ2ljIGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9pbGlha2FuL2RldGVjdC1ub2RlL1xyXG5mdW5jdGlvbiBpc05vZGUoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGdsb2JhbC5wcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBEZXRlY3QgQnJvd3NlciBFbnZpcm9ubWVudFxyXG4gKi9cclxuZnVuY3Rpb24gaXNCcm93c2VyKCkge1xyXG4gICAgcmV0dXJuIHR5cGVvZiBzZWxmID09PSAnb2JqZWN0JyAmJiBzZWxmLnNlbGYgPT09IHNlbGY7XHJcbn1cclxuZnVuY3Rpb24gaXNCcm93c2VyRXh0ZW5zaW9uKCkge1xyXG4gICAgdmFyIHJ1bnRpbWUgPSB0eXBlb2YgY2hyb21lID09PSAnb2JqZWN0J1xyXG4gICAgICAgID8gY2hyb21lLnJ1bnRpbWVcclxuICAgICAgICA6IHR5cGVvZiBicm93c2VyID09PSAnb2JqZWN0J1xyXG4gICAgICAgICAgICA/IGJyb3dzZXIucnVudGltZVxyXG4gICAgICAgICAgICA6IHVuZGVmaW5lZDtcclxuICAgIHJldHVybiB0eXBlb2YgcnVudGltZSA9PT0gJ29iamVjdCcgJiYgcnVudGltZS5pZCAhPT0gdW5kZWZpbmVkO1xyXG59XHJcbi8qKlxyXG4gKiBEZXRlY3QgUmVhY3QgTmF0aXZlLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHRydWUgaWYgUmVhY3ROYXRpdmUgZW52aXJvbm1lbnQgaXMgZGV0ZWN0ZWQuXHJcbiAqL1xyXG5mdW5jdGlvbiBpc1JlYWN0TmF0aXZlKCkge1xyXG4gICAgcmV0dXJuICh0eXBlb2YgbmF2aWdhdG9yID09PSAnb2JqZWN0JyAmJiBuYXZpZ2F0b3JbJ3Byb2R1Y3QnXSA9PT0gJ1JlYWN0TmF0aXZlJyk7XHJcbn1cclxuLyoqIERldGVjdHMgRWxlY3Ryb24gYXBwcy4gKi9cclxuZnVuY3Rpb24gaXNFbGVjdHJvbigpIHtcclxuICAgIHJldHVybiBnZXRVQSgpLmluZGV4T2YoJ0VsZWN0cm9uLycpID49IDA7XHJcbn1cclxuLyoqIERldGVjdHMgSW50ZXJuZXQgRXhwbG9yZXIuICovXHJcbmZ1bmN0aW9uIGlzSUUoKSB7XHJcbiAgICB2YXIgdWEgPSBnZXRVQSgpO1xyXG4gICAgcmV0dXJuIHVhLmluZGV4T2YoJ01TSUUgJykgPj0gMCB8fCB1YS5pbmRleE9mKCdUcmlkZW50LycpID49IDA7XHJcbn1cclxuLyoqIERldGVjdHMgVW5pdmVyc2FsIFdpbmRvd3MgUGxhdGZvcm0gYXBwcy4gKi9cclxuZnVuY3Rpb24gaXNVV1AoKSB7XHJcbiAgICByZXR1cm4gZ2V0VUEoKS5pbmRleE9mKCdNU0FwcEhvc3QvJykgPj0gMDtcclxufVxyXG4vKipcclxuICogRGV0ZWN0IHdoZXRoZXIgdGhlIGN1cnJlbnQgU0RLIGJ1aWxkIGlzIHRoZSBOb2RlIHZlcnNpb24uXHJcbiAqXHJcbiAqIEByZXR1cm4gdHJ1ZSBpZiBpdCdzIHRoZSBOb2RlIFNESyBidWlsZC5cclxuICovXHJcbmZ1bmN0aW9uIGlzTm9kZVNkaygpIHtcclxuICAgIHJldHVybiBDT05TVEFOVFMuTk9ERV9DTElFTlQgPT09IHRydWUgfHwgQ09OU1RBTlRTLk5PREVfQURNSU4gPT09IHRydWU7XHJcbn1cclxuLyoqIFJldHVybnMgdHJ1ZSBpZiB3ZSBhcmUgcnVubmluZyBpbiBTYWZhcmkuICovXHJcbmZ1bmN0aW9uIGlzU2FmYXJpKCkge1xyXG4gICAgcmV0dXJuICghaXNOb2RlKCkgJiZcclxuICAgICAgICBuYXZpZ2F0b3IudXNlckFnZW50LmluY2x1ZGVzKCdTYWZhcmknKSAmJlxyXG4gICAgICAgICFuYXZpZ2F0b3IudXNlckFnZW50LmluY2x1ZGVzKCdDaHJvbWUnKSk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxudmFyIEVSUk9SX05BTUUgPSAnRmlyZWJhc2VFcnJvcic7XHJcbi8vIEJhc2VkIG9uIGNvZGUgZnJvbTpcclxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRXJyb3IjQ3VzdG9tX0Vycm9yX1R5cGVzXHJcbnZhciBGaXJlYmFzZUVycm9yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgdHNsaWIuX19leHRlbmRzKEZpcmViYXNlRXJyb3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBGaXJlYmFzZUVycm9yKGNvZGUsIG1lc3NhZ2UpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBtZXNzYWdlKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLmNvZGUgPSBjb2RlO1xyXG4gICAgICAgIF90aGlzLm5hbWUgPSBFUlJPUl9OQU1FO1xyXG4gICAgICAgIC8vIEZpeCBGb3IgRVM1XHJcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0LXdpa2kvYmxvYi9tYXN0ZXIvQnJlYWtpbmctQ2hhbmdlcy5tZCNleHRlbmRpbmctYnVpbHQtaW5zLWxpa2UtZXJyb3ItYXJyYXktYW5kLW1hcC1tYXktbm8tbG9uZ2VyLXdvcmtcclxuICAgICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoX3RoaXMsIEZpcmViYXNlRXJyb3IucHJvdG90eXBlKTtcclxuICAgICAgICAvLyBNYWludGFpbnMgcHJvcGVyIHN0YWNrIHRyYWNlIGZvciB3aGVyZSBvdXIgZXJyb3Igd2FzIHRocm93bi5cclxuICAgICAgICAvLyBPbmx5IGF2YWlsYWJsZSBvbiBWOC5cclxuICAgICAgICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcclxuICAgICAgICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UoX3RoaXMsIEVycm9yRmFjdG9yeS5wcm90b3R5cGUuY3JlYXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIEZpcmViYXNlRXJyb3I7XHJcbn0oRXJyb3IpKTtcclxudmFyIEVycm9yRmFjdG9yeSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIEVycm9yRmFjdG9yeShzZXJ2aWNlLCBzZXJ2aWNlTmFtZSwgZXJyb3JzKSB7XHJcbiAgICAgICAgdGhpcy5zZXJ2aWNlID0gc2VydmljZTtcclxuICAgICAgICB0aGlzLnNlcnZpY2VOYW1lID0gc2VydmljZU5hbWU7XHJcbiAgICAgICAgdGhpcy5lcnJvcnMgPSBlcnJvcnM7XHJcbiAgICB9XHJcbiAgICBFcnJvckZhY3RvcnkucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uIChjb2RlKSB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBkYXRhW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY3VzdG9tRGF0YSA9IGRhdGFbMF0gfHwge307XHJcbiAgICAgICAgdmFyIGZ1bGxDb2RlID0gdGhpcy5zZXJ2aWNlICsgXCIvXCIgKyBjb2RlO1xyXG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9IHRoaXMuZXJyb3JzW2NvZGVdO1xyXG4gICAgICAgIHZhciBtZXNzYWdlID0gdGVtcGxhdGUgPyByZXBsYWNlVGVtcGxhdGUodGVtcGxhdGUsIGN1c3RvbURhdGEpIDogJ0Vycm9yJztcclxuICAgICAgICAvLyBTZXJ2aWNlIE5hbWU6IEVycm9yIG1lc3NhZ2UgKHNlcnZpY2UvY29kZSkuXHJcbiAgICAgICAgdmFyIGZ1bGxNZXNzYWdlID0gdGhpcy5zZXJ2aWNlTmFtZSArIFwiOiBcIiArIG1lc3NhZ2UgKyBcIiAoXCIgKyBmdWxsQ29kZSArIFwiKS5cIjtcclxuICAgICAgICB2YXIgZXJyb3IgPSBuZXcgRmlyZWJhc2VFcnJvcihmdWxsQ29kZSwgZnVsbE1lc3NhZ2UpO1xyXG4gICAgICAgIC8vIEtleXMgd2l0aCBhbiB1bmRlcnNjb3JlIGF0IHRoZSBlbmQgb2YgdGhlaXIgbmFtZSBhcmUgbm90IGluY2x1ZGVkIGluXHJcbiAgICAgICAgLy8gZXJyb3IuZGF0YSBmb3Igc29tZSByZWFzb24uXHJcbiAgICAgICAgLy8gVE9ETzogUmVwbGFjZSB3aXRoIE9iamVjdC5lbnRyaWVzIHdoZW4gbGliIGlzIHVwZGF0ZWQgdG8gZXMyMDE3LlxyXG4gICAgICAgIGZvciAodmFyIF9hID0gMCwgX2IgPSBPYmplY3Qua2V5cyhjdXN0b21EYXRhKTsgX2EgPCBfYi5sZW5ndGg7IF9hKyspIHtcclxuICAgICAgICAgICAgdmFyIGtleSA9IF9iW19hXTtcclxuICAgICAgICAgICAgaWYgKGtleS5zbGljZSgtMSkgIT09ICdfJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleSBpbiBlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIk92ZXJ3cml0aW5nIEZpcmViYXNlRXJyb3IgYmFzZSBmaWVsZCBcXFwiXCIgKyBrZXkgKyBcIlxcXCIgY2FuIGNhdXNlIHVuZXhwZWN0ZWQgYmVoYXZpb3IuXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZXJyb3Jba2V5XSA9IGN1c3RvbURhdGFba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIEVycm9yRmFjdG9yeTtcclxufSgpKTtcclxuZnVuY3Rpb24gcmVwbGFjZVRlbXBsYXRlKHRlbXBsYXRlLCBkYXRhKSB7XHJcbiAgICByZXR1cm4gdGVtcGxhdGUucmVwbGFjZShQQVRURVJOLCBmdW5jdGlvbiAoXywga2V5KSB7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gZGF0YVtrZXldO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZSAhPSBudWxsID8gU3RyaW5nKHZhbHVlKSA6IFwiPFwiICsga2V5ICsgXCI/PlwiO1xyXG4gICAgfSk7XHJcbn1cclxudmFyIFBBVFRFUk4gPSAvXFx7XFwkKFtefV0rKX0vZztcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIEV2YWx1YXRlcyBhIEpTT04gc3RyaW5nIGludG8gYSBqYXZhc2NyaXB0IG9iamVjdC5cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciBBIHN0cmluZyBjb250YWluaW5nIEpTT04uXHJcbiAqIEByZXR1cm4geyp9IFRoZSBqYXZhc2NyaXB0IG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHNwZWNpZmllZCBKU09OLlxyXG4gKi9cclxuZnVuY3Rpb24ganNvbkV2YWwoc3RyKSB7XHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShzdHIpO1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIEpTT04gcmVwcmVzZW50aW5nIGEgamF2YXNjcmlwdCBvYmplY3QuXHJcbiAqIEBwYXJhbSB7Kn0gZGF0YSBKYXZhc2NyaXB0IG9iamVjdCB0byBiZSBzdHJpbmdpZmllZC5cclxuICogQHJldHVybiB7c3RyaW5nfSBUaGUgSlNPTiBjb250ZW50cyBvZiB0aGUgb2JqZWN0LlxyXG4gKi9cclxuZnVuY3Rpb24gc3RyaW5naWZ5KGRhdGEpIHtcclxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogRGVjb2RlcyBhIEZpcmViYXNlIGF1dGguIHRva2VuIGludG8gY29uc3RpdHVlbnQgcGFydHMuXHJcbiAqXHJcbiAqIE5vdGVzOlxyXG4gKiAtIE1heSByZXR1cm4gd2l0aCBpbnZhbGlkIC8gaW5jb21wbGV0ZSBjbGFpbXMgaWYgdGhlcmUncyBubyBuYXRpdmUgYmFzZTY0IGRlY29kaW5nIHN1cHBvcnQuXHJcbiAqIC0gRG9lc24ndCBjaGVjayBpZiB0aGUgdG9rZW4gaXMgYWN0dWFsbHkgdmFsaWQuXHJcbiAqL1xyXG52YXIgZGVjb2RlID0gZnVuY3Rpb24gKHRva2VuKSB7XHJcbiAgICB2YXIgaGVhZGVyID0ge30sIGNsYWltcyA9IHt9LCBkYXRhID0ge30sIHNpZ25hdHVyZSA9ICcnO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB2YXIgcGFydHMgPSB0b2tlbi5zcGxpdCgnLicpO1xyXG4gICAgICAgIGhlYWRlciA9IGpzb25FdmFsKGJhc2U2NERlY29kZShwYXJ0c1swXSkgfHwgJycpO1xyXG4gICAgICAgIGNsYWltcyA9IGpzb25FdmFsKGJhc2U2NERlY29kZShwYXJ0c1sxXSkgfHwgJycpO1xyXG4gICAgICAgIHNpZ25hdHVyZSA9IHBhcnRzWzJdO1xyXG4gICAgICAgIGRhdGEgPSBjbGFpbXNbJ2QnXSB8fCB7fTtcclxuICAgICAgICBkZWxldGUgY2xhaW1zWydkJ107XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkgeyB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGhlYWRlcjogaGVhZGVyLFxyXG4gICAgICAgIGNsYWltczogY2xhaW1zLFxyXG4gICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgc2lnbmF0dXJlOiBzaWduYXR1cmVcclxuICAgIH07XHJcbn07XHJcbi8qKlxyXG4gKiBEZWNvZGVzIGEgRmlyZWJhc2UgYXV0aC4gdG9rZW4gYW5kIGNoZWNrcyB0aGUgdmFsaWRpdHkgb2YgaXRzIHRpbWUtYmFzZWQgY2xhaW1zLiBXaWxsIHJldHVybiB0cnVlIGlmIHRoZVxyXG4gKiB0b2tlbiBpcyB3aXRoaW4gdGhlIHRpbWUgd2luZG93IGF1dGhvcml6ZWQgYnkgdGhlICduYmYnIChub3QtYmVmb3JlKSBhbmQgJ2lhdCcgKGlzc3VlZC1hdCkgY2xhaW1zLlxyXG4gKlxyXG4gKiBOb3RlczpcclxuICogLSBNYXkgcmV0dXJuIGEgZmFsc2UgbmVnYXRpdmUgaWYgdGhlcmUncyBubyBuYXRpdmUgYmFzZTY0IGRlY29kaW5nIHN1cHBvcnQuXHJcbiAqIC0gRG9lc24ndCBjaGVjayBpZiB0aGUgdG9rZW4gaXMgYWN0dWFsbHkgdmFsaWQuXHJcbiAqL1xyXG52YXIgaXNWYWxpZFRpbWVzdGFtcCA9IGZ1bmN0aW9uICh0b2tlbikge1xyXG4gICAgdmFyIGNsYWltcyA9IGRlY29kZSh0b2tlbikuY2xhaW1zO1xyXG4gICAgdmFyIG5vdyA9IE1hdGguZmxvb3IobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKTtcclxuICAgIHZhciB2YWxpZFNpbmNlID0gMCwgdmFsaWRVbnRpbCA9IDA7XHJcbiAgICBpZiAodHlwZW9mIGNsYWltcyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICBpZiAoY2xhaW1zLmhhc093blByb3BlcnR5KCduYmYnKSkge1xyXG4gICAgICAgICAgICB2YWxpZFNpbmNlID0gY2xhaW1zWyduYmYnXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoY2xhaW1zLmhhc093blByb3BlcnR5KCdpYXQnKSkge1xyXG4gICAgICAgICAgICB2YWxpZFNpbmNlID0gY2xhaW1zWydpYXQnXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNsYWltcy5oYXNPd25Qcm9wZXJ0eSgnZXhwJykpIHtcclxuICAgICAgICAgICAgdmFsaWRVbnRpbCA9IGNsYWltc1snZXhwJ107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyB0b2tlbiB3aWxsIGV4cGlyZSBhZnRlciAyNGggYnkgZGVmYXVsdFxyXG4gICAgICAgICAgICB2YWxpZFVudGlsID0gdmFsaWRTaW5jZSArIDg2NDAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiAoISFub3cgJiZcclxuICAgICAgICAhIXZhbGlkU2luY2UgJiZcclxuICAgICAgICAhIXZhbGlkVW50aWwgJiZcclxuICAgICAgICBub3cgPj0gdmFsaWRTaW5jZSAmJlxyXG4gICAgICAgIG5vdyA8PSB2YWxpZFVudGlsKTtcclxufTtcclxuLyoqXHJcbiAqIERlY29kZXMgYSBGaXJlYmFzZSBhdXRoLiB0b2tlbiBhbmQgcmV0dXJucyBpdHMgaXNzdWVkIGF0IHRpbWUgaWYgdmFsaWQsIG51bGwgb3RoZXJ3aXNlLlxyXG4gKlxyXG4gKiBOb3RlczpcclxuICogLSBNYXkgcmV0dXJuIG51bGwgaWYgdGhlcmUncyBubyBuYXRpdmUgYmFzZTY0IGRlY29kaW5nIHN1cHBvcnQuXHJcbiAqIC0gRG9lc24ndCBjaGVjayBpZiB0aGUgdG9rZW4gaXMgYWN0dWFsbHkgdmFsaWQuXHJcbiAqL1xyXG52YXIgaXNzdWVkQXRUaW1lID0gZnVuY3Rpb24gKHRva2VuKSB7XHJcbiAgICB2YXIgY2xhaW1zID0gZGVjb2RlKHRva2VuKS5jbGFpbXM7XHJcbiAgICBpZiAodHlwZW9mIGNsYWltcyA9PT0gJ29iamVjdCcgJiYgY2xhaW1zLmhhc093blByb3BlcnR5KCdpYXQnKSkge1xyXG4gICAgICAgIHJldHVybiBjbGFpbXNbJ2lhdCddO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbi8qKlxyXG4gKiBEZWNvZGVzIGEgRmlyZWJhc2UgYXV0aC4gdG9rZW4gYW5kIGNoZWNrcyB0aGUgdmFsaWRpdHkgb2YgaXRzIGZvcm1hdC4gRXhwZWN0cyBhIHZhbGlkIGlzc3VlZC1hdCB0aW1lLlxyXG4gKlxyXG4gKiBOb3RlczpcclxuICogLSBNYXkgcmV0dXJuIGEgZmFsc2UgbmVnYXRpdmUgaWYgdGhlcmUncyBubyBuYXRpdmUgYmFzZTY0IGRlY29kaW5nIHN1cHBvcnQuXHJcbiAqIC0gRG9lc24ndCBjaGVjayBpZiB0aGUgdG9rZW4gaXMgYWN0dWFsbHkgdmFsaWQuXHJcbiAqL1xyXG52YXIgaXNWYWxpZEZvcm1hdCA9IGZ1bmN0aW9uICh0b2tlbikge1xyXG4gICAgdmFyIGRlY29kZWQgPSBkZWNvZGUodG9rZW4pLCBjbGFpbXMgPSBkZWNvZGVkLmNsYWltcztcclxuICAgIHJldHVybiAhIWNsYWltcyAmJiB0eXBlb2YgY2xhaW1zID09PSAnb2JqZWN0JyAmJiBjbGFpbXMuaGFzT3duUHJvcGVydHkoJ2lhdCcpO1xyXG59O1xyXG4vKipcclxuICogQXR0ZW1wdHMgdG8gcGVlciBpbnRvIGFuIGF1dGggdG9rZW4gYW5kIGRldGVybWluZSBpZiBpdCdzIGFuIGFkbWluIGF1dGggdG9rZW4gYnkgbG9va2luZyBhdCB0aGUgY2xhaW1zIHBvcnRpb24uXHJcbiAqXHJcbiAqIE5vdGVzOlxyXG4gKiAtIE1heSByZXR1cm4gYSBmYWxzZSBuZWdhdGl2ZSBpZiB0aGVyZSdzIG5vIG5hdGl2ZSBiYXNlNjQgZGVjb2Rpbmcgc3VwcG9ydC5cclxuICogLSBEb2Vzbid0IGNoZWNrIGlmIHRoZSB0b2tlbiBpcyBhY3R1YWxseSB2YWxpZC5cclxuICovXHJcbnZhciBpc0FkbWluID0gZnVuY3Rpb24gKHRva2VuKSB7XHJcbiAgICB2YXIgY2xhaW1zID0gZGVjb2RlKHRva2VuKS5jbGFpbXM7XHJcbiAgICByZXR1cm4gdHlwZW9mIGNsYWltcyA9PT0gJ29iamVjdCcgJiYgY2xhaW1zWydhZG1pbiddID09PSB0cnVlO1xyXG59O1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBjb250YWlucyhvYmosIGtleSkge1xyXG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSk7XHJcbn1cclxuZnVuY3Rpb24gc2FmZUdldChvYmosIGtleSkge1xyXG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcclxuICAgICAgICByZXR1cm4gb2JqW2tleV07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGlzRW1wdHkob2JqKSB7XHJcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XHJcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcbmZ1bmN0aW9uIG1hcChvYmosIGZuLCBjb250ZXh0T2JqKSB7XHJcbiAgICB2YXIgcmVzID0ge307XHJcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XHJcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcclxuICAgICAgICAgICAgcmVzW2tleV0gPSBmbi5jYWxsKGNvbnRleHRPYmosIG9ialtrZXldLCBrZXksIG9iaik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlcztcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogUmV0dXJucyBhIHF1ZXJ5c3RyaW5nLWZvcm1hdHRlZCBzdHJpbmcgKGUuZy4gJmFyZz12YWwmYXJnMj12YWwyKSBmcm9tIGFcclxuICogcGFyYW1zIG9iamVjdCAoZS5nLiB7YXJnOiAndmFsJywgYXJnMjogJ3ZhbDInfSlcclxuICogTm90ZTogWW91IG11c3QgcHJlcGVuZCBpdCB3aXRoID8gd2hlbiBhZGRpbmcgaXQgdG8gYSBVUkwuXHJcbiAqL1xyXG5mdW5jdGlvbiBxdWVyeXN0cmluZyhxdWVyeXN0cmluZ1BhcmFtcykge1xyXG4gICAgdmFyIHBhcmFtcyA9IFtdO1xyXG4gICAgdmFyIF9sb29wXzEgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAgICAgICB2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uIChhcnJheVZhbCkge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoYXJyYXlWYWwpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBwYXJhbXMucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gT2JqZWN0LmVudHJpZXMocXVlcnlzdHJpbmdQYXJhbXMpOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgIHZhciBfYiA9IF9hW19pXSwga2V5ID0gX2JbMF0sIHZhbHVlID0gX2JbMV07XHJcbiAgICAgICAgX2xvb3BfMShrZXksIHZhbHVlKTtcclxuICAgIH1cclxuICAgIHJldHVybiBwYXJhbXMubGVuZ3RoID8gJyYnICsgcGFyYW1zLmpvaW4oJyYnKSA6ICcnO1xyXG59XHJcbi8qKlxyXG4gKiBEZWNvZGVzIGEgcXVlcnlzdHJpbmcgKGUuZy4gP2FyZz12YWwmYXJnMj12YWwyKSBpbnRvIGEgcGFyYW1zIG9iamVjdFxyXG4gKiAoZS5nLiB7YXJnOiAndmFsJywgYXJnMjogJ3ZhbDInfSlcclxuICovXHJcbmZ1bmN0aW9uIHF1ZXJ5c3RyaW5nRGVjb2RlKHF1ZXJ5c3RyaW5nKSB7XHJcbiAgICB2YXIgb2JqID0ge307XHJcbiAgICB2YXIgdG9rZW5zID0gcXVlcnlzdHJpbmcucmVwbGFjZSgvXlxcPy8sICcnKS5zcGxpdCgnJicpO1xyXG4gICAgdG9rZW5zLmZvckVhY2goZnVuY3Rpb24gKHRva2VuKSB7XHJcbiAgICAgICAgaWYgKHRva2VuKSB7XHJcbiAgICAgICAgICAgIHZhciBrZXkgPSB0b2tlbi5zcGxpdCgnPScpO1xyXG4gICAgICAgICAgICBvYmpba2V5WzBdXSA9IGtleVsxXTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBvYmo7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIEBmaWxlb3ZlcnZpZXcgU0hBLTEgY3J5cHRvZ3JhcGhpYyBoYXNoLlxyXG4gKiBWYXJpYWJsZSBuYW1lcyBmb2xsb3cgdGhlIG5vdGF0aW9uIGluIEZJUFMgUFVCIDE4MC0zOlxyXG4gKiBodHRwOi8vY3NyYy5uaXN0Lmdvdi9wdWJsaWNhdGlvbnMvZmlwcy9maXBzMTgwLTMvZmlwczE4MC0zX2ZpbmFsLnBkZi5cclxuICpcclxuICogVXNhZ2U6XHJcbiAqICAgdmFyIHNoYTEgPSBuZXcgc2hhMSgpO1xyXG4gKiAgIHNoYTEudXBkYXRlKGJ5dGVzKTtcclxuICogICB2YXIgaGFzaCA9IHNoYTEuZGlnZXN0KCk7XHJcbiAqXHJcbiAqIFBlcmZvcm1hbmNlOlxyXG4gKiAgIENocm9tZSAyMzogICB+NDAwIE1iaXQvc1xyXG4gKiAgIEZpcmVmb3ggMTY6ICB+MjUwIE1iaXQvc1xyXG4gKlxyXG4gKi9cclxuLyoqXHJcbiAqIFNIQS0xIGNyeXB0b2dyYXBoaWMgaGFzaCBjb25zdHJ1Y3Rvci5cclxuICpcclxuICogVGhlIHByb3BlcnRpZXMgZGVjbGFyZWQgaGVyZSBhcmUgZGlzY3Vzc2VkIGluIHRoZSBhYm92ZSBhbGdvcml0aG0gZG9jdW1lbnQuXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAZmluYWxcclxuICogQHN0cnVjdFxyXG4gKi9cclxudmFyIFNoYTEgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBTaGExKCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEhvbGRzIHRoZSBwcmV2aW91cyB2YWx1ZXMgb2YgYWNjdW11bGF0ZWQgdmFyaWFibGVzIGEtZSBpbiB0aGUgY29tcHJlc3NfXHJcbiAgICAgICAgICogZnVuY3Rpb24uXHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNoYWluXyA9IFtdO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEEgYnVmZmVyIGhvbGRpbmcgdGhlIHBhcnRpYWxseSBjb21wdXRlZCBoYXNoIHJlc3VsdC5cclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuYnVmXyA9IFtdO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFuIGFycmF5IG9mIDgwIGJ5dGVzLCBlYWNoIGEgcGFydCBvZiB0aGUgbWVzc2FnZSB0byBiZSBoYXNoZWQuICBSZWZlcnJlZCB0b1xyXG4gICAgICAgICAqIGFzIHRoZSBtZXNzYWdlIHNjaGVkdWxlIGluIHRoZSBkb2NzLlxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5XXyA9IFtdO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnRhaW5zIGRhdGEgbmVlZGVkIHRvIHBhZCBtZXNzYWdlcyBsZXNzIHRoYW4gNjQgYnl0ZXMuXHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnBhZF8gPSBbXTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAcHJpdmF0ZSB7bnVtYmVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuaW5idWZfID0gMDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAcHJpdmF0ZSB7bnVtYmVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMudG90YWxfID0gMDtcclxuICAgICAgICB0aGlzLmJsb2NrU2l6ZSA9IDUxMiAvIDg7XHJcbiAgICAgICAgdGhpcy5wYWRfWzBdID0gMTI4O1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgdGhpcy5ibG9ja1NpemU7ICsraSkge1xyXG4gICAgICAgICAgICB0aGlzLnBhZF9baV0gPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJlc2V0KCk7XHJcbiAgICB9XHJcbiAgICBTaGExLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmNoYWluX1swXSA9IDB4Njc0NTIzMDE7XHJcbiAgICAgICAgdGhpcy5jaGFpbl9bMV0gPSAweGVmY2RhYjg5O1xyXG4gICAgICAgIHRoaXMuY2hhaW5fWzJdID0gMHg5OGJhZGNmZTtcclxuICAgICAgICB0aGlzLmNoYWluX1szXSA9IDB4MTAzMjU0NzY7XHJcbiAgICAgICAgdGhpcy5jaGFpbl9bNF0gPSAweGMzZDJlMWYwO1xyXG4gICAgICAgIHRoaXMuaW5idWZfID0gMDtcclxuICAgICAgICB0aGlzLnRvdGFsXyA9IDA7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbnRlcm5hbCBjb21wcmVzcyBoZWxwZXIgZnVuY3Rpb24uXHJcbiAgICAgKiBAcGFyYW0gYnVmIEJsb2NrIHRvIGNvbXByZXNzLlxyXG4gICAgICogQHBhcmFtIG9mZnNldCBPZmZzZXQgb2YgdGhlIGJsb2NrIGluIHRoZSBidWZmZXIuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBTaGExLnByb3RvdHlwZS5jb21wcmVzc18gPSBmdW5jdGlvbiAoYnVmLCBvZmZzZXQpIHtcclxuICAgICAgICBpZiAoIW9mZnNldCkge1xyXG4gICAgICAgICAgICBvZmZzZXQgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgVyA9IHRoaXMuV187XHJcbiAgICAgICAgLy8gZ2V0IDE2IGJpZyBlbmRpYW4gd29yZHNcclxuICAgICAgICBpZiAodHlwZW9mIGJ1ZiA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPKHVzZXIpOiBbYnVnIDgxNDAxMjJdIFJlY2VudCB2ZXJzaW9ucyBvZiBTYWZhcmkgZm9yIE1hYyBPUyBhbmQgaU9TXHJcbiAgICAgICAgICAgICAgICAvLyBoYXZlIGEgYnVnIHRoYXQgdHVybnMgdGhlIHBvc3QtaW5jcmVtZW50ICsrIG9wZXJhdG9yIGludG8gcHJlLWluY3JlbWVudFxyXG4gICAgICAgICAgICAgICAgLy8gZHVyaW5nIEpJVCBjb21waWxhdGlvbi4gIFdlIGhhdmUgY29kZSB0aGF0IGRlcGVuZHMgaGVhdmlseSBvbiBTSEEtMSBmb3JcclxuICAgICAgICAgICAgICAgIC8vIGNvcnJlY3RuZXNzIGFuZCB3aGljaCBpcyBhZmZlY3RlZCBieSB0aGlzIGJ1Zywgc28gSSd2ZSByZW1vdmVkIGFsbCB1c2VzXHJcbiAgICAgICAgICAgICAgICAvLyBvZiBwb3N0LWluY3JlbWVudCArKyBpbiB3aGljaCB0aGUgcmVzdWx0IHZhbHVlIGlzIHVzZWQuICBXZSBjYW4gcmV2ZXJ0XHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNoYW5nZSBvbmNlIHRoZSBTYWZhcmkgYnVnXHJcbiAgICAgICAgICAgICAgICAvLyAoaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTEwOTAzNikgaGFzIGJlZW4gZml4ZWQgYW5kXHJcbiAgICAgICAgICAgICAgICAvLyBtb3N0IGNsaWVudHMgaGF2ZSBiZWVuIHVwZGF0ZWQuXHJcbiAgICAgICAgICAgICAgICBXW2ldID1cclxuICAgICAgICAgICAgICAgICAgICAoYnVmLmNoYXJDb2RlQXQob2Zmc2V0KSA8PCAyNCkgfFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoYnVmLmNoYXJDb2RlQXQob2Zmc2V0ICsgMSkgPDwgMTYpIHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGJ1Zi5jaGFyQ29kZUF0KG9mZnNldCArIDIpIDw8IDgpIHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmLmNoYXJDb2RlQXQob2Zmc2V0ICsgMyk7XHJcbiAgICAgICAgICAgICAgICBvZmZzZXQgKz0gNDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBXW2ldID1cclxuICAgICAgICAgICAgICAgICAgICAoYnVmW29mZnNldF0gPDwgMjQpIHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGJ1ZltvZmZzZXQgKyAxXSA8PCAxNikgfFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoYnVmW29mZnNldCArIDJdIDw8IDgpIHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmW29mZnNldCArIDNdO1xyXG4gICAgICAgICAgICAgICAgb2Zmc2V0ICs9IDQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZXhwYW5kIHRvIDgwIHdvcmRzXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDE2OyBpIDwgODA7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgdCA9IFdbaSAtIDNdIF4gV1tpIC0gOF0gXiBXW2kgLSAxNF0gXiBXW2kgLSAxNl07XHJcbiAgICAgICAgICAgIFdbaV0gPSAoKHQgPDwgMSkgfCAodCA+Pj4gMzEpKSAmIDB4ZmZmZmZmZmY7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBhID0gdGhpcy5jaGFpbl9bMF07XHJcbiAgICAgICAgdmFyIGIgPSB0aGlzLmNoYWluX1sxXTtcclxuICAgICAgICB2YXIgYyA9IHRoaXMuY2hhaW5fWzJdO1xyXG4gICAgICAgIHZhciBkID0gdGhpcy5jaGFpbl9bM107XHJcbiAgICAgICAgdmFyIGUgPSB0aGlzLmNoYWluX1s0XTtcclxuICAgICAgICB2YXIgZiwgaztcclxuICAgICAgICAvLyBUT0RPKHVzZXIpOiBUcnkgdG8gdW5yb2xsIHRoaXMgbG9vcCB0byBzcGVlZCB1cCB0aGUgY29tcHV0YXRpb24uXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA4MDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpIDwgNDApIHtcclxuICAgICAgICAgICAgICAgIGlmIChpIDwgMjApIHtcclxuICAgICAgICAgICAgICAgICAgICBmID0gZCBeIChiICYgKGMgXiBkKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgayA9IDB4NWE4Mjc5OTk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmID0gYiBeIGMgXiBkO1xyXG4gICAgICAgICAgICAgICAgICAgIGsgPSAweDZlZDllYmExO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPCA2MCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGYgPSAoYiAmIGMpIHwgKGQgJiAoYiB8IGMpKTtcclxuICAgICAgICAgICAgICAgICAgICBrID0gMHg4ZjFiYmNkYztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGYgPSBiIF4gYyBeIGQ7XHJcbiAgICAgICAgICAgICAgICAgICAgayA9IDB4Y2E2MmMxZDY7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHQgPSAoKChhIDw8IDUpIHwgKGEgPj4+IDI3KSkgKyBmICsgZSArIGsgKyBXW2ldKSAmIDB4ZmZmZmZmZmY7XHJcbiAgICAgICAgICAgIGUgPSBkO1xyXG4gICAgICAgICAgICBkID0gYztcclxuICAgICAgICAgICAgYyA9ICgoYiA8PCAzMCkgfCAoYiA+Pj4gMikpICYgMHhmZmZmZmZmZjtcclxuICAgICAgICAgICAgYiA9IGE7XHJcbiAgICAgICAgICAgIGEgPSB0O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNoYWluX1swXSA9ICh0aGlzLmNoYWluX1swXSArIGEpICYgMHhmZmZmZmZmZjtcclxuICAgICAgICB0aGlzLmNoYWluX1sxXSA9ICh0aGlzLmNoYWluX1sxXSArIGIpICYgMHhmZmZmZmZmZjtcclxuICAgICAgICB0aGlzLmNoYWluX1syXSA9ICh0aGlzLmNoYWluX1syXSArIGMpICYgMHhmZmZmZmZmZjtcclxuICAgICAgICB0aGlzLmNoYWluX1szXSA9ICh0aGlzLmNoYWluX1szXSArIGQpICYgMHhmZmZmZmZmZjtcclxuICAgICAgICB0aGlzLmNoYWluX1s0XSA9ICh0aGlzLmNoYWluX1s0XSArIGUpICYgMHhmZmZmZmZmZjtcclxuICAgIH07XHJcbiAgICBTaGExLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoYnl0ZXMsIGxlbmd0aCkge1xyXG4gICAgICAgIC8vIFRPRE8oam9obmxlbnopOiB0aWdodGVuIHRoZSBmdW5jdGlvbiBzaWduYXR1cmUgYW5kIHJlbW92ZSB0aGlzIGNoZWNrXHJcbiAgICAgICAgaWYgKGJ5dGVzID09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbGVuZ3RoID0gYnl0ZXMubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbGVuZ3RoTWludXNCbG9jayA9IGxlbmd0aCAtIHRoaXMuYmxvY2tTaXplO1xyXG4gICAgICAgIHZhciBuID0gMDtcclxuICAgICAgICAvLyBVc2luZyBsb2NhbCBpbnN0ZWFkIG9mIG1lbWJlciB2YXJpYWJsZXMgZ2l2ZXMgfjUlIHNwZWVkdXAgb24gRmlyZWZveCAxNi5cclxuICAgICAgICB2YXIgYnVmID0gdGhpcy5idWZfO1xyXG4gICAgICAgIHZhciBpbmJ1ZiA9IHRoaXMuaW5idWZfO1xyXG4gICAgICAgIC8vIFRoZSBvdXRlciB3aGlsZSBsb29wIHNob3VsZCBleGVjdXRlIGF0IG1vc3QgdHdpY2UuXHJcbiAgICAgICAgd2hpbGUgKG4gPCBsZW5ndGgpIHtcclxuICAgICAgICAgICAgLy8gV2hlbiB3ZSBoYXZlIG5vIGRhdGEgaW4gdGhlIGJsb2NrIHRvIHRvcCB1cCwgd2UgY2FuIGRpcmVjdGx5IHByb2Nlc3MgdGhlXHJcbiAgICAgICAgICAgIC8vIGlucHV0IGJ1ZmZlciAoYXNzdW1pbmcgaXQgY29udGFpbnMgc3VmZmljaWVudCBkYXRhKS4gVGhpcyBnaXZlcyB+MjUlXHJcbiAgICAgICAgICAgIC8vIHNwZWVkdXAgb24gQ2hyb21lIDIzIGFuZCB+MTUlIHNwZWVkdXAgb24gRmlyZWZveCAxNiwgYnV0IHJlcXVpcmVzIHRoYXRcclxuICAgICAgICAgICAgLy8gdGhlIGRhdGEgaXMgcHJvdmlkZWQgaW4gbGFyZ2UgY2h1bmtzIChvciBpbiBtdWx0aXBsZXMgb2YgNjQgYnl0ZXMpLlxyXG4gICAgICAgICAgICBpZiAoaW5idWYgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChuIDw9IGxlbmd0aE1pbnVzQmxvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXByZXNzXyhieXRlcywgbik7XHJcbiAgICAgICAgICAgICAgICAgICAgbiArPSB0aGlzLmJsb2NrU2l6ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGJ5dGVzID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKG4gPCBsZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBidWZbaW5idWZdID0gYnl0ZXMuY2hhckNvZGVBdChuKTtcclxuICAgICAgICAgICAgICAgICAgICArK2luYnVmO1xyXG4gICAgICAgICAgICAgICAgICAgICsrbjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5idWYgPT09IHRoaXMuYmxvY2tTaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcHJlc3NfKGJ1Zik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluYnVmID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSnVtcCB0byB0aGUgb3V0ZXIgbG9vcCBzbyB3ZSB1c2UgdGhlIGZ1bGwtYmxvY2sgb3B0aW1pemF0aW9uLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAobiA8IGxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZltpbmJ1Zl0gPSBieXRlc1tuXTtcclxuICAgICAgICAgICAgICAgICAgICArK2luYnVmO1xyXG4gICAgICAgICAgICAgICAgICAgICsrbjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5idWYgPT09IHRoaXMuYmxvY2tTaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcHJlc3NfKGJ1Zik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluYnVmID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSnVtcCB0byB0aGUgb3V0ZXIgbG9vcCBzbyB3ZSB1c2UgdGhlIGZ1bGwtYmxvY2sgb3B0aW1pemF0aW9uLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbmJ1Zl8gPSBpbmJ1ZjtcclxuICAgICAgICB0aGlzLnRvdGFsXyArPSBsZW5ndGg7XHJcbiAgICB9O1xyXG4gICAgLyoqIEBvdmVycmlkZSAqL1xyXG4gICAgU2hhMS5wcm90b3R5cGUuZGlnZXN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBkaWdlc3QgPSBbXTtcclxuICAgICAgICB2YXIgdG90YWxCaXRzID0gdGhpcy50b3RhbF8gKiA4O1xyXG4gICAgICAgIC8vIEFkZCBwYWQgMHg4MCAweDAwKi5cclxuICAgICAgICBpZiAodGhpcy5pbmJ1Zl8gPCA1Nikge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSh0aGlzLnBhZF8sIDU2IC0gdGhpcy5pbmJ1Zl8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUodGhpcy5wYWRfLCB0aGlzLmJsb2NrU2l6ZSAtICh0aGlzLmluYnVmXyAtIDU2KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEFkZCAjIGJpdHMuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMuYmxvY2tTaXplIC0gMTsgaSA+PSA1NjsgaS0tKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnVmX1tpXSA9IHRvdGFsQml0cyAmIDI1NTtcclxuICAgICAgICAgICAgdG90YWxCaXRzIC89IDI1NjsgLy8gRG9uJ3QgdXNlIGJpdC1zaGlmdGluZyBoZXJlIVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNvbXByZXNzXyh0aGlzLmJ1Zl8pO1xyXG4gICAgICAgIHZhciBuID0gMDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDU7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMjQ7IGogPj0gMDsgaiAtPSA4KSB7XHJcbiAgICAgICAgICAgICAgICBkaWdlc3Rbbl0gPSAodGhpcy5jaGFpbl9baV0gPj4gaikgJiAyNTU7XHJcbiAgICAgICAgICAgICAgICArK247XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRpZ2VzdDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gU2hhMTtcclxufSgpKTtcblxuLyoqXHJcbiAqIEhlbHBlciB0byBtYWtlIGEgU3Vic2NyaWJlIGZ1bmN0aW9uIChqdXN0IGxpa2UgUHJvbWlzZSBoZWxwcyBtYWtlIGFcclxuICogVGhlbmFibGUpLlxyXG4gKlxyXG4gKiBAcGFyYW0gZXhlY3V0b3IgRnVuY3Rpb24gd2hpY2ggY2FuIG1ha2UgY2FsbHMgdG8gYSBzaW5nbGUgT2JzZXJ2ZXJcclxuICogICAgIGFzIGEgcHJveHkuXHJcbiAqIEBwYXJhbSBvbk5vT2JzZXJ2ZXJzIENhbGxiYWNrIHdoZW4gY291bnQgb2YgT2JzZXJ2ZXJzIGdvZXMgdG8gemVyby5cclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZVN1YnNjcmliZShleGVjdXRvciwgb25Ob09ic2VydmVycykge1xyXG4gICAgdmFyIHByb3h5ID0gbmV3IE9ic2VydmVyUHJveHkoZXhlY3V0b3IsIG9uTm9PYnNlcnZlcnMpO1xyXG4gICAgcmV0dXJuIHByb3h5LnN1YnNjcmliZS5iaW5kKHByb3h5KTtcclxufVxyXG4vKipcclxuICogSW1wbGVtZW50IGZhbi1vdXQgZm9yIGFueSBudW1iZXIgb2YgT2JzZXJ2ZXJzIGF0dGFjaGVkIHZpYSBhIHN1YnNjcmliZVxyXG4gKiBmdW5jdGlvbi5cclxuICovXHJcbnZhciBPYnNlcnZlclByb3h5ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gZXhlY3V0b3IgRnVuY3Rpb24gd2hpY2ggY2FuIG1ha2UgY2FsbHMgdG8gYSBzaW5nbGUgT2JzZXJ2ZXJcclxuICAgICAqICAgICBhcyBhIHByb3h5LlxyXG4gICAgICogQHBhcmFtIG9uTm9PYnNlcnZlcnMgQ2FsbGJhY2sgd2hlbiBjb3VudCBvZiBPYnNlcnZlcnMgZ29lcyB0byB6ZXJvLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBPYnNlcnZlclByb3h5KGV4ZWN1dG9yLCBvbk5vT2JzZXJ2ZXJzKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLm9ic2VydmVycyA9IFtdO1xyXG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmVzID0gW107XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlckNvdW50ID0gMDtcclxuICAgICAgICAvLyBNaWNyby10YXNrIHNjaGVkdWxpbmcgYnkgY2FsbGluZyB0YXNrLnRoZW4oKS5cclxuICAgICAgICB0aGlzLnRhc2sgPSBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICB0aGlzLmZpbmFsaXplZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMub25Ob09ic2VydmVycyA9IG9uTm9PYnNlcnZlcnM7XHJcbiAgICAgICAgLy8gQ2FsbCB0aGUgZXhlY3V0b3IgYXN5bmNocm9ub3VzbHkgc28gc3Vic2NyaWJlcnMgdGhhdCBhcmUgY2FsbGVkXHJcbiAgICAgICAgLy8gc3luY2hyb25vdXNseSBhZnRlciB0aGUgY3JlYXRpb24gb2YgdGhlIHN1YnNjcmliZSBmdW5jdGlvblxyXG4gICAgICAgIC8vIGNhbiBzdGlsbCByZWNlaXZlIHRoZSB2ZXJ5IGZpcnN0IHZhbHVlIGdlbmVyYXRlZCBpbiB0aGUgZXhlY3V0b3IuXHJcbiAgICAgICAgdGhpcy50YXNrXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZXhlY3V0b3IoX3RoaXMpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBfdGhpcy5lcnJvcihlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIE9ic2VydmVyUHJveHkucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLmZvckVhY2hPYnNlcnZlcihmdW5jdGlvbiAob2JzZXJ2ZXIpIHtcclxuICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgT2JzZXJ2ZXJQcm94eS5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICB0aGlzLmZvckVhY2hPYnNlcnZlcihmdW5jdGlvbiAob2JzZXJ2ZXIpIHtcclxuICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY2xvc2UoZXJyb3IpO1xyXG4gICAgfTtcclxuICAgIE9ic2VydmVyUHJveHkucHJvdG90eXBlLmNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuZm9yRWFjaE9ic2VydmVyKGZ1bmN0aW9uIChvYnNlcnZlcikge1xyXG4gICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFN1YnNjcmliZSBmdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGFkZCBhbiBPYnNlcnZlciB0byB0aGUgZmFuLW91dCBsaXN0LlxyXG4gICAgICpcclxuICAgICAqIC0gV2UgcmVxdWlyZSB0aGF0IG5vIGV2ZW50IGlzIHNlbnQgdG8gYSBzdWJzY3JpYmVyIHN5Y2hyb25vdXNseSB0byB0aGVpclxyXG4gICAgICogICBjYWxsIHRvIHN1YnNjcmliZSgpLlxyXG4gICAgICovXHJcbiAgICBPYnNlcnZlclByb3h5LnByb3RvdHlwZS5zdWJzY3JpYmUgPSBmdW5jdGlvbiAobmV4dE9yT2JzZXJ2ZXIsIGVycm9yLCBjb21wbGV0ZSkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIG9ic2VydmVyO1xyXG4gICAgICAgIGlmIChuZXh0T3JPYnNlcnZlciA9PT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgIGVycm9yID09PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgY29tcGxldGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgT2JzZXJ2ZXIuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEFzc2VtYmxlIGFuIE9ic2VydmVyIG9iamVjdCB3aGVuIHBhc3NlZCBhcyBjYWxsYmFjayBmdW5jdGlvbnMuXHJcbiAgICAgICAgaWYgKGltcGxlbWVudHNBbnlNZXRob2RzKG5leHRPck9ic2VydmVyLCBbXHJcbiAgICAgICAgICAgICduZXh0JyxcclxuICAgICAgICAgICAgJ2Vycm9yJyxcclxuICAgICAgICAgICAgJ2NvbXBsZXRlJ1xyXG4gICAgICAgIF0pKSB7XHJcbiAgICAgICAgICAgIG9ic2VydmVyID0gbmV4dE9yT2JzZXJ2ZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBvYnNlcnZlciA9IHtcclxuICAgICAgICAgICAgICAgIG5leHQ6IG5leHRPck9ic2VydmVyLFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLFxyXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IGNvbXBsZXRlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvYnNlcnZlci5uZXh0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCA9IG5vb3A7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvYnNlcnZlci5lcnJvciA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG9ic2VydmVyLmVycm9yID0gbm9vcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9ic2VydmVyLmNvbXBsZXRlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUgPSBub29wO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdW5zdWIgPSB0aGlzLnVuc3Vic2NyaWJlT25lLmJpbmQodGhpcywgdGhpcy5vYnNlcnZlcnMubGVuZ3RoKTtcclxuICAgICAgICAvLyBBdHRlbXB0IHRvIHN1YnNjcmliZSB0byBhIHRlcm1pbmF0ZWQgT2JzZXJ2YWJsZSAtIHdlXHJcbiAgICAgICAgLy8ganVzdCByZXNwb25kIHRvIHRoZSBPYnNlcnZlciB3aXRoIHRoZSBmaW5hbCBlcnJvciBvciBjb21wbGV0ZVxyXG4gICAgICAgIC8vIGV2ZW50LlxyXG4gICAgICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xyXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWZsb2F0aW5nLXByb21pc2VzXHJcbiAgICAgICAgICAgIHRoaXMudGFzay50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKF90aGlzLmZpbmFsRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoX3RoaXMuZmluYWxFcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbm90aGluZ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlcnMucHVzaChvYnNlcnZlcik7XHJcbiAgICAgICAgcmV0dXJuIHVuc3ViO1xyXG4gICAgfTtcclxuICAgIC8vIFVuc3Vic2NyaWJlIGlzIHN5bmNocm9ub3VzIC0gd2UgZ3VhcmFudGVlIHRoYXQgbm8gZXZlbnRzIGFyZSBzZW50IHRvXHJcbiAgICAvLyBhbnkgdW5zdWJzY3JpYmVkIE9ic2VydmVyLlxyXG4gICAgT2JzZXJ2ZXJQcm94eS5wcm90b3R5cGUudW5zdWJzY3JpYmVPbmUgPSBmdW5jdGlvbiAoaSkge1xyXG4gICAgICAgIGlmICh0aGlzLm9ic2VydmVycyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMub2JzZXJ2ZXJzW2ldID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZWxldGUgdGhpcy5vYnNlcnZlcnNbaV07XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlckNvdW50IC09IDE7XHJcbiAgICAgICAgaWYgKHRoaXMub2JzZXJ2ZXJDb3VudCA9PT0gMCAmJiB0aGlzLm9uTm9PYnNlcnZlcnMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uTm9PYnNlcnZlcnModGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIE9ic2VydmVyUHJveHkucHJvdG90eXBlLmZvckVhY2hPYnNlcnZlciA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xyXG4gICAgICAgICAgICAvLyBBbHJlYWR5IGNsb3NlZCBieSBwcmV2aW91cyBldmVudC4uLi5qdXN0IGVhdCB0aGUgYWRkaXRpb25hbCB2YWx1ZXMuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gU2luY2Ugc2VuZE9uZSBjYWxscyBhc3luY2hyb25vdXNseSAtIHRoZXJlIGlzIG5vIGNoYW5jZSB0aGF0XHJcbiAgICAgICAgLy8gdGhpcy5vYnNlcnZlcnMgd2lsbCBiZWNvbWUgdW5kZWZpbmVkLlxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5vYnNlcnZlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5zZW5kT25lKGksIGZuKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLy8gQ2FsbCB0aGUgT2JzZXJ2ZXIgdmlhIG9uZSBvZiBpdCdzIGNhbGxiYWNrIGZ1bmN0aW9uLiBXZSBhcmUgY2FyZWZ1bCB0b1xyXG4gICAgLy8gY29uZmlybSB0aGF0IHRoZSBvYnNlcnZlIGhhcyBub3QgYmVlbiB1bnN1YnNjcmliZWQgc2luY2UgdGhpcyBhc3luY2hyb25vdXNcclxuICAgIC8vIGZ1bmN0aW9uIGhhZCBiZWVuIHF1ZXVlZC5cclxuICAgIE9ic2VydmVyUHJveHkucHJvdG90eXBlLnNlbmRPbmUgPSBmdW5jdGlvbiAoaSwgZm4pIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIC8vIEV4ZWN1dGUgdGhlIGNhbGxiYWNrIGFzeW5jaHJvbm91c2x5XHJcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1mbG9hdGluZy1wcm9taXNlc1xyXG4gICAgICAgIHRoaXMudGFzay50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKF90aGlzLm9ic2VydmVycyAhPT0gdW5kZWZpbmVkICYmIF90aGlzLm9ic2VydmVyc1tpXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZuKF90aGlzLm9ic2VydmVyc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElnbm9yZSBleGNlcHRpb25zIHJhaXNlZCBpbiBPYnNlcnZlcnMgb3IgbWlzc2luZyBtZXRob2RzIG9mIGFuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gT2JzZXJ2ZXIuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTG9nIGVycm9yIHRvIGNvbnNvbGUuIGIvMzE0MDQ4MDZcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBPYnNlcnZlclByb3h5LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZmluYWxpemVkID0gdHJ1ZTtcclxuICAgICAgICBpZiAoZXJyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5maW5hbEVycm9yID0gZXJyO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBQcm94eSBpcyBubyBsb25nZXIgbmVlZGVkIC0gZ2FyYmFnZSBjb2xsZWN0IHJlZmVyZW5jZXNcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWZsb2F0aW5nLXByb21pc2VzXHJcbiAgICAgICAgdGhpcy50YXNrLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBfdGhpcy5vYnNlcnZlcnMgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIF90aGlzLm9uTm9PYnNlcnZlcnMgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIE9ic2VydmVyUHJveHk7XHJcbn0oKSk7XHJcbi8qKiBUdXJuIHN5bmNocm9ub3VzIGZ1bmN0aW9uIGludG8gb25lIGNhbGxlZCBhc3luY2hyb25vdXNseS4gKi9cclxuZnVuY3Rpb24gYXN5bmMoZm4sIG9uRXJyb3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFyZ3MgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSh0cnVlKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZuLmFwcGx5KHZvaWQgMCwgYXJncyk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICBpZiAob25FcnJvcikge1xyXG4gICAgICAgICAgICAgICAgb25FcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSBvYmplY3QgcGFzc2VkIGluIGltcGxlbWVudHMgYW55IG9mIHRoZSBuYW1lZCBtZXRob2RzLlxyXG4gKi9cclxuZnVuY3Rpb24gaW1wbGVtZW50c0FueU1ldGhvZHMob2JqLCBtZXRob2RzKSB7XHJcbiAgICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcgfHwgb2JqID09PSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgZm9yICh2YXIgX2kgPSAwLCBtZXRob2RzXzEgPSBtZXRob2RzOyBfaSA8IG1ldGhvZHNfMS5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICB2YXIgbWV0aG9kID0gbWV0aG9kc18xW19pXTtcclxuICAgICAgICBpZiAobWV0aG9kIGluIG9iaiAmJiB0eXBlb2Ygb2JqW21ldGhvZF0gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcbmZ1bmN0aW9uIG5vb3AoKSB7XHJcbiAgICAvLyBkbyBub3RoaW5nXHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIENoZWNrIHRvIG1ha2Ugc3VyZSB0aGUgYXBwcm9wcmlhdGUgbnVtYmVyIG9mIGFyZ3VtZW50cyBhcmUgcHJvdmlkZWQgZm9yIGEgcHVibGljIGZ1bmN0aW9uLlxyXG4gKiBUaHJvd3MgYW4gZXJyb3IgaWYgaXQgZmFpbHMuXHJcbiAqXHJcbiAqIEBwYXJhbSBmbk5hbWUgVGhlIGZ1bmN0aW9uIG5hbWVcclxuICogQHBhcmFtIG1pbkNvdW50IFRoZSBtaW5pbXVtIG51bWJlciBvZiBhcmd1bWVudHMgdG8gYWxsb3cgZm9yIHRoZSBmdW5jdGlvbiBjYWxsXHJcbiAqIEBwYXJhbSBtYXhDb3VudCBUaGUgbWF4aW11bSBudW1iZXIgb2YgYXJndW1lbnQgdG8gYWxsb3cgZm9yIHRoZSBmdW5jdGlvbiBjYWxsXHJcbiAqIEBwYXJhbSBhcmdDb3VudCBUaGUgYWN0dWFsIG51bWJlciBvZiBhcmd1bWVudHMgcHJvdmlkZWQuXHJcbiAqL1xyXG52YXIgdmFsaWRhdGVBcmdDb3VudCA9IGZ1bmN0aW9uIChmbk5hbWUsIG1pbkNvdW50LCBtYXhDb3VudCwgYXJnQ291bnQpIHtcclxuICAgIHZhciBhcmdFcnJvcjtcclxuICAgIGlmIChhcmdDb3VudCA8IG1pbkNvdW50KSB7XHJcbiAgICAgICAgYXJnRXJyb3IgPSAnYXQgbGVhc3QgJyArIG1pbkNvdW50O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoYXJnQ291bnQgPiBtYXhDb3VudCkge1xyXG4gICAgICAgIGFyZ0Vycm9yID0gbWF4Q291bnQgPT09IDAgPyAnbm9uZScgOiAnbm8gbW9yZSB0aGFuICcgKyBtYXhDb3VudDtcclxuICAgIH1cclxuICAgIGlmIChhcmdFcnJvcikge1xyXG4gICAgICAgIHZhciBlcnJvciA9IGZuTmFtZSArXHJcbiAgICAgICAgICAgICcgZmFpbGVkOiBXYXMgY2FsbGVkIHdpdGggJyArXHJcbiAgICAgICAgICAgIGFyZ0NvdW50ICtcclxuICAgICAgICAgICAgKGFyZ0NvdW50ID09PSAxID8gJyBhcmd1bWVudC4nIDogJyBhcmd1bWVudHMuJykgK1xyXG4gICAgICAgICAgICAnIEV4cGVjdHMgJyArXHJcbiAgICAgICAgICAgIGFyZ0Vycm9yICtcclxuICAgICAgICAgICAgJy4nO1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvcik7XHJcbiAgICB9XHJcbn07XHJcbi8qKlxyXG4gKiBHZW5lcmF0ZXMgYSBzdHJpbmcgdG8gcHJlZml4IGFuIGVycm9yIG1lc3NhZ2UgYWJvdXQgZmFpbGVkIGFyZ3VtZW50IHZhbGlkYXRpb25cclxuICpcclxuICogQHBhcmFtIGZuTmFtZSBUaGUgZnVuY3Rpb24gbmFtZVxyXG4gKiBAcGFyYW0gYXJndW1lbnROdW1iZXIgVGhlIGluZGV4IG9mIHRoZSBhcmd1bWVudFxyXG4gKiBAcGFyYW0gb3B0aW9uYWwgV2hldGhlciBvciBub3QgdGhlIGFyZ3VtZW50IGlzIG9wdGlvbmFsXHJcbiAqIEByZXR1cm4gVGhlIHByZWZpeCB0byBhZGQgdG8gdGhlIGVycm9yIHRocm93biBmb3IgdmFsaWRhdGlvbi5cclxuICovXHJcbmZ1bmN0aW9uIGVycm9yUHJlZml4KGZuTmFtZSwgYXJndW1lbnROdW1iZXIsIG9wdGlvbmFsKSB7XHJcbiAgICB2YXIgYXJnTmFtZSA9ICcnO1xyXG4gICAgc3dpdGNoIChhcmd1bWVudE51bWJlcikge1xyXG4gICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgYXJnTmFtZSA9IG9wdGlvbmFsID8gJ2ZpcnN0JyA6ICdGaXJzdCc7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgYXJnTmFtZSA9IG9wdGlvbmFsID8gJ3NlY29uZCcgOiAnU2Vjb25kJztcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICBhcmdOYW1lID0gb3B0aW9uYWwgPyAndGhpcmQnIDogJ1RoaXJkJztcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICBhcmdOYW1lID0gb3B0aW9uYWwgPyAnZm91cnRoJyA6ICdGb3VydGgnO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Vycm9yUHJlZml4IGNhbGxlZCB3aXRoIGFyZ3VtZW50TnVtYmVyID4gNC4gIE5lZWQgdG8gdXBkYXRlIGl0PycpO1xyXG4gICAgfVxyXG4gICAgdmFyIGVycm9yID0gZm5OYW1lICsgJyBmYWlsZWQ6ICc7XHJcbiAgICBlcnJvciArPSBhcmdOYW1lICsgJyBhcmd1bWVudCAnO1xyXG4gICAgcmV0dXJuIGVycm9yO1xyXG59XHJcbi8qKlxyXG4gKiBAcGFyYW0gZm5OYW1lXHJcbiAqIEBwYXJhbSBhcmd1bWVudE51bWJlclxyXG4gKiBAcGFyYW0gbmFtZXNwYWNlXHJcbiAqIEBwYXJhbSBvcHRpb25hbFxyXG4gKi9cclxuZnVuY3Rpb24gdmFsaWRhdGVOYW1lc3BhY2UoZm5OYW1lLCBhcmd1bWVudE51bWJlciwgbmFtZXNwYWNlLCBvcHRpb25hbCkge1xyXG4gICAgaWYgKG9wdGlvbmFsICYmICFuYW1lc3BhY2UpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIG5hbWVzcGFjZSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAvL1RPRE86IEkgc2hvdWxkIGRvIG1vcmUgdmFsaWRhdGlvbiBoZXJlLiBXZSBvbmx5IGFsbG93IGNlcnRhaW4gY2hhcnMgaW4gbmFtZXNwYWNlcy5cclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JQcmVmaXgoZm5OYW1lLCBhcmd1bWVudE51bWJlciwgb3B0aW9uYWwpICtcclxuICAgICAgICAgICAgJ211c3QgYmUgYSB2YWxpZCBmaXJlYmFzZSBuYW1lc3BhY2UuJyk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdmFsaWRhdGVDYWxsYmFjayhmbk5hbWUsIGFyZ3VtZW50TnVtYmVyLCBjYWxsYmFjaywgb3B0aW9uYWwpIHtcclxuICAgIGlmIChvcHRpb25hbCAmJiAhY2FsbGJhY2spIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yUHJlZml4KGZuTmFtZSwgYXJndW1lbnROdW1iZXIsIG9wdGlvbmFsKSArXHJcbiAgICAgICAgICAgICdtdXN0IGJlIGEgdmFsaWQgZnVuY3Rpb24uJyk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdmFsaWRhdGVDb250ZXh0T2JqZWN0KGZuTmFtZSwgYXJndW1lbnROdW1iZXIsIGNvbnRleHQsIG9wdGlvbmFsKSB7XHJcbiAgICBpZiAob3B0aW9uYWwgJiYgIWNvbnRleHQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIGNvbnRleHQgIT09ICdvYmplY3QnIHx8IGNvbnRleHQgPT09IG51bGwpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JQcmVmaXgoZm5OYW1lLCBhcmd1bWVudE51bWJlciwgb3B0aW9uYWwpICtcclxuICAgICAgICAgICAgJ211c3QgYmUgYSB2YWxpZCBjb250ZXh0IG9iamVjdC4nKTtcclxuICAgIH1cclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vLyBDb2RlIG9yaWdpbmFsbHkgY2FtZSBmcm9tIGdvb2cuY3J5cHQuc3RyaW5nVG9VdGY4Qnl0ZUFycmF5LCBidXQgZm9yIHNvbWUgcmVhc29uIHRoZXlcclxuLy8gYXV0b21hdGljYWxseSByZXBsYWNlZCAnXFxyXFxuJyB3aXRoICdcXG4nLCBhbmQgdGhleSBkaWRuJ3QgaGFuZGxlIHN1cnJvZ2F0ZSBwYWlycyxcclxuLy8gc28gaXQncyBiZWVuIG1vZGlmaWVkLlxyXG4vLyBOb3RlIHRoYXQgbm90IGFsbCBVbmljb2RlIGNoYXJhY3RlcnMgYXBwZWFyIGFzIHNpbmdsZSBjaGFyYWN0ZXJzIGluIEphdmFTY3JpcHQgc3RyaW5ncy5cclxuLy8gZnJvbUNoYXJDb2RlIHJldHVybnMgdGhlIFVURi0xNiBlbmNvZGluZyBvZiBhIGNoYXJhY3RlciAtIHNvIHNvbWUgVW5pY29kZSBjaGFyYWN0ZXJzXHJcbi8vIHVzZSAyIGNoYXJhY3RlcnMgaW4gSmF2YXNjcmlwdC4gIEFsbCA0LWJ5dGUgVVRGLTggY2hhcmFjdGVycyBiZWdpbiB3aXRoIGEgZmlyc3RcclxuLy8gY2hhcmFjdGVyIGluIHRoZSByYW5nZSAweEQ4MDAgLSAweERCRkYgKHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgYSBzby1jYWxsZWQgc3Vycm9nYXRlXHJcbi8vIHBhaXIpLlxyXG4vLyBTZWUgaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzUuMS8jc2VjLTE1LjEuM1xyXG4vKipcclxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxyXG4gKiBAcmV0dXJuIHtBcnJheX1cclxuICovXHJcbnZhciBzdHJpbmdUb0J5dGVBcnJheSQxID0gZnVuY3Rpb24gKHN0cikge1xyXG4gICAgdmFyIG91dCA9IFtdO1xyXG4gICAgdmFyIHAgPSAwO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgYyA9IHN0ci5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgIC8vIElzIHRoaXMgdGhlIGxlYWQgc3Vycm9nYXRlIGluIGEgc3Vycm9nYXRlIHBhaXI/XHJcbiAgICAgICAgaWYgKGMgPj0gMHhkODAwICYmIGMgPD0gMHhkYmZmKSB7XHJcbiAgICAgICAgICAgIHZhciBoaWdoID0gYyAtIDB4ZDgwMDsgLy8gdGhlIGhpZ2ggMTAgYml0cy5cclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICBhc3NlcnQoaSA8IHN0ci5sZW5ndGgsICdTdXJyb2dhdGUgcGFpciBtaXNzaW5nIHRyYWlsIHN1cnJvZ2F0ZS4nKTtcclxuICAgICAgICAgICAgdmFyIGxvdyA9IHN0ci5jaGFyQ29kZUF0KGkpIC0gMHhkYzAwOyAvLyB0aGUgbG93IDEwIGJpdHMuXHJcbiAgICAgICAgICAgIGMgPSAweDEwMDAwICsgKGhpZ2ggPDwgMTApICsgbG93O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYyA8IDEyOCkge1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IGM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMgPCAyMDQ4KSB7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgPj4gNikgfCAxOTI7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMgPCA2NTUzNikge1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjID4+IDEyKSB8IDIyNDtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoKGMgPj4gNikgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjID4+IDE4KSB8IDI0MDtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoKGMgPj4gMTIpICYgNjMpIHwgMTI4O1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9ICgoYyA+PiA2KSAmIDYzKSB8IDEyODtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyAmIDYzKSB8IDEyODtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0O1xyXG59O1xyXG4vKipcclxuICogQ2FsY3VsYXRlIGxlbmd0aCB3aXRob3V0IGFjdHVhbGx5IGNvbnZlcnRpbmc7IHVzZWZ1bCBmb3IgZG9pbmcgY2hlYXBlciB2YWxpZGF0aW9uLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXHJcbiAqIEByZXR1cm4ge251bWJlcn1cclxuICovXHJcbnZhciBzdHJpbmdMZW5ndGggPSBmdW5jdGlvbiAoc3RyKSB7XHJcbiAgICB2YXIgcCA9IDA7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBjID0gc3RyLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgaWYgKGMgPCAxMjgpIHtcclxuICAgICAgICAgICAgcCsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjIDwgMjA0OCkge1xyXG4gICAgICAgICAgICBwICs9IDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMgPj0gMHhkODAwICYmIGMgPD0gMHhkYmZmKSB7XHJcbiAgICAgICAgICAgIC8vIExlYWQgc3Vycm9nYXRlIG9mIGEgc3Vycm9nYXRlIHBhaXIuICBUaGUgcGFpciB0b2dldGhlciB3aWxsIHRha2UgNCBieXRlcyB0byByZXByZXNlbnQuXHJcbiAgICAgICAgICAgIHAgKz0gNDtcclxuICAgICAgICAgICAgaSsrOyAvLyBza2lwIHRyYWlsIHN1cnJvZ2F0ZS5cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHAgKz0gMztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcDtcclxufTtcblxuZXhwb3J0cy5DT05TVEFOVFMgPSBDT05TVEFOVFM7XG5leHBvcnRzLkRlZmVycmVkID0gRGVmZXJyZWQ7XG5leHBvcnRzLkVycm9yRmFjdG9yeSA9IEVycm9yRmFjdG9yeTtcbmV4cG9ydHMuRmlyZWJhc2VFcnJvciA9IEZpcmViYXNlRXJyb3I7XG5leHBvcnRzLlNoYTEgPSBTaGExO1xuZXhwb3J0cy5hc3NlcnQgPSBhc3NlcnQ7XG5leHBvcnRzLmFzc2VydGlvbkVycm9yID0gYXNzZXJ0aW9uRXJyb3I7XG5leHBvcnRzLmFzeW5jID0gYXN5bmM7XG5leHBvcnRzLmJhc2U2NCA9IGJhc2U2NDtcbmV4cG9ydHMuYmFzZTY0RGVjb2RlID0gYmFzZTY0RGVjb2RlO1xuZXhwb3J0cy5iYXNlNjRFbmNvZGUgPSBiYXNlNjRFbmNvZGU7XG5leHBvcnRzLmNvbnRhaW5zID0gY29udGFpbnM7XG5leHBvcnRzLmNyZWF0ZVN1YnNjcmliZSA9IGNyZWF0ZVN1YnNjcmliZTtcbmV4cG9ydHMuZGVjb2RlID0gZGVjb2RlO1xuZXhwb3J0cy5kZWVwQ29weSA9IGRlZXBDb3B5O1xuZXhwb3J0cy5kZWVwRXh0ZW5kID0gZGVlcEV4dGVuZDtcbmV4cG9ydHMuZXJyb3JQcmVmaXggPSBlcnJvclByZWZpeDtcbmV4cG9ydHMuZ2V0VUEgPSBnZXRVQTtcbmV4cG9ydHMuaXNBZG1pbiA9IGlzQWRtaW47XG5leHBvcnRzLmlzQnJvd3NlciA9IGlzQnJvd3NlcjtcbmV4cG9ydHMuaXNCcm93c2VyRXh0ZW5zaW9uID0gaXNCcm93c2VyRXh0ZW5zaW9uO1xuZXhwb3J0cy5pc0VsZWN0cm9uID0gaXNFbGVjdHJvbjtcbmV4cG9ydHMuaXNFbXB0eSA9IGlzRW1wdHk7XG5leHBvcnRzLmlzSUUgPSBpc0lFO1xuZXhwb3J0cy5pc01vYmlsZUNvcmRvdmEgPSBpc01vYmlsZUNvcmRvdmE7XG5leHBvcnRzLmlzTm9kZSA9IGlzTm9kZTtcbmV4cG9ydHMuaXNOb2RlU2RrID0gaXNOb2RlU2RrO1xuZXhwb3J0cy5pc1JlYWN0TmF0aXZlID0gaXNSZWFjdE5hdGl2ZTtcbmV4cG9ydHMuaXNTYWZhcmkgPSBpc1NhZmFyaTtcbmV4cG9ydHMuaXNVV1AgPSBpc1VXUDtcbmV4cG9ydHMuaXNWYWxpZEZvcm1hdCA9IGlzVmFsaWRGb3JtYXQ7XG5leHBvcnRzLmlzVmFsaWRUaW1lc3RhbXAgPSBpc1ZhbGlkVGltZXN0YW1wO1xuZXhwb3J0cy5pc3N1ZWRBdFRpbWUgPSBpc3N1ZWRBdFRpbWU7XG5leHBvcnRzLmpzb25FdmFsID0ganNvbkV2YWw7XG5leHBvcnRzLm1hcCA9IG1hcDtcbmV4cG9ydHMucXVlcnlzdHJpbmcgPSBxdWVyeXN0cmluZztcbmV4cG9ydHMucXVlcnlzdHJpbmdEZWNvZGUgPSBxdWVyeXN0cmluZ0RlY29kZTtcbmV4cG9ydHMuc2FmZUdldCA9IHNhZmVHZXQ7XG5leHBvcnRzLnN0cmluZ0xlbmd0aCA9IHN0cmluZ0xlbmd0aDtcbmV4cG9ydHMuc3RyaW5nVG9CeXRlQXJyYXkgPSBzdHJpbmdUb0J5dGVBcnJheSQxO1xuZXhwb3J0cy5zdHJpbmdpZnkgPSBzdHJpbmdpZnk7XG5leHBvcnRzLnZhbGlkYXRlQXJnQ291bnQgPSB2YWxpZGF0ZUFyZ0NvdW50O1xuZXhwb3J0cy52YWxpZGF0ZUNhbGxiYWNrID0gdmFsaWRhdGVDYWxsYmFjaztcbmV4cG9ydHMudmFsaWRhdGVDb250ZXh0T2JqZWN0ID0gdmFsaWRhdGVDb250ZXh0T2JqZWN0O1xuZXhwb3J0cy52YWxpZGF0ZU5hbWVzcGFjZSA9IHZhbGlkYXRlTmFtZXNwYWNlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguY2pzLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG52YXIgdHNsaWIgPSByZXF1aXJlKCd0c2xpYicpO1xudmFyIHV0aWwgPSByZXF1aXJlKCdAZmlyZWJhc2UvdXRpbCcpO1xuXG4vKipcclxuICogQ29tcG9uZW50IGZvciBzZXJ2aWNlIG5hbWUgVCwgZS5nLiBgYXV0aGAsIGBhdXRoLWludGVybmFsYFxyXG4gKi9cclxudmFyIENvbXBvbmVudCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBuYW1lIFRoZSBwdWJsaWMgc2VydmljZSBuYW1lLCBlLmcuIGFwcCwgYXV0aCwgZmlyZXN0b3JlLCBkYXRhYmFzZVxyXG4gICAgICogQHBhcmFtIGluc3RhbmNlRmFjdG9yeSBTZXJ2aWNlIGZhY3RvcnkgcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRoZSBwdWJsaWMgaW50ZXJmYWNlXHJcbiAgICAgKiBAcGFyYW0gdHlwZSB3aGV0aGVyIHRoZSBzZXJ2aWNlIHByb3ZpZGVkIGJ5IHRoZSBjb21wb25lbnQgaXMgcHVibGljIG9yIHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gQ29tcG9uZW50KG5hbWUsIGluc3RhbmNlRmFjdG9yeSwgdHlwZSkge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZUZhY3RvcnkgPSBpbnN0YW5jZUZhY3Rvcnk7XHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLm11bHRpcGxlSW5zdGFuY2VzID0gZmFsc2U7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUHJvcGVydGllcyB0byBiZSBhZGRlZCB0byB0aGUgc2VydmljZSBuYW1lc3BhY2VcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnNlcnZpY2VQcm9wcyA9IHt9O1xyXG4gICAgICAgIHRoaXMuaW5zdGFudGlhdGlvbk1vZGUgPSBcIkxBWllcIiAvKiBMQVpZICovO1xyXG4gICAgfVxyXG4gICAgQ29tcG9uZW50LnByb3RvdHlwZS5zZXRJbnN0YW50aWF0aW9uTW9kZSA9IGZ1bmN0aW9uIChtb2RlKSB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW50aWF0aW9uTW9kZSA9IG1vZGU7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgQ29tcG9uZW50LnByb3RvdHlwZS5zZXRNdWx0aXBsZUluc3RhbmNlcyA9IGZ1bmN0aW9uIChtdWx0aXBsZUluc3RhbmNlcykge1xyXG4gICAgICAgIHRoaXMubXVsdGlwbGVJbnN0YW5jZXMgPSBtdWx0aXBsZUluc3RhbmNlcztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBDb21wb25lbnQucHJvdG90eXBlLnNldFNlcnZpY2VQcm9wcyA9IGZ1bmN0aW9uIChwcm9wcykge1xyXG4gICAgICAgIHRoaXMuc2VydmljZVByb3BzID0gcHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIENvbXBvbmVudDtcclxufSgpKTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxudmFyIERFRkFVTFRfRU5UUllfTkFNRSA9ICdbREVGQVVMVF0nO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogUHJvdmlkZXIgZm9yIGluc3RhbmNlIGZvciBzZXJ2aWNlIG5hbWUgVCwgZS5nLiAnYXV0aCcsICdhdXRoLWludGVybmFsJ1xyXG4gKiBOYW1lU2VydmljZU1hcHBpbmdbVF0gaXMgYW4gYWxpYXMgZm9yIHRoZSB0eXBlIG9mIHRoZSBpbnN0YW5jZVxyXG4gKi9cclxudmFyIFByb3ZpZGVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gUHJvdmlkZXIobmFtZSwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZXMgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZXNEZWZlcnJlZCA9IG5ldyBNYXAoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIGlkZW50aWZpZXIgQSBwcm92aWRlciBjYW4gcHJvdmlkZSBtdWxpdHBsZSBpbnN0YW5jZXMgb2YgYSBzZXJ2aWNlXHJcbiAgICAgKiBpZiB0aGlzLmNvbXBvbmVudC5tdWx0aXBsZUluc3RhbmNlcyBpcyB0cnVlLlxyXG4gICAgICovXHJcbiAgICBQcm92aWRlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGlkZW50aWZpZXIpIHtcclxuICAgICAgICBpZiAoaWRlbnRpZmllciA9PT0gdm9pZCAwKSB7IGlkZW50aWZpZXIgPSBERUZBVUxUX0VOVFJZX05BTUU7IH1cclxuICAgICAgICAvLyBpZiBtdWx0aXBsZUluc3RhbmNlcyBpcyBub3Qgc3VwcG9ydGVkLCB1c2UgdGhlIGRlZmF1bHQgbmFtZVxyXG4gICAgICAgIHZhciBub3JtYWxpemVkSWRlbnRpZmllciA9IHRoaXMubm9ybWFsaXplSW5zdGFuY2VJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xyXG4gICAgICAgIGlmICghdGhpcy5pbnN0YW5jZXNEZWZlcnJlZC5oYXMobm9ybWFsaXplZElkZW50aWZpZXIpKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9IG5ldyB1dGlsLkRlZmVycmVkKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2VzRGVmZXJyZWQuc2V0KG5vcm1hbGl6ZWRJZGVudGlmaWVyLCBkZWZlcnJlZCk7XHJcbiAgICAgICAgICAgIC8vIElmIHRoZSBzZXJ2aWNlIGluc3RhbmNlIGlzIGF2YWlsYWJsZSwgcmVzb2x2ZSB0aGUgcHJvbWlzZSB3aXRoIGl0IGltbWVkaWF0ZWx5XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSB0aGlzLmdldE9ySW5pdGlhbGl6ZVNlcnZpY2Uobm9ybWFsaXplZElkZW50aWZpZXIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIHdoZW4gdGhlIGluc3RhbmNlIGZhY3RvcnkgdGhyb3dzIGFuIGV4Y2VwdGlvbiBkdXJpbmcgZ2V0KCksIGl0IHNob3VsZCBub3QgY2F1c2VcclxuICAgICAgICAgICAgICAgIC8vIGEgZmF0YWwgZXJyb3IuIFdlIGp1c3QgcmV0dXJuIHRoZSB1bnJlc29sdmVkIHByb21pc2UgaW4gdGhpcyBjYXNlLlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlc0RlZmVycmVkLmdldChub3JtYWxpemVkSWRlbnRpZmllcikucHJvbWlzZTtcclxuICAgIH07XHJcbiAgICBQcm92aWRlci5wcm90b3R5cGUuZ2V0SW1tZWRpYXRlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgX2EgPSB0c2xpYi5fX2Fzc2lnbih7IGlkZW50aWZpZXI6IERFRkFVTFRfRU5UUllfTkFNRSwgb3B0aW9uYWw6IGZhbHNlIH0sIG9wdGlvbnMpLCBpZGVudGlmaWVyID0gX2EuaWRlbnRpZmllciwgb3B0aW9uYWwgPSBfYS5vcHRpb25hbDtcclxuICAgICAgICAvLyBpZiBtdWx0aXBsZUluc3RhbmNlcyBpcyBub3Qgc3VwcG9ydGVkLCB1c2UgdGhlIGRlZmF1bHQgbmFtZVxyXG4gICAgICAgIHZhciBub3JtYWxpemVkSWRlbnRpZmllciA9IHRoaXMubm9ybWFsaXplSW5zdGFuY2VJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IHRoaXMuZ2V0T3JJbml0aWFsaXplU2VydmljZShub3JtYWxpemVkSWRlbnRpZmllcik7XHJcbiAgICAgICAgICAgIGlmICghaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25hbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJTZXJ2aWNlIFwiICsgdGhpcy5uYW1lICsgXCIgaXMgbm90IGF2YWlsYWJsZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25hbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFByb3ZpZGVyLnByb3RvdHlwZS5nZXRDb21wb25lbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50O1xyXG4gICAgfTtcclxuICAgIFByb3ZpZGVyLnByb3RvdHlwZS5zZXRDb21wb25lbnQgPSBmdW5jdGlvbiAoY29tcG9uZW50KSB7XHJcbiAgICAgICAgdmFyIGVfMSwgX2E7XHJcbiAgICAgICAgaWYgKGNvbXBvbmVudC5uYW1lICE9PSB0aGlzLm5hbWUpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJNaXNtYXRjaGluZyBDb21wb25lbnQgXCIgKyBjb21wb25lbnQubmFtZSArIFwiIGZvciBQcm92aWRlciBcIiArIHRoaXMubmFtZSArIFwiLlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiQ29tcG9uZW50IGZvciBcIiArIHRoaXMubmFtZSArIFwiIGhhcyBhbHJlYWR5IGJlZW4gcHJvdmlkZWRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY29tcG9uZW50ID0gY29tcG9uZW50O1xyXG4gICAgICAgIC8vIGlmIHRoZSBzZXJ2aWNlIGlzIGVhZ2VyLCBpbml0aWFsaXplIHRoZSBkZWZhdWx0IGluc3RhbmNlXHJcbiAgICAgICAgaWYgKGlzQ29tcG9uZW50RWFnZXIoY29tcG9uZW50KSkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRPckluaXRpYWxpemVTZXJ2aWNlKERFRkFVTFRfRU5UUllfTkFNRSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIHdoZW4gdGhlIGluc3RhbmNlIGZhY3RvcnkgZm9yIGFuIGVhZ2VyIENvbXBvbmVudCB0aHJvd3MgYW4gZXhjZXB0aW9uIGR1cmluZyB0aGUgZWFnZXJcclxuICAgICAgICAgICAgICAgIC8vIGluaXRpYWxpemF0aW9uLCBpdCBzaG91bGQgbm90IGNhdXNlIGEgZmF0YWwgZXJyb3IuXHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBJbnZlc3RpZ2F0ZSBpZiB3ZSBuZWVkIHRvIG1ha2UgaXQgY29uZmlndXJhYmxlLCBiZWNhdXNlIHNvbWUgY29tcG9uZW50IG1heSB3YW50IHRvIGNhdXNlXHJcbiAgICAgICAgICAgICAgICAvLyBhIGZhdGFsIGVycm9yIGluIHRoaXMgY2FzZT9cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgc2VydmljZSBpbnN0YW5jZXMgZm9yIHRoZSBwZW5kaW5nIHByb21pc2VzIGFuZCByZXNvbHZlIHRoZW1cclxuICAgICAgICAgICAgLy8gTk9URTogaWYgdGhpcy5tdWx0aXBsZUluc3RhbmNlcyBpcyBmYWxzZSwgb25seSB0aGUgZGVmYXVsdCBpbnN0YW5jZSB3aWxsIGJlIGNyZWF0ZWRcclxuICAgICAgICAgICAgLy8gYW5kIGFsbCBwcm9taXNlcyB3aXRoIHJlc29sdmUgd2l0aCBpdCByZWdhcmRsZXNzIG9mIHRoZSBpZGVudGlmaWVyLlxyXG4gICAgICAgICAgICBmb3IgKHZhciBfYiA9IHRzbGliLl9fdmFsdWVzKHRoaXMuaW5zdGFuY2VzRGVmZXJyZWQuZW50cmllcygpKSwgX2MgPSBfYi5uZXh0KCk7ICFfYy5kb25lOyBfYyA9IF9iLm5leHQoKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIF9kID0gdHNsaWIuX19yZWFkKF9jLnZhbHVlLCAyKSwgaW5zdGFuY2VJZGVudGlmaWVyID0gX2RbMF0sIGluc3RhbmNlRGVmZXJyZWQgPSBfZFsxXTtcclxuICAgICAgICAgICAgICAgIHZhciBub3JtYWxpemVkSWRlbnRpZmllciA9IHRoaXMubm9ybWFsaXplSW5zdGFuY2VJZGVudGlmaWVyKGluc3RhbmNlSWRlbnRpZmllcik7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGBnZXRPckluaXRpYWxpemVTZXJ2aWNlKClgIHNob3VsZCBhbHdheXMgcmV0dXJuIGEgdmFsaWQgaW5zdGFuY2Ugc2luY2UgYSBjb21wb25lbnQgaXMgZ3VhcmFudGVlZC4gdXNlICEgdG8gbWFrZSB0eXBlc2NyaXB0IGhhcHB5LlxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IHRoaXMuZ2V0T3JJbml0aWFsaXplU2VydmljZShub3JtYWxpemVkSWRlbnRpZmllcik7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2VEZWZlcnJlZC5yZXNvbHZlKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gd2hlbiB0aGUgaW5zdGFuY2UgZmFjdG9yeSB0aHJvd3MgYW4gZXhjZXB0aW9uLCBpdCBzaG91bGQgbm90IGNhdXNlXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYSBmYXRhbCBlcnJvci4gV2UganVzdCBsZWF2ZSB0aGUgcHJvbWlzZSB1bnJlc29sdmVkLlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlXzFfMSkgeyBlXzEgPSB7IGVycm9yOiBlXzFfMSB9OyB9XHJcbiAgICAgICAgZmluYWxseSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX2MgJiYgIV9jLmRvbmUgJiYgKF9hID0gX2IucmV0dXJuKSkgX2EuY2FsbChfYik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjsgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQcm92aWRlci5wcm90b3R5cGUuY2xlYXJJbnN0YW5jZSA9IGZ1bmN0aW9uIChpZGVudGlmaWVyKSB7XHJcbiAgICAgICAgaWYgKGlkZW50aWZpZXIgPT09IHZvaWQgMCkgeyBpZGVudGlmaWVyID0gREVGQVVMVF9FTlRSWV9OQU1FOyB9XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZXNEZWZlcnJlZC5kZWxldGUoaWRlbnRpZmllcik7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZXMuZGVsZXRlKGlkZW50aWZpZXIpO1xyXG4gICAgfTtcclxuICAgIC8vIGFwcC5kZWxldGUoKSB3aWxsIGNhbGwgdGhpcyBtZXRob2Qgb24gZXZlcnkgcHJvdmlkZXIgdG8gZGVsZXRlIHRoZSBzZXJ2aWNlc1xyXG4gICAgLy8gVE9ETzogc2hvdWxkIHdlIG1hcmsgdGhlIHByb3ZpZGVyIGFzIGRlbGV0ZWQ/XHJcbiAgICBQcm92aWRlci5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0c2xpYi5fX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHNlcnZpY2VzO1xyXG4gICAgICAgICAgICByZXR1cm4gdHNsaWIuX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlcyA9IEFycmF5LmZyb20odGhpcy5pbnN0YW5jZXMudmFsdWVzKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBQcm9taXNlLmFsbChzZXJ2aWNlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKHNlcnZpY2UpIHsgcmV0dXJuICdJTlRFUk5BTCcgaW4gc2VydmljZTsgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKHNlcnZpY2UpIHsgcmV0dXJuIHNlcnZpY2UuSU5URVJOQUwuZGVsZXRlKCk7IH0pKV07XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUHJvdmlkZXIucHJvdG90eXBlLmlzQ29tcG9uZW50U2V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudCAhPSBudWxsO1xyXG4gICAgfTtcclxuICAgIFByb3ZpZGVyLnByb3RvdHlwZS5nZXRPckluaXRpYWxpemVTZXJ2aWNlID0gZnVuY3Rpb24gKGlkZW50aWZpZXIpIHtcclxuICAgICAgICB2YXIgaW5zdGFuY2UgPSB0aGlzLmluc3RhbmNlcy5nZXQoaWRlbnRpZmllcik7XHJcbiAgICAgICAgaWYgKCFpbnN0YW5jZSAmJiB0aGlzLmNvbXBvbmVudCkge1xyXG4gICAgICAgICAgICBpbnN0YW5jZSA9IHRoaXMuY29tcG9uZW50Lmluc3RhbmNlRmFjdG9yeSh0aGlzLmNvbnRhaW5lciwgbm9ybWFsaXplSWRlbnRpZmllckZvckZhY3RvcnkoaWRlbnRpZmllcikpO1xyXG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlcy5zZXQoaWRlbnRpZmllciwgaW5zdGFuY2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2UgfHwgbnVsbDtcclxuICAgIH07XHJcbiAgICBQcm92aWRlci5wcm90b3R5cGUubm9ybWFsaXplSW5zdGFuY2VJZGVudGlmaWVyID0gZnVuY3Rpb24gKGlkZW50aWZpZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5jb21wb25lbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50Lm11bHRpcGxlSW5zdGFuY2VzID8gaWRlbnRpZmllciA6IERFRkFVTFRfRU5UUllfTkFNRTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpZGVudGlmaWVyOyAvLyBhc3N1bWUgbXVsdGlwbGUgaW5zdGFuY2VzIGFyZSBzdXBwb3J0ZWQgYmVmb3JlIHRoZSBjb21wb25lbnQgaXMgcHJvdmlkZWQuXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHJldHVybiBQcm92aWRlcjtcclxufSgpKTtcclxuLy8gdW5kZWZpbmVkIHNob3VsZCBiZSBwYXNzZWQgdG8gdGhlIHNlcnZpY2UgZmFjdG9yeSBmb3IgdGhlIGRlZmF1bHQgaW5zdGFuY2VcclxuZnVuY3Rpb24gbm9ybWFsaXplSWRlbnRpZmllckZvckZhY3RvcnkoaWRlbnRpZmllcikge1xyXG4gICAgcmV0dXJuIGlkZW50aWZpZXIgPT09IERFRkFVTFRfRU5UUllfTkFNRSA/IHVuZGVmaW5lZCA6IGlkZW50aWZpZXI7XHJcbn1cclxuZnVuY3Rpb24gaXNDb21wb25lbnRFYWdlcihjb21wb25lbnQpIHtcclxuICAgIHJldHVybiBjb21wb25lbnQuaW5zdGFudGlhdGlvbk1vZGUgPT09IFwiRUFHRVJcIiAvKiBFQUdFUiAqLztcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogQ29tcG9uZW50Q29udGFpbmVyIHRoYXQgcHJvdmlkZXMgUHJvdmlkZXJzIGZvciBzZXJ2aWNlIG5hbWUgVCwgZS5nLiBgYXV0aGAsIGBhdXRoLWludGVybmFsYFxyXG4gKi9cclxudmFyIENvbXBvbmVudENvbnRhaW5lciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIENvbXBvbmVudENvbnRhaW5lcihuYW1lKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLnByb3ZpZGVycyA9IG5ldyBNYXAoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjb21wb25lbnQgQ29tcG9uZW50IGJlaW5nIGFkZGVkXHJcbiAgICAgKiBAcGFyYW0gb3ZlcndyaXRlIFdoZW4gYSBjb21wb25lbnQgd2l0aCB0aGUgc2FtZSBuYW1lIGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZCxcclxuICAgICAqIGlmIG92ZXJ3cml0ZSBpcyB0cnVlOiBvdmVyd3JpdGUgdGhlIGV4aXN0aW5nIGNvbXBvbmVudCB3aXRoIHRoZSBuZXcgY29tcG9uZW50IGFuZCBjcmVhdGUgYSBuZXdcclxuICAgICAqIHByb3ZpZGVyIHdpdGggdGhlIG5ldyBjb21wb25lbnQuIEl0IGNhbiBiZSB1c2VmdWwgaW4gdGVzdHMgd2hlcmUgeW91IHdhbnQgdG8gdXNlIGRpZmZlcmVudCBtb2Nrc1xyXG4gICAgICogZm9yIGRpZmZlcmVudCB0ZXN0cy5cclxuICAgICAqIGlmIG92ZXJ3cml0ZSBpcyBmYWxzZTogdGhyb3cgYW4gZXhjZXB0aW9uXHJcbiAgICAgKi9cclxuICAgIENvbXBvbmVudENvbnRhaW5lci5wcm90b3R5cGUuYWRkQ29tcG9uZW50ID0gZnVuY3Rpb24gKGNvbXBvbmVudCkge1xyXG4gICAgICAgIHZhciBwcm92aWRlciA9IHRoaXMuZ2V0UHJvdmlkZXIoY29tcG9uZW50Lm5hbWUpO1xyXG4gICAgICAgIGlmIChwcm92aWRlci5pc0NvbXBvbmVudFNldCgpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBcIiArIGNvbXBvbmVudC5uYW1lICsgXCIgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkIHdpdGggXCIgKyB0aGlzLm5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm92aWRlci5zZXRDb21wb25lbnQoY29tcG9uZW50KTtcclxuICAgIH07XHJcbiAgICBDb21wb25lbnRDb250YWluZXIucHJvdG90eXBlLmFkZE9yT3ZlcndyaXRlQ29tcG9uZW50ID0gZnVuY3Rpb24gKGNvbXBvbmVudCkge1xyXG4gICAgICAgIHZhciBwcm92aWRlciA9IHRoaXMuZ2V0UHJvdmlkZXIoY29tcG9uZW50Lm5hbWUpO1xyXG4gICAgICAgIGlmIChwcm92aWRlci5pc0NvbXBvbmVudFNldCgpKSB7XHJcbiAgICAgICAgICAgIC8vIGRlbGV0ZSB0aGUgZXhpc3RpbmcgcHJvdmlkZXIgZnJvbSB0aGUgY29udGFpbmVyLCBzbyB3ZSBjYW4gcmVnaXN0ZXIgdGhlIG5ldyBjb21wb25lbnRcclxuICAgICAgICAgICAgdGhpcy5wcm92aWRlcnMuZGVsZXRlKGNvbXBvbmVudC5uYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hZGRDb21wb25lbnQoY29tcG9uZW50KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIGdldFByb3ZpZGVyIHByb3ZpZGVzIGEgdHlwZSBzYWZlIGludGVyZmFjZSB3aGVyZSBpdCBjYW4gb25seSBiZSBjYWxsZWQgd2l0aCBhIGZpZWxkIG5hbWVcclxuICAgICAqIHByZXNlbnQgaW4gTmFtZVNlcnZpY2VNYXBwaW5nIGludGVyZmFjZS5cclxuICAgICAqXHJcbiAgICAgKiBGaXJlYmFzZSBTREtzIHByb3ZpZGluZyBzZXJ2aWNlcyBzaG91bGQgZXh0ZW5kIE5hbWVTZXJ2aWNlTWFwcGluZyBpbnRlcmZhY2UgdG8gcmVnaXN0ZXJcclxuICAgICAqIHRoZW1zZWx2ZXMuXHJcbiAgICAgKi9cclxuICAgIENvbXBvbmVudENvbnRhaW5lci5wcm90b3R5cGUuZ2V0UHJvdmlkZXIgPSBmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICAgIGlmICh0aGlzLnByb3ZpZGVycy5oYXMobmFtZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvdmlkZXJzLmdldChuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY3JlYXRlIGEgUHJvdmlkZXIgZm9yIGEgc2VydmljZSB0aGF0IGhhc24ndCByZWdpc3RlcmVkIHdpdGggRmlyZWJhc2VcclxuICAgICAgICB2YXIgcHJvdmlkZXIgPSBuZXcgUHJvdmlkZXIobmFtZSwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5wcm92aWRlcnMuc2V0KG5hbWUsIHByb3ZpZGVyKTtcclxuICAgICAgICByZXR1cm4gcHJvdmlkZXI7XHJcbiAgICB9O1xyXG4gICAgQ29tcG9uZW50Q29udGFpbmVyLnByb3RvdHlwZS5nZXRQcm92aWRlcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5wcm92aWRlcnMudmFsdWVzKCkpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBDb21wb25lbnRDb250YWluZXI7XHJcbn0oKSk7XG5cbmV4cG9ydHMuQ29tcG9uZW50ID0gQ29tcG9uZW50O1xuZXhwb3J0cy5Db21wb25lbnRDb250YWluZXIgPSBDb21wb25lbnRDb250YWluZXI7XG5leHBvcnRzLlByb3ZpZGVyID0gUHJvdmlkZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5janMuanMubWFwXG4iLCIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxyXG50aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZVxyXG5MaWNlbnNlIGF0IGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVEhJUyBDT0RFIElTIFBST1ZJREVEIE9OIEFOICpBUyBJUyogQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxyXG5LSU5ELCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OIEFOWSBJTVBMSUVEXHJcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXHJcbk1FUkNIQU5UQUJMSVRZIE9SIE5PTi1JTkZSSU5HRU1FTlQuXHJcblxyXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcclxuYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG5cclxuZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG52YXIgX2E7XHJcbi8qKlxyXG4gKiBBIGNvbnRhaW5lciBmb3IgYWxsIG9mIHRoZSBMb2dnZXIgaW5zdGFuY2VzXHJcbiAqL1xyXG52YXIgaW5zdGFuY2VzID0gW107XHJcbi8qKlxyXG4gKiBUaGUgSlMgU0RLIHN1cHBvcnRzIDUgbG9nIGxldmVscyBhbmQgYWxzbyBhbGxvd3MgYSB1c2VyIHRoZSBhYmlsaXR5IHRvXHJcbiAqIHNpbGVuY2UgdGhlIGxvZ3MgYWx0b2dldGhlci5cclxuICpcclxuICogVGhlIG9yZGVyIGlzIGEgZm9sbG93czpcclxuICogREVCVUcgPCBWRVJCT1NFIDwgSU5GTyA8IFdBUk4gPCBFUlJPUlxyXG4gKlxyXG4gKiBBbGwgb2YgdGhlIGxvZyB0eXBlcyBhYm92ZSB0aGUgY3VycmVudCBsb2cgbGV2ZWwgd2lsbCBiZSBjYXB0dXJlZCAoaS5lLiBpZlxyXG4gKiB5b3Ugc2V0IHRoZSBsb2cgbGV2ZWwgdG8gYElORk9gLCBlcnJvcnMgd2lsbCBzdGlsbCBiZSBsb2dnZWQsIGJ1dCBgREVCVUdgIGFuZFxyXG4gKiBgVkVSQk9TRWAgbG9ncyB3aWxsIG5vdClcclxuICovXHJcbnZhciBMb2dMZXZlbDtcclxuKGZ1bmN0aW9uIChMb2dMZXZlbCkge1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJERUJVR1wiXSA9IDBdID0gXCJERUJVR1wiO1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJWRVJCT1NFXCJdID0gMV0gPSBcIlZFUkJPU0VcIjtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiSU5GT1wiXSA9IDJdID0gXCJJTkZPXCI7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIldBUk5cIl0gPSAzXSA9IFwiV0FSTlwiO1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJFUlJPUlwiXSA9IDRdID0gXCJFUlJPUlwiO1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJTSUxFTlRcIl0gPSA1XSA9IFwiU0lMRU5UXCI7XHJcbn0pKExvZ0xldmVsIHx8IChMb2dMZXZlbCA9IHt9KSk7XHJcbnZhciBsZXZlbFN0cmluZ1RvRW51bSA9IHtcclxuICAgICdkZWJ1Zyc6IExvZ0xldmVsLkRFQlVHLFxyXG4gICAgJ3ZlcmJvc2UnOiBMb2dMZXZlbC5WRVJCT1NFLFxyXG4gICAgJ2luZm8nOiBMb2dMZXZlbC5JTkZPLFxyXG4gICAgJ3dhcm4nOiBMb2dMZXZlbC5XQVJOLFxyXG4gICAgJ2Vycm9yJzogTG9nTGV2ZWwuRVJST1IsXHJcbiAgICAnc2lsZW50JzogTG9nTGV2ZWwuU0lMRU5UXHJcbn07XHJcbi8qKlxyXG4gKiBUaGUgZGVmYXVsdCBsb2cgbGV2ZWxcclxuICovXHJcbnZhciBkZWZhdWx0TG9nTGV2ZWwgPSBMb2dMZXZlbC5JTkZPO1xyXG4vKipcclxuICogQnkgZGVmYXVsdCwgYGNvbnNvbGUuZGVidWdgIGlzIG5vdCBkaXNwbGF5ZWQgaW4gdGhlIGRldmVsb3BlciBjb25zb2xlIChpblxyXG4gKiBjaHJvbWUpLiBUbyBhdm9pZCBmb3JjaW5nIHVzZXJzIHRvIGhhdmUgdG8gb3B0LWluIHRvIHRoZXNlIGxvZ3MgdHdpY2VcclxuICogKGkuZS4gb25jZSBmb3IgZmlyZWJhc2UsIGFuZCBvbmNlIGluIHRoZSBjb25zb2xlKSwgd2UgYXJlIHNlbmRpbmcgYERFQlVHYFxyXG4gKiBsb2dzIHRvIHRoZSBgY29uc29sZS5sb2dgIGZ1bmN0aW9uLlxyXG4gKi9cclxudmFyIENvbnNvbGVNZXRob2QgPSAoX2EgPSB7fSxcclxuICAgIF9hW0xvZ0xldmVsLkRFQlVHXSA9ICdsb2cnLFxyXG4gICAgX2FbTG9nTGV2ZWwuVkVSQk9TRV0gPSAnbG9nJyxcclxuICAgIF9hW0xvZ0xldmVsLklORk9dID0gJ2luZm8nLFxyXG4gICAgX2FbTG9nTGV2ZWwuV0FSTl0gPSAnd2FybicsXHJcbiAgICBfYVtMb2dMZXZlbC5FUlJPUl0gPSAnZXJyb3InLFxyXG4gICAgX2EpO1xyXG4vKipcclxuICogVGhlIGRlZmF1bHQgbG9nIGhhbmRsZXIgd2lsbCBmb3J3YXJkIERFQlVHLCBWRVJCT1NFLCBJTkZPLCBXQVJOLCBhbmQgRVJST1JcclxuICogbWVzc2FnZXMgb24gdG8gdGhlaXIgY29ycmVzcG9uZGluZyBjb25zb2xlIGNvdW50ZXJwYXJ0cyAoaWYgdGhlIGxvZyBtZXRob2RcclxuICogaXMgc3VwcG9ydGVkIGJ5IHRoZSBjdXJyZW50IGxvZyBsZXZlbClcclxuICovXHJcbnZhciBkZWZhdWx0TG9nSGFuZGxlciA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgbG9nVHlwZSkge1xyXG4gICAgdmFyIGFyZ3MgPSBbXTtcclxuICAgIGZvciAodmFyIF9pID0gMjsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgYXJnc1tfaSAtIDJdID0gYXJndW1lbnRzW19pXTtcclxuICAgIH1cclxuICAgIGlmIChsb2dUeXBlIDwgaW5zdGFuY2UubG9nTGV2ZWwpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB2YXIgbm93ID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xyXG4gICAgdmFyIG1ldGhvZCA9IENvbnNvbGVNZXRob2RbbG9nVHlwZV07XHJcbiAgICBpZiAobWV0aG9kKSB7XHJcbiAgICAgICAgY29uc29sZVttZXRob2RdLmFwcGx5KGNvbnNvbGUsIF9fc3ByZWFkQXJyYXlzKFtcIltcIiArIG5vdyArIFwiXSAgXCIgKyBpbnN0YW5jZS5uYW1lICsgXCI6XCJdLCBhcmdzKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBdHRlbXB0ZWQgdG8gbG9nIGEgbWVzc2FnZSB3aXRoIGFuIGludmFsaWQgbG9nVHlwZSAodmFsdWU6IFwiICsgbG9nVHlwZSArIFwiKVwiKTtcclxuICAgIH1cclxufTtcclxudmFyIExvZ2dlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qKlxyXG4gICAgICogR2l2ZXMgeW91IGFuIGluc3RhbmNlIG9mIGEgTG9nZ2VyIHRvIGNhcHR1cmUgbWVzc2FnZXMgYWNjb3JkaW5nIHRvXHJcbiAgICAgKiBGaXJlYmFzZSdzIGxvZ2dpbmcgc2NoZW1lLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIHRoYXQgdGhlIGxvZ3Mgd2lsbCBiZSBhc3NvY2lhdGVkIHdpdGhcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gTG9nZ2VyKG5hbWUpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZSBsb2cgbGV2ZWwgb2YgdGhlIGdpdmVuIExvZ2dlciBpbnN0YW5jZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLl9sb2dMZXZlbCA9IGRlZmF1bHRMb2dMZXZlbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGUgbWFpbiAoaW50ZXJuYWwpIGxvZyBoYW5kbGVyIGZvciB0aGUgTG9nZ2VyIGluc3RhbmNlLlxyXG4gICAgICAgICAqIENhbiBiZSBzZXQgdG8gYSBuZXcgZnVuY3Rpb24gaW4gaW50ZXJuYWwgcGFja2FnZSBjb2RlIGJ1dCBub3QgYnkgdXNlci5cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLl9sb2dIYW5kbGVyID0gZGVmYXVsdExvZ0hhbmRsZXI7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGhlIG9wdGlvbmFsLCBhZGRpdGlvbmFsLCB1c2VyLWRlZmluZWQgbG9nIGhhbmRsZXIgZm9yIHRoZSBMb2dnZXIgaW5zdGFuY2UuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5fdXNlckxvZ0hhbmRsZXIgPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENhcHR1cmUgdGhlIGN1cnJlbnQgaW5zdGFuY2UgZm9yIGxhdGVyIHVzZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGluc3RhbmNlcy5wdXNoKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KExvZ2dlci5wcm90b3R5cGUsIFwibG9nTGV2ZWxcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbG9nTGV2ZWw7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICAgICAgaWYgKCEodmFsIGluIExvZ0xldmVsKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgdmFsdWUgXFxcIlwiICsgdmFsICsgXCJcXFwiIGFzc2lnbmVkIHRvIGBsb2dMZXZlbGBcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fbG9nTGV2ZWwgPSB2YWw7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgLy8gV29ya2Fyb3VuZCBmb3Igc2V0dGVyL2dldHRlciBoYXZpbmcgdG8gYmUgdGhlIHNhbWUgdHlwZS5cclxuICAgIExvZ2dlci5wcm90b3R5cGUuc2V0TG9nTGV2ZWwgPSBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fbG9nTGV2ZWwgPSB0eXBlb2YgdmFsID09PSAnc3RyaW5nJyA/IGxldmVsU3RyaW5nVG9FbnVtW3ZhbF0gOiB2YWw7XHJcbiAgICB9O1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KExvZ2dlci5wcm90b3R5cGUsIFwibG9nSGFuZGxlclwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sb2dIYW5kbGVyO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdWYWx1ZSBhc3NpZ25lZCB0byBgbG9nSGFuZGxlcmAgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fbG9nSGFuZGxlciA9IHZhbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTG9nZ2VyLnByb3RvdHlwZSwgXCJ1c2VyTG9nSGFuZGxlclwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91c2VyTG9nSGFuZGxlcjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgICAgICB0aGlzLl91c2VyTG9nSGFuZGxlciA9IHZhbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBmdW5jdGlvbnMgYmVsb3cgYXJlIGFsbCBiYXNlZCBvbiB0aGUgYGNvbnNvbGVgIGludGVyZmFjZVxyXG4gICAgICovXHJcbiAgICBMb2dnZXIucHJvdG90eXBlLmRlYnVnID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhcmdzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl91c2VyTG9nSGFuZGxlciAmJiB0aGlzLl91c2VyTG9nSGFuZGxlci5hcHBseSh0aGlzLCBfX3NwcmVhZEFycmF5cyhbdGhpcywgTG9nTGV2ZWwuREVCVUddLCBhcmdzKSk7XHJcbiAgICAgICAgdGhpcy5fbG9nSGFuZGxlci5hcHBseSh0aGlzLCBfX3NwcmVhZEFycmF5cyhbdGhpcywgTG9nTGV2ZWwuREVCVUddLCBhcmdzKSk7XHJcbiAgICB9O1xyXG4gICAgTG9nZ2VyLnByb3RvdHlwZS5sb2cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFyZ3MgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3VzZXJMb2dIYW5kbGVyICYmIHRoaXMuX3VzZXJMb2dIYW5kbGVyLmFwcGx5KHRoaXMsIF9fc3ByZWFkQXJyYXlzKFt0aGlzLCBMb2dMZXZlbC5WRVJCT1NFXSwgYXJncykpO1xyXG4gICAgICAgIHRoaXMuX2xvZ0hhbmRsZXIuYXBwbHkodGhpcywgX19zcHJlYWRBcnJheXMoW3RoaXMsIExvZ0xldmVsLlZFUkJPU0VdLCBhcmdzKSk7XHJcbiAgICB9O1xyXG4gICAgTG9nZ2VyLnByb3RvdHlwZS5pbmZvID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhcmdzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl91c2VyTG9nSGFuZGxlciAmJiB0aGlzLl91c2VyTG9nSGFuZGxlci5hcHBseSh0aGlzLCBfX3NwcmVhZEFycmF5cyhbdGhpcywgTG9nTGV2ZWwuSU5GT10sIGFyZ3MpKTtcclxuICAgICAgICB0aGlzLl9sb2dIYW5kbGVyLmFwcGx5KHRoaXMsIF9fc3ByZWFkQXJyYXlzKFt0aGlzLCBMb2dMZXZlbC5JTkZPXSwgYXJncykpO1xyXG4gICAgfTtcclxuICAgIExvZ2dlci5wcm90b3R5cGUud2FybiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYXJncyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIGFyZ3NbX2ldID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fdXNlckxvZ0hhbmRsZXIgJiYgdGhpcy5fdXNlckxvZ0hhbmRsZXIuYXBwbHkodGhpcywgX19zcHJlYWRBcnJheXMoW3RoaXMsIExvZ0xldmVsLldBUk5dLCBhcmdzKSk7XHJcbiAgICAgICAgdGhpcy5fbG9nSGFuZGxlci5hcHBseSh0aGlzLCBfX3NwcmVhZEFycmF5cyhbdGhpcywgTG9nTGV2ZWwuV0FSTl0sIGFyZ3MpKTtcclxuICAgIH07XHJcbiAgICBMb2dnZXIucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhcmdzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl91c2VyTG9nSGFuZGxlciAmJiB0aGlzLl91c2VyTG9nSGFuZGxlci5hcHBseSh0aGlzLCBfX3NwcmVhZEFycmF5cyhbdGhpcywgTG9nTGV2ZWwuRVJST1JdLCBhcmdzKSk7XHJcbiAgICAgICAgdGhpcy5fbG9nSGFuZGxlci5hcHBseSh0aGlzLCBfX3NwcmVhZEFycmF5cyhbdGhpcywgTG9nTGV2ZWwuRVJST1JdLCBhcmdzKSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIExvZ2dlcjtcclxufSgpKTtcclxuZnVuY3Rpb24gc2V0TG9nTGV2ZWwobGV2ZWwpIHtcclxuICAgIGluc3RhbmNlcy5mb3JFYWNoKGZ1bmN0aW9uIChpbnN0KSB7XHJcbiAgICAgICAgaW5zdC5zZXRMb2dMZXZlbChsZXZlbCk7XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBzZXRVc2VyTG9nSGFuZGxlcihsb2dDYWxsYmFjaywgb3B0aW9ucykge1xyXG4gICAgdmFyIF9sb29wXzEgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcclxuICAgICAgICB2YXIgY3VzdG9tTG9nTGV2ZWwgPSBudWxsO1xyXG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubGV2ZWwpIHtcclxuICAgICAgICAgICAgY3VzdG9tTG9nTGV2ZWwgPSBsZXZlbFN0cmluZ1RvRW51bVtvcHRpb25zLmxldmVsXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGxvZ0NhbGxiYWNrID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnVzZXJMb2dIYW5kbGVyID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnVzZXJMb2dIYW5kbGVyID0gZnVuY3Rpb24gKGluc3RhbmNlLCBsZXZlbCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIF9pID0gMjsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJnc1tfaSAtIDJdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gYXJnc1xyXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGFyZykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhcmcgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGFyZyA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFyZztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicgfHwgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhcmcudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoYXJnIGluc3RhbmNlb2YgRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFyZy5tZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChpZ25vcmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoYXJnKSB7IHJldHVybiBhcmc7IH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmpvaW4oJyAnKTtcclxuICAgICAgICAgICAgICAgIGlmIChsZXZlbCA+PSAoY3VzdG9tTG9nTGV2ZWwgIT09IG51bGwgJiYgY3VzdG9tTG9nTGV2ZWwgIT09IHZvaWQgMCA/IGN1c3RvbUxvZ0xldmVsIDogaW5zdGFuY2UubG9nTGV2ZWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nQ2FsbGJhY2soe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXZlbDogTG9nTGV2ZWxbbGV2ZWxdLnRvTG93ZXJDYXNlKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3M6IGFyZ3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGluc3RhbmNlLm5hbWVcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgZm9yICh2YXIgX2kgPSAwLCBpbnN0YW5jZXNfMSA9IGluc3RhbmNlczsgX2kgPCBpbnN0YW5jZXNfMS5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICB2YXIgaW5zdGFuY2UgPSBpbnN0YW5jZXNfMVtfaV07XHJcbiAgICAgICAgX2xvb3BfMShpbnN0YW5jZSk7XHJcbiAgICB9XHJcbn1cblxuZXhwb3J0IHsgTG9nTGV2ZWwsIExvZ2dlciwgc2V0TG9nTGV2ZWwsIHNldFVzZXJMb2dIYW5kbGVyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5lc20uanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbnZhciB0c2xpYiA9IHJlcXVpcmUoJ3RzbGliJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJ0BmaXJlYmFzZS91dGlsJyk7XG52YXIgY29tcG9uZW50ID0gcmVxdWlyZSgnQGZpcmViYXNlL2NvbXBvbmVudCcpO1xudmFyIGxvZ2dlciQxID0gcmVxdWlyZSgnQGZpcmViYXNlL2xvZ2dlcicpO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG52YXIgX2E7XHJcbnZhciBFUlJPUlMgPSAoX2EgPSB7fSxcclxuICAgIF9hW1wibm8tYXBwXCIgLyogTk9fQVBQICovXSA9IFwiTm8gRmlyZWJhc2UgQXBwICd7JGFwcE5hbWV9JyBoYXMgYmVlbiBjcmVhdGVkIC0gXCIgK1xyXG4gICAgICAgICdjYWxsIEZpcmViYXNlIEFwcC5pbml0aWFsaXplQXBwKCknLFxyXG4gICAgX2FbXCJiYWQtYXBwLW5hbWVcIiAvKiBCQURfQVBQX05BTUUgKi9dID0gXCJJbGxlZ2FsIEFwcCBuYW1lOiAneyRhcHBOYW1lfVwiLFxyXG4gICAgX2FbXCJkdXBsaWNhdGUtYXBwXCIgLyogRFVQTElDQVRFX0FQUCAqL10gPSBcIkZpcmViYXNlIEFwcCBuYW1lZCAneyRhcHBOYW1lfScgYWxyZWFkeSBleGlzdHNcIixcclxuICAgIF9hW1wiYXBwLWRlbGV0ZWRcIiAvKiBBUFBfREVMRVRFRCAqL10gPSBcIkZpcmViYXNlIEFwcCBuYW1lZCAneyRhcHBOYW1lfScgYWxyZWFkeSBkZWxldGVkXCIsXHJcbiAgICBfYVtcImludmFsaWQtYXBwLWFyZ3VtZW50XCIgLyogSU5WQUxJRF9BUFBfQVJHVU1FTlQgKi9dID0gJ2ZpcmViYXNlLnskYXBwTmFtZX0oKSB0YWtlcyBlaXRoZXIgbm8gYXJndW1lbnQgb3IgYSAnICtcclxuICAgICAgICAnRmlyZWJhc2UgQXBwIGluc3RhbmNlLicsXHJcbiAgICBfYVtcImludmFsaWQtbG9nLWFyZ3VtZW50XCIgLyogSU5WQUxJRF9MT0dfQVJHVU1FTlQgKi9dID0gJ0ZpcnN0IGFyZ3VtZW50IHRvIGBvbkxvZ2AgbXVzdCBiZSBudWxsIG9yIGEgZnVuY3Rpb24uJyxcclxuICAgIF9hKTtcclxudmFyIEVSUk9SX0ZBQ1RPUlkgPSBuZXcgdXRpbC5FcnJvckZhY3RvcnkoJ2FwcCcsICdGaXJlYmFzZScsIEVSUk9SUyk7XG5cbnZhciBuYW1lJDEgPSBcIkBmaXJlYmFzZS9hcHBcIjtcbnZhciB2ZXJzaW9uID0gXCIwLjYuOFwiO1xuXG52YXIgbmFtZSQyID0gXCJAZmlyZWJhc2UvYW5hbHl0aWNzXCI7XG5cbnZhciBuYW1lJDMgPSBcIkBmaXJlYmFzZS9hdXRoXCI7XG5cbnZhciBuYW1lJDQgPSBcIkBmaXJlYmFzZS9kYXRhYmFzZVwiO1xuXG52YXIgbmFtZSQ1ID0gXCJAZmlyZWJhc2UvZnVuY3Rpb25zXCI7XG5cbnZhciBuYW1lJDYgPSBcIkBmaXJlYmFzZS9pbnN0YWxsYXRpb25zXCI7XG5cbnZhciBuYW1lJDcgPSBcIkBmaXJlYmFzZS9tZXNzYWdpbmdcIjtcblxudmFyIG5hbWUkOCA9IFwiQGZpcmViYXNlL3BlcmZvcm1hbmNlXCI7XG5cbnZhciBuYW1lJDkgPSBcIkBmaXJlYmFzZS9yZW1vdGUtY29uZmlnXCI7XG5cbnZhciBuYW1lJGEgPSBcIkBmaXJlYmFzZS9zdG9yYWdlXCI7XG5cbnZhciBuYW1lJGIgPSBcIkBmaXJlYmFzZS9maXJlc3RvcmVcIjtcblxudmFyIG5hbWUkYyA9IFwiZmlyZWJhc2Utd3JhcHBlclwiO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG52YXIgX2EkMTtcclxudmFyIERFRkFVTFRfRU5UUllfTkFNRSA9ICdbREVGQVVMVF0nO1xyXG52YXIgUExBVEZPUk1fTE9HX1NUUklORyA9IChfYSQxID0ge30sXHJcbiAgICBfYSQxW25hbWUkMV0gPSAnZmlyZS1jb3JlJyxcclxuICAgIF9hJDFbbmFtZSQyXSA9ICdmaXJlLWFuYWx5dGljcycsXHJcbiAgICBfYSQxW25hbWUkM10gPSAnZmlyZS1hdXRoJyxcclxuICAgIF9hJDFbbmFtZSQ0XSA9ICdmaXJlLXJ0ZGInLFxyXG4gICAgX2EkMVtuYW1lJDVdID0gJ2ZpcmUtZm4nLFxyXG4gICAgX2EkMVtuYW1lJDZdID0gJ2ZpcmUtaWlkJyxcclxuICAgIF9hJDFbbmFtZSQ3XSA9ICdmaXJlLWZjbScsXHJcbiAgICBfYSQxW25hbWUkOF0gPSAnZmlyZS1wZXJmJyxcclxuICAgIF9hJDFbbmFtZSQ5XSA9ICdmaXJlLXJjJyxcclxuICAgIF9hJDFbbmFtZSRhXSA9ICdmaXJlLWdjcycsXHJcbiAgICBfYSQxW25hbWUkYl0gPSAnZmlyZS1mc3QnLFxyXG4gICAgX2EkMVsnZmlyZS1qcyddID0gJ2ZpcmUtanMnLFxyXG4gICAgX2EkMVtuYW1lJGNdID0gJ2ZpcmUtanMtYWxsJyxcclxuICAgIF9hJDEpO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG52YXIgbG9nZ2VyID0gbmV3IGxvZ2dlciQxLkxvZ2dlcignQGZpcmViYXNlL2FwcCcpO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogR2xvYmFsIGNvbnRleHQgb2JqZWN0IGZvciBhIGNvbGxlY3Rpb24gb2Ygc2VydmljZXMgdXNpbmdcclxuICogYSBzaGFyZWQgYXV0aGVudGljYXRpb24gc3RhdGUuXHJcbiAqL1xyXG52YXIgRmlyZWJhc2VBcHBJbXBsID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gRmlyZWJhc2VBcHBJbXBsKG9wdGlvbnMsIGNvbmZpZywgZmlyZWJhc2VfKSB7XHJcbiAgICAgICAgdmFyIGVfMSwgX2E7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmZpcmViYXNlXyA9IGZpcmViYXNlXztcclxuICAgICAgICB0aGlzLmlzRGVsZXRlZF8gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm5hbWVfID0gY29uZmlnLm5hbWU7XHJcbiAgICAgICAgdGhpcy5hdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWRfID1cclxuICAgICAgICAgICAgY29uZmlnLmF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCB8fCBmYWxzZTtcclxuICAgICAgICB0aGlzLm9wdGlvbnNfID0gdXRpbC5kZWVwQ29weShvcHRpb25zKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IG5ldyBjb21wb25lbnQuQ29tcG9uZW50Q29udGFpbmVyKGNvbmZpZy5uYW1lKTtcclxuICAgICAgICAvLyBhZGQgaXRzZWxmIHRvIGNvbnRhaW5lclxyXG4gICAgICAgIHRoaXMuX2FkZENvbXBvbmVudChuZXcgY29tcG9uZW50LkNvbXBvbmVudCgnYXBwJywgZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXM7IH0sIFwiUFVCTElDXCIgLyogUFVCTElDICovKSk7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gcG9wdWxhdGUgQ29tcG9uZW50Q29udGFpbmVyIHdpdGggZXhpc3RpbmcgY29tcG9uZW50c1xyXG4gICAgICAgICAgICBmb3IgKHZhciBfYiA9IHRzbGliLl9fdmFsdWVzKHRoaXMuZmlyZWJhc2VfLklOVEVSTkFMLmNvbXBvbmVudHMudmFsdWVzKCkpLCBfYyA9IF9iLm5leHQoKTsgIV9jLmRvbmU7IF9jID0gX2IubmV4dCgpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29tcG9uZW50JDEgPSBfYy52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FkZENvbXBvbmVudChjb21wb25lbnQkMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGVfMV8xKSB7IGVfMSA9IHsgZXJyb3I6IGVfMV8xIH07IH1cclxuICAgICAgICBmaW5hbGx5IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yOyB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZpcmViYXNlQXBwSW1wbC5wcm90b3R5cGUsIFwiYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGVja0Rlc3Ryb3llZF8oKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkXztcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgICAgICB0aGlzLmNoZWNrRGVzdHJveWVkXygpO1xyXG4gICAgICAgICAgICB0aGlzLmF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZF8gPSB2YWw7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZpcmViYXNlQXBwSW1wbC5wcm90b3R5cGUsIFwibmFtZVwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tEZXN0cm95ZWRfKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5hbWVfO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGaXJlYmFzZUFwcEltcGwucHJvdG90eXBlLCBcIm9wdGlvbnNcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmNoZWNrRGVzdHJveWVkXygpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zXztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBGaXJlYmFzZUFwcEltcGwucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG4gICAgICAgICAgICBfdGhpcy5jaGVja0Rlc3Ryb3llZF8oKTtcclxuICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgX3RoaXMuZmlyZWJhc2VfLklOVEVSTkFMLnJlbW92ZUFwcChfdGhpcy5uYW1lXyk7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChfdGhpcy5jb250YWluZXIuZ2V0UHJvdmlkZXJzKCkubWFwKGZ1bmN0aW9uIChwcm92aWRlcikgeyByZXR1cm4gcHJvdmlkZXIuZGVsZXRlKCk7IH0pKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF90aGlzLmlzRGVsZXRlZF8gPSB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJuIGEgc2VydmljZSBpbnN0YW5jZSBhc3NvY2lhdGVkIHdpdGggdGhpcyBhcHAgKGNyZWF0aW5nIGl0XHJcbiAgICAgKiBvbiBkZW1hbmQpLCBpZGVudGlmaWVkIGJ5IHRoZSBwYXNzZWQgaW5zdGFuY2VJZGVudGlmaWVyLlxyXG4gICAgICpcclxuICAgICAqIE5PVEU6IEN1cnJlbnRseSBzdG9yYWdlIGFuZCBmdW5jdGlvbnMgYXJlIHRoZSBvbmx5IG9uZXMgdGhhdCBhcmUgbGV2ZXJhZ2luZyB0aGlzXHJcbiAgICAgKiBmdW5jdGlvbmFsaXR5LiBUaGV5IGludm9rZSBpdCBieSBjYWxsaW5nOlxyXG4gICAgICpcclxuICAgICAqIGBgYGphdmFzY3JpcHRcclxuICAgICAqIGZpcmViYXNlLmFwcCgpLnN0b3JhZ2UoJ1NUT1JBR0UgQlVDS0VUIElEJylcclxuICAgICAqIGBgYFxyXG4gICAgICpcclxuICAgICAqIFRoZSBzZXJ2aWNlIG5hbWUgaXMgcGFzc2VkIHRvIHRoaXMgYWxyZWFkeVxyXG4gICAgICogQGludGVybmFsXHJcbiAgICAgKi9cclxuICAgIEZpcmViYXNlQXBwSW1wbC5wcm90b3R5cGUuX2dldFNlcnZpY2UgPSBmdW5jdGlvbiAobmFtZSwgaW5zdGFuY2VJZGVudGlmaWVyKSB7XHJcbiAgICAgICAgaWYgKGluc3RhbmNlSWRlbnRpZmllciA9PT0gdm9pZCAwKSB7IGluc3RhbmNlSWRlbnRpZmllciA9IERFRkFVTFRfRU5UUllfTkFNRTsgfVxyXG4gICAgICAgIHRoaXMuY2hlY2tEZXN0cm95ZWRfKCk7XHJcbiAgICAgICAgLy8gZ2V0SW1tZWRpYXRlIHdpbGwgYWx3YXlzIHN1Y2NlZWQgYmVjYXVzZSBfZ2V0U2VydmljZSBpcyBvbmx5IGNhbGxlZCBmb3IgcmVnaXN0ZXJlZCBjb21wb25lbnRzLlxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRhaW5lci5nZXRQcm92aWRlcihuYW1lKS5nZXRJbW1lZGlhdGUoe1xyXG4gICAgICAgICAgICBpZGVudGlmaWVyOiBpbnN0YW5jZUlkZW50aWZpZXJcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZSBhIHNlcnZpY2UgaW5zdGFuY2UgZnJvbSB0aGUgY2FjaGUsIHNvIHdlIHdpbGwgY3JlYXRlIGEgbmV3IGluc3RhbmNlIGZvciB0aGlzIHNlcnZpY2VcclxuICAgICAqIHdoZW4gcGVvcGxlIHRyeSB0byBnZXQgdGhpcyBzZXJ2aWNlIGFnYWluLlxyXG4gICAgICpcclxuICAgICAqIE5PVEU6IGN1cnJlbnRseSBvbmx5IGZpcmVzdG9yZSBpcyB1c2luZyB0aGlzIGZ1bmN0aW9uYWxpdHkgdG8gc3VwcG9ydCBmaXJlc3RvcmUgc2h1dGRvd24uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIG5hbWUgVGhlIHNlcnZpY2UgbmFtZVxyXG4gICAgICogQHBhcmFtIGluc3RhbmNlSWRlbnRpZmllciBpbnN0YW5jZSBpZGVudGlmaWVyIGluIGNhc2UgbXVsdGlwbGUgaW5zdGFuY2VzIGFyZSBhbGxvd2VkXHJcbiAgICAgKiBAaW50ZXJuYWxcclxuICAgICAqL1xyXG4gICAgRmlyZWJhc2VBcHBJbXBsLnByb3RvdHlwZS5fcmVtb3ZlU2VydmljZUluc3RhbmNlID0gZnVuY3Rpb24gKG5hbWUsIGluc3RhbmNlSWRlbnRpZmllcikge1xyXG4gICAgICAgIGlmIChpbnN0YW5jZUlkZW50aWZpZXIgPT09IHZvaWQgMCkgeyBpbnN0YW5jZUlkZW50aWZpZXIgPSBERUZBVUxUX0VOVFJZX05BTUU7IH1cclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmdldFByb3ZpZGVyKG5hbWUpLmNsZWFySW5zdGFuY2UoaW5zdGFuY2VJZGVudGlmaWVyKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBjb21wb25lbnQgdGhlIGNvbXBvbmVudCBiZWluZyBhZGRlZCB0byB0aGlzIGFwcCdzIGNvbnRhaW5lclxyXG4gICAgICovXHJcbiAgICBGaXJlYmFzZUFwcEltcGwucHJvdG90eXBlLl9hZGRDb21wb25lbnQgPSBmdW5jdGlvbiAoY29tcG9uZW50KSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYWRkQ29tcG9uZW50KGNvbXBvbmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZyhcIkNvbXBvbmVudCBcIiArIGNvbXBvbmVudC5uYW1lICsgXCIgZmFpbGVkIHRvIHJlZ2lzdGVyIHdpdGggRmlyZWJhc2VBcHAgXCIgKyB0aGlzLm5hbWUsIGUpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBGaXJlYmFzZUFwcEltcGwucHJvdG90eXBlLl9hZGRPck92ZXJ3cml0ZUNvbXBvbmVudCA9IGZ1bmN0aW9uIChjb21wb25lbnQpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hZGRPck92ZXJ3cml0ZUNvbXBvbmVudChjb21wb25lbnQpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiB3aWxsIHRocm93IGFuIEVycm9yIGlmIHRoZSBBcHAgaGFzIGFscmVhZHkgYmVlbiBkZWxldGVkIC1cclxuICAgICAqIHVzZSBiZWZvcmUgcGVyZm9ybWluZyBBUEkgYWN0aW9ucyBvbiB0aGUgQXBwLlxyXG4gICAgICovXHJcbiAgICBGaXJlYmFzZUFwcEltcGwucHJvdG90eXBlLmNoZWNrRGVzdHJveWVkXyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0RlbGV0ZWRfKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiYXBwLWRlbGV0ZWRcIiAvKiBBUFBfREVMRVRFRCAqLywgeyBhcHBOYW1lOiB0aGlzLm5hbWVfIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gRmlyZWJhc2VBcHBJbXBsO1xyXG59KCkpO1xyXG4vLyBQcmV2ZW50IGRlYWQtY29kZSBlbGltaW5hdGlvbiBvZiB0aGVzZSBtZXRob2RzIHcvbyBpbnZhbGlkIHByb3BlcnR5XHJcbi8vIGNvcHlpbmcuXHJcbihGaXJlYmFzZUFwcEltcGwucHJvdG90eXBlLm5hbWUgJiYgRmlyZWJhc2VBcHBJbXBsLnByb3RvdHlwZS5vcHRpb25zKSB8fFxyXG4gICAgRmlyZWJhc2VBcHBJbXBsLnByb3RvdHlwZS5kZWxldGUgfHxcclxuICAgIGNvbnNvbGUubG9nKCdkYycpO1xuXG52YXIgdmVyc2lvbiQxID0gXCI3LjE2LjBcIjtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIEJlY2F1c2UgYXV0aCBjYW4ndCBzaGFyZSBjb2RlIHdpdGggb3RoZXIgY29tcG9uZW50cywgd2UgYXR0YWNoIHRoZSB1dGlsaXR5IGZ1bmN0aW9uc1xyXG4gKiBpbiBhbiBpbnRlcm5hbCBuYW1lc3BhY2UgdG8gc2hhcmUgY29kZS5cclxuICogVGhpcyBmdW5jdGlvbiByZXR1cm4gYSBmaXJlYmFzZSBuYW1lc3BhY2Ugb2JqZWN0IHdpdGhvdXRcclxuICogYW55IHV0aWxpdHkgZnVuY3Rpb25zLCBzbyBpdCBjYW4gYmUgc2hhcmVkIGJldHdlZW4gdGhlIHJlZ3VsYXIgZmlyZWJhc2VOYW1lc3BhY2UgYW5kXHJcbiAqIHRoZSBsaXRlIHZlcnNpb24uXHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGVGaXJlYmFzZU5hbWVzcGFjZUNvcmUoZmlyZWJhc2VBcHBJbXBsKSB7XHJcbiAgICB2YXIgYXBwcyA9IHt9O1xyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuICAgIHZhciBjb21wb25lbnRzID0gbmV3IE1hcCgpO1xyXG4gICAgLy8gQSBuYW1lc3BhY2UgaXMgYSBwbGFpbiBKYXZhU2NyaXB0IE9iamVjdC5cclxuICAgIHZhciBuYW1lc3BhY2UgPSB7XHJcbiAgICAgICAgLy8gSGFjayB0byBwcmV2ZW50IEJhYmVsIGZyb20gbW9kaWZ5aW5nIHRoZSBvYmplY3QgcmV0dXJuZWRcclxuICAgICAgICAvLyBhcyB0aGUgZmlyZWJhc2UgbmFtZXNwYWNlLlxyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBfX2VzTW9kdWxlOiB0cnVlLFxyXG4gICAgICAgIGluaXRpYWxpemVBcHA6IGluaXRpYWxpemVBcHAsXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIGFwcDogYXBwLFxyXG4gICAgICAgIHJlZ2lzdGVyVmVyc2lvbjogcmVnaXN0ZXJWZXJzaW9uLFxyXG4gICAgICAgIHNldExvZ0xldmVsOiBsb2dnZXIkMS5zZXRMb2dMZXZlbCxcclxuICAgICAgICBvbkxvZzogb25Mb2csXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIGFwcHM6IG51bGwsXHJcbiAgICAgICAgU0RLX1ZFUlNJT046IHZlcnNpb24kMSxcclxuICAgICAgICBJTlRFUk5BTDoge1xyXG4gICAgICAgICAgICByZWdpc3RlckNvbXBvbmVudDogcmVnaXN0ZXJDb21wb25lbnQsXHJcbiAgICAgICAgICAgIHJlbW92ZUFwcDogcmVtb3ZlQXBwLFxyXG4gICAgICAgICAgICBjb21wb25lbnRzOiBjb21wb25lbnRzLFxyXG4gICAgICAgICAgICB1c2VBc1NlcnZpY2U6IHVzZUFzU2VydmljZVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvLyBJbmplY3QgYSBjaXJjdWxhciBkZWZhdWx0IGV4cG9ydCB0byBhbGxvdyBCYWJlbCB1c2VycyB3aG8gd2VyZSBwcmV2aW91c2x5XHJcbiAgICAvLyB1c2luZzpcclxuICAgIC8vXHJcbiAgICAvLyAgIGltcG9ydCBmaXJlYmFzZSBmcm9tICdmaXJlYmFzZSc7XHJcbiAgICAvLyAgIHdoaWNoIGJlY29tZXM6IHZhciBmaXJlYmFzZSA9IHJlcXVpcmUoJ2ZpcmViYXNlJykuZGVmYXVsdDtcclxuICAgIC8vXHJcbiAgICAvLyBpbnN0ZWFkIG9mXHJcbiAgICAvL1xyXG4gICAgLy8gICBpbXBvcnQgKiBhcyBmaXJlYmFzZSBmcm9tICdmaXJlYmFzZSc7XHJcbiAgICAvLyAgIHdoaWNoIGJlY29tZXM6IHZhciBmaXJlYmFzZSA9IHJlcXVpcmUoJ2ZpcmViYXNlJyk7XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG4gICAgbmFtZXNwYWNlWydkZWZhdWx0J10gPSBuYW1lc3BhY2U7XHJcbiAgICAvLyBmaXJlYmFzZS5hcHBzIGlzIGEgcmVhZC1vbmx5IGdldHRlci5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuYW1lc3BhY2UsICdhcHBzJywge1xyXG4gICAgICAgIGdldDogZ2V0QXBwc1xyXG4gICAgfSk7XHJcbiAgICAvKipcclxuICAgICAqIENhbGxlZCBieSBBcHAuZGVsZXRlKCkgLSBidXQgYmVmb3JlIGFueSBzZXJ2aWNlcyBhc3NvY2lhdGVkIHdpdGggdGhlIEFwcFxyXG4gICAgICogYXJlIGRlbGV0ZWQuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHJlbW92ZUFwcChuYW1lKSB7XHJcbiAgICAgICAgZGVsZXRlIGFwcHNbbmFtZV07XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgQXBwIG9iamVjdCBmb3IgYSBnaXZlbiBuYW1lIChvciBERUZBVUxUKS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYXBwKG5hbWUpIHtcclxuICAgICAgICBuYW1lID0gbmFtZSB8fCBERUZBVUxUX0VOVFJZX05BTUU7XHJcbiAgICAgICAgaWYgKCF1dGlsLmNvbnRhaW5zKGFwcHMsIG5hbWUpKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwibm8tYXBwXCIgLyogTk9fQVBQICovLCB7IGFwcE5hbWU6IG5hbWUgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcHBzW25hbWVdO1xyXG4gICAgfVxyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgYXBwWydBcHAnXSA9IGZpcmViYXNlQXBwSW1wbDtcclxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemVBcHAob3B0aW9ucywgcmF3Q29uZmlnKSB7XHJcbiAgICAgICAgaWYgKHJhd0NvbmZpZyA9PT0gdm9pZCAwKSB7IHJhd0NvbmZpZyA9IHt9OyB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiByYXdDb25maWcgIT09ICdvYmplY3QnIHx8IHJhd0NvbmZpZyA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB2YXIgbmFtZV8xID0gcmF3Q29uZmlnO1xyXG4gICAgICAgICAgICByYXdDb25maWcgPSB7IG5hbWU6IG5hbWVfMSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY29uZmlnID0gcmF3Q29uZmlnO1xyXG4gICAgICAgIGlmIChjb25maWcubmFtZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGNvbmZpZy5uYW1lID0gREVGQVVMVF9FTlRSWV9OQU1FO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbmFtZSA9IGNvbmZpZy5uYW1lO1xyXG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycgfHwgIW5hbWUpIHtcclxuICAgICAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJiYWQtYXBwLW5hbWVcIiAvKiBCQURfQVBQX05BTUUgKi8sIHtcclxuICAgICAgICAgICAgICAgIGFwcE5hbWU6IFN0cmluZyhuYW1lKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHV0aWwuY29udGFpbnMoYXBwcywgbmFtZSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJkdXBsaWNhdGUtYXBwXCIgLyogRFVQTElDQVRFX0FQUCAqLywgeyBhcHBOYW1lOiBuYW1lIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgYXBwID0gbmV3IGZpcmViYXNlQXBwSW1wbChvcHRpb25zLCBjb25maWcsIG5hbWVzcGFjZSk7XHJcbiAgICAgICAgYXBwc1tuYW1lXSA9IGFwcDtcclxuICAgICAgICByZXR1cm4gYXBwO1xyXG4gICAgfVxyXG4gICAgLypcclxuICAgICAqIFJldHVybiBhbiBhcnJheSBvZiBhbGwgdGhlIG5vbi1kZWxldGVkIEZpcmViYXNlQXBwcy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0QXBwcygpIHtcclxuICAgICAgICAvLyBNYWtlIGEgY29weSBzbyBjYWxsZXIgY2Fubm90IG11dGF0ZSB0aGUgYXBwcyBsaXN0LlxyXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhhcHBzKS5tYXAoZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIGFwcHNbbmFtZV07IH0pO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcmVnaXN0ZXJDb21wb25lbnQoY29tcG9uZW50KSB7XHJcbiAgICAgICAgdmFyIGVfMSwgX2E7XHJcbiAgICAgICAgdmFyIGNvbXBvbmVudE5hbWUgPSBjb21wb25lbnQubmFtZTtcclxuICAgICAgICBpZiAoY29tcG9uZW50cy5oYXMoY29tcG9uZW50TmFtZSkpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKFwiVGhlcmUgd2VyZSBtdWx0aXBsZSBhdHRlbXB0cyB0byByZWdpc3RlciBjb21wb25lbnQgXCIgKyBjb21wb25lbnROYW1lICsgXCIuXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50LnR5cGUgPT09IFwiUFVCTElDXCIgLyogUFVCTElDICovXHJcbiAgICAgICAgICAgICAgICA/IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlW2NvbXBvbmVudE5hbWVdXHJcbiAgICAgICAgICAgICAgICA6IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbXBvbmVudHMuc2V0KGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudCk7XHJcbiAgICAgICAgLy8gY3JlYXRlIHNlcnZpY2UgbmFtZXNwYWNlIGZvciBwdWJsaWMgY29tcG9uZW50c1xyXG4gICAgICAgIGlmIChjb21wb25lbnQudHlwZSA9PT0gXCJQVUJMSUNcIiAvKiBQVUJMSUMgKi8pIHtcclxuICAgICAgICAgICAgLy8gVGhlIFNlcnZpY2UgbmFtZXNwYWNlIGlzIGFuIGFjY2Vzc29yIGZ1bmN0aW9uIC4uLlxyXG4gICAgICAgICAgICB2YXIgc2VydmljZU5hbWVzcGFjZSA9IGZ1bmN0aW9uIChhcHBBcmcpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhcHBBcmcgPT09IHZvaWQgMCkgeyBhcHBBcmcgPSBhcHAoKTsgfVxyXG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYXBwQXJnW2NvbXBvbmVudE5hbWVdICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSW52YWxpZCBhcmd1bWVudC5cclxuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIGhhcHBlbnMgaW4gdGhlIGZvbGxvd2luZyBjYXNlOiBmaXJlYmFzZS5zdG9yYWdlKCdnczovJylcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImludmFsaWQtYXBwLWFyZ3VtZW50XCIgLyogSU5WQUxJRF9BUFBfQVJHVU1FTlQgKi8sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwTmFtZTogY29tcG9uZW50TmFtZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gRm9yd2FyZCBzZXJ2aWNlIGluc3RhbmNlIGxvb2t1cCB0byB0aGUgRmlyZWJhc2VBcHAuXHJcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFwcEFyZ1tjb21wb25lbnROYW1lXSgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAvLyAuLi4gYW5kIGEgY29udGFpbmVyIGZvciBzZXJ2aWNlLWxldmVsIHByb3BlcnRpZXMuXHJcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQuc2VydmljZVByb3BzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuZGVlcEV4dGVuZChzZXJ2aWNlTmFtZXNwYWNlLCBjb21wb25lbnQuc2VydmljZVByb3BzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG4gICAgICAgICAgICBuYW1lc3BhY2VbY29tcG9uZW50TmFtZV0gPSBzZXJ2aWNlTmFtZXNwYWNlO1xyXG4gICAgICAgICAgICAvLyBQYXRjaCB0aGUgRmlyZWJhc2VBcHBJbXBsIHByb3RvdHlwZVxyXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG4gICAgICAgICAgICBmaXJlYmFzZUFwcEltcGwucHJvdG90eXBlW2NvbXBvbmVudE5hbWVdID1cclxuICAgICAgICAgICAgICAgIC8vIFRPRE86IFRoZSBlc2xpbnQgZGlzYWJsZSBjYW4gYmUgcmVtb3ZlZCBhbmQgdGhlICdpZ25vcmVSZXN0QXJncydcclxuICAgICAgICAgICAgICAgIC8vIG9wdGlvbiBhZGRlZCB0byB0aGUgbm8tZXhwbGljaXQtYW55IHJ1bGUgd2hlbiBFU2xpbnQgcmVsZWFzZXMgaXQuXHJcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2VydmljZUZ4biA9IHRoaXMuX2dldFNlcnZpY2UuYmluZCh0aGlzLCBjb21wb25lbnROYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VydmljZUZ4bi5hcHBseSh0aGlzLCBjb21wb25lbnQubXVsdGlwbGVJbnN0YW5jZXMgPyBhcmdzIDogW10pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gYWRkIHRoZSBjb21wb25lbnQgdG8gZXhpc3RpbmcgYXBwIGluc3RhbmNlc1xyXG4gICAgICAgICAgICBmb3IgKHZhciBfYiA9IHRzbGliLl9fdmFsdWVzKE9iamVjdC5rZXlzKGFwcHMpKSwgX2MgPSBfYi5uZXh0KCk7ICFfYy5kb25lOyBfYyA9IF9iLm5leHQoKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFwcE5hbWUgPSBfYy52YWx1ZTtcclxuICAgICAgICAgICAgICAgIGFwcHNbYXBwTmFtZV0uX2FkZENvbXBvbmVudChjb21wb25lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlXzFfMSkgeyBlXzEgPSB7IGVycm9yOiBlXzFfMSB9OyB9XHJcbiAgICAgICAgZmluYWxseSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX2MgJiYgIV9jLmRvbmUgJiYgKF9hID0gX2IucmV0dXJuKSkgX2EuY2FsbChfYik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjsgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29tcG9uZW50LnR5cGUgPT09IFwiUFVCTElDXCIgLyogUFVCTElDICovXHJcbiAgICAgICAgICAgID8gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZVtjb21wb25lbnROYW1lXVxyXG4gICAgICAgICAgICA6IG51bGw7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiByZWdpc3RlclZlcnNpb24obGlicmFyeUtleU9yTmFtZSwgdmVyc2lvbiwgdmFyaWFudCkge1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgICAgICAvLyBUT0RPOiBXZSBjYW4gdXNlIHRoaXMgY2hlY2sgdG8gd2hpdGVsaXN0IHN0cmluZ3Mgd2hlbi9pZiB3ZSBzZXQgdXBcclxuICAgICAgICAvLyBhIGdvb2Qgd2hpdGVsaXN0IHN5c3RlbS5cclxuICAgICAgICB2YXIgbGlicmFyeSA9IChfYSA9IFBMQVRGT1JNX0xPR19TVFJJTkdbbGlicmFyeUtleU9yTmFtZV0pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IGxpYnJhcnlLZXlPck5hbWU7XHJcbiAgICAgICAgaWYgKHZhcmlhbnQpIHtcclxuICAgICAgICAgICAgbGlicmFyeSArPSBcIi1cIiArIHZhcmlhbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsaWJyYXJ5TWlzbWF0Y2ggPSBsaWJyYXJ5Lm1hdGNoKC9cXHN8XFwvLyk7XHJcbiAgICAgICAgdmFyIHZlcnNpb25NaXNtYXRjaCA9IHZlcnNpb24ubWF0Y2goL1xcc3xcXC8vKTtcclxuICAgICAgICBpZiAobGlicmFyeU1pc21hdGNoIHx8IHZlcnNpb25NaXNtYXRjaCkge1xyXG4gICAgICAgICAgICB2YXIgd2FybmluZyA9IFtcclxuICAgICAgICAgICAgICAgIFwiVW5hYmxlIHRvIHJlZ2lzdGVyIGxpYnJhcnkgXFxcIlwiICsgbGlicmFyeSArIFwiXFxcIiB3aXRoIHZlcnNpb24gXFxcIlwiICsgdmVyc2lvbiArIFwiXFxcIjpcIlxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICBpZiAobGlicmFyeU1pc21hdGNoKSB7XHJcbiAgICAgICAgICAgICAgICB3YXJuaW5nLnB1c2goXCJsaWJyYXJ5IG5hbWUgXFxcIlwiICsgbGlicmFyeSArIFwiXFxcIiBjb250YWlucyBpbGxlZ2FsIGNoYXJhY3RlcnMgKHdoaXRlc3BhY2Ugb3IgXFxcIi9cXFwiKVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobGlicmFyeU1pc21hdGNoICYmIHZlcnNpb25NaXNtYXRjaCkge1xyXG4gICAgICAgICAgICAgICAgd2FybmluZy5wdXNoKCdhbmQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodmVyc2lvbk1pc21hdGNoKSB7XHJcbiAgICAgICAgICAgICAgICB3YXJuaW5nLnB1c2goXCJ2ZXJzaW9uIG5hbWUgXFxcIlwiICsgdmVyc2lvbiArIFwiXFxcIiBjb250YWlucyBpbGxlZ2FsIGNoYXJhY3RlcnMgKHdoaXRlc3BhY2Ugb3IgXFxcIi9cXFwiKVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsb2dnZXIud2Fybih3YXJuaW5nLmpvaW4oJyAnKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVnaXN0ZXJDb21wb25lbnQobmV3IGNvbXBvbmVudC5Db21wb25lbnQobGlicmFyeSArIFwiLXZlcnNpb25cIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gKHsgbGlicmFyeTogbGlicmFyeSwgdmVyc2lvbjogdmVyc2lvbiB9KTsgfSwgXCJWRVJTSU9OXCIgLyogVkVSU0lPTiAqLykpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gb25Mb2cobG9nQ2FsbGJhY2ssIG9wdGlvbnMpIHtcclxuICAgICAgICBpZiAobG9nQ2FsbGJhY2sgIT09IG51bGwgJiYgdHlwZW9mIGxvZ0NhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiaW52YWxpZC1sb2ctYXJndW1lbnRcIiAvKiBJTlZBTElEX0xPR19BUkdVTUVOVCAqLywge1xyXG4gICAgICAgICAgICAgICAgYXBwTmFtZTogbmFtZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbG9nZ2VyJDEuc2V0VXNlckxvZ0hhbmRsZXIobG9nQ2FsbGJhY2ssIG9wdGlvbnMpO1xyXG4gICAgfVxyXG4gICAgLy8gTWFwIHRoZSByZXF1ZXN0ZWQgc2VydmljZSB0byBhIHJlZ2lzdGVyZWQgc2VydmljZSBuYW1lXHJcbiAgICAvLyAodXNlZCB0byBtYXAgYXV0aCB0byBzZXJ2ZXJBdXRoIHNlcnZpY2Ugd2hlbiBuZWVkZWQpLlxyXG4gICAgZnVuY3Rpb24gdXNlQXNTZXJ2aWNlKGFwcCwgbmFtZSkge1xyXG4gICAgICAgIGlmIChuYW1lID09PSAnc2VydmVyQXV0aCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciB1c2VTZXJ2aWNlID0gbmFtZTtcclxuICAgICAgICByZXR1cm4gdXNlU2VydmljZTtcclxuICAgIH1cclxuICAgIHJldHVybiBuYW1lc3BhY2U7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFJldHVybiBhIGZpcmViYXNlIG5hbWVzcGFjZSBvYmplY3QuXHJcbiAqXHJcbiAqIEluIHByb2R1Y3Rpb24sIHRoaXMgd2lsbCBiZSBjYWxsZWQgZXhhY3RseSBvbmNlIGFuZCB0aGUgcmVzdWx0XHJcbiAqIGFzc2lnbmVkIHRvIHRoZSAnZmlyZWJhc2UnIGdsb2JhbC4gIEl0IG1heSBiZSBjYWxsZWQgbXVsdGlwbGUgdGltZXNcclxuICogaW4gdW5pdCB0ZXN0cy5cclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZUZpcmViYXNlTmFtZXNwYWNlKCkge1xyXG4gICAgdmFyIG5hbWVzcGFjZSA9IGNyZWF0ZUZpcmViYXNlTmFtZXNwYWNlQ29yZShGaXJlYmFzZUFwcEltcGwpO1xyXG4gICAgbmFtZXNwYWNlLklOVEVSTkFMID0gdHNsaWIuX19hc3NpZ24odHNsaWIuX19hc3NpZ24oe30sIG5hbWVzcGFjZS5JTlRFUk5BTCksIHsgY3JlYXRlRmlyZWJhc2VOYW1lc3BhY2U6IGNyZWF0ZUZpcmViYXNlTmFtZXNwYWNlLFxyXG4gICAgICAgIGV4dGVuZE5hbWVzcGFjZTogZXh0ZW5kTmFtZXNwYWNlLFxyXG4gICAgICAgIGNyZWF0ZVN1YnNjcmliZTogdXRpbC5jcmVhdGVTdWJzY3JpYmUsXHJcbiAgICAgICAgRXJyb3JGYWN0b3J5OiB1dGlsLkVycm9yRmFjdG9yeSxcclxuICAgICAgICBkZWVwRXh0ZW5kOiB1dGlsLmRlZXBFeHRlbmQgfSk7XHJcbiAgICAvKipcclxuICAgICAqIFBhdGNoIHRoZSB0b3AtbGV2ZWwgZmlyZWJhc2UgbmFtZXNwYWNlIHdpdGggYWRkaXRpb25hbCBwcm9wZXJ0aWVzLlxyXG4gICAgICpcclxuICAgICAqIGZpcmViYXNlLklOVEVSTkFMLmV4dGVuZE5hbWVzcGFjZSgpXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGV4dGVuZE5hbWVzcGFjZShwcm9wcykge1xyXG4gICAgICAgIHV0aWwuZGVlcEV4dGVuZChuYW1lc3BhY2UsIHByb3BzKTtcclxuICAgIH1cclxuICAgIHJldHVybiBuYW1lc3BhY2U7XHJcbn1cclxudmFyIGZpcmViYXNlID0gY3JlYXRlRmlyZWJhc2VOYW1lc3BhY2UoKTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxudmFyIFBsYXRmb3JtTG9nZ2VyU2VydmljZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFBsYXRmb3JtTG9nZ2VyU2VydmljZShjb250YWluZXIpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgIH1cclxuICAgIC8vIEluIGluaXRpYWwgaW1wbGVtZW50YXRpb24sIHRoaXMgd2lsbCBiZSBjYWxsZWQgYnkgaW5zdGFsbGF0aW9ucyBvblxyXG4gICAgLy8gYXV0aCB0b2tlbiByZWZyZXNoLCBhbmQgaW5zdGFsbGF0aW9ucyB3aWxsIHNlbmQgdGhpcyBzdHJpbmcuXHJcbiAgICBQbGF0Zm9ybUxvZ2dlclNlcnZpY2UucHJvdG90eXBlLmdldFBsYXRmb3JtSW5mb1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcHJvdmlkZXJzID0gdGhpcy5jb250YWluZXIuZ2V0UHJvdmlkZXJzKCk7XHJcbiAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHByb3ZpZGVycyBhbmQgZ2V0IGxpYnJhcnkvdmVyc2lvbiBwYWlycyBmcm9tIGFueSB0aGF0IGFyZVxyXG4gICAgICAgIC8vIHZlcnNpb24gY29tcG9uZW50cy5cclxuICAgICAgICByZXR1cm4gcHJvdmlkZXJzXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKHByb3ZpZGVyKSB7XHJcbiAgICAgICAgICAgIGlmIChpc1ZlcnNpb25TZXJ2aWNlUHJvdmlkZXIocHJvdmlkZXIpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VydmljZSA9IHByb3ZpZGVyLmdldEltbWVkaWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2UubGlicmFyeSArIFwiL1wiICsgc2VydmljZS52ZXJzaW9uO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChsb2dTdHJpbmcpIHsgcmV0dXJuIGxvZ1N0cmluZzsgfSlcclxuICAgICAgICAgICAgLmpvaW4oJyAnKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gUGxhdGZvcm1Mb2dnZXJTZXJ2aWNlO1xyXG59KCkpO1xyXG4vKipcclxuICpcclxuICogQHBhcmFtIHByb3ZpZGVyIGNoZWNrIGlmIHRoaXMgcHJvdmlkZXIgcHJvdmlkZXMgYSBWZXJzaW9uU2VydmljZVxyXG4gKlxyXG4gKiBOT1RFOiBVc2luZyBQcm92aWRlcjwnYXBwLXZlcnNpb24nPiBpcyBhIGhhY2sgdG8gaW5kaWNhdGUgdGhhdCB0aGUgcHJvdmlkZXJcclxuICogcHJvdmlkZXMgVmVyc2lvblNlcnZpY2UuIFRoZSBwcm92aWRlciBpcyBub3QgbmVjZXNzYXJpbHkgYSAnYXBwLXZlcnNpb24nXHJcbiAqIHByb3ZpZGVyLlxyXG4gKi9cclxuZnVuY3Rpb24gaXNWZXJzaW9uU2VydmljZVByb3ZpZGVyKHByb3ZpZGVyKSB7XHJcbiAgICB2YXIgY29tcG9uZW50ID0gcHJvdmlkZXIuZ2V0Q29tcG9uZW50KCk7XHJcbiAgICByZXR1cm4gKGNvbXBvbmVudCA9PT0gbnVsbCB8fCBjb21wb25lbnQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNvbXBvbmVudC50eXBlKSA9PT0gXCJWRVJTSU9OXCIgLyogVkVSU0lPTiAqLztcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5mdW5jdGlvbiByZWdpc3RlckNvcmVDb21wb25lbnRzKGZpcmViYXNlLCB2YXJpYW50KSB7XHJcbiAgICBmaXJlYmFzZS5JTlRFUk5BTC5yZWdpc3RlckNvbXBvbmVudChuZXcgY29tcG9uZW50LkNvbXBvbmVudCgncGxhdGZvcm0tbG9nZ2VyJywgZnVuY3Rpb24gKGNvbnRhaW5lcikgeyByZXR1cm4gbmV3IFBsYXRmb3JtTG9nZ2VyU2VydmljZShjb250YWluZXIpOyB9LCBcIlBSSVZBVEVcIiAvKiBQUklWQVRFICovKSk7XHJcbiAgICAvLyBSZWdpc3RlciBgYXBwYCBwYWNrYWdlLlxyXG4gICAgZmlyZWJhc2UucmVnaXN0ZXJWZXJzaW9uKG5hbWUkMSwgdmVyc2lvbiwgdmFyaWFudCk7XHJcbiAgICAvLyBSZWdpc3RlciBwbGF0Zm9ybSBTREsgaWRlbnRpZmllciAobm8gdmVyc2lvbikuXHJcbiAgICBmaXJlYmFzZS5yZWdpc3RlclZlcnNpb24oJ2ZpcmUtanMnLCAnJyk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLy8gRmlyZWJhc2UgTGl0ZSBkZXRlY3Rpb24gdGVzdFxyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG5pZiAodXRpbC5pc0Jyb3dzZXIoKSAmJiBzZWxmLmZpcmViYXNlICE9PSB1bmRlZmluZWQpIHtcclxuICAgIGxvZ2dlci53YXJuKFwiXFxuICAgIFdhcm5pbmc6IEZpcmViYXNlIGlzIGFscmVhZHkgZGVmaW5lZCBpbiB0aGUgZ2xvYmFsIHNjb3BlLiBQbGVhc2UgbWFrZSBzdXJlXFxuICAgIEZpcmViYXNlIGxpYnJhcnkgaXMgb25seSBsb2FkZWQgb25jZS5cXG4gIFwiKTtcclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxyXG4gICAgdmFyIHNka1ZlcnNpb24gPSBzZWxmLmZpcmViYXNlLlNES19WRVJTSU9OO1xyXG4gICAgaWYgKHNka1ZlcnNpb24gJiYgc2RrVmVyc2lvbi5pbmRleE9mKCdMSVRFJykgPj0gMCkge1xyXG4gICAgICAgIGxvZ2dlci53YXJuKFwiXFxuICAgIFdhcm5pbmc6IFlvdSBhcmUgdHJ5aW5nIHRvIGxvYWQgRmlyZWJhc2Ugd2hpbGUgdXNpbmcgRmlyZWJhc2UgUGVyZm9ybWFuY2Ugc3RhbmRhbG9uZSBzY3JpcHQuXFxuICAgIFlvdSBzaG91bGQgbG9hZCBGaXJlYmFzZSBQZXJmb3JtYW5jZSB3aXRoIHRoaXMgaW5zdGFuY2Ugb2YgRmlyZWJhc2UgdG8gYXZvaWQgbG9hZGluZyBkdXBsaWNhdGUgY29kZS5cXG4gICAgXCIpO1xyXG4gICAgfVxyXG59XHJcbnZhciBpbml0aWFsaXplQXBwID0gZmlyZWJhc2UuaW5pdGlhbGl6ZUFwcDtcclxuLy8gVE9ETzogVGhpcyBkaXNhYmxlIGNhbiBiZSByZW1vdmVkIGFuZCB0aGUgJ2lnbm9yZVJlc3RBcmdzJyBvcHRpb24gYWRkZWQgdG9cclxuLy8gdGhlIG5vLWV4cGxpY2l0LWFueSBydWxlIHdoZW4gRVNsaW50IHJlbGVhc2VzIGl0LlxyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG5maXJlYmFzZS5pbml0aWFsaXplQXBwID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGFyZ3MgPSBbXTtcclxuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgfVxyXG4gICAgLy8gRW52aXJvbm1lbnQgY2hlY2sgYmVmb3JlIGluaXRpYWxpemluZyBhcHBcclxuICAgIC8vIERvIHRoZSBjaGVjayBpbiBpbml0aWFsaXplQXBwLCBzbyBwZW9wbGUgaGF2ZSBhIGNoYW5jZSB0byBkaXNhYmxlIGl0IGJ5IHNldHRpbmcgbG9nTGV2ZWxcclxuICAgIC8vIGluIEBmaXJlYmFzZS9sb2dnZXJcclxuICAgIGlmICh1dGlsLmlzTm9kZSgpKSB7XHJcbiAgICAgICAgbG9nZ2VyLndhcm4oXCJcXG4gICAgICBXYXJuaW5nOiBUaGlzIGlzIGEgYnJvd3Nlci10YXJnZXRlZCBGaXJlYmFzZSBidW5kbGUgYnV0IGl0IGFwcGVhcnMgaXQgaXMgYmVpbmdcXG4gICAgICBydW4gaW4gYSBOb2RlIGVudmlyb25tZW50LiAgSWYgcnVubmluZyBpbiBhIE5vZGUgZW52aXJvbm1lbnQsIG1ha2Ugc3VyZSB5b3VcXG4gICAgICBhcmUgdXNpbmcgdGhlIGJ1bmRsZSBzcGVjaWZpZWQgYnkgdGhlIFxcXCJtYWluXFxcIiBmaWVsZCBpbiBwYWNrYWdlLmpzb24uXFxuICAgICAgXFxuICAgICAgSWYgeW91IGFyZSB1c2luZyBXZWJwYWNrLCB5b3UgY2FuIHNwZWNpZnkgXFxcIm1haW5cXFwiIGFzIHRoZSBmaXJzdCBpdGVtIGluXFxuICAgICAgXFxcInJlc29sdmUubWFpbkZpZWxkc1xcXCI6XFxuICAgICAgaHR0cHM6Ly93ZWJwYWNrLmpzLm9yZy9jb25maWd1cmF0aW9uL3Jlc29sdmUvI3Jlc29sdmVtYWluZmllbGRzXFxuICAgICAgXFxuICAgICAgSWYgdXNpbmcgUm9sbHVwLCB1c2UgdGhlIHJvbGx1cC1wbHVnaW4tbm9kZS1yZXNvbHZlIHBsdWdpbiBhbmQgc3BlY2lmeSBcXFwibWFpblxcXCJcXG4gICAgICBhcyB0aGUgZmlyc3QgaXRlbSBpbiBcXFwibWFpbkZpZWxkc1xcXCIsIGUuZy4gWydtYWluJywgJ21vZHVsZSddLlxcbiAgICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9yb2xsdXAvcm9sbHVwLXBsdWdpbi1ub2RlLXJlc29sdmVcXG4gICAgICBcIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaW5pdGlhbGl6ZUFwcC5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xyXG59O1xyXG52YXIgZmlyZWJhc2UkMSA9IGZpcmViYXNlO1xyXG5yZWdpc3RlckNvcmVDb21wb25lbnRzKGZpcmViYXNlJDEpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBmaXJlYmFzZSQxO1xuZXhwb3J0cy5maXJlYmFzZSA9IGZpcmViYXNlJDE7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5janMuanMubWFwXG4iXSwibmFtZXMiOlsiZ2xvYmFsIiwidHNsaWIiLCJ1dGlsIiwibG9nZ2VyJDEiLCJjb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTtBQUNBLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzlEO0FBQzZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFNBQVMsR0FBRztBQUNoQjtBQUNBO0FBQ0E7QUFDQSxJQUFJLFdBQVcsRUFBRSxLQUFLO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBLElBQUksVUFBVSxFQUFFLEtBQUs7QUFDckI7QUFDQTtBQUNBO0FBQ0EsSUFBSSxXQUFXLEVBQUUsbUJBQW1CO0FBQ3BDLENBQUMsQ0FBQztBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJ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USxDQUFDLEVBQUUsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRSxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUM1SCxTQUFTO0FBQ1QsUUFBUSxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDL0IsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFlBQVksRUFBRSxVQUFVLEtBQUssRUFBRSxPQUFPLEVBQUU7QUFDNUM7QUFDQTtBQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsa0JBQWtCLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDakQsWUFBWSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMvQixTQUFTO0FBQ1QsUUFBUSxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDdkUsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFlBQVksRUFBRSxVQUFVLEtBQUssRUFBRSxPQUFPLEVBQUU7QUFDNUM7QUFDQTtBQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsa0JBQWtCLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDakQsWUFBWSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMvQixTQUFTO0FBQ1QsUUFBUSxPQUFPLGlCQUFpQixDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUMvRSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSx1QkFBdUIsRUFBRSxVQUFVLEtBQUssRUFBRSxPQUFPLEVBQUU7QUFDdkQsUUFBUSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7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QyxHQUFHLENBQUMsQ0FBQztBQUN6QixTQUFTO0FBQ1QsYUFBYSxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUU7QUFDM0IsWUFBWSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDO0FBQ3RDLFlBQVksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEdBQUcsQ0FBQztBQUN0QyxTQUFTO0FBQ1QsYUFBYSxJQUFJLENBQUMsR0FBRyxLQUFLLEVBQUU7QUFDNUIsWUFBWSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksR0FBRyxDQUFDO0FBQ3ZDLFlBQVksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQztBQUM3QyxZQUFZLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxHQUFHLENBQUM7QUFDdEMsU0FBUztBQUNULGFBQWE7QUFDYixZQUFZLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxHQUFHLENBQUM7QUFDdkMsWUFBWSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksR0FBRyxDQUFDO0FBQzlDLFlBQVksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQztBQUM3QyxZQUFZLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxHQUFHLENBQUM7QUFDdEMsU0FBUztBQUNULEtBQUs7QUFDTCxJQUFJLE9BQU8sR0FBRyxD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QUFDLENBQUMsQ0FBQztBQUM5RyxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbEYsS0FBSyxDQUFDO0FBQ04sSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxZQUFZO0FBQ3hDLFFBQVEsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLFFBQVEsS0FBSyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDdEQsWUFBWSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JDLFNBQVM7QUFDVCxRQUFRLElBQUksQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM5RyxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbEYsS0FBSyxDQUFDO0FBQ04sSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxZQUFZO0FBQ3pDLFFBQVEsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLFFBQVEsS0FBSyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDdEQsWUFBWSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JD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
