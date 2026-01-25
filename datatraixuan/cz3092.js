window.addEventListener("DOMContentLoaded", () => {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    let id = "Quét QR trên vé";
    let dataqr = "";

    const paramId = params.get("id");
    if (paramId && paramId.trim() !== "") {
        id = paramId;
        dataqr = "&addInfo=ma ve " + id;
    }

    var idShow = document.getElementById("id-show");
    const ndckShow = document.getElementById("ndck");

    if (idShow) {
        idShow.innerHTML = id;
        console.log()
        try {
            if(params.get("id").length > 0) ndckShow.innerHTML = "ma ve "+id
        }
        catch{console.error("KHÔNG TÌM THẤY ID VÉ")}
    }
    const box = document.getElementById("BOX42");


    if(id[0] == "r" && id[4]=="m"){
        console.log("Nhận diện vé rau má")
        document.getElementById("veid").innerHTML = "Vé: Rau má sữa"
        box.style.backgroundImage = "url('datatraixuan/verauma.png')";
        box.style.backgroundSize = "cover";
        box.style.backgroundPosition = "center";
        box.style.backgroundRepeat = "no-repeat";
    }
    else if(id[0] == "s" && id[4]=="t"){
        console.log("Nhận diện vé sữa tươi trân châu đường đen")
        document.getElementById("veid").innerHTML = "Vé: sữa tươi trân châu"
        box.style.backgroundImage = "url('datatraixuan/suatuoi.png')";
        box.style.backgroundSize = "cover";
        box.style.backgroundPosition = "center";
        box.style.backgroundRepeat = "no-repeat";
    }
    else if(id[0] == "x" && id[4]=="q"){
        document.getElementById("veid").innerHTML = "Vé: Xiên nướng"
        console.log("Nhận diện vé xiên que")
        box.style.backgroundImage = "url('datatraixuan/thitxien.png')";
        box.style.backgroundSize = "cover";
        box.style.backgroundPosition = "center";
        box.style.backgroundRepeat = "no-repeat";
    }
    else {
        document.getElementById("veid").innerHTML = ""
    }
    const qrCodeImage = document.getElementById("qr-vietqr");
    if (qrCodeImage) {
        qrCodeImage.src =
            `https://img.vietqr.io/image/MB-0917962972-qr_only.png?size=200x200${dataqr}`;
    } else {
        console.warn("Không tìm thấy element #qr-vietqr");
    }

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
            console.log(data.data.email);
            const namedk = document.getElementById("namecxx");
            const emaildk = document.getElementById("emailcxx");
            const classdk = document.getElementById("classcxx");
            namedk.value = data.data.name;
            emaildk.value = data.data.email;
            classdk.value = data.data.form_item6;
            classdk.readOnly = true
            emaildk.readOnly = true;
            namedk.readOnly = true;
            const btnWrapper = document.getElementById("BUTTON6");
            const btnText = document.querySelector("#BUTTON_TEXT6 p");

            if (btnText) {
                btnText.innerText = "Đã định danh";
            }

            if (btnWrapper) {
                btnWrapper.style.pointerEvents = "none";
                btnWrapper.style.opacity = "0.6";
                btnWrapper.style.cursor = "not-allowed";
             }

        } else {
        }
        });





});
const contactForm=document.getElementById("joinevent")
contactForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const contactFormdata = Object.fromEntries(new FormData(contactForm).entries()); 
  const showValue = document.getElementById("id-show").innerText;
  if(showValue == "Quét QR trên vé" || showValue == ""){
    console.log("Không có mã vé");
  }
  else{
    contactFormdata.id_show = showValue;
    fetch('https://dnc-svc.palat.io.vn/dat-hang-tx12a2', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactFormdata)  
    })

    .then(response => {
        if (response.status === 200) {
        alert('Cảm ơn bạn đã gửi - Định danh thành công');
        setTimeout(() => {
            window.location.reload();
        }, 2000);
        } else {
        alert('Có lỗi xảy ra, vui lòng thử lại.');
        }
    })
  }
 
});



