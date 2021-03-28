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
  let requestId = e.data.requestId;

  switch (action) {
    case "init_request":
      // Hashes the URL
      let url = e.data.url;
      if (HashingBox.hash(url))
        foundHash(url);

      currentRequests[requestId] = {
        "url": url,
        "hashes": new HashingBox()
      }

      break;
    case "update_request":
      currentRequests[requestId].hashes.update(e.data.data);

      break;
    case "finalize_request":
      if (currentRequests[requestId].hashes.verify())
        foundHash(currentRequests[requestId].url);

      currentRequests[requestId].hashes.cleanup();
      delete currentRequests[requestId];

      break;
  }
};
