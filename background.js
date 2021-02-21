
// Test function
function updateHashes(requestId, data) {
  let decoder = new TextDecoder();

  console.log(currentRequests[requestId].url, decoder.decode(data));
}

var currentRequests = {};

// Hooks a request before it starts
// This function is blocking and
function prepareHashing(details) {
  let requestId = details.requestId;
  let filter = browser.webRequest.filterResponseData(requestId);

  currentRequests[requestId] = {
    'url': details.url,
    'ip': details.ip
  }

  filter.ondata = event => {
    // A new data buffer has arrived !

    updateHashes(requestId, event.data);

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

// Registers the hashing callback
browser.webRequest.onBeforeRequest.addListener(
  prepareHashing,

  // match any URL
  { urls: [ "<all_urls>" ] },
  ["blocking"]
);
