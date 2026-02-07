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

function onScanSuccess(decodedText, decodedResult) {
    console.log("QR content:", decodedText);

    let paramId = "";

    // ===== PARSE QR =====
    try {
        const url = new URL(decodedText);
        paramId = url.search.substring(1); // s001t
    } catch (e) {
        alert("QR không hợp lệ");
        return;
    }

    console.log("ID lấy được:", paramId);

    // ===== COOKIE + CHỐNG QUÉT TRÙNG =====
    let qrScanned = getCookie("qr_scanned");

    if (qrScanned.includes(paramId)) {
        alert("QR này đã được quét rồi");
        return;
    }

    qrScanned.push(paramId);
    setCookie("qr_scanned", qrScanned);
    updateStatistic();

    // ===== DỪNG CAMERA =====
    html5QrcodeScanner.clear();

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
            const namedk = document.getElementById("namecxx");
            const emaildk = document.getElementById("emailcxx");
            const classdk = document.getElementById("classcxx");

            namedk.value = data.data.name;
            emaildk.value = data.data.email;
            classdk.value = data.data.form_item6;

            namedk.readOnly = true;
            emaildk.readOnly = true;
            classdk.readOnly = true;

            const btnWrapper = document.getElementById("BUTTON6");
            const btnText = document.querySelector("#BUTTON_TEXT6 p");

            if (btnText) btnText.innerText = "Đã định danh";

            if (btnWrapper) {
                btnWrapper.style.pointerEvents = "none";
                btnWrapper.style.opacity = "0.6";
                btnWrapper.style.cursor = "not-allowed";
            }
        } else {
            alert("Không tìm thấy vé");
        }
    })
    .catch(err => {
        console.error(err);
        alert("Lỗi server");
    });
}

const html5QrcodeScanner = new Html5QrcodeScanner(
    "reader",
    { fps: 10, qrbox: 250 }
);

html5QrcodeScanner.render(onScanSuccess);

// Load thống kê khi vào trang
updateStatistic();
