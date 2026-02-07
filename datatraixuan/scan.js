let processing = false;
let lastScanned = "";

function setStatus(text, color = "black") {
    const el = document.getElementById("scan-status");
    if (!el) return;
    el.innerText = text;
    el.style.color = color;
}

function onScanSuccess(decodedText, decodedResult) {
    if (processing) return;

    let paramId = "";

    // ===== PARSE QR =====
    try {
        const url = new URL(decodedText);
        paramId = url.search.substring(1); // s001t
    } catch {
        return;
    }

    // Chặn scan lặp frame cùng QR
    if (paramId === lastScanned) return;
    lastScanned = paramId;

    let qrScanned = getCookie("qr_scanned");

    // ===== QR TRÙNG (ĐÃ QUÉT) =====
    if (qrScanned.includes(paramId)) {
        setStatus(`QR ${paramId} đã quét trước đó`, "orange");
        return;
    }

    processing = true;

    // Lưu QR
    qrScanned.push(paramId);
    setCookie("qr_scanned", qrScanned);
    updateStatistic();

    // ===== GỌI API =====
    fetch('https://dnc-svc.palat.io.vn/getidticket2a2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_show: paramId })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            setStatus(`Đã định danh: ${data.data.name}`, "green");

            const namedk = document.getElementById("namecxx");
            const emaildk = document.getElementById("emailcxx");
            const classdk = document.getElementById("classcxx");

            namedk.value = data.data.name;
            emaildk.value = data.data.email;
            classdk.value = data.data.form_item6;

        } else {
            setStatus(`Không tìm thấy vé: ${paramId}`, "red");
            const namedk = document.getElementById("namecxx");
            const emaildk = document.getElementById("emailcxx");
            const classdk = document.getElementById("classcxx");

            namedk.value = "";
            emaildk.value ="";
            classdk.value = "";
        }
    })
    .catch(() => {
        setStatus("Lỗi server", "red");
    })
    .finally(() => {
        // Mở scan lại sau 500ms
        setTimeout(() => {
            processing = false;
            lastScanned = "";
        }, 500);
    });
}
const html5QrcodeScanner = new Html5QrcodeScanner(
    "reader",
    { fps: 10, qrbox: 250 }
);

html5QrcodeScanner.render(onScanSuccess);
updateStatistic();



function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        try {
            return JSON.parse(parts.pop().split(';').shift());
        } catch {
            return [];
        }
    }
    return [];
}

function setCookie(name, value, days = 1) {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${JSON.stringify(value)}; expires=${expires}; path=/`;
}

function updateStatistic() {
    const list = getCookie("qr_scanned");

    let s = 0, x = 0, r = 0;

    list.forEach(id => {
        const k = id.charAt(0).toLowerCase();
        if (k === "s") s++;
        if (k === "x") x++;
        if (k === "r") r++;
    });

    document.getElementById("count-s").innerText = s;
    document.getElementById("count-x").innerText = x;
    document.getElementById("count-r").innerText = r;
}

function resetQR() {
    if (!confirm("Reset toàn bộ QR đã quét?")) return;
    setCookie("qr_scanned", []);
    updateStatistic();
}
