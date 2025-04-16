const stations = [
    { x: 450, y: 380, icon: '🖥️', label: 'PVE', ip: '', section: 'dmz' },
    { x: 450, y: 750, icon: '💻', label: 'AIOps 외부망PC', ip: '', section: 'dmz' },
    { x: 950, y: 250, icon: '🔍', label: 'NLP#1', ip: '10.0.0.20', section: 'private' },
    { x: 1300, y: 250, icon: '💻', label: 'node#1', ip: '10.0.0.31', section: 'private' },
    { x: 1300, y: 600, icon: '💻', label: 'node#2', ip: '10.0.0.32', section: 'private' },
    { x: 950, y: 600, icon: '💻', label: 'node#3', ip: '10.0.0.33', section: 'private' },
    { x: 1300, y: 380, icon: '⚖️', label: 'HA Proxy', ip: '10.0.0.30', section: 'private' },
    { x: 950, y: 380, icon: '🔁', label: 'NAT', ip: '', section: 'private' },
    { x: 800, y: 380, icon: '🔄', label: 'Port Forward', ip: '', section: 'private' },
    { x: 150, y: 400, icon: '🔒', label: 'SSH Tunneling', ip: '', section: 'internet' },
    { x: 300, y: 500, icon: '☁️', label: 'OCI\n138.2.113.x/24', ip: '', section: 'internet' },
    { x: 300, y: 600, icon: '📦', label: 'Deploy SSL', ip: '', section: 'internet' },
    { x: 150, y: 600, icon: '🔐', label: 'ZeroSSL', ip: '', section: 'internet' },
    { x: 300, y: 750, icon: '🌐', label: 'Portal\n(saleee.kro.kr)', ip: '', section: 'internet' },
    { x: 800, y: 250, icon: '🔀', label: 'passThrough\n(DMA)', ip: '', section: 'private' },            
    { x: 150, y: 200, icon: '💰', label: 'Crypto currency', ip: '', section: 'internet' },
    { x: 150, y: 750, icon: '🔐', label: 'Provide SSL', ip: '', section: 'internet' },
];

const lines = [
    { start: 'DeploySSL', end: 'OCI\n138.2.113.x/24', color: '#4285F4' },
    { start: 'OCI\n138.2.113.x/24', end: 'SSHTunneling', color: '#4285F4', bent: true },            
    { start: 'SSHTunneling', end: 'PVE', color: '#4285F4', bent: true },
    { start: 'ZeroSSL', end: 'ProvideSSL', color: '#E01E5A' },
    { start: 'ProvideSSL', end: 'Portal(saleee.kro.kr)', color: '#E01E5A' },
    { start: 'Portal(saleee.kro.kr)', end: 'DeploySSL', color: '#E01E5A' },
    { start: 'AIOps외부망PC', end: 'Portal(saleee.kro.kr)', color: '#E01E5A', bent: true },
    { start: 'PVE', end: 'passThrough(DMA)', color: '#2E8555', bent: true },
    { start: 'passThrough(DMA)', end: 'NLP#1', color: '#2E8555' },
    { start: 'PVE', end: 'PortForward', color: '#e8472b', bent: true },
    { start: 'PortForward', end: 'NAT', color: '#e8472b' },
    { start: 'NAT', end: 'node#1', color: '#e8b62b' },
    { start: 'NAT', end: 'node#2', color: '#e8b62b' },
    { start: 'NAT', end: 'node#3', color: '#e8b62b' },
    { start: 'NAT', end: 'HAProxy', color: '#e8472b' },
    { start: 'NAT', end: 'NLP#1', color: '#e8b62b' },
    { start: 'HAProxy', end: 'node#1', color: '#e8472b' },
    { start: 'HAProxy', end: 'node#2', color: '#e8472b' },
    { start: 'node#3', end: 'node#1', color: '#4285F4' },
    { start: 'node#3', end: 'node#2', color: '#4285F4' },
    { start: 'Cryptocurrency', end: 'PVE', color: '#4285F4', bent: true },
    { start: 'AIOps 외부망PC', end: 'PVE', color: '#4285F4'},
];

function createStation(x, y, icon, label, ip) {
    const station = document.createElement('div');
    station.className = 'station';
    station.style.left = (x - 40) + 'px';
    station.style.top = (y - 35) + 'px';
    
    const iconDiv = document.createElement('div');
    iconDiv.className = 'station-icon';
    iconDiv.innerHTML = icon;
    
    const labelDiv = document.createElement('div');
    labelDiv.className = 'station-label';
    labelDiv.innerHTML = label;
    
    station.appendChild(iconDiv);
    station.appendChild(labelDiv);

    if (ip) {
        const ipDiv = document.createElement('div');
        ipDiv.className = 'station-ip';
        ipDiv.innerHTML = ip;
        station.appendChild(ipDiv);
    }
    
    return station;
}

function getStationCenter(station) {
    const rect = station.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}

function createLine(startStation, endStation, color, bent = false) {
    const start = getStationCenter(startStation);
    const end = getStationCenter(endStation);
    
    if (bent) {
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;
        
        if (Math.abs(start.x - end.x) > Math.abs(start.y - end.y)) {
            createStraightLine(start, {x: start.x, y: midY}, color);
            createStraightLine({x: start.x, y: midY}, {x: end.x, y: midY}, color);
            createStraightLine({x: end.x, y: midY}, end, color);
        } else {
            createStraightLine(start, {x: midX, y: start.y}, color);
            createStraightLine({x: midX, y: start.y}, {x: midX, y: end.y}, color);
            createStraightLine({x: midX, y: end.y}, end, color);
        }
    } else {
        createStraightLine(start, end, color);
    }
}

function createStraightLine(start, end, color) {
    const line = document.createElement('div');
    line.className = 'line';
    
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    
    const distance = Math.sqrt(dx*dx + dy*dy);
    
    line.style.width = distance + 'px';
    line.style.left = start.x + 'px';
    line.style.top = start.y + 'px';
    
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = '0 0';
    
    const dotCount = Math.floor(distance / 15);
    for (let i = 0; i <= dotCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.style.left = (i / dotCount * 100) + '%';
        dot.style.background = color;
        line.appendChild(dot);
    }

    map.appendChild(line);
    return line;
}

function createMovingDot(line, color) {
    const movingDot = document.createElement('div');
    movingDot.className = 'moving-dot';
    movingDot.style.background = color;

    const start = getStationCenter(line.startElement);
    const end = getStationCenter(line.endElement);
    
    let progress = 0;
    setInterval(() => {
        progress = (progress + 1) % 100;
        let x, y;
        if (line.bent) {
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;
            if (Math.abs(start.x - end.x) > Math.abs(start.y - end.y)) {
                if (progress < 33) {
                    x = start.x;
                    y = start.y + (midY - start.y) * progress / 33;
                } else if (progress < 66) {
                    x = start.x + (end.x - start.x) * (progress - 33) / 33;
                    y = midY;
                } else {
                    x = end.x;
                    y = midY + (end.y - midY) * (progress - 66) / 34;
                }
            } else {
                if (progress < 33) {
                    x = start.x + (midX - start.x) * progress / 33;
                    y = start.y;
                } else if (progress < 66) {
                    x = midX;
                    y = start.y + (end.y - start.y) * (progress - 33) / 33;
                } else {
                    x = midX + (end.x - midX) * (progress - 66) / 34;
                    y = end.y;
                }
            }
        } else {
            x = start.x + (end.x - start.x) * progress / 100;
            y = start.y + (end.y - start.y) * progress / 100;
        }
        movingDot.style.left = x + 'px';
        movingDot.style.top = y + 'px';
    }, 50);

    return movingDot;
}

const map = document.getElementById('map');

stations.forEach(station => {
    const stationElement = createStation(station.x, station.y, station.icon, station.label, station.ip);     
    stationElement.id = station.label.replace(/\s+/g, '');
    map.appendChild(stationElement);
});

setTimeout(() => {
    lines.forEach(line => {
        const startElement = document.getElementById(line.start.replace(/\s+/g, ''));
        const endElement = document.getElementById(line.end.replace(/\s+/g, ''));
        if (startElement && endElement) {
            createLine(startElement, endElement, line.color, line.bent);
            line.startElement = startElement;
            line.endElement = endElement;
            map.appendChild(createMovingDot(line, line.color));
        }
    });
}, 0);