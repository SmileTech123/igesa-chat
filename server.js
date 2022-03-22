var PORT = process.env.PORT || 3000;
var PORTHTTPS = process.env.PORT || 4000; // take port from heroku or for loacalhost
const path = require('path');
var siofu = require("socketio-file-upload");
var soap = require('soap'),
    Cookie = require('soap-cookie');
var soapcall
var adminaccess
    var argssql={"SQL":"Select * from tabuser  where (datafinerapport>current_date or datafinerapport is null) and codarea in ('HOTLINE') ORDER BY nome ASC "}



 var data=new Date()
    var anno= data.getFullYear()
    var mese = data.getMonth()
    var giorno= data.getDate()

var express = require("express");
var room
var progress = require('progress-stream');
const Database = require("@replit/database")
const db = new Database()

var app = express(); // express app which is used boilerplate for HTTP
var http = require("http")
var https = require('https')
var fs = require('fs-extra')
const getSize = require('get-folder-size');
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

var server = http.createServer(options,app)
//var serverhttp = http.createServer(app)
//moment js
var moment = require("moment");

var clientInfo = {};

app.post('/users', async function (req, res) {
   soapcall = await soap.createClientAsync("http://mts.igesa.it:8686/mts/megadb.asmx?WSDL")
  var args = {};
   adminaccess = req.query.username
  var password = req.query.password
  args={"User":adminaccess,"Password":password}
  soapcall.Login(args, function(err, response) {
  soapcall.setSecurity(new Cookie(soapcall.lastResponseHeaders));
  res.json(response)
});
});
app.get("/accessiadmin",function(req,res){
  res.sendFile(path.join(__dirname + '/accessiadmin.html'));
})
app.get("/assistenza",function(req,res){
  //var soapcall=soap.createClientAsync("http://mts.igesa.it:8686/mts/megadb.asmx?WSDL")
  if(soapcall!=undefined){
  soapcall.GetSQL(argssql,function(err, response) {
    if(response.GetSQLResult){
    res.json(response.GetSQLResult.diffgram.NewDataSet.tabuser)
    }else{
      res.json({"msg":"errore"})
    }
  })
  }else{
    res.json({"msg":"errore"})
  }
})
app.get('/adminuser',function(req,res){
  res.json(adminaccess)
})



//socket io module
var io = require("socket.io")(server);

// expose the folder via express thought
app.use(express.static(__dirname,{index:'index.html'}));
//app.use("/", express.static(__dirname + '/'));

app.use(siofu.router)
// send current users to provided scoket
function sendCurrentUsers(socket) { // loading current users
  var info = clientInfo[socket.id];
  console.log(info.room)
  var users = [];
  if (typeof info === 'undefined') {
    return;
  }
  // filte name based on rooms
  Object.keys(clientInfo).forEach(function(socketId) {
    var userinfo = clientInfo[socketId];
    console.log(userinfo)
    // check if user room and selcted room same or not
    // as user should see names in only his chat room
    if (info.room == userinfo.room) {
      users.push(userinfo.name);
      console.log(userinfo.room)
      
    }

  });
  // emit message when all users list

  socket.emit("messageserver", {
    name: "Sistema",
    text: "Utente Corrente : " + users.join(', '),
    timestamp: moment().valueOf()
  });

}




// io.on listens for events
io.on("connection", async function(socket) {

  var uploader = new siofu();
    uploader.dir = "./tmp/file";
    uploader.listen(socket);
    uploader.on('progress', function(event) {
      console.log(event.file.name)
    console.log(Math.floor(event.file.bytesLoaded / event.file.size *100))
    socket.emit('upload.progress', {
      percentage:(Math.floor(event.file.bytesLoaded / event.file.size *100)) ,
      timestamp: event.file.mtime,
      name: event.file.name,
      file: event.file
      
    })
});
  getSize("./tmp/log", (err, size) => {
  if (err) { throw err; }
  var dimension=(size / 1024 / 1024).toFixed(2)
  console.log(size)
  if(dimension>50){
   fs.emptydir("./tmp/log")
  }
});

  
  console.log("User is connected");
  //for disconnection
  socket.on("disconnect", function() {
    var userdata = clientInfo[socket.id];
    
    if (typeof(userdata !== undefined)) {
      if(userdata){
      socket.leave(userdata.room);
       // leave the room
      //broadcast leave room to only memebers of same room
      socket.broadcast.to(userdata.room).emit("messageserver", {
        text: userdata.name + " si è disconnesso",
        name: "Sistema",
        timestamp: moment().valueOf()
      });
}
      // delete user data-
      delete clientInfo[socket.id];

    }
  });

  // for private chat
  socket.on('joinRoom', function(req) {
    //console.log(req)
    io.sockets.emit("clientconnect",JSON.stringify({"utente":req.name,"room":req.room}))
    clientInfo[socket.id] = req;
    room=req.room
    socket.join(req.room);
      if(fs.existsSync("./tmp/log/"+room+"/"+anno+"-"+mese+"-"+giorno+".json")){
      var mexold =  fs.readFileSync("./tmp/log/"+room+"/"+anno+"-"+mese+"-"+giorno+".json")
      mexold=JSON.parse(mexold)
      //console.log(mexold)
      
      
    mexold.messaggi.forEach((mex)=>{
      console.log(moment.utc(mex.date).local().format("HH:mm"))
      if(mex.text){
    socket.emit("messageserver", {
    text: mex.text,
    timestamp: mex.date,
    name: mex.name
  });
    } else if(mex.image){
   socket.emit("imageserver", {
    image: mex.image,
    timestamp: mex.date,
    name: mex.name
  });
  }else if(mex.filename){
   socket.emit("fileserver", {
    file: mex.file,
    filename:mex.filename,
    timestamp: mex.date,
    name: mex.name
  });
  }
    })
   

   
  }else{
    if(!fs.existsSync("./tmp/log/"+room)){
    fs.mkdirSync("./tmp/log/"+room)
    fs.mkdirSync("./tmp/log/"+room+"/txt")
    }
  }

   var deletemex=fs.readdirSync("./tmp/log/"+room)
    var fileoggi=anno+"-"+mese+"-"+giorno
    console.log(deletemex[0])
    //console.log(fileoggi)
    console.log("2020-10-20"+".json")
    console.log(deletemex[0]!=fileoggi+".json")
    if(deletemex[0]==fileoggi+".json"){
      console.log("uguali")
    
    }else{
      console.log("diversi cancella")
        if(!fs.statSync("./tmp/log/"+room+"/"+deletemex[0]).isDirectory()){
      fs.unlinkSync("./tmp/log/"+room+"/"+deletemex[0])
    }
    }
    //broadcast new user joined room
    socket.broadcast.to(req.room).emit("messageserver", {
      name: "Sistema",
      text: req.name + ' si è connesso!',
      timestamp: moment().valueOf(),
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

  socket.emit("messageserver", {
    text: "Salve! \n rimanga in attesa, un operatore sarà subito da voi!😉",
    timestamp: moment().valueOf(),
    name: "Sistema"
  });


  // listen for client message
  socket.on("message", function(message) {
    

    var textlog= message.time+"\n"+"Utente: "+message.name+" Messaggio: "+message.text+"\n"
    
   
    console.log("Message Received : " + message.text);
    fs.writeFileSync("./tmp/log/"+room+"/txt/"+anno+"-"+mese+"-"+giorno+".txt",textlog,{flag:"a"})
    var dati={
      messaggi:[]
       }
    if(fs.existsSync("./tmp/log/"+room+"/"+anno+"-"+mese+"-"+giorno+".json")){
      //console.log("esisto")
      var now=""+anno+mese+giorno
      console.log(now)
       var filex=fs.readFileSync("./tmp/log/"+room+"/"+anno+"-"+mese+"-"+giorno+".json")
       
       
   
       
      dati=JSON.parse(filex)
      console.log(message.timestamp)
      dati.messaggi.push({
      name: message.name,
      text: message.text,
      date: moment().valueOf()})
      dati=JSON.stringify(dati)
      fs.writeFileSync("./tmp/log/"+room+"/"+anno+"-"+mese+"-"+giorno+".json",dati)
    }else{
       dati.messaggi.push({
      name: message.name,
      text: message.text,
      date: moment().valueOf()})
      dati=JSON.stringify(dati)
      fs.writeFileSync("./tmp/log/"+room+"/"+anno+"-"+mese+"-"+giorno+".json",dati)
    }

    

    
    /*switch (message.room) {
      case "Alessio":
        fs.writeFileSync("./tmp/log/Alessio/"+anno+"-"+mese+"-"+giorno+".json",dati)
        break;

      case "Gesù":
        fs.writeFileSync("./tmp/log/Gesù/"+anno+"-"+mese+"-"+giorno+".json",dati)
      break;
    
      default:
        break;
    }*/
    
    
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
     var textlog= image.time+"\n"+"Utente: "+image.name+" Messaggio: "+image.image+"\n"
     fs.writeFileSync("./tmp/log/"+room+"/txt/"+anno+"-"+mese+"-"+giorno+".txt",textlog,{flag:"a"})
    var dati={
      messaggi:[]
       }
    if(fs.existsSync("./tmp/log/"+room+"/"+anno+"-"+mese+"-"+giorno+".json")){
      //console.log("esisto")
       var filex=fs.readFileSync("./tmp/log/"+room+"/"+anno+"-"+mese+"-"+giorno+".json")
      dati=JSON.parse(filex)
      //console.log(dati)
      dati.messaggi.push({
      name: image.name,
      image: image.image,
      date: moment().valueOf()})
      dati=JSON.stringify(dati)
      fs.writeFileSync("./tmp/log/"+room+"/"+anno+"-"+mese+"-"+giorno+".json",dati)
    }else{
     dati.messaggi.push({
      name: image.name,
      image: image.image,
      date: moment().valueOf()})
      dati=JSON.stringify(dati)
      fs.writeFileSync("./tmp/log/"+room+"/"+anno+"-"+mese+"-"+giorno+".json",dati)
    }
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
  console.log(file)
  var textlog= file.time+"\n"+"Utente: "+file.name+" Messaggio: "+file.image+"\n"
     fs.writeFileSync("./tmp/log/"+room+"/txt/"+anno+"-"+mese+"-"+giorno+".txt",textlog,{flag:"a"})
    var dati={
      messaggi:[]
       }
    if(fs.existsSync("./tmp/log/"+room+"/"+anno+"-"+mese+"-"+giorno+".json")){
      //console.log("esisto")
       var filex=fs.readFileSync("./tmp/log/"+room+"/"+anno+"-"+mese+"-"+giorno+".json")
      dati=JSON.parse(filex)
      //console.log(dati)
      dati.messaggi.push({
      name: file.name,
      filename: file.filename,
      date: moment().valueOf()})
      dati=JSON.stringify(dati)
      fs.writeFileSync("./tmp/log/"+room+"/"+anno+"-"+mese+"-"+giorno+".json",dati)
    }else{
    dati.messaggi.push({
      name: file.name,
      filename: file.filename,
      date: moment().valueOf()})
      dati=JSON.stringify(dati)
      fs.writeFileSync("./tmp/log/"+room+"/"+anno+"-"+mese+"-"+giorno+".json",dati)
    }


  getSize("./tmp/file", (err, size) => {
    if (err) { throw err; }
   
    
    size=(size / 1024 / 1024).toFixed(2)
    //console.log(size + ' MB');
    if(size>100){
      fs.emptyDirSync('./tmp/file')
    }
  });


  
 // fs.promises
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
      socket.emit('file', file);
    }
    // fs.promises
  });





socket.on('videocall', async videocall => {
  
  console.log(videocall)
 // fs.promises
  /*socket.emit('image',image.toString('base64'))
  socket.broadcast.to(clientInfo[socket.id].room).emit('image', image.toString('base64'));*/
  if (videocall.name === "@currentUsers") {
    sendCurrentUsers(socket);
  } else {
    //broadcast to all users except for sender
      videocall.timestamp = moment().valueOf();
      
      //socket.broadcast.emit("message",message);
      // now message should be only sent to users who are in same room
      socket.broadcast.to(clientInfo[socket.id].room).emit("videocall", videocall);
      socket.emit('videocall', videocall);
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
server.listen(PORT, function() {
  console.log('server up and running at %s port', PORT);
})
/*serverhttp.listen(PORT,function(){
  console.log('server up and running at %s port', PORT)
})*/
