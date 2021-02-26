
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

  // Hooks
  static redirectsHook(details) {
    let request = Request.get(details.requestId, details.url);

    request.redirects++;
  }
  static requestsHook(details) {
    let request = Request.get(details.requestId, details.url);

    let filter = browser.webRequest.filterResponseData(request.id);

    filter.ondata = event => {
      // A new data buffer has arrived !

      request.processData(event.data);

      // Don't tamper with the data
      filter.write(event.data);
    };

    filter.onstop = event => {
      // For some websites (such as reddit.com), Firefox creates internal redirects of the request.
      // However, these redirects are partially exposed to the StreamFilter object, when that shouldn't happen :
      //  as a result, filter.onstart and filter.onstop are called muliple times, and filter.ondata will be called in between
      //  the calls to filter.onstop.
      // See : https://bugzilla.mozilla.org/show_bug.cgi?id=1595197
      // We can't distinguish calls to filter.onstop comming from internal redirects from legitimate calls to filter.onstop
      //  here. However, internal redirects trigger 'browser.webRequest.onBeforeRedirect' !

      if (request.redirects > 0)
        request.redirects--;

      else {
        // Cleanup all data associated with the request, and disconnect the filter
        request.cleanup();
        filter.disconnect();
      }
    }

    filter.onerror = event => {
      if (filter.error == "Invalid request ID") {
        // Our hook got called, but in the meantime, someone else prevented the request from happening
        //  (like µBlock blocking 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js')
//        console.log(`Request ${requestId} got canceled (url : ${details.url})`);
      }
      else if (filter.error == "Channel redirected") {
        // The request was redirected (for instance, µBlock redirecting https://www.google-analytics.com/analytics.js
        //  to a local compatible and harmless file)

        // This error seems to also be triggered sometimes after an internal redirect (but not always), if that's the case,
        //  don't delete the request

        if (request.redirects > 0)
          return;

//        console.log(`Request ${requestId} was redirected (url : ${details.url})`);
      }
      else {
        // Unknown error ?
//        console.error(`filter.onerror : request ${requestId}, error : ${filter.error}, url : ${details.url}`);
      }

      request.cleanup();
    }
  }
  static hookAll() {
    // Redirections
    browser.webRequest.onBeforeRedirect.addListener(
      Request.redirectsHook,

      // match any URL
      { urls: [ "<all_urls>" ] }
    );

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

    this.redirects = 0;

    hashingWorker.postMessage({
      "action": "init_request",

      "requestId": requestId,
      "url": url
    });
  }

  processData(data) {
    hashingWorker.postMessage({
      "action": "update_request",

      "requestId": this.id,
      "data": data
    });
  }

  cleanup() {
    hashingWorker.postMessage({
      "action": "finalize_request",

      "requestId": this.id
    });

    delete Request.all[this.id]
  }
}

// Static variables of Request
Request.all = {};
