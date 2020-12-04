$( document ).ready(function() {
    var x = Cookies.get('color')
console.log(x)
  if(x=="btn btn-dark"){
        $(".btn").removeClass("btn btn-light").addClass("btn btn-dark");
     $("#iconbutton").removeClass("far fa-sun").addClass("far fa-moon");      $("#iconbutton").addClass("far fa-moon");      $("#sfondoform").css("border-color","white") 
     $(".btn").addClass("btn btn-dark");
     $("#bottonecolore").text("Dark mode");
     $("#sfondoform").css("background-color","#2d2d2d");
     $("body").css("background-color","black");
     $("body").css({"background":"linear-gradient(rgba(0,0,0,80%),rgba(0,0,0,80%)),url(./images/logo-black.png)"});
     $("label").css("color","white");
     $("h1").css("color","white");
  } else{
    $("#sfondoform").css("border-color","black")
    $("body").css({"background":"linear-gradient(rgba(255,255,255,80%),rgba(255,255,255,80%)),url(./images/logo.png)"});
  }
});
 
 $("#bottonecolore").click(function () {
     if($(this).hasClass("btn btn-light")){
       $("body").css({"background":"linear-gradient(rgba(0,0,0,80%),rgba(0,0,0,80%)),url(./images/logo-black.png)"});
     $(".btn").removeClass("btn btn-light").addClass("btn btn-dark");
     $("#bottonecolore i").attr('class', 'far fa-sun')
     $("#iconbutton").removeClass("far fa-sun").addClass("far fa-moon");    
     $("#iconbutton").addClass("far fa-moon");       $("#sfondoform").css("border-color","white") 
     $(".btn").addClass("btn btn-dark");
     $("#bottonecolore").text("Dark mode");
     $("#sfondoform").css("background-color","#2d2d2d");
     $("body").css("background-color","black");
     $("label").css("color","white");
     $("h1").css("color","white");
     Cookies.set('color', 'btn btn-dark')
    // Cookies.get('color')

}else{
     $(".btn").removeClass("btn btn-dark").addClass("btn btn-light");          $("body").css({"background":"linear-gradient(rgba(255,255,255,80%),rgba(255,255,255,80%)),url(./images/logo.png)"});     
     $(".btn").addClass("btn btn-light");
     $("#bottonecolore").text('Light mode');
     $("#sfondoform").css("background-color","");
     $("body").css("background-color","");
     $("label").css("color","");
     $("h1").css("color","");
     $("#sfondoform").css("border-color","black")
      Cookies.set('color',"btn btn-light");

}        
});