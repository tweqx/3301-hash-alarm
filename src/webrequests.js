
const hashes = {
  "sha3-512": async message => {
    return await sha3.digestHex(message, 512);
  },
  "streebog512": async message => {
    return await streebog.digestHex(message, 512);
  },
  "sha512": async message => {
    return await sha512(message);
  },
  "blake2b": async message => {
    return await blake2bHex(message);
  }
};

// Processes new data
// This function is blocking and should be as efficient as possible.
function processData(requestId, data) {
  let decoder = new TextDecoder();

  let theURL = currentRequests[requestId].url;
  let theData = decoder.decode(data);
//  console.log(theURL);
//  console.log(theData.substring(0,20), '.....', theData.slice(-20));

  // Example usage, blake2b hash of 'http://example.com/favicon.ico'
  let checkHash = digest => {
    const example_favicon = "ff80f1e7b77312a37cee1e78cbb183ef0c5334e1d3c7404e3cfa8f1de5eac99a97f6082cef820fb2e15780bda9d09b3ae10f4c3ec892463c8e61a92e6666d21e";

    if (digest == example_favicon)
      notifyHashFound({ url: theURL });
  };


  for (let algorithm in hashes) {
    let fnc = hashes[algorithm];

    fnc(theURL).then(checkHash);
//  fnc(theURL).then(digest => {
//      console.log(algorithm, digest, theURL);
//    });

    fnc(theData).then(checkHash);
//    fnc(theData).then(digest => {
//      console.log(algorithm, digest, theURL);
//    });
  }
}

var currentRequests = {};

// Hooks a request before it starts
// This function is blocking and should be as efficient as possible.
function hookRequest(details) {
  let requestId = details.requestId;
  let filter = browser.webRequest.filterResponseData(requestId);

  currentRequests[requestId] = Object.assign(currentRequests[requestId] || {}, {
    'url': details.url,
    'ip': details.ip
  });

  filter.ondata = event => {
    // A new data buffer has arrived !

    processData(requestId, event.data);

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

    if (currentRequests[requestId].redirects_remaining > 0)
      currentRequests[requestId].redirects_remaining--;

    else {
      // Cleanup all data associated with the request, and disconnect the filter
      delete currentRequests[details.requestId];
      filter.disconnect();
    }
  }
  filter.onerror = event => {
    if (filter.error == "Invalid request ID") {
      // Our hook got called, but in the meantime, someone else prevented the request from happening
      //  (like µBlock blocking 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js')
//      console.log(`Request ${requestId} got canceled (url : ${details.url})`);
    }
    else if (filter.error == "Channel redirected") {
      // The request was redirected (for instance, µBlock redirecting https://www.google-analytics.com/analytics.js
      //  to a local compatible and harmless file)

      // This error seems to also be triggered sometimes after an internal redirect (but not always), if that's the case,
      //  don't delete the request

      let redirects_remaining = currentRequests[details.requestId].redirects_remaining;
      if (redirects_remaining !== undefined && redirects_remaining > 0)
        return;

//      console.log(`Request ${requestId} was redirected (url : ${details.url})`);
    }
    else {
      // Unknown error ?
//      console.error(`filter.onerror : request ${requestId}, error : ${filter.error}, url : ${details.url}`);
    }

    delete currentRequests[details.requestId];
  }
}

browser.webRequest.onBeforeRedirect.addListener(details => {
    let requestId = details.requestId;

    if (currentRequests[requestId] && currentRequests[requestId].redirects_remaining)
      currentRequests[requestId].redirects_remaining++;
    else
      currentRequests[requestId] = Object.assign(currentRequests[requestId] || {}, {
        redirects_remaining: 1
      });
  },

  // match any URL
  { urls: [ "<all_urls>" ] }
);
