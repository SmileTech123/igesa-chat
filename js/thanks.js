$( document ).ready(function() {
    var x = document.cookie;
    console.log(x)
  if(x=="btn btn-light"||x==""){

  } else{
    $("body").css({"background":"linear-gradient(rgba(0,0,0,80%),rgba(0,0,0,80%)),url(./images/logo-black.png)","background-repeat": "no-repeat","background-size":"cover"});
    $("#closed").css({"font-size":"30px","color":"white","text-align": "center"})
    $("img").attr("src","./images/header-black.png")

  }
});
 
 $("#bottonecolore").click(function () {
     if($(this).hasClass("btn btn-light")){
          $(".btn").removeClass("btn btn-light").addClass("btn btn-dark");               
     $(this).addClass("btn btn-dark");
     $("#bottonecolore").text("Dark mode");
     $("#sfondoform").css("background-color","#2d2d2d");
      $("body").css("background-color","black");
     $("label").css("color","white");
     $("h1").css("color","white");
     document.cookie = "btn btn-dark";
}else{
  $(".btn").removeClass("btn btn-dark").addClass("btn btn-light");               
     $(this).addClass("btn btn-light");
     $("#bottonecolore").text('Light mode');
     $("#sfondoform").css("background-color","");
      $("body").css("background-color","");
     $("label").css("color","");
     $("h1").css("color","");
     document.cookie = "btn btn-light";
}        
});