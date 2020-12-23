var cookie=Cookies.get('Login');
if(cookie=="success"){
$.get("/adminuser",function(response){
  $("#loggeduser").text(response+" ")
})
$.get("/assistenza",function(response){

  var i = 0
  if(!response.msg){
  response.forEach(()=>{
    
    var iduser= response[i].iduser
    var nome =response[i].nome
    var cognome = response[i].cognome
    var ip = response[i].ip
    var interno =response[i].telefonointerno
    var dataentrata=response[i].dataoraentrata
    dataentrata= Date.parse(dataentrata)
    dataentrata= new Date(dataentrata)
    dataentrata =
    ("00" + dataentrata.getDate()).slice(-2) + "/" +
  ("00" + (dataentrata.getMonth() + 1)).slice(-2) + "/" +
  dataentrata.getFullYear() + " " +
  ("00" + dataentrata.getHours()).slice(-2) + ":" +
  ("00" + dataentrata.getMinutes()).slice(-2) + ":" +
  ("00" + dataentrata.getSeconds()).slice(-2);
    var datauscita=response[i].dataorauscita
     datauscita= Date.parse(datauscita)
    datauscita= new Date(datauscita)
    datauscita =
     ("00" + datauscita.getDate()).slice(-2) + "/" +
  ("00" + (datauscita.getMonth() + 1)).slice(-2) + "/" +
 
  datauscita.getFullYear() + " " +
  ("00" + datauscita.getHours()).slice(-2) + ":" +
  ("00" + datauscita.getMinutes()).slice(-2) + ":" +
  ("00" + datauscita.getSeconds()).slice(-2);
  console.log(datauscita)
    if(datauscita==null || datauscita==undefined || datauscita=="aN/aN/NaN aN:aN:aN"){
      datauscita=""
    }
    if(dataentrata==null || dataentrata==undefined|| dataentrata=="aN/aN/NaN aN:aN:aN"){
      dataentrata=""
    }
    if(interno==null || interno==undefined){
      interno="Inesistente"
    }
    var rating="5,0★"
      $("#tableuser").append("<tr><td>"+iduser+"</td><td>"+nome+"</td><td>"+cognome+"</td><td>"+ip+"</td><td>"+interno+"</td><td>"+dataentrata+"</td><td>"+datauscita+"</td><td>"+rating+"</td></tr>")
      i++
  })
}else{
  alert("Riesegui accesso")
  window.location.href='accessiadmin.html'
}
})

$("#logout").click(()=>{
  Cookies.set('Login', 'error');
})

}else{
  window.location.href='accessiadmin.html'
}
