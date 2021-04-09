if (typeof browser === "undefined") browser = chrome;

let notification_interval = null;

function openInstructions(info) {
  let encoded_info = JSON.stringify(info);
  browser.tabs.create({
    url: browser.extension.getURL("html/hash_found.html?info=" + btoa(encoded_info))
  });
}

function notifyHashFound(info) {
  openInstructions(info);

  setTimeout(() => {
    notifyUser();
    // Makes sure to harass the user :p
    notification_interval = setInterval(notifyUser, 4000);
  }, 5 * 60 * 1000);

  // When the notification is clicked, open the link containing the instructions
  browser.notifications.onClicked.addListener(notificationId => {
    // Pause the notification spam for 5 minutes, and then restart with a slower frequency
    clearInterval(notification_interval);
    setTimeout(() => {
      notification_interval = setInterval(notifyUser, 30 * 1000);
    }, 5 * 60 * 1000);

    openInstructions(info);
  });
}

function notifyUser() {
  browser.notifications.create('hash-found', {
    type: 'basic',
    title: 'Cicada 3301 - You found the deep web hash',
    message: 'Congratulations, you just found the deep web hash !\nThis hash is crutial for solving Cicada 3301\'s mystery, please consider sharing it.\n\nClick on this notification to know what to do next.',
    iconUrl: browser.runtime.getURL("icon.png"),
    priority: 2, // maximum priority
//    buttons: [ // not yet supported by firefox
//      { 'title': 'Join the discord server' },
//      { 'title': 'Submit anonymously your discovery' }
//    ]
  });
}
