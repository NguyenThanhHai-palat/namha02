function webonload(g){
  if(g=='3'){
    let user;
    function setCookie(cname, cvalue, exdays) {
      const d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      let expires = "expires="+d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
      let name = cname + "=";
      let ca = document.cookie.split(';');
      for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }

    function checkCookie() {
      user = getCookie("username");
      if (user != "") {
      } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
      setCookie("username", user, 365);
        }
      }
    }
    if(user!=null){
      var content = '<h1 style="text-align:center">TÀI LIỆU</h1> <iframe src="/plt/" frameborder="0" width="90%" height ="800px"></iframe> <h4 style="text-align:center">TẢI LÊN TÀI LIỆU</h4><iframe src="/plt/add.html" frameborder="0" width="90%" height ="800px"></iframe>';
    document.getElementById("documents.page").innerHTML = content
    }
    else{
      checkCookie();
    }
    
  }
   
}