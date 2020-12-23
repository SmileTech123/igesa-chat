$(document).keypress(function (e) {
 var key = e.which;
 if(key == 13)  // the enter key code
  {
    loginuser()
  }
});  
function loginuser () {
  var user=$("#login").val()
  var pass=$("#password").val()
  $.post("/users?username="+user+"&password="+pass,((response)=>{
    console.log(response)
     if(response.LoginResult.IsError==false){
      //console.log("Accesso Consentito")
      window.location.href='areaadmin.html'
      Cookies.set('Login', 'success');
    }else{
      //console.log("Errore")
      alert("Utente o password errati!")
      Cookies.set('Login', 'error');
    }
  }))


}

