let processing = false; // khóa chống bắn liên tục

function onScanSuccess(decodedText, decodedResult) {
    if (processing) return;

    let paramId = "";

    // ===== PARSE QR =====
    try {
        const url = new URL(decodedText);
        paramId = url.search.substring(1); // s001t
    } catch (e) {
        return; // QR không đúng format thì bỏ
    }

    // ===== COOKIE + CHỐNG QUÉT TRÙNG =====
    let qrScanned = getCookie("qr_scanned");

    // Nếu đã quét rồi → bỏ qua, KHÔNG POST
    if (qrScanned.includes(paramId)) {
        return;
    }

    // ===== KHÓA TẠM =====
    processing = true;

    // Lưu QR mới
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
        }
    })
    .catch(err => {
        console.error(err);
    })
    .finally(() => {
        // Mở khóa sau 800ms để scan QR tiếp theo
        setTimeout(() => {
            processing = false;
        }, 800);
    });
}
const html5QrcodeScanner = new Html5QrcodeScanner(
    "reader",
    { fps: 10, qrbox: 250 }
);

html5QrcodeScanner.render(onScanSuccess);

// Load thống kê khi vào trang
updateStatistic();
