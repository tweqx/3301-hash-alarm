importScripts("./hashes/blake2b.js");
importScripts("./hashes/blake-wrapped.js");
importScripts("./hashes/fnv512-wrapped.js");
importScripts("./hashes/md6-wrapped.js");
importScripts("./hashes/sha3-wrapped.js");
importScripts("./hashes/sha512.js");
importScripts("./hashes/streebog-wrapped.js");
importScripts("./hashes/grostl-wasm.js");
importScripts("./hashes/jh-wasm.js");
importScripts("./hashes/lsh-wasm.js");
importScripts("./hashes/skein-wasm.js");
importScripts("./hashes/cubehash-wasm.js");
importScripts("./hashes/whirlpool-wasm.js");
importScripts("./hashbox.js");

var currentRequests = {};

function foundHash(url) {
  postMessage({
    "action": "hash_found",

    "url": url
  });
}

onmessage = function(e) {
  let action = e.data.action;
  let requestId;
  let url;

  switch (action) {
    case "hashing_mode":
      HashingBox.setMode(e.data.mode);

      break;

    case "hash_url_only":
      requestId = e.data.requestId;

      // Hashes the URL
      url = e.data.url;
      if (HashingBox.hash(url))
        foundHash(url);

      break;
    case "init_request":
      requestId = e.data.requestId;

      // Hashes the URL
      url = e.data.url;
      if (HashingBox.hash(url))
        foundHash(url);

      currentRequests[requestId] = {
        "url": url,
        "hashes": new HashingBox()
      }

      break;
    case "update_request":
      requestId = e.data.requestId;
      currentRequests[requestId].hashes.update(e.data.data);

      break;
    case "finalize_request":
      requestId = e.data.requestId;

      if (currentRequests[requestId].hashes.verify())
        foundHash(currentRequests[requestId].url);

      currentRequests[requestId].hashes.cleanup();
      delete currentRequests[requestId];

      break;
  }
};
