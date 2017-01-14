if (chrome.tabs) {  // execute only in extension context

    function updateTabs() {
        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(function (tab) {  // async forEach
                setTimeout(() => {
                    let dbEntry = {
                        id: String(hashCode(JSON.stringify(tab))),
                        source: "tab",
                        type: "tab",
                        selectedText: tab.title,
                        text: tab.title,
                        tab: tab
                    };
                    console.log("Saving tab to localStorage: ", tab);
                    let curDb = localStorage.getItem('db');
                    console.log('Current state of db: ', curDb);
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

    function updateSelect() {
        let curDb = localStorage.getItem('db');
        if (curDb) {
            data = JSON.parse(curDb);
            // console.log("search.data = ", $("#search").data('select2'));
            var currentData = $("#search").data('select2').results.data._currentData;
            if (data) {
                data.forEach(function (item) {
                    setTimeout(() => {  // TODO: use async or promise
                        if ($.inArray(item.id, currentData.map(function (el) {
                                return el.id;
                            })) === -1) {  // TODO: use map
                            currentData.push(item);
                        }
                    });
                });
            }
        }

    }

    var timerId = setInterval(() => {updateTabs(); updateSelect();}, 1000);
    // setTimeout(() => clearInterval(timerId), 10000);

}

function hashCode(str) {
    if (str.length == 0) return 0;

    var hash = 0,
        i, chr, len;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}