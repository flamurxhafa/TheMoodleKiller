let DEFAULT_UA = "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0 SEB/2.4";
let CUSTOM_UA = DEFAULT_UA;

// Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0 SEB
function init() {
    bindOnBeforeSendHeaders();
    bindOnMessage();
}

function onBeforeSendHeadersCallback(details) {
    if (CUSTOM_UA === DEFAULT_UA) {
        return;
    }

    for (let i = 0; i < details.requestHeaders.length; i++) {
        if (details.requestHeaders[i].name !== 'User-Agent') {
            continue;
        }
        details.requestHeaders[i].value = CUSTOM_UA;
        break;
    }

    return {
        requestHeaders: details.requestHeaders
    };
}

function bindOnBeforeSendHeaders() {
    chrome.webRequest.onBeforeSendHeaders.addListener(
        onBeforeSendHeadersCallback, { urls: ["<all_urls>"] }, ["blocking", "requestHeaders"]
    );
}

function bindOnMessage() {
    chrome.runtime.onMessage.addListener(function(msg, sender, callback) {
        if (msg.type === 'getUA') {
            callback(CUSTOM_UA);
        } else if (msg.type === 'setUA') {
            gotMessageSetUA(msg.ua);
        } else if (msg.type === 'resetUA') {
            gotMessageResetUA();
        }
    });
}

function gotMessageSetUA(ua) {
    if (ua === '') {
        CUSTOM_UA = DEFAULT_UA;
    } else if (isValidUA(ua)) {
        CUSTOM_UA = ua;
    } else {
        throw "Invalid UA";
    }
}

function gotMessageResetUA() {
    CUSTOM_UA = DEFAULT_UA;
}

function isValidUA(ua) {
    // Pretty much any string is considered valid.
    // Invalid if not a string, or has new line characters.
    return isString(ua) && !ua.match("[\n\r]") ? true : false;
}

function isString(input) {
    return input !== undefined && input !== null && typeof(input) === 'string';
}

init();