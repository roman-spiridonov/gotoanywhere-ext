const helpers = require('./helpers');

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
                    text: tab.title,
                    tab: tab
                };
                console.log("Saving tab to localStorage: ", tab);
                let curDb = localStorage.getItem('db');
                // console.log('Current state of db: ', curDb);
                if (curDb && curDb.length) {
                    if ($.inArray(dbEntry.id, JSON.parse(curDb).map(function (el) {
                            return el.id;
                        })) === -1) {  // TODO: use map
                        localStorage.setItem('db', curDb.slice(0, -1).concat(',', JSON.stringify(dbEntry), ']'));
                    }
                } else {
                    localStorage.setItem('db', ''.concat('[', JSON.stringify(dbEntry), ']'));
                }
            }, 0);
        });

        console.log("Updated localStorage with all the tabs: ", JSON.parse(localStorage['db']));
    });
}

exports.updateTabs = updateTabs;