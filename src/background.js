/**
 * This script is executed in background (i.e. before the user opens up the extension).
 */
"use strict";

if(window === chrome.extension.getBackgroundPage()) {  // execute only if in the context of background page
  const extension = require('./extension');

  extension.updateTabs();

  setInterval(() => {  // TODO: update on the fly instead of setInterval
    // db.dbInit();
    extension.updateTabs();
  }, 5000);
}

exports.db = require('./db').db;