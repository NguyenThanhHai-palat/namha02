window.addEventListener("DOMContentLoaded", () => {
    var url = new URL(window.location.href);
    var params = url.searchParams;
    var id = "Quét QR trên vé "
    if(params.get("id") > 0){
        id = params.get("id");
    }

    document.getElementById("id-show").innerHTML = id

});
