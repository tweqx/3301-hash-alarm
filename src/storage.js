
// Provides browser-independent functions to access and modify persistent storage

const Storage = {
  "retrieve": function(keyname) {
    if (typeof chrome === "undefined")
      // Firefox returns a promise that is resolved when data is retrieved
      return browser.storage.local.get(keyname);
    else
      // Chrome requires a callback function for when the data is retrieved
      return new Promise(resolve => chrome.storage.local.get(keyname, resolve));
  },

  "save": function(entries) {
    if (typeof chrome === "undefined")
      // Firefox returns a promise that is resolved when data is set
      return browser.storage.local.set(entries);
    else
      // Chrome requires a callback function for when the data is set
      return new Promise(resolve => chrome.storage.local.set(entries, resolve));
  }
}
