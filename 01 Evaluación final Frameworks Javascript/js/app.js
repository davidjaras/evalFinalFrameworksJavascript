/*********************** Definición de funciones y variables globales ************************/

//Función movimiento define los eventos drag and drop para los elementos del tablero.
var dragInfo = {columna: 0, fila: 0, imagen: 0}
var dropInfo = {columna: 0, fila: 0, imagen: 0}

function movimiento(){
  
  $('div[class^="col"]').find("div img").draggable({
    start: function(event){
      dragInfo.columna = $(event.target).parent().parent().attr('class').substring(4)
      dragInfo.fila  = $(event.target).parent().attr('class').substring(13,14)
      dragInfo.imagen  = $(event.target).attr('src')      
    }
  });
  $('div[class^="col"]').find("div img").droppable({
    tolerance: "intersect",
    drop: function(event){
      dropInfo.columna = $(event.target).parent().parent().attr('class').substring(4)
      dropInfo.fila  = $(event.target).parent().attr('class').substring(13,14)
      dropInfo.imagen  = $(event.target).attr('src')
      makeMove()      
    }
  });
}//Función movimiento


//Función que valida que el movimiento sea correcto y ejecuta las funciones correspondientes
function makeMove(){
  setScore(1,'#movimientos-text')
  var restaCol = dropInfo.columna - dragInfo.columna
  var restaFila = dropInfo.fila - dragInfo.fila
  if (Math.abs(restaCol)==1 && restaFila==0) {
    animateMove(-restaCol,restaFila)
  }
  else if (Math.abs(restaFila)==1 && restaCol==0) {
    animateMove(restaCol,restaFila)
  } else {
    var imagenMover = $('.col-'+dragInfo.columna+' .fila'+dragInfo.fila+' img')
    imagenMover.animate({
      top: 0,
      left: 0
    },100)
  }
}//makeMove


//Función que define animación de los elementos después de moverlos
function animateMove(sentidoHorizontal,sentidoVertical){
  
  var imagenMover = $('.col-'+dropInfo.columna+' .fila'+dropInfo.fila+' img')
  var top1 = sentidoVertical*96;
  var left1 = (sentidoHorizontal*100).toString()+'%';
  imagenMover.animate({
    top: top1,
    left: left1
  },250,function(){
    restoreMove()
  })
}//aminateMove


//Función que establece el cambio real (a nivel de html) de los elementos
//arrastrados con drag and drop
//Esta función vuelve a invocar la función movimiento() para mantener las propiedades
//drag and drop
function restoreMove(){
  var casillaDrag = $('.col-'+dragInfo.columna+' .fila'+dragInfo.fila)
  var casillaDrop = $('.col-'+dropInfo.columna+' .fila'+dropInfo.fila)
  casillaDrag.find('img').detach()
  casillaDrop.find('img').detach()
  var imageDrag = '<img src="'+dropInfo.imagen+'">'
  var imageDrop = '<img src="'+dragInfo.imagen+'">'
  casillaDrag.append(imageDrag)
  casillaDrop.append(imageDrop)
  //movimiento()
  updateStatus()
}//restoreMove


//objeto Timer para llevar conteo regresivo del juego
var temporizador = $('#timer')
var timerGame = new Timer({
  tick    : 1,
  ontick  : function(millisec) {
    var mm = Math.floor(millisec/1000/60)
    var ss = Math.floor(((millisec/1000/60)-mm)*60)
    ss = ss.toString()
    if (ss.length == 1) {ss = '0'+ss}
    temporizador.text('0'+mm+':'+ss)
  },
  onstart : function(millisec) {
    var mm = Math.floor(millisec/1000/60)
    var ss = Math.floor(((millisec/1000/60)-mm)*60)
    ss = ss.toString()
    if (ss.length == 1) {ss = '0'+ss}
    temporizador.text('0'+mm+':'+ss)
  },
  onstop  : function() {
     temporizador.text('02:00')
  },
  onpause : function() { console.log('timer set on pause') },
  onend   : function() {
    var panelt = $('.panel-tablero')
    var panels = $('.panel-score')
     $('div[class^="col"]').find("div").remove()

    panelt.animate(
      {
        width: 0,
        border: 0,
        height: 0
      },1500,'linear');
    
    panels.animate(
      {
        width: '100%'
      },1500,'linear', function(){
        panelt.hide()
        $('.time').hide('fast')
        $('.titulo-over').show('fast')
        $('div[class^="col"]').find("div").remove()
      });
  }
});
//Objeto Timer


//Función para cambiar color del título Match Game
function changeColorTitle(elemento){  
  var cambiarColor = setInterval(function(){
    var colorActual = elemento.css("color")
    if (colorActual == "rgb(220, 255, 14)") {
      elemento.css("color","rgb(255, 255, 255)")
    } else {
      elemento.css("color","rgb(220, 255, 14)")
    }
  },350)
}//changeColorTitle


//Función para rellenar tablero de dulces
function initBoard(){
  for (let i = 1; i <= 7; i++) {
    var columna = $('.col-'+i);
    for (let j = 7; j >= 1; j--) {
      columna.append(sweetMaker(j))
    }//For Filas    
  }//For Columnas
}//initBoard


//Función para verificar cuando se forman las alineaciones de más de tres en los dulces
function sweetValidation(){
  var filasIguales = []

  //Validación por columnas
  for (let i = 1; i <= 7; i++) {
    var columna = $('.col-'+i);
    
    for (let j = 1; j <= 5; j++) {
      var selectorActual  = '.fila'+j+' img'
      var selectorSig1    = '.fila'+(j+1)+' img'
      var selectorSig2    = '.fila'+(j+2)+' img'
      var f1 = columna.find(selectorActual).attr('src')
      var f2 = columna.find(selectorSig1).attr('src')
      var f3 = columna.find(selectorSig2).attr('src')
      if((f1 == f2) && (f2 == f3)){
        if (!filasIguales.includes('.col-'+i+' '+selectorActual)) {filasIguales.push('.col-'+i+' '+selectorActual) }
        if (!filasIguales.includes('.col-'+i+' '+selectorSig1))   {filasIguales.push('.col-'+i+' '+selectorSig1) }
        if (!filasIguales.includes('.col-'+i+' '+selectorSig2))   {filasIguales.push('.col-'+i+' '+selectorSig2) }
      }
    }//For Filas
  }//For Columnas

  //Validación por filas
  for (let i = 1; i <= 7; i++) {
    var fila = $('.fila'+i);
    for (let j = 1; j <= 5; j++) {
      var selectorActual  = '.col-'+j+' .fila'+i+' img'
      var selectorSig1    = '.col-'+(j+1)+' .fila'+i+' img'
      var selectorSig2    = '.col-'+(j+2)+' .fila'+i+' img'
      var f1 = $(selectorActual).attr('src')
      var f2 = $(selectorSig1).attr('src')
      var f3 = $(selectorSig2).attr('src')
      if((f1 == f2) && (f2 == f3)){
        if (!filasIguales.includes(selectorActual)){filasIguales.push(selectorActual) }
        if (!filasIguales.includes(selectorSig1)){filasIguales.push(selectorSig1) }
        if (!filasIguales.includes(selectorSig2)){filasIguales.push(selectorSig2) }
      }
    }//For Columnas 
  }//For Filas

  return filasIguales;
}//sweetValidation


//Funcion que retorna un elemento html con un dulce aleatorio
function sweetMaker(numRow,mode = 'R',num = 0){
  if(mode == "R"){
    num = Math.round(Math.random()*3+1)
  }  
  var stringHTML =  '<div class="elemento fila'+numRow+'">'+
                      '<img src="image/'+num+'.png" alt="">'+
                    '</div>'
  return stringHTML
}//sweetMaker


//Función que recibe como parametro string selector y aplica animación
function matchAnimation(arraySelectores){
  //console.log(arraySelectores)
  for (let i = 0; i < arraySelectores.length; i++) {
    if (i == arraySelectores.length - 1) {
      $(arraySelectores[i]).delay(400).effect('explode',800,function(){
        checkBoard()
        setScore(arraySelectores.length,'#score-text')
      })
    } else {
      $(arraySelectores[i]).delay(400).effect('explode',800)
    }
  }//for
 
}//matchanimation


//Función que evalua estado de los dulces, los mueve y completa faltantes
function checkBoard(){
  //console.log("Función Check Board ********************************************************")
  var elemento1 = undefined
  var elemento2 = undefined
  var factor = 0
  var antifactor = 0
  var matrizResponse = undefined

  for (let col = 1; col <= 7; col++) {

    var columna = $('.col-'+col);    
    for (let row = 1; row <= 8; row++) {
      
      var filai = columna.find('.fila'+row+' img')
      if (filai.is(':hidden')) {
        factor += 1;
        if (elemento1 == undefined) { elemento1 = filai; }
      }
      else if (row == 8){
        if((elemento1!=undefined)&&(elemento2==undefined)){

          filai = columna.find('.fila'+(row-1)+' img')
          elemento1 = filai; elemento2 = filai
          var desplazamiento = (96*factor).toString()
          elemento2.animate(
            {
              top: desplazamiento
            },400 , function(){            
             if (matrizResponse == undefined ) {
                matrizResponse = organizeHTML()
                //console.log(matrizResponse)
                setBoard(matrizResponse)
              }             
            })
        }//if elemento1 elemento2
      }//else if
      else{
        if (elemento1 != undefined) {
          elemento2 = filai
          elemento1.clone().insertAfter(elemento2)
          var desplazamiento = (96*factor).toString()
          elemento2.animate(
            {
              top: desplazamiento
            },400, function(){              
              if (matrizResponse == undefined ) {
                matrizResponse = organizeHTML()
                //console.log(matrizResponse)
                setBoard(matrizResponse)
              }             
            })
          row = 0
          elemento1 = undefined
          elemento2 = undefined
          antifactor -= 1
          factor = antifactor
        }//if elemento 1 undefined
      }//else   
    }//for row
    elemento1 = undefined
    elemento2 = undefined
    factor = 0
    antifactor = 0
  }//for col
}//checkBoard


//Función que retorna matriz con los elementos aún presentes en la pantalla
//después de ocultar los match en los dulces, organiza en una matriz dichos 
//elementos para redefinir la pantalla html
function organizeHTML(){
    var columnaOrganizada = []
    var matriz = []

    for (let columna = 1; columna <= 7; columna++) {

      var col = $('.col-'+columna);
      for (let row = 1; row <= 7; row++) {        
        var filai = col.find('.fila'+row+' img')

        if (filai.length == 2) {
          if (!filai.eq(0).is(':hidden')) {
            columnaOrganizada.push(filai.eq(0).attr('src'))
          }        
        } else {
          if (!filai.is(':hidden')) {
            columnaOrganizada.push(filai.attr('src'))
          }
        }   
      }//for row
      matriz.push(columnaOrganizada)
      columnaOrganizada = []
    
    }//For columna
    return matriz
}//organizateHTML


//Funcuón que rellena el tablero después de eliminar los match
function setBoard(matriz){
  for (let i = 1; i <= 7; i++) {
    var columna = $('.col-'+i);
    columna.find("div").remove()
    for (let j = 7; j >= 1; j--) {
      if (matriz[i-1][j-1] == undefined) {
        columna.append(sweetMaker(j))
      } else {
        var numImage = matriz[i-1][j-1].substring(6,7)
        columna.append(sweetMaker(j,'N',numImage))
      }
    }//For Filas    
  }//For Columnas
  updateStatus();
}//setboard


//Función que integra verificación de alineaciones de dulces, con su respectiva
//animación; mueve los dulces y completa los campos faltantes
function updateStatus(){
  matchAnimation(sweetValidation())
  movimiento()
}//updateStatus()


//Función que define funcionamiento del botón Iniciar
function btnIniciar(elemento){
  elemento.text('Reiniciar')
  initBoard()
  updateStatus()
}//btnIniciar


//función para mostrar puntuación, cada dulce con match es 1 punto
//Se ejecuta dentro de los procesos de updateStatus
function setScore(num,selector){
  if(num=="reset"){
    $(selector).text("0")
  }
  else{
    var numActual = $(selector).text()
    var nuevoPuntaje = Number(numActual)+num
    $(selector).text(nuevoPuntaje.toString())
  }
  
}//setScore


/*********************************************************************************************/

/***************************** Definición y manejo de eventos *******************************/

//Load Page
$(function(){

  //Intercalar indefinidamente color del título
  changeColorTitle($('.main-titulo'));

  //Eventos asociados al botón iniciar/reiniciar
  $('.btn-reinicio').on('click',function(){

    var accionBtn = $(this).text()

    if (accionBtn == "Iniciar") {
      btnIniciar($(this))
      timerGame.start(120)
    }
    else {
      location.reload()
    }
  })//btn-reinicio onclick

})//jQuery.Ready


/*********************************************************************************************/
