'use strict';

// Where we will expose all the data we retrieve from storage.sync.
/*const storageCache = { count: 0 };
// Asynchronously retrieve data from storage.sync, then cache it.
const initStorageCache = chrome.storage.sync.get().then((items) => {
  // Copy the data retrieved from storage into storageCache.
  Object.assign(storageCache, items);
});*/

/*chrome.action.onClicked.addListener(async (tab) => {
  try {
    await initStorageCache;
  } catch (e) {
    // Handle error that occurred during storage initialization.
  }

  // Normal action handler logic.
  //It's just a stupid example
  storageCache.count++;
  storageCache.lastTabId = tab.id;
  chrome.storage.sync.set(storageCache);
});*/

/*chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GREETINGS') {
    const message = `Hi ${
      sender.tab ? 'Con' : 'Pop'
    }, my name is Bac. I am from Background. It's great to hear from you.`;

    // Log message coming from the `request` parameter
    // Send a response message
    sendResponse({
      message
    });
  }
});*/

/*async function start() {
  var popup_window = await chrome.windows.create(
  {
      focused: true,
      left: 1000,
      top: 200,
      type: 'popup'
  },
  ()=>console.log('chrome.windows.create OK')
)*/
  /*const current = await chrome.windows.getCurrent();

  const allTabs = await chrome.tabs.query({});
  allTabs.forEach((tab) => {
    if (tab.windowId != current.id) {
      chrome.tabs.move(tab.id, {
        windowId: current.id,
        index: tab.index
      });
    }
  });*/
/*}

// Set up a click handler so that we can merge all the windows.
chrome.action.onClicked.addListener(start);*/
