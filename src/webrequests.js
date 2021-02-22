
async function streebog512Digest(message,description){
  const hashHex = await streebog.digestHex(message,512);
  if (typeof description !== 'undefined') {
    console.log("streebog512", description, hashHex);
  } else {
    console.log("streebog512", hashHex);
  }
}

async function sha512digest(message, description) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-512', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  if (typeof description !== 'undefined') {
    console.log("sha512", description, hashHex);
  } else {
    console.log("sha512", hashHex);
  }
}

async function blake2bDigest(message, description) {
  const hashHex = await blake2bHex(message);
  if (typeof description !== 'undefined') {
    console.log("blake2b", description, hashHex);
  } else {
    console.log("blake2b", hashHex);
  }
}

// Processes new data
// This function is blocking and should be as efficient as possible.
function processData(requestId, data) {
  let decoder = new TextDecoder();

  let theURL = currentRequests[requestId].url;
  let theData = decoder.decode(data);
  console.log(theURL);
  console.log(theData.substring(0,20), '.....', theData.slice(-20));
  sha512digest(theURL);
  sha512digest(theData, theURL);
  blake2bDigest(theURL);
  blake2bDigest(theData, theURL);
  streebog512Digest(theURL);
  streebog512Digest(theData, theURL);
}

var currentRequests = {};

// Hooks a request before it starts
// This function is blocking and should be as efficient as possible.
function hookRequest(details) {
  let requestId = details.requestId;
  let filter = browser.webRequest.filterResponseData(requestId);

  currentRequests[requestId] = {
    'url': details.url,
    'ip': details.ip
  }

  filter.ondata = event => {
    // A new data buffer has arrived !

    processData(requestId, event.data);

    // Don't tamper with the data
    filter.write(event.data);
  };

  filter.onstop = event => {
    // Cleanup all data associated with the request, and disconnect the filter
    delete currentRequests[details.requestId];
    filter.disconnect();
  }
  filter.onerror = event => {
    delete currentRequests[details.requestId];
  }
}
