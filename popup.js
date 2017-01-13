/**
 * Test simple one-time request.
 */
function testRequest() {
    printResult("requestResult", "running...");

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var timer = new Timer();
        timer.start();
        var tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, {counter: 1}, function handler(response) {
            if (response.counter < 1000) {
                chrome.tabs.sendMessage(tab.id, {counter: response.counter}, handler);
            } else {
                timer.stop();
                var misec = Math.round(timer.milliseconds() / response.counter * 100) / 100;
                console.log(misec);
                printResult("requestResult", misec + " ms / request");
            }
        });
    });
}

/**
 * Test long-lived connection messages.
 */
function testConnect() {
    printResult("connectResult", "running...");

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var timer = new Timer();
        timer.start();

        var port = chrome.tabs.connect(tabs[0].id);
        console.log("Connected to port ", port);
        port.postMessage({counter: 1});
        port.onMessage.addListener(function getResp(response) {
            if (response.counter < 1000) {
                port.postMessage({counter: response.counter});
            } else {
                timer.stop();
                var misec = Math.round(timer.milliseconds() / response.counter * 100) / 100;
                printResult("connectResult", misec + " ms / message");
            }
        });
    });
}

function printResult(elementId, text) {
    document.getElementById(elementId).innerText = text;
}


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('requestButton').addEventListener(
        'click', testRequest);
    document.getElementById('connectButton').addEventListener(
        'click', testConnect);
});