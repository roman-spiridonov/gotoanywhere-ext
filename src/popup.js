"use strict";

// access window object of background page: chrome.extension.getBackgroundPage()
// see https://groups.google.com/a/chromium.org/forum/#!topic/chromium-extensions/iFxhbJb_56c

const GTASelect = require('./GTASelect').GTASelect;

chrome.runtime.getBackgroundPage(function (backgroundPage) {
  // backgroundPage references window object of background.js script
  // bg is the exports object from background.js (see webpack settings)
  const bg = backgroundPage.background;
  let db = bg.db;

  $(function () {
    let searchBox = new GTASelect({db: db});
    // db.refresh();
    searchBox.init('#search', db.get());

    //searchBox.update();
    setInterval(() => {  // TODO: update on the fly instead of setInterval
      searchBox.update();
    }, 1000);

    searchBox.open();

    /* eslint-disable */
    bg.test();
    /* eslint-enable */
  });
});

