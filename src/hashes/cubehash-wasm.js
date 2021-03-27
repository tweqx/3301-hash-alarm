
var createCubehashModule = (function() {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return (
function(createCubehashModule) {
  createCubehashModule = createCubehashModule || {};

var Module=typeof createCubehashModule!=="undefined"?createCubehashModule:{};var readyPromiseResolve,readyPromiseReject;Module["ready"]=new Promise(function(resolve,reject){readyPromiseResolve=resolve;readyPromiseReject=reject});var moduleOverrides={};var key;for(key in Module){if(Module.hasOwnProperty(key)){moduleOverrides[key]=Module[key]}}var arguments_=[];var thisProgram="./this.program";var quit_=function(status,toThrow){throw toThrow};var ENVIRONMENT_IS_WEB=false;var ENVIRONMENT_IS_WORKER=false;var ENVIRONMENT_IS_NODE=false;var ENVIRONMENT_IS_SHELL=false;ENVIRONMENT_IS_WEB=typeof window==="object";ENVIRONMENT_IS_WORKER=typeof importScripts==="function";ENVIRONMENT_IS_NODE=typeof process==="object"&&typeof process.versions==="object"&&typeof process.versions.node==="string";ENVIRONMENT_IS_SHELL=!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_NODE&&!ENVIRONMENT_IS_WORKER;var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var read_,readAsync,readBinary,setWindowTitle;var nodeFS;var nodePath;if(ENVIRONMENT_IS_NODE){if(ENVIRONMENT_IS_WORKER){scriptDirectory=require("path").dirname(scriptDirectory)+"/"}else{scriptDirectory=__dirname+"/"}read_=function shell_read(filename,binary){if(!nodeFS)nodeFS=require("fs");if(!nodePath)nodePath=require("path");filename=nodePath["normalize"](filename);return nodeFS["readFileSync"](filename,binary?null:"utf8")};readBinary=function readBinary(filename){var ret=read_(filename,true);if(!ret.buffer){ret=new Uint8Array(ret)}assert(ret.buffer);return ret};if(process["argv"].length>1){thisProgram=process["argv"][1].replace(/\\/g,"/")}arguments_=process["argv"].slice(2);process["on"]("uncaughtException",function(ex){if(!(ex instanceof ExitStatus)){throw ex}});process["on"]("unhandledRejection",abort);quit_=function(status){process["exit"](status)};Module["inspect"]=function(){return"[Emscripten Module object]"}}else if(ENVIRONMENT_IS_SHELL){if(typeof read!="undefined"){read_=function shell_read(f){return read(f)}}readBinary=function readBinary(f){var data;if(typeof readbuffer==="function"){return new Uint8Array(readbuffer(f))}data=read(f,"binary");assert(typeof data==="object");return data};if(typeof scriptArgs!="undefined"){arguments_=scriptArgs}else if(typeof arguments!="undefined"){arguments_=arguments}if(typeof quit==="function"){quit_=function(status){quit(status)}}if(typeof print!=="undefined"){if(typeof console==="undefined")console={};console.log=print;console.warn=console.error=typeof printErr!=="undefined"?printErr:print}}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href}else if(typeof document!=="undefined"&&document.currentScript){scriptDirectory=document.currentScript.src}if(_scriptDir){scriptDirectory=_scriptDir}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.lastIndexOf("/")+1)}else{scriptDirectory=""}{read_=function(url){var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText};if(ENVIRONMENT_IS_WORKER){readBinary=function(url){var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}}readAsync=function(url,onload,onerror){var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=function(){if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}onerror()};xhr.onerror=onerror;xhr.send(null)}}setWindowTitle=function(title){document.title=title}}else{}var out=Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.warn.bind(console);for(key in moduleOverrides){if(moduleOverrides.hasOwnProperty(key)){Module[key]=moduleOverrides[key]}}moduleOverrides=null;if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];if(Module["quit"])quit_=Module["quit"];var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];var noExitRuntime=Module["noExitRuntime"]||true;if(typeof WebAssembly!=="object"){abort("no native wasm support detected")}var wasmMemory;var ABORT=false;var EXITSTATUS;function assert(condition,text){if(!condition){abort("Assertion failed: "+text)}}function getCFunc(ident){var func=Module["_"+ident];assert(func,"Cannot call unknown function "+ident+", make sure it is exported");return func}function ccall(ident,returnType,argTypes,args,opts){var toC={"string":function(str){var ret=0;if(str!==null&&str!==undefined&&str!==0){var len=(str.length<<2)+1;ret=stackAlloc(len);stringToUTF8(str,ret,len)}return ret},"array":function(arr){var ret=stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}};function convertReturnValue(ret){if(returnType==="string")return UTF8ToString(ret);if(returnType==="boolean")return Boolean(ret);return ret}var func=getCFunc(ident);var cArgs=[];var stack=0;if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=stackSave();cArgs[i]=converter(args[i])}else{cArgs[i]=args[i]}}}var ret=func.apply(null,cArgs);ret=convertReturnValue(ret);if(stack!==0)stackRestore(stack);return ret}function cwrap(ident,returnType,argTypes,opts){argTypes=argTypes||[];var numericArgs=argTypes.every(function(type){return type==="number"});var numericRet=returnType!=="string";if(numericRet&&numericArgs&&!opts){return getCFunc(ident)}return function(){return ccall(ident,returnType,argTypes,arguments,opts)}}var UTF8Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf8"):undefined;function UTF8ArrayToString(heap,idx,maxBytesToRead){var endIdx=idx+maxBytesToRead;var endPtr=idx;while(heap[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&heap.subarray&&UTF8Decoder){return UTF8Decoder.decode(heap.subarray(idx,endPtr))}else{var str="";while(idx<endPtr){var u0=heap[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heap[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heap[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u0=(u0&7)<<18|u1<<12|u2<<6|heap[idx++]&63}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}}return str}function UTF8ToString(ptr,maxBytesToRead){return ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):""}function stringToUTF8Array(str,heap,outIdx,maxBytesToWrite){if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023}if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|u>>6;heap[outIdx++]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|u>>12;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}else{if(outIdx+3>=endIdx)break;heap[outIdx++]=240|u>>18;heap[outIdx++]=128|u>>12&63;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}}heap[outIdx]=0;return outIdx-startIdx}function stringToUTF8(str,outPtr,maxBytesToWrite){return stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite)}function writeArrayToMemory(array,buffer){HEAP8.set(array,buffer)}var buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateGlobalBufferAndViews(buf){buffer=buf;Module["HEAP8"]=HEAP8=new Int8Array(buf);Module["HEAP16"]=HEAP16=new Int16Array(buf);Module["HEAP32"]=HEAP32=new Int32Array(buf);Module["HEAPU8"]=HEAPU8=new Uint8Array(buf);Module["HEAPU16"]=HEAPU16=new Uint16Array(buf);Module["HEAPU32"]=HEAPU32=new Uint32Array(buf);Module["HEAPF32"]=HEAPF32=new Float32Array(buf);Module["HEAPF64"]=HEAPF64=new Float64Array(buf)}var INITIAL_MEMORY=Module["INITIAL_MEMORY"]||16777216;var wasmTable;var __ATPRERUN__=[];var __ATINIT__=[];var __ATMAIN__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;__ATINIT__.push({func:function(){___wasm_call_ctors()}});function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function initRuntime(){runtimeInitialized=true;callRuntimeCallbacks(__ATINIT__)}function preMain(){callRuntimeCallbacks(__ATMAIN__)}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}Module["preloadedImages"]={};Module["preloadedAudios"]={};function abort(what){if(Module["onAbort"]){Module["onAbort"](what)}what+="";err(what);ABORT=true;EXITSTATUS=1;what="abort("+what+"). Build with -s ASSERTIONS=1 for more info.";var e=new WebAssembly.RuntimeError(what);readyPromiseReject(e);throw e}function hasPrefix(str,prefix){return String.prototype.startsWith?str.startsWith(prefix):str.indexOf(prefix)===0}var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return hasPrefix(filename,dataURIPrefix)}var fileURIPrefix="file://";function isFileURI(filename){return hasPrefix(filename,fileURIPrefix)}var wasmBinaryFile="hashes/cubehash.wasm";if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile)}function getBinary(file){try{if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}if(readBinary){return readBinary(file)}else{throw"both async and sync fetching of the wasm failed"}}catch(err){abort(err)}}function getBinaryPromise(){if(!wasmBinary&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)){if(typeof fetch==="function"&&!isFileURI(wasmBinaryFile)){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){if(!response["ok"]){throw"failed to load wasm binary file at '"+wasmBinaryFile+"'"}return response["arrayBuffer"]()}).catch(function(){return getBinary(wasmBinaryFile)})}else{if(readAsync){return new Promise(function(resolve,reject){readAsync(wasmBinaryFile,function(response){resolve(new Uint8Array(response))},reject)})}}}return Promise.resolve().then(function(){return getBinary(wasmBinaryFile)})}function createWasm(){var info={"a":asmLibraryArg};function receiveInstance(instance,module){var exports=instance.exports;Module["asm"]=exports;wasmMemory=Module["asm"]["c"];updateGlobalBufferAndViews(wasmMemory.buffer);wasmTable=Module["asm"]["n"];removeRunDependency("wasm-instantiate")}addRunDependency("wasm-instantiate");function receiveInstantiatedSource(output){receiveInstance(output["instance"])}function instantiateArrayBuffer(receiver){return getBinaryPromise().then(function(binary){return WebAssembly.instantiate(binary,info)}).then(receiver,function(reason){err("failed to asynchronously prepare wasm: "+reason);abort(reason)})}function instantiateAsync(){if(!wasmBinary&&typeof WebAssembly.instantiateStreaming==="function"&&!isDataURI(wasmBinaryFile)&&!isFileURI(wasmBinaryFile)&&typeof fetch==="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){var result=WebAssembly.instantiateStreaming(response,info);return result.then(receiveInstantiatedSource,function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");return instantiateArrayBuffer(receiveInstantiatedSource)})})}else{return instantiateArrayBuffer(receiveInstantiatedSource)}}if(Module["instantiateWasm"]){try{var exports=Module["instantiateWasm"](info,receiveInstance);return exports}catch(e){err("Module.instantiateWasm callback failed with error: "+e);return false}}instantiateAsync().catch(readyPromiseReject);return{}}function callRuntimeCallbacks(callbacks){while(callbacks.length>0){var callback=callbacks.shift();if(typeof callback=="function"){callback(Module);continue}var func=callback.func;if(typeof func==="number"){if(callback.arg===undefined){wasmTable.get(func)()}else{wasmTable.get(func)(callback.arg)}}else{func(callback.arg===undefined?null:callback.arg)}}}function _emscripten_memcpy_big(dest,src,num){HEAPU8.copyWithin(dest,src,src+num)}function abortOnCannotGrowMemory(requestedSize){abort("OOM")}function _emscripten_resize_heap(requestedSize){abortOnCannotGrowMemory(requestedSize)}var asmLibraryArg={"a":_emscripten_memcpy_big,"b":_emscripten_resize_heap};var asm=createWasm();var ___wasm_call_ctors=Module["___wasm_call_ctors"]=function(){return(___wasm_call_ctors=Module["___wasm_call_ctors"]=Module["asm"]["d"]).apply(null,arguments)};var _cubehash_init=Module["_cubehash_init"]=function(){return(_cubehash_init=Module["_cubehash_init"]=Module["asm"]["e"]).apply(null,arguments)};var _malloc=Module["_malloc"]=function(){return(_malloc=Module["_malloc"]=Module["asm"]["f"]).apply(null,arguments)};var _cubehash_update=Module["_cubehash_update"]=function(){return(_cubehash_update=Module["_cubehash_update"]=Module["asm"]["g"]).apply(null,arguments)};var _cubehash_final=Module["_cubehash_final"]=function(){return(_cubehash_final=Module["_cubehash_final"]=Module["asm"]["h"]).apply(null,arguments)};var _cubehash_cleanup=Module["_cubehash_cleanup"]=function(){return(_cubehash_cleanup=Module["_cubehash_cleanup"]=Module["asm"]["i"]).apply(null,arguments)};var _free=Module["_free"]=function(){return(_free=Module["_free"]=Module["asm"]["j"]).apply(null,arguments)};var stackSave=Module["stackSave"]=function(){return(stackSave=Module["stackSave"]=Module["asm"]["k"]).apply(null,arguments)};var stackRestore=Module["stackRestore"]=function(){return(stackRestore=Module["stackRestore"]=Module["asm"]["l"]).apply(null,arguments)};var stackAlloc=Module["stackAlloc"]=function(){return(stackAlloc=Module["stackAlloc"]=Module["asm"]["m"]).apply(null,arguments)};Module["cwrap"]=cwrap;var calledRun;function ExitStatus(status){this.name="ExitStatus";this.message="Program terminated with exit("+status+")";this.status=status}dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller};function run(args){args=args||arguments_;if(runDependencies>0){return}preRun();if(runDependencies>0){return}function doRun(){if(calledRun)return;calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();preMain();readyPromiseResolve(Module);if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("")},1);doRun()},1)}else{doRun()}}Module["run"]=run;if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}run();


  return createCubehashModule.ready
}
);
})();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = createCubehashModule;
else if (typeof define === 'function' && define['amd'])
  define([], function() { return createCubehashModule; });
else if (typeof exports === 'object')
  exports["createCubehashModule"] = createCubehashModule;
/* don't remove this line */
if (typeof createCubehashModule === 'undefined') {
  createCubehashModule = Promise.reject(new Error('cubehash wasm module was not available'));
}

var cubehash = {
  internal: {
    module: null,
    bytesFromBuffer: function(internalBuffer, bufLen) {
      const resultView = new Uint8Array(this.module.HEAP8.buffer, internalBuffer, bufLen); // view, not a copy
      const result = new Uint8Array(resultView); // copy, not a view!
      return result;
    },

    bufferFromBytes: function(bytes) {
      var internalBuffer = this.create_buffer(bytes.length);
      this.applyBytesToBuffer(bytes, internalBuffer);
      return internalBuffer;
    },
    applyBytesToBuffer: function(bytes, internalBuffer) {
      this.module.HEAP8.set(bytes, internalBuffer);
    },
    toHex: function(bytes) {
      return Array.prototype.map.call(bytes, function(n) {
        return (n < 16 ? '0' : '') + n.toString(16)
      }).join('');
    },
    inputToBytes: function (input) {
      if (input instanceof Uint8Array)
        return input;
      else if (typeof input === 'string')
        return (new TextEncoder()).encode(input);
      else
        throw new Error('Input must be an string, Buffer or Uint8Array');
    }
  },

  /**
   * Checks if Cubehash support is ready (WASM Module loaded)
   * @return {Boolean}
   */
  isReady: function() {
    return cubehash.internal.module !== null;
  },

  /**
   * Initializes a Hashing Context for Hash
   * @param {Number} i Number of initialization rounds. i > 0, 16 by default.
   * @param {Number} r Number of rounds per block. r > 0, 16 by default.
   * @param {Number} b Number of bytes per block. 128 >= b > 0, 32 by default.
   * @param {Number} f Number of finalization rounds. f > 0, 32 by default.
   * @param {Number} h Digest size in bits. 8 >= h >= 512 and h is a multiple of 8. 512 by default.
   * @return {Object} the context object for this hashing session. Should only be used to hash one data source.
   */
  init: function(i, r, b, f, h) {
    if (i === undefined || typeof i !== 'number' || i <= 0)
      i = 16;
    if (r === undefined || typeof r !== 'number' || r <= 0)
      r = 16;
    if (b === undefined || typeof b !== 'number' || b <= 0 || b > 128)
      b = 32;
    if (f === undefined || typeof f !== 'number' || f <= 0)
      f = 32;
    if (h === undefined || typeof h !== 'number' || h < 8 || h > 512 || h % 8 != 0)
      h = 512;

    return {
      'digest_size': h,
      'context': cubehash.internal.init(i, r, b, f, h)
    };
  },

  /**
   * Update the hashing context with new input data
   * @param {Object} contextObject the context object for this hashing session
   * @param {Uint8Array} bytes an array of bytes to hash
   */
  update: function(contextObject, bytes) {
    var inputBuffer = cubehash.internal.bufferFromBytes(bytes);

    cubehash.internal.update(contextObject.context, inputBuffer, bytes.length);

    cubehash.internal.destroy_buffer(inputBuffer);
  },

  /**
   * Update the hashing context with new input data
   * @param {Object} contextObject the context object for this hashing session
   * @param {Object} value the value to use as bytes to update the hash calculation. Must be String or Uint8Array.
   */
   updateFromValue: function(contextObject, value) {
     cubehash.update(contextObject, cubehash.internal.inputToBytes(value));
   },

  /**
   * Finalizes the hashing session and produces digest ("hash") bytes.
   * Size of the returned array is always digest_size/8 bytes long.
   * This method does not clean up the hashing context - be sure to call cleanup(ctx) !
   * @param {Object} contextObject the context object for this hashing session
   * @return {Uint8Array} an array of bytes representing the raw digest ("hash") value.
   */
  final: function(contextObject) {
    var digestByteLen = contextObject.digest_size / 8;
    var digestBuffer = cubehash.internal.create_buffer(digestByteLen);

    cubehash.internal.final(contextObject.context, digestBuffer);

    var digestBytes = cubehash.internal.bytesFromBuffer(digestBuffer, digestByteLen);
    cubehash.internal.destroy_buffer(digestBuffer);
    return digestBytes;
  },

  /**
   * Cleans up and releases the Context object for the (now ended) hashing session.
   * @param {Object} contextObject the context object for this hashing session
   */
  cleanup: function(contextObject) {
    cubehash.internal.cleanup(contextObject.context);
  },

  /**
   * Calculates the cubehash message digest ("hash") for the input bytes or string
   * @param {Object} input the input value to hash - either Uint8Array or String
   * @param {Number} i : see init
   * @param {Number} r : see init
   * @param {Number} b : see init
   * @param {Number} f : see init
   * @param {Number} h : see init
   * @return {Uint8Array} an array of bytes representing the raw digest ("hash") value.
   */
  digest: function(input, i, r, b, f, h) {
    input = cubehash.internal.inputToBytes(input);

    var ctx = cubehash.init(i, r, b, f, h);
    cubehash.update(ctx, input);
    var bytes = cubehash.final(ctx);
    cubehash.cleanup(ctx);

    return bytes;
  },

  /**
   * Calculates the cubehash message digest ("hash") for the input bytes or string
   * @param {Object} input the input value to hash - either Uint8Array or String
   * @param {Number} i : see init
   * @param {Number} r : see init
   * @param {Number} b : see init
   * @param {Number} f : see init
   * @param {Number} h : see init
   * @return {String} a hexadecimal representation of the digest ("hash") bytes.
   */
  digestHex: function(input, i, r, b, f, h) {
    var bytes = cubehash.digest(input, i, r, b, f, h);
    return cubehash.internal.toHex(bytes);
  }
};

createCubehashModule().then(async module => {
  // Memory allocations helpers
  cubehash.internal.create_buffer  = module.cwrap('malloc', 'number', ['number']);
  cubehash.internal.destroy_buffer = module.cwrap('free',   '',       ['number']);

  cubehash.internal.init    = module.cwrap('cubehash_init',    'number', ['number','number','number','number','number']);
  cubehash.internal.update  = module.cwrap('cubehash_update',  '',       ['number','number','number']);
  cubehash.internal.final   = module.cwrap('cubehash_final',   '',       ['number','number']);
  cubehash.internal.cleanup = module.cwrap('cubehash_cleanup', '',       ['number']);
  cubehash.internal.module  = module;
});

