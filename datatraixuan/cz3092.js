window.addEventListener("DOMContentLoaded", () => {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    let id = "Quét QR trên vé";
    let dataqr = "";

    const paramId = params.get("id");
    if (paramId && paramId.trim() !== "") {
        id = paramId;
        dataqr = "&addInfo=thanh toan ve " + id;
    }

    const idShow = document.getElementById("id-show");
    const ndckShow = document.getElementById("ndck");
    if (idShow) {
        idShow.innerHTML = id;
        ndckShow.innerHTML = "thanh toan ve "+id
    }

    const qrCodeImage = document.getElementById("qr-vietqr");
    if (qrCodeImage) {
        qrCodeImage.src =
            `https://img.vietqr.io/image/MB-0917962972-qr_only.png?size=200x200${dataqr}`;
    } else {
        console.warn("Không tìm thấy element #qr-vietqr");
    }
});
