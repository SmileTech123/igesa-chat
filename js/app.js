 var socket = io();
 var uploader = new SocketIOFileUpload(socket);

 //var $messages = $(".messages");
//var $message = $('<li class = "list-group-item"></li>')
var momentTimestamp=""
var videochat=""

$( document ).ready(function() {
  
    var x = Cookies.get('color')
    console.log(x)
    $('[data-toggle="tooltip"]').tooltip()
  if(x=="btn btn-light"||x==""){
    $("#icons").css({"background-color":"#2d2d2d","border":"2px solid lightgrey","border-radius": "25px","padding": "5px","background-color":"lightgrey","color":"black"});
    $("body").css({"background":"linear-gradient(rgba(255,255,255,80%),rgba(255,255,255,80%)),url(./images/logo.png)"});
        $("#icons2").css({"background-color":"#2d2d2d","border":"2px solid lightgrey","border-radius": "25px","padding": "5px","background-color":"lightgrey","color":"black"})
         $("#icons3").css({"background-color":"#2d2d2d","border":"2px solid lightgrey","border-radius": "25px","padding": "5px","background-color":"lightgrey","color":"black"})
  } else{
     $(".btn").removeClass("btn btn-light").addClass("btn btn-dark");            $("body").css({"background":"linear-gradient(rgba(0,0,0,80%),rgba(0,0,0,80%)),url(./images/logo.png)"});      
     $(this).addClass("btn btn-dark");
     $("#bottonecolore").text("Dark mode");
     $("#sfondoform").css("background-color","#2d2d2d");
      $("body").css("background-color","black");
     $("label").css("color","white");
     $("h1").css("color","white");
      $("#sharecolor").css("background-color","#2d2d2d");
       $("#sharecolor2").css("background-color","#2d2d2d");
       $("#sharecolor3").css("background-color","#2d2d2d");
        $("#icons").css({"background-color":"#2d2d2d","border":"2px solid white","border-radius": "25px","padding": "5px","background-color":" white","color":"black"});
        $("#icons2").css({"background-color":"#2d2d2d","border":"2px solid white","border-radius": "25px","padding": "5px","background-color":" white","color":"black"});
         $("#icons3").css({"background-color":"#2d2d2d","border":"2px solid white","border-radius": "25px","padding": "5px","background-color":" white","color":"black"});
  }
});

$( "#send" ).click(function() {
  $( "#messagebox" ).focus();
});
$( "#file-image" ).click(function() {
  $( "#messagebox" ).focus();
});
$( "#file-input" ).click(function() {
  $( "#messagebox" ).focus();
});
 uploader.chunkSize=1024*5000
 uploader.listenOnInput(document.getElementById("file-input"));
 // listen for server connection
 // get query params from url
 var name = getQueryVariable("name") || 'Anonymous';
 var room = getQueryVariable("room") || 'No Room Selected';
$("#buttonvolume").click(()=>{
  var classes = $("#volumeicon").attr("class")
  console.log(classes)
 if(classes=="fas fa-volume-up"){
  $("#volumeicon").removeClass("fas fa-volume-up").addClass("fas fa-volume-mute"); 
  $(this).addClass("fas fa-volume-mute");
  }else{
     $("#volumeicon").removeClass("fas fa-volume-mute").addClass("fas fa-volume-up"); 
  $(this).addClass("fas fa-volume-up");
  }
})
 var preview = document.querySelector('#imagepreview');
 $(preview).hide()
 var reader  = new FileReader();
 function previewFile() {
  
  var file    = document.querySelector('input[type=file]').files[0];
  reader.onload = function(){
    const base64 = this.result.replace(/.*base64,/, '');
    momentTimestamp=moment().format("HH:mm");
    socket.emit('image', {
      image:base64,
      name: name,
      timestamp:momentTimestamp
    });
  }



  if (file) {
    reader.readAsDataURL(file);
   
  } else {
    preview.src = "";
  }
}

socket.on("upload.progress", function(prg){
  $('#carica').remove();
  console.log(prg)
   var $messages = $(".messages");
  var $message = $('<li  id="carica" class="list-group-item"></li>');
  var momentTimestamp = moment.utc(prg.timestamp).local().format
  ("HH:mm");
  momentTimestamp=moment().format("HH:mm");
  $message.append("<strong>" + momentTimestamp + " " + name + "</strong>");
  $message.append("<p></p>");
    $message.append('<div  class="progress">'+
  '<div class="progress-bar progress-bar-striped progress-bar-animated active" '+'role="progressbar" aria-valuenow="'+prg.percentage+'" aria-valuemin="0" '+'aria-valuemax="100" style="width:'+prg.percentage+'%">Caricamento: '+prg.percentage+'%</div>'+
'</div>');
    $messages.append($message);
     var obj = $("ul.messages.list-group");
  var offset = obj.offset();
  var scrollLength = obj[0].scrollHeight;
  //  offset.top += 20;
  $("ul.messages.list-group").animate({
    scrollTop: scrollLength - offset.top
  });
  if(prg.percentage==100){
  socket.emit('file', {
      file: prg.file,
      filename:prg.name,
      name: name,
      timestamp:momentTimestamp
    });
  }
    //const base64 = this.result.replace(/.*base64,/, '');
})

    
    
/*function previewFile2() {
  
  var file = document.querySelector('input[id=file-input]').files[0];
  console.log(file)
  reader.onload = function(){
 
  
    momentTimestamp=moment().format("HH:mm");
    socket.emit('file', {
      file:file,
      filename:file.name,
      name: name,
      timestamp:momentTimestamp
    });
  }



  if (file) {
    
    reader.readAsDataURL(file);
   
  } else {
    preview.src = "";
  }
}


*/


 $(".room-title").text("Stanza: "+room);
 // fires when client successfully conencts to the server
 socket.on("connect", function() {
   console.log("Connected to Socket I/O Server!");
   console.log(name + " wants to join  " + room);
   // to join a specific room
   socket.emit('joinRoom', {
     name: name,
     room: room
   });
 });

 // below code is to know when typing is there
 var timeout;

 function timeoutFunction() {
   typing = false;
   //console.log("stopped typing");
   // socket.emit("typing", false);
   socket.emit('typing', {
     text: "" //name + " stopped typing"
   });
 }
 // if key is pressed typing message is seen else auto after 2 sec typing false message is send
 // TODO : add broadcast event when server receives typing event
 $('#messagebox').keyup(function() {
   console.log('happening');
   typing = true;
   $("#icon-type").removeClass();
   //console.log("typing typing ....");
   //socket.emit('typing', 'typing...');
   socket.emit('typing', {
     text: name+" sta scrivendo ..."
   });
   clearTimeout(timeout);
   timeout = setTimeout(timeoutFunction, 1000);
 });

 // below is the checking for page visibility api
 var hidden, visibilityChange;
 if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
   hidden = "hidden";
   visibilityChange = "visibilitychange";
 } else if (typeof document.mozHidden !== "undefined") {
   hidden = "mozHidden";
   visibilityChange = "mozvisibilitychange";
 } else if (typeof document.msHidden !== "undefined") {
   hidden = "msHidden";
   visibilityChange = "msvisibilitychange";
 } else if (typeof document.webkitHidden !== "undefined") {
   hidden = "webkitHidden";
   visibilityChange = "webkitvisibilitychange";
 }

 //listening for typing  event
 socket.on("typing", function(message) { //console.log(message.text);
   $(".typing").text(message.text);
 });

 socket.on("userSeen", function(msg) {
 
 
  
    
    
  // if (msg.user == name) {
     // read message
     // show messags only to user who has typied
     var icon = $("#icon-type");
     icon.removeClass();
     icon.addClass("fa fa-check-circle");
     if (msg.read) {
       //user read the message
       icon.addClass("msg-read");
     } else {
         
       // message deleiverd but not read yet
       icon.addClass("msg-delieverd");
     }
     console.log(msg);
     i=0
   //}
 });


 socket.on('image', image => {
  

  var $messages = $(".messages");
  var $message = $('<li class = "list-group-item"></li>');
play()

  var $message1= "data:image/png;base64,"+image.image
  var momentTimestamp = moment.utc(image.timestamp).local().format("HH:mm");
  $message.append("<strong>" + momentTimestamp + " " + image.name + "</strong>");
  $message.append("<p></p>");
  var htmlimage="<img class='mymessages' src='"+$message1+"' style='width:30%'></img>"
  $message.append(htmlimage);

  $messages.append($message);
  $message1='';
  var obj = $("ul.messages.list-group").attr("id","boxlist");
  var offset = obj.offset();
  var scrollLength = obj[0].scrollHeight;
  //  offset.top += 20;
  $("ul.messages.list-group").animate({
    scrollTop: scrollLength - offset.top
  });
 
  //socket.emit('image', image)
  //$("#imagechat").attr('src',"data:image/jpg;base64,"+image)
  // Insert it into the DOM
});



 socket.on('imageserver', image => {
  //alert("ciao")

  
  var $messages = $(".messages");
  var $message = $('<li class = "list-group-item"></li>');
  var $message1= "data:image/png;base64,"+image.image
  var momentTimestamp = moment.utc(image.timestamp).local().format("HH:mm");
  $message.append("<strong>" + momentTimestamp + " " + image.name + "</strong>");
  $message.append("<p></p>");
  var htmlimage="<img class='mymessages' src='"+$message1+"' style='width:30%'></img>"
  $message.append(htmlimage);

  $messages.append($message);
  $message1='';
  var obj = $("ul.messages.list-group");
  var offset = obj.offset();
  var scrollLength = obj[0].scrollHeight;
  //  offset.top += 20;
  $("ul.messages.list-group").animate({
    scrollTop: scrollLength
  },10);
 
  //socket.emit('image', image)
  //$("#imagechat").attr('src',"data:image/jpg;base64,"+image)
  // Insert it into the DOM
});


socket.on('videocall',videocall=>{
if(videocall.name!=name){
  var $messages = $(".messages");
  var $message = $('<li class = "list-group-item"></li>')
  play()
  //var $message1= file.file
   var momentTimestamp = moment.utc(videocall.timestamp).local().format("HH:mm");
    $message.append("<strong>" + momentTimestamp + " " + videocall.name + "</strong>");
  $message.append("<p></p>");
    var fileshtml="<a> <div id='callbox' class='box3'>" +
 "<div class='box4'style='text-align:center'>"+
 "<a href='https://igesa-chat.fabiogerman.repl.co/videocall.html?user="+name+"&room="+videocall.room+"' target='_blank'class='btn btn-primary' style='margin-right:10px'>Accetta</a>"+
 "<button id='rifiuta' onlcick='callblockremove()'class='btn btn-primary'>Rifiuta</button>"+
 "</div>"+
 "<p>Videochiamata in corso</p>"+
"</div></a>";
$message.append(fileshtml);
  $messages.append($message);
  $message1='';
  var obj = $("ul.messages.list-group");
  var offset = obj.offset();
  var scrollLength = obj[0].scrollHeight;
  //  offset.top += 20;
  $("ul.messages.list-group").animate({
    scrollTop: scrollLength - offset.top
  });
  }else{
    var $messages = $(".messages");
  var $message = $('<li class = "list-group-item"></li>')
  play()
  //var $message1= file.file
   var momentTimestamp = moment.utc(videocall.timestamp).local().format("HH:mm");
    $message.append("<strong>" + momentTimestamp + " " + videocall.name + "</strong>");
  $message.append("<p></p>");
    var fileshtml="<a> <div class='box3'>" +
 "<div class='box4'style='text-align:center'>"+
 "</div>"+
 "<p>Videochiamata inviata</p>"+
"</div></a>";
$message.append(fileshtml);
  $messages.append($message);
  $message1='';
  var obj = $("ul.messages.list-group");
  var offset = obj.offset();
  var scrollLength = obj[0].scrollHeight;
  //  offset.top += 20;
  $("ul.messages.list-group").animate({
    scrollTop: scrollLength - offset.top
  });

  }
})


socket.on('file', file => {
  //Sconsole.log(image)
  console.log(file)

$('#carica').remove();
  var $messages = $(".messages");
  var $message = $('<li class = "list-group-item"></li>');
  play()
  var $message1= file.file
  var momentTimestamp = moment.utc(file.timestamp).local().format("HH:mm");
  $message.append("<strong>" + momentTimestamp + " " + file.name + "</strong>");
  $message.append("<p></p>");
  if(file.filename.length>12){
 var fileshtml="<a data-toggle='tooltip'title='"+file.filename+"'  href='https://igesa-chat.fabiogerman.repl.co/tmp/file/"+file.filename+"' download> <div class='box'>" +
 "<div class='box2'style='text-align:center'>"+
 file.filename.substr(0,6)+"..."+file.filename.substr(-3)+
 "</div>"+
 "<img style='height:28px' src='./images/file.png'></img>"+
"</div></a>";
  }else{
    var fileshtml="<a data-toggle='tooltip'title='"+file.filename+"'  href='https://igesa-chat.fabiogerman.repl.co/tmp/file/"+file.filename+"' download> <div class='box'>" +
 "<div class='box2'style='text-align:center'>"+
 file.filename+
 "</div>"+
 "<img style='height:28px' src='./images/file.png'></img>"+
"</div></a>";
  }
  $message.append(fileshtml);
  $message.append("<script>function imagedown() { window.open('"+$message1+"');}</script>")
  $messages.append($message);
  $message1='';
  var obj = $("ul.messages.list-group");
  var offset = obj.offset();
  var scrollLength = obj[0].scrollHeight;
  //  offset.top += 20;
  $("ul.messages.list-group").animate({
    scrollTop: scrollLength - offset.top
  });
 
  //socket.emit('image', image)
  //$("#imagechat").attr('src',"data:image/jpg;base64,"+image)
  // Insert it into the DOM
});




socket.on('fileserver', file => {
  //Sconsole.log(image)
  console.log(file)

  var $messages = $(".messages");
  var $message = $('<li class = "list-group-item"></li>');
  var $message1= file.file
  var momentTimestamp = moment.utc(file.timestamp).local().format("HH:mm");
  $message.append("<strong>" + momentTimestamp + " " + file.name + "</strong>");
  $message.append("<p></p>");
  if(file.filename.length>12){
 var fileshtml="<a data-toggle='tooltip'title='"+file.filename+"'  href='https://igesa-chat.fabiogerman.repl.co/tmp/file/"+file.filename+"' download> <div class='box'>" +
 "<div class='box2'style='text-align:center'>"+
 file.filename.substr(0,6)+"..."+file.filename.substr(-3)+
 "</div>"+
 "<img style='height:28px' src='./images/file.png'></img>"+
"</div></a>";
  }else{
var fileshtml="<a data-toggle='tooltip'title='"+file.filename+"'  href='https://igesa-chat.fabiogerman.repl.co/tmp/file/"+file.filename+"' download> <div class='box'>" +
 "<div class='box2'style='text-align:center'>"+
 file.filename+
 "</div>"+
 "<img style='height:28px' src='./images/file.png'></img>"+
"</div></a>";
  }
  $message.append(fileshtml);
  $message.append("<script>function imagedown() { window.open('"+$message1+"');}</script>")
  $messages.append($message);
  $message1='';
  var obj = $("ul.messages.list-group");
  var offset = obj.offset();
  var scrollLength = obj[0].scrollHeight;
  //  offset.top += 20;
  $("ul.messages.list-group").animate({
    scrollTop: scrollLength 
  },10);
 
  //socket.emit('image', image)
  //$("#imagechat").attr('src',"data:image/jpg;base64,"+image)
  // Insert it into the DOM
});



 //setup for custom events
 socket.on("message", function(message) {
  var $messages = $(".messages");
  var $message = $('<li class = "list-group-item"></li>');
   console.log("New Message !");
   console.log(message.text);
   // insert messages in container
    play()
 

    momentTimestamp = moment.utc(message.timestamp).local().format("HH:mm");
   //$(".messages").append($('<p>').text(message.text));
   $message.append("<strong>" + momentTimestamp + " " + message.name + "</strong>");
   $message.append("<p>" + message.text + "</p>");
   $messages.append($message);
   // handle autoscroll
   // manage autoscroll
 play()
   var obj = $("ul.messages.list-group");
   var offset = obj.offset();
   var scrollLength = obj[0].scrollHeight;
   //  offset.top += 20;
  $("ul.messages.list-group").animate({
     scrollTop: scrollLength - offset.top
   });
  play()
   // try notify , only when user has not open chat view
   if (document[hidden]) {
       
     notifyMe(message);
     // also notify server that user has not seen messgae
     var umsg = {
       text: name + " has not seen message",
       read: false
     };
     socket.emit("userSeen", umsg);
     play()
   } else {
     // notify  server that user has seen message
     var umsg = {
       text: name + " has seen message",
       read: true,
       user: name
     };
     socket.emit("userSeen", umsg);
     play()
   }
 });



socket.on("messageserver", function(message) {
  var $messages = $(".messages");
  var $message = $('<li class = "list-group-item"></li>');
   console.log("New Message !");
   console.log(message.text);
   // insert messages in container
  

    momentTimestamp = moment.utc(message.timestamp).local().format("HH:mm");
   //$(".messages").append($('<p>').text(message.text));
   $message.append("<strong>" + momentTimestamp + " " + message.name + "</strong>");
   $message.append("<p>" + message.text + "</p>");
   $messages.append($message);
   // handle autoscroll
   // manage autoscroll
   var obj = $("ul.messages.list-group");
   var offset = obj.offset();
   var scrollLength = obj[0].scrollHeight;
   //  offset.top += 20;
  $("ul.messages.list-group").animate({
     scrollTop: scrollLength
   },10);

   // try notify , only when user has not open chat view
   if (document[hidden]) {
     notifyMe(message);
     // also notify server that user has not seen messgae
     var umsg = {
       text: name + " has not seen message",
       read: false
     };
     socket.emit("userSeen", umsg);
   } else {
     // notify  server that user has seen message
     var umsg = {
       text: name + " has seen message",
       read: true,
       user: name
     };
     socket.emit("userSeen", umsg);
   }
 });



 // handles submitting of new message
 var $form = $("#messageForm");
 var $message1 = $("#messagebox");
 $form.on("submit", function(event) {
   console.log()
   event.preventDefault();
   console.log($("#messagebox").val())
   var msg = $("#messagebox").val()
   //prevent js injection attack
   msg = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
   if (msg === "") return -1; //empty messages cannot be sent
   var momentTimestamp = moment().format("HH:mm");
   socket.emit("message", {
     text: msg,
     name: name,
     room: room,
     time: momentTimestamp
   });
   // show user messageForm
   var $messages = $(".messages");
   var $message = $('<li class = "list-group-item"></li>');
  play()
   console.log("messaggio")
   // $(".messages").append($('<p>').text(message.text));
   $message.append("<strong>" + momentTimestamp + " " + name + "</strong>");
   //$message.append("<p>" + $message1.val()+ "</p>");
   $message.append($("<p>", {
     class: "mymessages",
     text: $("#messagebox").val()
   }));
   $messages.append($message);
   $("#messagebox").val('')
   // manage autoscroll
   var obj = $("ul.messages.list-group");
   var offset = obj.offset();
   var scrollLength = obj[0].scrollHeight;
   //  offset.top += 20;
   $("ul.messages.list-group").animate({
     scrollTop: scrollLength - offset.top
   });
  
 });

 // notification message
 function notifyMe(msg) {
   // Let's check if the browser supports notifications
   if (!("Notification" in window)) {
     alert("This browser does not support desktop notification,try Chromium!");
   }

   // Let's check whether notification permissions have already been granted
   else if (Notification.permission === "granted") {
     // If it's okay let's create a notification
     //  var notification = new Notification(msg);
     var notification = new Notification('Igesa Chat', {
       body: msg.name + ": " + msg.text,
       icon: '/images/apple-icon.png' // optional
     });
     notification.onclick = function(event) {
       event.preventDefault();
       window.focus()
       // assume user would see message so broadcast userSeen event
       var umsg = {
         text: name + " has seen message",
         read: true,
         user: name
       };
       socket.emit("userSeen", umsg);
       //window.open('http://www.mozilla.org', '_blank');
     };
   }
   // Otherwise, we need to ask the user for permission
   else if (Notification.permission !== 'denied') {
     Notification.requestPermission(function(permission) {
       // If the user accepts, let's create a notification
       if (permission === "granted") {
         var notification = new Notification('Igesa chat', {
           body: msg.name + ": " + msg.text,
           icon: '/images/apple-icon.png' // optional
         });
         notification.onclick = function(event) {
           event.preventDefault();
           window.focus()
           var umsg = {
             text: name + " has seen message",
             read: true,
             user: name
           };
           socket.emit("userSeen", umsg);
           // assume user would see message so broadcast userSeen event
           //window.open('http://www.mozilla.org', '_blank');
         };
       }
     });
   }

   // At last, if the user has denied notifications, and you
   // want to be respectful there is no need to bother them any more.
 }
function callblockremove(){
  console.log("ciao")
}
 function play(){
   var audio = new Audio('./images/pop.mp3')
   audio.volume = 0.2
    var classes = $("#volumeicon").attr("class")
   if(classes=="fas fa-volume-up"){
  audio.play()
  }else{
    audio.muted
  }
 }

 $("#buttonvideochat").click(()=>{
      
      if(room.length<10){
        let r = Math.random().toString(36).substring(2, 12-room.length);
         $("#buttonvideochat").attr("href","https://igesa-chat.fabiogerman.repl.co/videocall.html?utente="+name+"&room="+room+r)
         socket.emit('videocall', {
         room:room+r,
         name: name,
         timestamp:momentTimestamp
        });
       // console.log(r)
      }else if(room.length>10){
        let r = room.substring(0,10)
         $("#buttonvideochat").attr("href","https://igesa-chat.fabiogerman.repl.co/videocall.html?utente="+name+"&room="+r)
         socket.emit('videocall', {
         room:r,
         name: name,
         timestamp:momentTimestamp
        });
       
      }else if(room.length==10){
        let r = room
           $("#buttonvideochat").attr("href","https://igesa-chat.fabiogerman.repl.co/videocall.html?utente="+name+"&room="+r)
         socket.emit('videocall', {
         room:r,
         name: name,
         timestamp:momentTimestamp
      })
      }
 })
      
   
