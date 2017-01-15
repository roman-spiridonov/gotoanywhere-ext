const Timer = require('./timer').Timer;

/**
 * Test simple one-time request.
 */
function testRequest() {
    $("#requestResult").text("running...");

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        var timer = new Timer();
        timer.start();
        var tab = tabs[0];
        console.group("testRequest (One-time message check)");
        console.log("Sending message to tab %d", tab.id);
        console.groupEnd();

        chrome.tabs.sendMessage(tab.id, {counter: 1}, function handler(response) {
            if (response.counter < 1000) {
                chrome.tabs.sendMessage(tab.id, {counter: response.counter}, handler);
            } else {
                timer.stop();
                var misec = Math.round(timer.milliseconds() / response.counter * 100) / 100;
                $("#requestResult").text(misec + " ms / request");
            }
        });
    });
}

/**
 * Test long-lived connection messages.
 */
function testConnect() {
    $("#connectResult").text("running...");

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        var timer = new Timer();
        timer.start();

        var port = chrome.tabs.connect(tabs[0].id);
        console.group("testRequest (Long-lived connection message check)");
        console.log("Connected to port %O and sending message to it", port);
        port.postMessage({counter: 1});
        console.groupEnd();
        port.onMessage.addListener(function getResp(response) {
            if (response.counter < 1000) {
                port.postMessage({counter: response.counter});
            } else {
                timer.stop();
                var misec = Math.round(timer.milliseconds() / response.counter * 100) / 100;
                $("#connectResult").text(misec + " ms / message");
            }
        });
    });
}

$(function() {
    $('#requestButton').click(testRequest);
    $('#connectButton').click(testConnect);
});