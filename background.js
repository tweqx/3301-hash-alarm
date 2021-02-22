
// Registers the hashing callback
browser.webRequest.onBeforeRequest.addListener(
  hookRequest,

  // match any URL
  { urls: [ "<all_urls>" ] },
  ["blocking"]
);

