// 노선 정의
const lines = [
    // 1번 라인 (빨강)
    { points: [[100,100], [300,100], [300,300], [500,300], [700,300]], color: '#E01E5A' },
    // 2번 라인 (파랑)
    { points: [[100,200], [300,200], [500,200], [500,400], [700,400]], color: '#4285F4' },
    // 3번 라인 (초록)
    { points: [[100,300], [200,300], [400,500], [600,500], [700,500]], color: '#2E8555' }
];

// 정거장 정의
const stations = [
    { x: 100, y: 100, icon: '📨' },
    { x: 100, y: 200, icon: '🔒' },
    { x: 100, y: 300, icon: '⚙️' },
    { x: 300, y: 100, icon: '💬' },
    { x: 500, y: 200, icon: '🌐' },
    { x: 700, y: 300, icon: '📊' },
    { x: 300, y: 300, icon: '💾' },
    { x: 700, y: 400, icon: '📱' },
    { x: 700, y: 500, icon: '☁️' }            
];

function createDot(x, y, color) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
    dot.style.background = color;
    return dot;
}

function createMovingDot(color) {
    const dot = document.createElement('div');
    dot.className = 'moving-dot';
    dot.style.background = color;
    return dot;
}

function lerp(start, end, t) {
    return start + (end - start) * t;
}

function createStation(x, y, icon) {
    const station = document.createElement('div');
    station.className = 'station';
    station.style.left = (x - 25) + 'px';
    station.style.top = (y - 25) + 'px';
    station.innerHTML = icon;
    return station;
}

const map = document.getElementById('map');

// 라인 그리기
lines.forEach(line => {
    for (let i = 0; i < line.points.length - 1; i++) {
        const [x1, y1] = line.points[i];
        const [x2, y2] = line.points[i + 1];
        
        // 점선 그리기
        const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const dotCount = Math.floor(distance / 15);
        
        for (let j = 0; j <= dotCount; j++) {
            const t = j / dotCount;
            const x = lerp(x1, x2, t);
            const y = lerp(y1, y2, t);
            map.appendChild(createDot(x, y, line.color));
        }

        // 움직이는 점 추가
        const movingDot = createMovingDot(line.color);
        map.appendChild(movingDot);

        // 애니메이션
        let progress = 0;
        setInterval(() => {
            progress = (progress + 1) % 100;
            const t = progress / 100;
            const x = lerp(x1, x2, t);
            const y = lerp(y1, y2, t);
            movingDot.style.left = x + 'px';
            movingDot.style.top = y + 'px';
        }, 50);
    }
});

// 정거장 추가
stations.forEach(station => {
    map.appendChild(createStation(station.x, station.y, station.icon));
});