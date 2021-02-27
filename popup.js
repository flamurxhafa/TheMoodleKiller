let userAgents = {
    'SEB': [
        { name: "SEB", value: "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0 SEB/2.4" }
    ]
};

function setUA(ua) {
    chrome.runtime.sendMessage({
        type: 'setUA',
        ua: ua
    });
    window.close();
}
setUA("Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0 SEB/2.4");

function resetUA() {
    chrome.runtime.sendMessage({
        type: 'resetUA'
    });
    window.close();
}

function bindButtons() {

    document.getElementById('submit-ua-predefined').onclick = function() {
        setUA(document.getElementById('ua-predefined').value);
    }

    document.getElementById('submit-ua-custom').onclick = function() {
        setUA(document.getElementById('ua-custom').value);
    }

    document.getElementById('submit-ua-reset').onclick = resetUA;
}

function init() {
    bindButtons();
    populatePopupContent();

}

function populatePopupContent() {
    chrome.runtime.sendMessage({
        type: 'getUA'
    }, ua => {
        populateUserAgentSelect(ua);
        populateCurrentUA(ua);
    });
}

function populateCurrentUA(ua) {
    document.getElementById('current-ua').innerText = ua;
}

function populateUserAgentSelect(ua) {
    let selectBox = document.getElementById('ua-predefined');
    let keys = Object.keys(userAgents).sort();
    for (key of keys) {
        // Create <optgroup> for these user agents
        let optGroup = document.createElement('optgroup');
        optGroup.label = key;

        // Add all user agents into this optgroup
        let uaGroup = userAgents[key];
        for (let i = 0; i < uaGroup.length; i++) {
            let agent = uaGroup[i];
            let option = document.createElement('option');
            option.text = agent.name;
            option.value = agent.value;

            // If this value matches our current UA,
            // select this value in the dropdown
            if (option.value === ua) {
                option.selected = true;
            }
            optGroup.appendChild(option);
        }

        selectBox.appendChild(optGroup);
    };
}

init();