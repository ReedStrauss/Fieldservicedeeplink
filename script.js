// JavaScript code here

// Store parameter names and values in an array of objects
const paramValues = [];

function showHideFields() {
    const actionType = document.getElementById('actionType').value;

    document.getElementById('recordFields').style.display = actionType === 'record' ? 'block' : 'none';
    document.getElementById('loginFields').style.display = actionType === 'login' ? 'block' : 'none';
    document.getElementById('globalFields').style.display = actionType === 'global' ? 'block' : 'none';
    document.getElementById('parametersDiv').style.display = (actionType === 'record' || actionType === 'global') ? 'block' : 'none';
    addParamButton.style.display = actionType === 'login' ? 'none' : 'block';
    updateQRCode();
}

function updateQRCode() {
    const actionType = document.getElementById('actionType').value;
    let deepLinkURL = 'com.salesforce.fieldservice://v1/';

    if (actionType === 'record') {
        const sObjectId = document.getElementById('sObjectId').value;
        deepLinkURL += `sObject/${sObjectId}/${document.getElementById('recordActionType').value}`;
    } else if (actionType === 'login') {
        const actionName = document.getElementById('actionName').value;
        deepLinkURL += `login/${actionName}`;
    } else if (actionType === 'global') {
        const globalActionName = document.getElementById('globalActionName').value;
        deepLinkURL += `globalaction/${globalActionName}`;
    }

    if (actionType !== 'login') { // Check if action type is not "login"
        const paramPairs = paramValues.map(param => `${param.name}=${param.value}`);
        const paramString = paramPairs.join('&');
        if (paramString) {
            deepLinkURL += '?' + paramString;
        }
    }

    document.getElementById('deepLinkDisplay').textContent = deepLinkURL;
    const baseURL = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=";
    const qrCodeURL = baseURL + encodeURIComponent(deepLinkURL);
    document.getElementById('qrCodeDisplay').innerHTML = `<img src="${qrCodeURL}" alt="QR Code">`;
}

function addParam() {
    const paramDiv = document.createElement('div');
    paramDiv.className = 'paramSet';
    paramDiv.innerHTML = `
        <input type="text" placeholder="param name" oninput="updateQRCode(); updateParamValues(this)">
        <input type="text" placeholder="param value" oninput="updateQRCode(); updateParamValues(this)">
        <button onclick="removeParam(this)">Delete</button>
    `;
    document.getElementById('parametersDiv').appendChild(paramDiv);
    updateQRCode();
}

function removeParam(btnElement) {
    const paramDiv = btnElement.parentElement;
    paramDiv.remove();
    updateQRCode();
    updateParamValues();
}

// Function to update the parameter values array
function updateParamValues() {
    paramValues.length = 0; // Clear the array
    const paramSets = document.querySelectorAll('.paramSet');
    paramSets.forEach(paramSet => {
        const paramName = paramSet.querySelector('input[placeholder="param name"]').value;
        const paramValue = paramSet.querySelector('input[placeholder="param value"]').value;
        if (paramName && paramValue) {
            paramValues.push({ name: paramName, value: paramValue });
        }
    });
    updateQRCode(); // Update the QR code after a change in parameters
}
