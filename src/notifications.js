function notifyHashFound(info) {
  notifyUser();
  // Makes sure to harass the user :p
  setInterval(notifyUser, 30000);

  // When the notification is clicked, open the link containing the instructions, and copy relevant information to the clipboard
  browser.notifications.onClicked.addListener(notificationId => {
    browser.tabs.create({ url: "https://github.com/tweqx/3301-hash-alarm/blob/master/hash-found.md" });

    let encoded_info = JSON.stringify(info);
    navigator.clipboard.writeText(btoa(encoded_info));
  });
}

function notifyUser() {
  browser.notifications.create('hash-found', {
    type: 'basic',
    title: 'Cicada 3301 - You found the deep web hash',
    message: 'Congratulations, you just found the deep web hash !\nThis hash is crutial for solving Cicada 3301\'s mystery, please consider sharing it.\n\nClick on this notification to know what to do next.',
    iconUrl: "/icon.svg", // Doesn't work :(
    priority: 2, // maximum priority
//    buttons: [ // not yet supported by firefox
//      { 'title': 'Join the discord server' },
//      { 'title': 'Submit anonymously your discovery' }
//    ]
  });
}
