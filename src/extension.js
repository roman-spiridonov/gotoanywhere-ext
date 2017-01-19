"use strict";

const db = require('./db').db;

/**
 * Scans tabs and saves to local storage.
 */
function updateTabs(commit = false) {  // TODO: handle removal of tabs
  if (!chrome.tabs) {  // execute only in extension context
    return;
  }
  chrome.tabs.query({}, function (tabs) {
    setTimeout(tabs.forEach(
        tab => updateTab(tab, commit)
    ), 0);
  });
}

function updateTab(tab, commit = false) {
  let dbEntry = {
    id: String(tab.id),
    source: "tab",
    type: "tab",
    selectedText: tab.title,
    text: tab.url + '\n' + tab.title,
    tab: tab
  };
  console.log("Saving tab: ", tab.id, tab.title);
  db.push(dbEntry);
  if (commit) db.save();
}

function removeTab(tab, commit = false) {
  db.delete(tab);
  console.log("Removing tab: ", tab.id, tab.title);
  if (commit) db.save();
}

exports.updateTabs = updateTabs;
exports.updateTab = updateTab;
exports.removeTab = removeTab;