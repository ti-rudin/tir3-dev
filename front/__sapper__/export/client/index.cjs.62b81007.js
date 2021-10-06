import{t as e}from"./client.0adb7cab.js";var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function r(e,t,r){return e(r={path:t,exports:{},require:function(e,t){return function(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}(null==t&&r.path)}},r.exports),r.exports}var n,i=r((function(r,n){Object.defineProperty(n,"__esModule",{value:!0});
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
var i={NODE_CLIENT:!1,NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"},o=function(e,t){if(!e)throw a(t)},a=function(e){return new Error("Firebase Database ("+i.SDK_VERSION+") INTERNAL ASSERT FAILED: "+e)},s=function(e){for(var t=[],r=0,n=0;n<e.length;n++){var i=e.charCodeAt(n);i<128?t[r++]=i:i<2048?(t[r++]=i>>6|192,t[r++]=63&i|128):55296==(64512&i)&&n+1<e.length&&56320==(64512&e.charCodeAt(n+1))?(i=65536+((1023&i)<<10)+(1023&e.charCodeAt(++n)),t[r++]=i>>18|240,t[r++]=i>>12&63|128,t[r++]=i>>6&63|128,t[r++]=63&i|128):(t[r++]=i>>12|224,t[r++]=i>>6&63|128,t[r++]=63&i|128)}return t},c={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray:function(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();for(var r=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[],i=0;i<e.length;i+=3){var o=e[i],a=i+1<e.length,s=a?e[i+1]:0,c=i+2<e.length,u=c?e[i+2]:0,f=o>>2,l=(3&o)<<4|s>>4,h=(15&s)<<2|u>>6,p=63&u;c||(p=64,a||(h=64)),n.push(r[f],r[l],r[h],r[p])}return n.join("")},encodeString:function(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(s(e),t)},decodeString:function(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):function(e){for(var t=[],r=0,n=0;r<e.length;){var i=e[r++];if(i<128)t[n++]=String.fromCharCode(i);else if(i>191&&i<224){var o=e[r++];t[n++]=String.fromCharCode((31&i)<<6|63&o)}else if(i>239&&i<365){var a=((7&i)<<18|(63&(o=e[r++]))<<12|(63&(s=e[r++]))<<6|63&e[r++])-65536;t[n++]=String.fromCharCode(55296+(a>>10)),t[n++]=String.fromCharCode(56320+(1023&a))}else{o=e[r++];var s=e[r++];t[n++]=String.fromCharCode((15&i)<<12|(63&o)<<6|63&s)}}return t.join("")}(this.decodeStringToByteArray(e,t))},decodeStringToByteArray:function(e,t){this.init_();for(var r=t?this.charToByteMapWebSafe_:this.charToByteMap_,n=[],i=0;i<e.length;){var o=r[e.charAt(i++)],a=i<e.length?r[e.charAt(i)]:0,s=++i<e.length?r[e.charAt(i)]:64,c=++i<e.length?r[e.charAt(i)]:64;if(++i,null==o||null==a||null==s||null==c)throw Error();var u=o<<2|a>>4;if(n.push(u),64!==s){var f=a<<4&240|s>>2;if(n.push(f),64!==c){var l=s<<6&192|c;n.push(l)}}}return n},init_:function(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(var e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}},u=function(e){try{return c.decodeString(e,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};
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
 */function f(e,t){if(!(t instanceof Object))return t;switch(t.constructor){case Date:return new Date(t.getTime());case Object:void 0===e&&(e={});break;case Array:e=[];break;default:return t}for(var r in t)t.hasOwnProperty(r)&&(e[r]=f(e[r],t[r]));return e}
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
 */var l=function(){function e(){var e=this;this.reject=function(){},this.resolve=function(){},this.promise=new Promise((function(t,r){e.resolve=t,e.reject=r}))}return e.prototype.wrapCallback=function(e){var t=this;return function(r,n){r?t.reject(r):t.resolve(n),"function"==typeof e&&(t.promise.catch((function(){})),1===e.length?e(r):e(r,n))}},e}();
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
 */function h(){return"undefined"!=typeof navigator&&"string"==typeof navigator.userAgent?navigator.userAgent:""}function p(){try{return"[object process]"===Object.prototype.toString.call(t.process)}catch(e){return!1}}
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
var d=function(t){function r(e,n){var i=t.call(this,n)||this;return i.code=e,i.name="FirebaseError",Object.setPrototypeOf(i,r.prototype),Error.captureStackTrace&&Error.captureStackTrace(i,v.prototype.create),i}return e.__extends(r,t),r}(Error),v=function(){function e(e,t,r){this.service=e,this.serviceName=t,this.errors=r}return e.prototype.create=function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];for(var n=t[0]||{},i=this.service+"/"+e,o=this.errors[e],a=o?g(o,n):"Error",s=this.serviceName+": "+a+" ("+i+").",c=new d(i,s),u=0,f=Object.keys(n);u<f.length;u++){var l=f[u];"_"!==l.slice(-1)&&(l in c&&console.warn('Overwriting FirebaseError base field "'+l+'" can cause unexpected behavior.'),c[l]=n[l])}return c},e}();function g(e,t){return e.replace(y,(function(e,r){var n=t[r];return null!=n?String(n):"<"+r+"?>"}))}var y=/\{\$([^}]+)}/g;
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
 */function b(e){return JSON.parse(e)}
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
var m=function(e){var t={},r={},n={},i="";try{var o=e.split(".");t=b(u(o[0])||""),r=b(u(o[1])||""),i=o[2],n=r.d||{},delete r.d}catch(e){}return{header:t,claims:r,data:n,signature:i}};
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
var _=function(){function e(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=64,this.pad_[0]=128;for(var e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}return e.prototype.reset=function(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0},e.prototype.compress_=function(e,t){t||(t=0);var r=this.W_;if("string"==typeof e)for(var n=0;n<16;n++)r[n]=e.charCodeAt(t)<<24|e.charCodeAt(t+1)<<16|e.charCodeAt(t+2)<<8|e.charCodeAt(t+3),t+=4;else for(n=0;n<16;n++)r[n]=e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3],t+=4;for(n=16;n<80;n++){var i=r[n-3]^r[n-8]^r[n-14]^r[n-16];r[n]=4294967295&(i<<1|i>>>31)}var o,a,s=this.chain_[0],c=this.chain_[1],u=this.chain_[2],f=this.chain_[3],l=this.chain_[4];for(n=0;n<80;n++){n<40?n<20?(o=f^c&(u^f),a=1518500249):(o=c^u^f,a=1859775393):n<60?(o=c&u|f&(c|u),a=2400959708):(o=c^u^f,a=3395469782);i=(s<<5|s>>>27)+o+l+a+r[n]&4294967295;l=f,f=u,u=4294967295&(c<<30|c>>>2),c=s,s=i}this.chain_[0]=this.chain_[0]+s&4294967295,this.chain_[1]=this.chain_[1]+c&4294967295,this.chain_[2]=this.chain_[2]+u&4294967295,this.chain_[3]=this.chain_[3]+f&4294967295,this.chain_[4]=this.chain_[4]+l&4294967295},e.prototype.update=function(e,t){if(null!=e){void 0===t&&(t=e.length);for(var r=t-this.blockSize,n=0,i=this.buf_,o=this.inbuf_;n<t;){if(0===o)for(;n<=r;)this.compress_(e,n),n+=this.blockSize;if("string"==typeof e){for(;n<t;)if(i[o]=e.charCodeAt(n),++n,++o===this.blockSize){this.compress_(i),o=0;break}}else for(;n<t;)if(i[o]=e[n],++n,++o===this.blockSize){this.compress_(i),o=0;break}}this.inbuf_=o,this.total_+=t}},e.prototype.digest=function(){var e=[],t=8*this.total_;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(var r=this.blockSize-1;r>=56;r--)this.buf_[r]=255&t,t/=256;this.compress_(this.buf_);var n=0;for(r=0;r<5;r++)for(var i=24;i>=0;i-=8)e[n]=this.chain_[r]>>i&255,++n;return e},e}();var E=function(){function e(e,t){var r=this;this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then((function(){e(r)})).catch((function(e){r.error(e)}))}return e.prototype.next=function(e){this.forEachObserver((function(t){t.next(e)}))},e.prototype.error=function(e){this.forEachObserver((function(t){t.error(e)})),this.close(e)},e.prototype.complete=function(){this.forEachObserver((function(e){e.complete()})),this.close()},e.prototype.subscribe=function(e,t,r){var n,i=this;if(void 0===e&&void 0===t&&void 0===r)throw new Error("Missing Observer.");void 0===(n=function(e,t){if("object"!=typeof e||null===e)return!1;for(var r=0,n=t;r<n.length;r++){var i=n[r];if(i in e&&"function"==typeof e[i])return!0}return!1}(e,["next","error","complete"])?e:{next:e,error:t,complete:r}).next&&(n.next=w),void 0===n.error&&(n.error=w),void 0===n.complete&&(n.complete=w);var o=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then((function(){try{i.finalError?n.error(i.finalError):n.complete()}catch(e){}})),this.observers.push(n),o},e.prototype.unsubscribeOne=function(e){void 0!==this.observers&&void 0!==this.observers[e]&&(delete this.observers[e],this.observerCount-=1,0===this.observerCount&&void 0!==this.onNoObservers&&this.onNoObservers(this))},e.prototype.forEachObserver=function(e){if(!this.finalized)for(var t=0;t<this.observers.length;t++)this.sendOne(t,e)},e.prototype.sendOne=function(e,t){var r=this;this.task.then((function(){if(void 0!==r.observers&&void 0!==r.observers[e])try{t(r.observers[e])}catch(e){"undefined"!=typeof console&&console.error&&console.error(e)}}))},e.prototype.close=function(e){var t=this;this.finalized||(this.finalized=!0,void 0!==e&&(this.finalError=e),this.task.then((function(){t.observers=void 0,t.onNoObservers=void 0})))},e}();function w(){}
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
 */function A(e,t,r){var n="";switch(t){case 1:n=r?"first":"First";break;case 2:n=r?"second":"Second";break;case 3:n=r?"third":"Third";break;case 4:n=r?"fourth":"Fourth";break;default:throw new Error("errorPrefix called with argumentNumber > 4.  Need to update it?")}var i=e+" failed: ";return i+=n+" argument "}n.CONSTANTS=i,n.Deferred=l,n.ErrorFactory=v,n.FirebaseError=d,n.Sha1=_,n.assert=o,n.assertionError=a,n.async=function(e,t){return function(){for(var r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];Promise.resolve(!0).then((function(){e.apply(void 0,r)})).catch((function(e){t&&t(e)}))}},n.base64=c,n.base64Decode=u,n.base64Encode=function(e){var t=s(e);return c.encodeByteArray(t,!0)},n.contains=
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
function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.createSubscribe=function(e,t){var r=new E(e,t);return r.subscribe.bind(r)},n.decode=m,n.deepCopy=
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
function(e){return f(void 0,e)},n.deepExtend=f,n.errorPrefix=A,n.getUA=h,n.isAdmin=function(e){var t=m(e).claims;return"object"==typeof t&&!0===t.admin},n.isBrowser=function(){return"object"==typeof self&&self.self===self},n.isBrowserExtension=function(){var e="object"==typeof chrome?chrome.runtime:"object"==typeof browser?browser.runtime:void 0;return"object"==typeof e&&void 0!==e.id},n.isElectron=function(){return h().indexOf("Electron/")>=0},n.isEmpty=function(e){for(var t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0},n.isIE=function(){var e=h();return e.indexOf("MSIE ")>=0||e.indexOf("Trident/")>=0},n.isMobileCordova=function(){return"undefined"!=typeof window&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(h())},n.isNode=p,n.isNodeSdk=function(){return!0===i.NODE_CLIENT||!0===i.NODE_ADMIN},n.isReactNative=function(){return"object"==typeof navigator&&"ReactNative"===navigator.product},n.isSafari=function(){return!p()&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")},n.isUWP=function(){return h().indexOf("MSAppHost/")>=0},n.isValidFormat=function(e){var t=m(e).claims;return!!t&&"object"==typeof t&&t.hasOwnProperty("iat")},n.isValidTimestamp=function(e){var t=m(e).claims,r=Math.floor((new Date).getTime()/1e3),n=0,i=0;return"object"==typeof t&&(t.hasOwnProperty("nbf")?n=t.nbf:t.hasOwnProperty("iat")&&(n=t.iat),i=t.hasOwnProperty("exp")?t.exp:n+86400),!!r&&!!n&&!!i&&r>=n&&r<=i},n.issuedAtTime=function(e){var t=m(e).claims;return"object"==typeof t&&t.hasOwnProperty("iat")?t.iat:null},n.jsonEval=b,n.map=function(e,t,r){var n={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(n[i]=t.call(r,e[i],i,e));return n}
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
 */,n.querystring=function(e){for(var t=[],r=function(e,r){Array.isArray(r)?r.forEach((function(r){t.push(encodeURIComponent(e)+"="+encodeURIComponent(r))})):t.push(encodeURIComponent(e)+"="+encodeURIComponent(r))},n=0,i=Object.entries(e);n<i.length;n++){var o=i[n];r(o[0],o[1])}return t.length?"&"+t.join("&"):""},n.querystringDecode=function(e){var t={};return e.replace(/^\?/,"").split("&").forEach((function(e){if(e){var r=e.split("=");t[r[0]]=r[1]}})),t},n.safeGet=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)?e[t]:void 0},n.stringLength=function(e){for(var t=0,r=0;r<e.length;r++){var n=e.charCodeAt(r);n<128?t++:n<2048?t+=2:n>=55296&&n<=56319?(t+=4,r++):t+=3}return t},n.stringToByteArray=function(e){for(var t=[],r=0,n=0;n<e.length;n++){var i=e.charCodeAt(n);if(i>=55296&&i<=56319){var a=i-55296;n++,o(n<e.length,"Surrogate pair missing trail surrogate."),i=65536+(a<<10)+(e.charCodeAt(n)-56320)}i<128?t[r++]=i:i<2048?(t[r++]=i>>6|192,t[r++]=63&i|128):i<65536?(t[r++]=i>>12|224,t[r++]=i>>6&63|128,t[r++]=63&i|128):(t[r++]=i>>18|240,t[r++]=i>>12&63|128,t[r++]=i>>6&63|128,t[r++]=63&i|128)}return t},n.stringify=function(e){return JSON.stringify(e)},n.validateArgCount=function(e,t,r,n){var i;if(n<t?i="at least "+t:n>r&&(i=0===r?"none":"no more than "+r),i)throw new Error(e+" failed: Was called with "+n+(1===n?" argument.":" arguments.")+" Expects "+i+".")},n.validateCallback=function(e,t,r,n){if((!n||r)&&"function"!=typeof r)throw new Error(A(e,t,n)+"must be a valid function.")},n.validateContextObject=function(e,t,r,n){if((!n||r)&&("object"!=typeof r||null===r))throw new Error(A(e,t,n)+"must be a valid context object.")}
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
 */,n.validateNamespace=function(e,t,r,n){if((!n||r)&&"string"!=typeof r)throw new Error(A(e,t,n)+"must be a valid firebase namespace.")}})),o=r((function(t,r){Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function e(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY"}return e.prototype.setInstantiationMode=function(e){return this.instantiationMode=e,this},e.prototype.setMultipleInstances=function(e){return this.multipleInstances=e,this},e.prototype.setServiceProps=function(e){return this.serviceProps=e,this},e}(),o=function(){function t(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map}return t.prototype.get=function(e){void 0===e&&(e="[DEFAULT]");var t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){var r=new i.Deferred;this.instancesDeferred.set(t,r);try{var n=this.getOrInitializeService(t);n&&r.resolve(n)}catch(e){}}return this.instancesDeferred.get(t).promise},t.prototype.getImmediate=function(t){var r=e.__assign({identifier:"[DEFAULT]",optional:!1},t),n=r.identifier,i=r.optional,o=this.normalizeInstanceIdentifier(n);try{var a=this.getOrInitializeService(o);if(!a){if(i)return null;throw Error("Service "+this.name+" is not available")}return a}catch(e){if(i)return null;throw e}},t.prototype.getComponent=function(){return this.component},t.prototype.setComponent=function(t){var r,n;if(t.name!==this.name)throw Error("Mismatching Component "+t.name+" for Provider "+this.name+".");if(this.component)throw Error("Component for "+this.name+" has already been provided");if(this.component=t,function(e){return"EAGER"===e.instantiationMode}
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
 */(t))try{this.getOrInitializeService("[DEFAULT]")}catch(e){}try{for(var i=e.__values(this.instancesDeferred.entries()),o=i.next();!o.done;o=i.next()){var a=e.__read(o.value,2),s=a[0],c=a[1],u=this.normalizeInstanceIdentifier(s);try{var f=this.getOrInitializeService(u);c.resolve(f)}catch(e){}}}catch(e){r={error:e}}finally{try{o&&!o.done&&(n=i.return)&&n.call(i)}finally{if(r)throw r.error}}},t.prototype.clearInstance=function(e){void 0===e&&(e="[DEFAULT]"),this.instancesDeferred.delete(e),this.instances.delete(e)},t.prototype.delete=function(){return e.__awaiter(this,void 0,void 0,(function(){var t;return e.__generator(this,(function(e){switch(e.label){case 0:return t=Array.from(this.instances.values()),[4,Promise.all(t.filter((function(e){return"INTERNAL"in e})).map((function(e){return e.INTERNAL.delete()})))];case 1:return e.sent(),[2]}}))}))},t.prototype.isComponentSet=function(){return null!=this.component},t.prototype.getOrInitializeService=function(e){var t=this.instances.get(e);return!t&&this.component&&(t=this.component.instanceFactory(this.container,function(e){return"[DEFAULT]"===e?void 0:e}(e)),this.instances.set(e,t)),t||null},t.prototype.normalizeInstanceIdentifier=function(e){return this.component?this.component.multipleInstances?e:"[DEFAULT]":e},t}();
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
 */var a=function(){function e(e){this.name=e,this.providers=new Map}return e.prototype.addComponent=function(e){var t=this.getProvider(e.name);if(t.isComponentSet())throw new Error("Component "+e.name+" has already been registered with "+this.name);t.setComponent(e)},e.prototype.addOrOverwriteComponent=function(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)},e.prototype.getProvider=function(e){if(this.providers.has(e))return this.providers.get(e);var t=new o(e,this);return this.providers.set(e,t),t},e.prototype.getProviders=function(){return Array.from(this.providers.values())},e}();r.Component=n,r.ComponentContainer=a,r.Provider=o}));
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
function a(){for(var e=0,t=0,r=arguments.length;t<r;t++)e+=arguments[t].length;var n=Array(e),i=0;for(t=0;t<r;t++)for(var o=arguments[t],a=0,s=o.length;a<s;a++,i++)n[i]=o[a];return n}
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
 */var s,c=[];!function(e){e[e.DEBUG=0]="DEBUG",e[e.VERBOSE=1]="VERBOSE",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.ERROR=4]="ERROR",e[e.SILENT=5]="SILENT"}(s||(s={}));var u={debug:s.DEBUG,verbose:s.VERBOSE,info:s.INFO,warn:s.WARN,error:s.ERROR,silent:s.SILENT},f=s.INFO,l=((n={})[s.DEBUG]="log",n[s.VERBOSE]="log",n[s.INFO]="info",n[s.WARN]="warn",n[s.ERROR]="error",n),h=function(e,t){for(var r=[],n=2;n<arguments.length;n++)r[n-2]=arguments[n];if(!(t<e.logLevel)){var i=(new Date).toISOString(),o=l[t];if(!o)throw new Error("Attempted to log a message with an invalid logType (value: "+t+")");console[o].apply(console,a(["["+i+"]  "+e.name+":"],r))}},p=function(){function e(e){this.name=e,this._logLevel=f,this._logHandler=h,this._userLogHandler=null,c.push(this)}return Object.defineProperty(e.prototype,"logLevel",{get:function(){return this._logLevel},set:function(e){if(!(e in s))throw new TypeError('Invalid value "'+e+'" assigned to `logLevel`');this._logLevel=e},enumerable:!1,configurable:!0}),e.prototype.setLogLevel=function(e){this._logLevel="string"==typeof e?u[e]:e},Object.defineProperty(e.prototype,"logHandler",{get:function(){return this._logHandler},set:function(e){if("function"!=typeof e)throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"userLogHandler",{get:function(){return this._userLogHandler},set:function(e){this._userLogHandler=e},enumerable:!1,configurable:!0}),e.prototype.debug=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._userLogHandler&&this._userLogHandler.apply(this,a([this,s.DEBUG],e)),this._logHandler.apply(this,a([this,s.DEBUG],e))},e.prototype.log=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._userLogHandler&&this._userLogHandler.apply(this,a([this,s.VERBOSE],e)),this._logHandler.apply(this,a([this,s.VERBOSE],e))},e.prototype.info=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._userLogHandler&&this._userLogHandler.apply(this,a([this,s.INFO],e)),this._logHandler.apply(this,a([this,s.INFO],e))},e.prototype.warn=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._userLogHandler&&this._userLogHandler.apply(this,a([this,s.WARN],e)),this._logHandler.apply(this,a([this,s.WARN],e))},e.prototype.error=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._userLogHandler&&this._userLogHandler.apply(this,a([this,s.ERROR],e)),this._logHandler.apply(this,a([this,s.ERROR],e))},e}();var d=Object.freeze({__proto__:null,get LogLevel(){return s},Logger:p,setLogLevel:function(e){c.forEach((function(t){t.setLogLevel(e)}))},setUserLogHandler:function(e,t){for(var r=function(r){var n=null;t&&t.level&&(n=u[t.level]),r.userLogHandler=null===e?null:function(t,r){for(var i=[],o=2;o<arguments.length;o++)i[o-2]=arguments[o];var a=i.map((function(e){if(null==e)return null;if("string"==typeof e)return e;if("number"==typeof e||"boolean"==typeof e)return e.toString();if(e instanceof Error)return e.message;try{return JSON.stringify(e)}catch(e){return null}})).filter((function(e){return e})).join(" ");r>=(null!=n?n:t.logLevel)&&e({level:s[r].toLowerCase(),message:a,args:i,type:t.name})}},n=0,i=c;n<i.length;n++){r(i[n])}}}),v=r((function(t,r){
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
var n;Object.defineProperty(r,"__esModule",{value:!0});var a,s=((n={})["no-app"]="No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()",n["bad-app-name"]="Illegal App name: '{$appName}",n["duplicate-app"]="Firebase App named '{$appName}' already exists",n["app-deleted"]="Firebase App named '{$appName}' already deleted",n["invalid-app-argument"]="firebase.{$appName}() takes either no argument or a Firebase App instance.",n["invalid-log-argument"]="First argument to `onLog` must be null or a function.",n),c=new i.ErrorFactory("app","Firebase",s),u=((a={})["@firebase/app"]="fire-core",a["@firebase/analytics"]="fire-analytics",a["@firebase/auth"]="fire-auth",a["@firebase/database"]="fire-rtdb",a["@firebase/functions"]="fire-fn",a["@firebase/installations"]="fire-iid",a["@firebase/messaging"]="fire-fcm",a["@firebase/performance"]="fire-perf",a["@firebase/remote-config"]="fire-rc",a["@firebase/storage"]="fire-gcs",a["@firebase/firestore"]="fire-fst",a["fire-js"]="fire-js",a["firebase-wrapper"]="fire-js-all",a),f=new d.Logger("@firebase/app"),l=function(){function t(t,r,n){var a,s,c=this;this.firebase_=n,this.isDeleted_=!1,this.name_=r.name,this.automaticDataCollectionEnabled_=r.automaticDataCollectionEnabled||!1,this.options_=i.deepCopy(t),this.container=new o.ComponentContainer(r.name),this._addComponent(new o.Component("app",(function(){return c}),"PUBLIC"));try{for(var u=e.__values(this.firebase_.INTERNAL.components.values()),f=u.next();!f.done;f=u.next()){var l=f.value;this._addComponent(l)}}catch(e){a={error:e}}finally{try{f&&!f.done&&(s=u.return)&&s.call(u)}finally{if(a)throw a.error}}}return Object.defineProperty(t.prototype,"automaticDataCollectionEnabled",{get:function(){return this.checkDestroyed_(),this.automaticDataCollectionEnabled_},set:function(e){this.checkDestroyed_(),this.automaticDataCollectionEnabled_=e},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"name",{get:function(){return this.checkDestroyed_(),this.name_},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"options",{get:function(){return this.checkDestroyed_(),this.options_},enumerable:!1,configurable:!0}),t.prototype.delete=function(){var e=this;return new Promise((function(t){e.checkDestroyed_(),t()})).then((function(){return e.firebase_.INTERNAL.removeApp(e.name_),Promise.all(e.container.getProviders().map((function(e){return e.delete()})))})).then((function(){e.isDeleted_=!0}))},t.prototype._getService=function(e,t){return void 0===t&&(t="[DEFAULT]"),this.checkDestroyed_(),this.container.getProvider(e).getImmediate({identifier:t})},t.prototype._removeServiceInstance=function(e,t){void 0===t&&(t="[DEFAULT]"),this.container.getProvider(e).clearInstance(t)},t.prototype._addComponent=function(e){try{this.container.addComponent(e)}catch(t){f.debug("Component "+e.name+" failed to register with FirebaseApp "+this.name,t)}},t.prototype._addOrOverwriteComponent=function(e){this.container.addOrOverwriteComponent(e)},t.prototype.checkDestroyed_=function(){if(this.isDeleted_)throw c.create("app-deleted",{appName:this.name_})},t}();l.prototype.name&&l.prototype.options||l.prototype.delete||console.log("dc");var h=
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
function t(){var r=
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
function(t){var r={},n=new Map,a={__esModule:!0,initializeApp:function(e,n){void 0===n&&(n={});if("object"!=typeof n||null===n){n={name:n}}var o=n;void 0===o.name&&(o.name="[DEFAULT]");var s=o.name;if("string"!=typeof s||!s)throw c.create("bad-app-name",{appName:String(s)});if(i.contains(r,s))throw c.create("duplicate-app",{appName:s});var u=new t(e,o,a);return r[s]=u,u},app:s,registerVersion:function(e,t,r){var n,i=null!==(n=u[e])&&void 0!==n?n:e;r&&(i+="-"+r);var a=i.match(/\s|\//),s=t.match(/\s|\//);if(a||s){var c=['Unable to register library "'+i+'" with version "'+t+'":'];return a&&c.push('library name "'+i+'" contains illegal characters (whitespace or "/")'),a&&s&&c.push("and"),s&&c.push('version name "'+t+'" contains illegal characters (whitespace or "/")'),void f.warn(c.join(" "))}l(new o.Component(i+"-version",(function(){return{library:i,version:t}}),"VERSION"))},setLogLevel:d.setLogLevel,onLog:function(e,t){if(null!==e&&"function"!=typeof e)throw c.create("invalid-log-argument",{appName:name});d.setUserLogHandler(e,t)},apps:null,SDK_VERSION:"7.16.0",INTERNAL:{registerComponent:l,removeApp:function(e){delete r[e]},components:n,useAsService:function(e,t){if("serverAuth"===t)return null;return t}}};function s(e){if(e=e||"[DEFAULT]",!i.contains(r,e))throw c.create("no-app",{appName:e});return r[e]}function l(o){var u,l,h=o.name;if(n.has(h))return f.debug("There were multiple attempts to register component "+h+"."),"PUBLIC"===o.type?a[h]:null;if(n.set(h,o),"PUBLIC"===o.type){var p=function(e){if(void 0===e&&(e=s()),"function"!=typeof e[h])throw c.create("invalid-app-argument",{appName:h});return e[h]()};void 0!==o.serviceProps&&i.deepExtend(p,o.serviceProps),a[h]=p,t.prototype[h]=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];var r=this._getService.bind(this,h);return r.apply(this,o.multipleInstances?e:[])}}try{for(var d=e.__values(Object.keys(r)),v=d.next();!v.done;v=d.next()){var g=v.value;r[g]._addComponent(o)}}catch(e){u={error:e}}finally{try{v&&!v.done&&(l=d.return)&&l.call(d)}finally{if(u)throw u.error}}return"PUBLIC"===o.type?a[h]:null}return a.default=a,Object.defineProperty(a,"apps",{get:function(){return Object.keys(r).map((function(e){return r[e]}))}}),s.App=t,a}(l);return r.INTERNAL=e.__assign(e.__assign({},r.INTERNAL),{createFirebaseNamespace:t,extendNamespace:function(e){i.deepExtend(r,e)},createSubscribe:i.createSubscribe,ErrorFactory:i.ErrorFactory,deepExtend:i.deepExtend}),r}(),p=function(){function e(e){this.container=e}return e.prototype.getPlatformInfoString=function(){return this.container.getProviders().map((function(e){if(function(e){var t=e.getComponent();return"VERSION"===(null==t?void 0:t.type)}
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
 */(e)){var t=e.getImmediate();return t.library+"/"+t.version}return null})).filter((function(e){return e})).join(" ")},e}();
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
if(i.isBrowser()&&void 0!==self.firebase){f.warn("\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  ");var v=self.firebase.SDK_VERSION;v&&v.indexOf("LITE")>=0&&f.warn("\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    ")}var g=h.initializeApp;h.initializeApp=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return i.isNode()&&f.warn('\n      Warning: This is a browser-targeted Firebase bundle but it appears it is being\n      run in a Node environment.  If running in a Node environment, make sure you\n      are using the bundle specified by the "main" field in package.json.\n      \n      If you are using Webpack, you can specify "main" as the first item in\n      "resolve.mainFields":\n      https://webpack.js.org/configuration/resolve/#resolvemainfields\n      \n      If using Rollup, use the rollup-plugin-node-resolve plugin and specify "main"\n      as the first item in "mainFields", e.g. [\'main\', \'module\'].\n      https://github.com/rollup/rollup-plugin-node-resolve\n      '),g.apply(void 0,e)};var y=h;!function(e,t){e.INTERNAL.registerComponent(new o.Component("platform-logger",(function(e){return new p(e)}),"PRIVATE")),e.registerVersion("@firebase/app","0.6.8",t),e.registerVersion("fire-js","")}(y),r.default=y,r.firebase=y}));export{t as c,v as i};
