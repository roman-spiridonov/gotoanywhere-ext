/**
 * This script is executed in background (i.e. before the user opens up the extension).
 */
"use strict";

if(window === chrome.extension.getBackgroundPage()) {  // execute only if in the context of background page
  const extension = require('./extension');

  extension.updateTabs();

  chrome.tabs.onCreated.addListener(function (tab) {
    extension.updateTab(tab);
  });

  chrome.tabs.onUpdated.addListener(function (tabId) {
    chrome.tabs.get(tabId, tab => extension.updateTab(tab));
  });

  chrome.tabs.onRemoved.addListener(function (tabId) {
    chrome.tabs.get(tabId, tab => extension.updateTab(tab));
  });


}

exports.db = require('./db').db;