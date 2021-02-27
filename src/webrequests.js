
const hashingWorker = new Worker(browser.extension.getURL("src/hashing_worker.js"));

hashingWorker.onmessage = function(e) {
  if (e.data.action == "hash_found")
    notifyHashFound({ url: e.data.url });
}

class Request {
  static get(requestId, url) {
    if (requestId in Request.all)
      return Request.all[requestId];

    // The request does not exist yet
    let obj = new Request(requestId, url);
    Request.all[requestId] = obj;

    return obj;
  }

  // Hook
  static requestsHook(details) {
    let request = Request.get(details.requestId, details.url);

    let filter = browser.webRequest.filterResponseData(request.id);

    filter.ondata = event => {
      // A new data buffer has arrived !

      // Don't tamper with the data
      filter.write(event.data);

      // Transferts ownership of the data object to the Web Worker - so we must write the data before
      request.sendData(event.data);
    };

    filter.onstop = event => {
      // Cleanup all data associated with the request, and disconnect the filter
      request.cleanup();
      filter.disconnect();
    }

    filter.onerror = event => {
      request.cleanup();
    }
  }
  static hookAll() {
    // Requests
    browser.webRequest.onBeforeRequest.addListener(
      Request.requestsHook,

      // match any URL
      { urls: [ "<all_urls>" ] },
      ["blocking"]
    );
  }

  constructor(requestId, url) {
    this.id = requestId;
    this.url = url;

    this.data_transfered = false;
  }

  sendData(data) {
    if (!this.data_transfered) {
      hashingWorker.postMessage({
        "action": "init_request",

        "requestId": this.id,
        "url": this.url
      });

      this.data_transfered = true;
    }

    // Transfers the object ownership to the Web Worker, instead of making a copy of it
    hashingWorker.postMessage({
      "action": "update_request",

      "requestId": this.id,
      "data": data
    }, [data]);
  }

  cleanup() {
    delete Request.all[this.id];

    if (!this.data_transfered)
      return;

    hashingWorker.postMessage({
      "action": "finalize_request",

      "requestId": this.id
    });
  }
}

// Static variables of Request
Request.all = {};
