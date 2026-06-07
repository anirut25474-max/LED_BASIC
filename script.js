const circuitData = {
    1: {
        normal: {
            title: "วงจรที่ 1: ปกติ (+ บน, - ล่าง)",
            content: `
                <h3>ผลการทำงาน: <span class="highlight">LED ติดสว่าง</span></h3>
                <ul>
                    <li>ไดโอด (ชี้ขึ้น) ถูก Reverse Bias จึงกั้นกระแส</li>
                    <li>LED (ชี้ลง) ถูก Forward Bias จึงทำงานได้ปกติ</li>
                </ul>
            `,
            ledOff: false
        },
        reverse: {
            title: "วงจรที่ 1: สลับขั้ว (- บน, + ล่าง)",
            content: `
                <h3>ผลการทำงาน: <span style="color: var(--error-color)">LED ดับ</span></h3>
                <ul>
                    <li>ไดโอด (ชี้ขึ้น) กลายเป็น Forward Bias จึงยอมให้กระแสไหลผ่าน</li>
                    <li>LED (ชี้ลง) กลายเป็น Reverse Bias จึงบล็อกกระแสและดับสนิท</li>
                    <li>กระแสไหลกลับผ่านสาขาของไดโอดแทน</li>
                </ul>
            `,
            ledOff: true
        }
    },
    2: {
        normal: {
            title: "วงจรที่ 2: ปกติ (+ บน, - ล่าง)",
            content: `
                <h3>ผลการทำงาน: <span class="highlight">LED ติดสว่าง</span></h3>
                <ul>
                    <li>วงจรอนุกรมปกติ LED (ชี้ลง) ถูก Forward Bias</li>
                </ul>
            `,
            ledOff: false
        },
        reverse: {
            title: "วงจรที่ 2: สลับขั้ว (- บน, + ล่าง)",
            content: `
                <h3>ผลการทำงาน: <span style="color: var(--error-color)">LED ดับ</span></h3>
                <ul>
                    <li>LED (ชี้ลง) ถูก Reverse Bias ทันทีที่สลับขั้วแบตเตอรี่ ทำให้กระแสไหลไม่ได้ทั้งวงจร</li>
                </ul>
            `,
            ledOff: true
        }
    },
    3: {
        normal: {
            title: "วงจรที่ 3: ปกติ (+ บน, - ล่าง)",
            content: `
                <h3>ผลการทำงาน: <span class="highlight">LED ติดสว่าง</span></h3>
                <ul>
                    <li>ไดโอดและ LED ที่ต่ออนุกรมกันต่างถูก Forward Bias ทั้งคู่ จึงทำงานได้</li>
                </ul>
            `,
            ledOff: false
        },
        reverse: {
            title: "วงจรที่ 3: สลับขั้ว (- บน, + ล่าง)",
            content: `
                <h3>ผลการทำงาน: <span style="color: var(--error-color)">LED ดับ</span></h3>
                <ul>
                    <li>ทั้งไดโอดและ LED ถูก Reverse Bias ทั้งคู่ วงจรจึงถูกตัดขาด กระแสไหลไม่ได้</li>
                </ul>
            `,
            ledOff: true
        }
    },
    4: {
        normal: {
            title: "วงจรที่ 4: ปกติ (+ บน, - ล่าง)",
            content: `
                <h3>ผลการทำงาน: <span style="color: #10b981; font-weight: bold;">LED สีเขียวติด</span> / <span style="color: #ef4444; font-weight: bold;">LED สีแดงดับ</span></h3>
                <ul>
                    <li>LED เขียว (ชี้ลง) ถูก Forward Bias จึงติดสว่าง</li>
                    <li>LED แดง (ชี้ขึ้น) ถูก Reverse Bias จึงดับ</li>
                    <li>อุปกรณ์ไฟฟ้าทำงานตามปกติ (ขั้ว + อยู่ด้านบน)</li>
                </ul>
            `,
            ledOff: true, // we handle specific green/red classes manually
            isCircuit4: true
        },
        reverse: {
            title: "วงจรที่ 4: สลับขั้ว (- บน, + ล่าง)",
            content: `
                <h3>ผลการทำงาน: <span style="color: #ef4444; font-weight: bold;">LED สีแดงติด</span> / <span style="color: #10b981; font-weight: bold;">LED สีเขียวดับ</span></h3>
                <ul>
                    <li>LED เขียว (ชี้ลง) กลายเป็น Reverse Bias จึงดับ</li>
                    <li>LED แดง (ชี้ขึ้น) กลายเป็น Forward Bias จึงติดสว่างแทน</li>
                    <li>อุปกรณ์ไฟฟ้าได้รับขั้วสลับกัน (ขั้ว - อยู่ด้านบน)</li>
                </ul>
            `,
            ledOff: true,
            isCircuit4: true,
            redLedOn: true
        }
    }
};

let currentCircuit = 1;
let isSwitchOn = false;
let isReversePolarity = false;

// DOM Elements
const circuitBtns = document.querySelectorAll('.circuit-btn');
const svgs = document.querySelectorAll('.circuit-svg');
const infoTitle = document.getElementById('infoTitle');
const infoContent = document.getElementById('infoContent');
const mainSwitch = document.getElementById('mainSwitch');
const polaritySwitch = document.getElementById('polaritySwitch');
const switchStatus = document.getElementById('switchStatus');
const polarityStatus = document.getElementById('polarityStatus');
const themeToggle = document.getElementById('themeToggle');

function init() {
    updateUI();
    
    circuitBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentCircuit = parseInt(btn.getAttribute('data-circuit'));
            updateUI();
        });
    });

    mainSwitch.addEventListener('change', (e) => {
        isSwitchOn = e.target.checked;
        updateSwitchStatus();
    });

    polaritySwitch.addEventListener('change', (e) => {
        isReversePolarity = e.target.checked;
        updateUI();
    });

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        if (document.body.classList.contains('light-mode')) {
            themeToggle.innerHTML = '🌞 Light Mode';
        } else {
            themeToggle.innerHTML = '🌙 Dark Mode';
        }
    });
}

function updateUI() {
    circuitBtns.forEach(btn => {
        if (parseInt(btn.getAttribute('data-circuit')) === currentCircuit) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    svgs.forEach(svg => {
        svg.classList.remove('active');
        svg.classList.remove('circuit-active');
        svg.classList.remove('led-off');
        svg.classList.remove('red-led-on');
    });
    
    const activeSvg = document.getElementById(`svg-c${currentCircuit}`);
    if (activeSvg) {
        activeSvg.classList.add('active');
    }

    // Handle Polarity State
    if (isReversePolarity) {
        document.body.classList.add('polarity-reverse');
        polarityStatus.textContent = 'ขั้วแบต: สลับ (- บน)';
        polarityStatus.style.color = 'var(--accent-color)';
        
        // Update SVG battery labels
        document.querySelectorAll('.batt-top-label').forEach(el => { el.textContent = '-'; el.style.fill = 'var(--text-primary)'; });
        document.querySelectorAll('.batt-bot-label').forEach(el => { el.textContent = '+'; el.style.fill = 'var(--error-color)'; });
        document.querySelectorAll('.polarity-top').forEach(el => { el.textContent = '-'; el.style.fill = 'var(--text-primary)'; });
        document.querySelectorAll('.polarity-bot').forEach(el => { el.textContent = '+'; el.style.fill = 'var(--error-color)'; });
        
        // Move lines
        document.querySelectorAll('.batt-top-line').forEach(el => { el.style.transform = 'translateY(40px)'; el.style.strokeWidth = '6'; });
        document.querySelectorAll('.batt-bot-line').forEach(el => { el.style.transform = 'translateY(-40px)'; el.style.strokeWidth = '3'; el.style.stroke = 'var(--error-color)'; });
        
    } else {
        document.body.classList.remove('polarity-reverse');
        polarityStatus.textContent = 'ขั้วแบต: ปกติ (+ บน)';
        polarityStatus.style.color = 'var(--text-secondary)';
        
        document.querySelectorAll('.batt-top-label').forEach(el => { el.textContent = '+'; el.style.fill = 'var(--error-color)'; });
        document.querySelectorAll('.batt-bot-label').forEach(el => { el.textContent = '-'; el.style.fill = 'var(--text-primary)'; });
        document.querySelectorAll('.polarity-top').forEach(el => { el.textContent = '+'; el.style.fill = 'var(--error-color)'; });
        document.querySelectorAll('.polarity-bot').forEach(el => { el.textContent = '-'; el.style.fill = 'var(--text-primary)'; });
        
        document.querySelectorAll('.batt-top-line').forEach(el => { el.style.transform = 'translateY(0)'; el.style.strokeWidth = '3'; el.style.stroke = 'var(--error-color)';});
        document.querySelectorAll('.batt-bot-line').forEach(el => { el.style.transform = 'translateY(0)'; el.style.strokeWidth = '6'; el.style.stroke = 'var(--text-primary)';});
    }

    const mode = isReversePolarity ? 'reverse' : 'normal';
    const data = circuitData[currentCircuit][mode];
    
    infoTitle.textContent = data.title;
    infoContent.innerHTML = data.content;

    updateSwitchStatus();
}

function updateSwitchStatus() {
    const activeSvg = document.getElementById(`svg-c${currentCircuit}`);
    const mode = isReversePolarity ? 'reverse' : 'normal';
    const data = circuitData[currentCircuit][mode];

    if (!activeSvg) return;

    if (isSwitchOn) {
        switchStatus.textContent = 'สวิตช์: ON';
        switchStatus.classList.remove('off');
        switchStatus.classList.add('on');
        
        activeSvg.classList.add('circuit-active');
        
        if (data.ledOff && !data.isCircuit4) {
            activeSvg.classList.add('led-off');
        }
        
        if (data.isCircuit4) {
            if (isReversePolarity) {
                activeSvg.classList.add('red-led-on');
                activeSvg.classList.add('led-off'); // Turn off green led
            } else {
                activeSvg.classList.remove('red-led-on');
                activeSvg.classList.remove('led-off'); // Turn on green led
            }
        }

    } else {
        switchStatus.textContent = 'สวิตช์: OFF';
        switchStatus.classList.remove('on');
        switchStatus.classList.add('off');
        
        activeSvg.classList.remove('circuit-active');
        activeSvg.classList.remove('led-off');
        activeSvg.classList.remove('red-led-on');
    }
}

window.addEventListener('DOMContentLoaded', init);
