const helpers = require('./helpers');
const db = require('./db').db;

/**
 * Scans tabs and saves to local storage.
 */
function updateTabs() {  // TODO: handle removal of tabs
    if (!chrome.tabs) return; // execute only in extension context
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {  // async forEach
            setTimeout(() => {
                let dbEntry = {
                    id: String(helpers.hashCode(JSON.stringify(tab))),
                    source: "tab",
                    type: "tab",
                    selectedText: tab.title,
                    text: tab.url + '\n' + tab.title,
                    tab: tab
                };
                console.log("Saving tab to localStorage: ", tab.title);
                db.push(dbEntry);
                db.save();
            }, 0);
        });
    });
}


exports.updateTabs = updateTabs;