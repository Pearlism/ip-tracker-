let searchHistory = [];

async function getIPInfo() {
    const ipInput = document.getElementById('ipInput').value;
    const url = ipInput ? `https://ipapi.co/${ipInput}/json/` : 'https://ipapi.co/json/';

    try {
        const response = await axios.get(url);
        const data = response.data;
        displayIPInfo(data);
        addToHistory(data.ip);
        getAdditionalInfo(data.ip);
    } catch (error) {
        console.error('Error fetching IP info:', error);
        document.getElementById('info').innerHTML = 'Error fetching IP information.';
    }
}

function displayIPInfo(data) {
    const infoDiv = document.getElementById('info');
    if (data.error) {
        infoDiv.innerHTML = `<p>Error: ${data.reason}</p>`;
    } else {
        infoDiv.innerHTML = `
            <p><strong>IP Address:</strong> ${data.ip}</p>
            <p><strong>City:</strong> ${data.city || 'N/A'}</p>
            <p><strong>Region:</strong> ${data.region || 'N/A'}</p>
            <p><strong>Country:</strong> ${data.country_name || 'N/A'}</p>
            <p><strong>ISP:</strong> ${data.org || 'N/A'}</p>
            <p><strong>Latitude:</strong> ${data.latitude || 'N/A'}</p>
            <p><strong>Longitude:</strong> ${data.longitude || 'N/A'}</p>
        `;
    }
}

function addToHistory(ip) {
    if (!searchHistory.includes(ip)) {
        searchHistory.unshift(ip);
        updateHistoryUI();
    }
}

function updateHistoryUI() {
    const historySelect = document.getElementById('history-select');
    const historyList = document.getElementById('history-list');

    historySelect.innerHTML = '<option value="">Select from history</option>';
    historyList.innerHTML = '';

    searchHistory.forEach(ip => {
        historySelect.innerHTML += `<option value="${ip}">${ip}</option>`;
        historyList.innerHTML += `<li onclick="setIPInput('${ip}')">${ip}</li>`;
    });
}

function loadFromHistory() {
    const selectedIP = document.getElementById('history-select').value;
    if (selectedIP) {
        document.getElementById('ipInput').value = selectedIP;
        getIPInfo();
    }
}

function setIPInput(ip) {
    document.getElementById('ipInput').value = ip;
    getIPInfo();
}

async function getAdditionalInfo(ip) {
    try {
        const response = await axios.get(`https://ipapi.co/${ip}/json/`);
        const data = response.data;
        const additionalInfoDiv = document.getElementById('additional-info');
        additionalInfoDiv.innerHTML = `
            <h2>Additional Information</h2>
            <p><strong>Timezone:</strong> ${data.timezone || 'N/A'}</p>
            <p><strong>Currency:</strong> ${data.currency || 'N/A'}</p>
            <p><strong>Calling Code:</strong> +${data.country_calling_code || 'N/A'}</p>
            <p><strong>Languages:</strong> ${data.languages || 'N/A'}</p>
        `;
    } catch (error) {
        console.error('Error fetching additional info:', error);
    }
}
