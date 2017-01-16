const helpers = require('./helpers');
const db = require('./db');

/**
 * Scans tabs and saves to local storage.
 */
function updateTabs() {
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
                let curDbStr = localStorage.getItem('db');
                let curDb = db.parseDbStr(curDbStr);
                if (curDb.length > 0) {
                    console.log("Current state of db: ", curDb.map(item => item.id));
                    let tabIndex = indexOfById(dbEntry, curDb);
                    if (tabIndex === -1) {
                        console.log("dbEntry: ", dbEntry.id);
                        localStorage.setItem('db', curDbStr.slice(0, -1).concat(',', JSON.stringify(dbEntry), ']'));
                    }
                } else {
                    localStorage.setItem('db', ''.concat('[', JSON.stringify(dbEntry), ']'));
                }
            }, 0);
        });

    });
}


function indexOfById(dbEntry, arr) {
    try {
        let keys = arr.map(el => el.id);
        return keys.indexOf(dbEntry.id);
    } catch(e) {
        return null;
    }
}


exports.updateTabs = updateTabs;
exports.indexOfById = indexOfById;