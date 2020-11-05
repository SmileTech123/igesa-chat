var PORT = process.env.PORT || 3000;
var PORTHTTPS = process.env.PORT || 80; // take port from heroku or for loacalhost
var express = require("express");
var app = express(); // express app which is used boilerplate for HTTP
//var http = require("http")
var https = require('https')
var fs = require('fs')
var options = {
  header: ('Content-Type','application/octet-stream'),
  key: fs.readFileSync('./cert/key.pem'),
  cert: fs.readFileSync('./cert/key-cert.pem'),
  ciphers: [
    "ECDHE-RSA-AES128-SHA256",
    "DHE-RSA-AES128-SHA256",
    "AES128-GCM-SHA256",
    "RC4",
    "HIGH",
    "!MD5",
    "!aNULL"
].join(':')
};

var server = https.createServer(options,app)
//var serverhttp = http.createServer(app)
//moment js
var moment = require("moment");

var clientInfo = {};

//socket io module
var io = require("socket.io")(server);

// expose the folder via express thought
app.use(express.static(__dirname,{index:'home.html'}));

// send current users to provided scoket
function sendCurrentUsers(socket) { // loading current users
  var info = clientInfo[socket.id];
  var users = [];
  if (typeof info === 'undefined') {
    return;
  }
  // filte name based on rooms
  Object.keys(clientInfo).forEach(function(socketId) {
    var userinfo = clientInfo[socketId];
    // check if user room and selcted room same or not
    // as user should see names in only his chat room
    if (info.room == userinfo.room) {
      users.push(userinfo.name);
    }

  });
  // emit message when all users list

  socket.emit("message", {
    name: "Sistema",
    text: "Utente Corrente : " + users.join(', '),
    timestamp: moment().valueOf()
  });

}


// io.on listens for events
io.on("connection", function(socket) {
  console.log("User is connected");

  //for disconnection
  socket.on("disconnect", function() {
    var userdata = clientInfo[socket.id];
    if (typeof(userdata !== undefined)) {
      socket.leave(userdata.room); // leave the room
      //broadcast leave room to only memebers of same room
      socket.broadcast.to(userdata.room).emit("message", {
        text: userdata.name + " si è disconnesso",
        name: "Sistema",
        timestamp: moment().valueOf()
      });

      // delete user data-
      delete clientInfo[socket.id];

    }
  });

  // for private chat
  socket.on('joinRoom', function(req) {
    clientInfo[socket.id] = req;
    socket.join(req.room);
    //broadcast new user joined room
    socket.broadcast.to(req.room).emit("message", {
      name: "Sistema",
      text: req.name + ' si è connesso!',
      timestamp: moment().valueOf()
    });

  });

  // to show who is typing Message

  socket.on('typing', function(message) { // broadcast this message to all users in that room
    socket.broadcast.to(clientInfo[socket.id].room).emit("typing", message);
  });

  // to check if user seen Message
  socket.on("userSeen", function(msg) {
    socket.broadcast.to(clientInfo[socket.id].room).emit("userSeen", msg);
    //socket.emit("message", msg);

  });

  socket.emit("message", {
    text: "Benvenuto in Igesa Chat",
    timestamp: moment().valueOf(),
    name: "Sistema"
  });

  // listen for client message
  socket.on("message", function(message) {
    console.log("Message Received : " + message.text);
    var dati= message.time+"\n"+"Utente: "+message.name+" Messaggio: "+message.text+"\n"
    var data=new Date()
    var anno= data.getFullYear()
    var mese = data.getMonth()
    var giorno= data.getDate()
    switch (message.room) {
      case "Alessio":
        fs.writeFileSync("./tmp/log/Alessio/"+anno+"-"+mese+"-"+giorno+".txt",dati,{flag:'a'})
        break;

      case "Gesù":
        fs.writeFileSync("./tmp/log/Gesù/"+anno+"-"+mese+"-"+giorno+".txt",dati,{flag:'a'})
      break;
    
      default:
        break;
    }
    
    
    // to show all current users
    if (message.text === "@currentUsers") {
      sendCurrentUsers(socket);
    } else {
      //broadcast to all users except for sender
      message.timestamp = moment().valueOf();
      //socket.broadcast.emit("message",message);
      // now message should be only sent to users who are in same room
      socket.broadcast.to(clientInfo[socket.id].room).emit("message", message);
      //socket.emit.to(clientInfo[socket.id].room).emit("message", message);
    }

  });

  

  // ...
  
  socket.on('image', async image => {

    const buffer = Buffer.from(image.image, 'base64');
    fs.writeFileSync('./tmp/image1.jpg', buffer) // fs.promises
    /*socket.emit('image',image.toString('base64'))
    socket.broadcast.to(clientInfo[socket.id].room).emit('image', image.toString('base64'));*/
    if (image.name === "@currentUsers") {
      sendCurrentUsers(socket);
    } else {
      //broadcast to all users except for sender
      image.timestamp = moment().valueOf();
      //socket.broadcast.emit("message",message);
      // now message should be only sent to users who are in same room
      socket.broadcast.to(clientInfo[socket.id].room).emit("image", image);
      socket.emit('image',image);
    }
// fs.promises
});


socket.on('file', async file => {

  const buffer = Buffer.from(file.file);
  fs.writeFileSync('./tmp/file/'+file.filename, buffer) // fs.promises
  /*socket.emit('image',image.toString('base64'))
  socket.broadcast.to(clientInfo[socket.id].room).emit('image', image.toString('base64'));*/
  if (file.name === "@currentUsers") {
    sendCurrentUsers(socket);
  } else {
    //broadcast to all users except for sender
    file.timestamp = moment().valueOf();
    //socket.broadcast.emit("message",message);
    // now message should be only sent to users who are in same room
    socket.broadcast.to(clientInfo[socket.id].room).emit("file", file);
    socket.emit('file',file);
  }
// fs.promises
});


});
/*http.listen(PORT, function() {
  console.log("server started");
});
https.listen(PORTHTTPS,function(){
  console.log("server started https")
})*/
/*httpServer.listen(8080);
httpsServer.listen(8443);*/
server.listen(PORTHTTPS,function(){
  console.log('server up and running at %s port', PORTHTTPS);
})
/*serverhttp.listen(PORT,function(){
  console.log('server up and running at %s port', PORT)
})*/