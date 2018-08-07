$(function() {
    var FADE_TIME = 150; // ms
    var TYPING_TIMER_LENGTH = 400; // ms
    var COLORS = [
        '#0B610B', '#DF0101', '#013ADF', '#D7DF01'
        
    ];

    // Initialize variables
    var myVinyls;
    var $window = $(window);
    var $carnetInput = $('.carnet'); // Input for username
    
    var $partidos = $('.partidos');
    

    var $loginPage = $('.login.page'); // The login page
    var $chatPage = $('.chat.page'); // The chatroom page

    // Prompt for setting a username
    var username;
    
    var $currentInput = $carnetInput.focus();

    var socket = io();    
    
     function setUsername() {
        username = cleanInput($carnetInput.val().trim());
        console.log(username);
        
        if (username) {
            $loginPage.fadeOut();
            $chatPage.show();
            $loginPage.off('click');

            // Tell the server your username
           // socket.emit('add user', username);
            socket.emit('load data', username);
        }    
    } 
    
  
    function cleanInput(input) {
        return $('<div/>').text(input).html();
    }   
   
    //-----------(10)---------------captura(presiona) y eenvia los datos al servidor las siglas del partido elegi 
    $(".votarclick").click(function() {

        var message = $('input:radio[name=partidos]:checked').val();
        socket.emit('save voto', message);
    });

    //-------(2)-----------CUANDO EL USUARIO ESCRIVE SU CARNET Y PRECIONA ENTER YLLAMA AL METODO serusername
    $window.keydown(function(event) {
        // Auto-focus the current input when a key is typed
        if (!(event.ctrlKey || event.metaKey || event.altKey)) {
            $currentInput.focus();
        }
        // When the client hits ENTER on their keyboard
        if (event.which === 13) {
            if (username) {
               
                typing = false;
            } else {
                setUsername();
            }
        }
    });      
   
    //----------(6)------------------metodo que resive los datos y cargar el html con esos datos
    socket.on('load data', function(data, ocultar) {
        // alert("camisa \" cafe\"");
        //alert("Gato");
        var cadena = "{";
        var partidosHTML = "";
        // alert(ocultar.value);
        var participnates = document.getElementById("partidos");
        var cont = 0;


        //carga los datos al html
        data.forEach(function(element) {
            

            //prepara los datos para convertirse en json
            if (cont == data.length - 1) {
                cadena += "\"+" + element.nombre + "\"" + ":" + element.votos + "";
            } else {
                cadena += "\"+" + element.nombre + "\"" + ":" + element.votos + ",";
            }

            //Dibujamos todos datos y campos de entrada necesarios para el UI 
            partidosHTML += " <tr><td><input type='radio' name='partidos' value=" + element.sigla + ">" + "</td><td>" + element.candidato + "</td><td>" + element.votos + "</td><td bgcolor=" + COLORS[cont] + "> </td> </tr>"
            cont = cont + 1;
        }, this);
        cadena += "}";
        var arrays = myObject = JSON.parse(cadena);
        console.log(arrays);
        var myVinyls = arrays;
        var legendHTML = "";
        var myLegend4 = "";
        var myLegend5 = document.getElementById("myLegend4");        
        var myLegend = document.getElementById("myLegend3");

        //muestra los colores con los votos y partidos q existen
        for (var j = 0; j < data.length; j++) {


            legendHTML += "<div><span style='border-radius: 50%;display:inline-block;width:20px;background-color:" + COLORS[j] + ";'>&nbsp;</span> " + data[j].nombre + "</div>";
            myLegend4 += "<div><span style='border-radius: 50%;display:inline-block;width:20px;background-color:" + COLORS[j] + ";'>&nbsp;</span> " + data[j].votos + "</div>";
        }
        myLegend.innerHTML = legendHTML;
        myLegend5.innerHTML = myLegend4;
        participnates.innerHTML = partidosHTML;
        var grafica1 = document.getElementById("grafica1");
        grafica1.innerHTML = " <canvas id='myCanvas' height='200' width='200'></canvas>";
        var boton = document.getElementById("boton");

        //--------[9]------------muestra el voton votar si esta registrado en la base de datos.
        if (ocultar.value == 1) {
            boton.innerHTML = "<button id='votarclick'> Votar </button>";


        }
        var myCanvas = document.getElementById("myCanvas");
        dona(myCanvas, myVinyls); //envia datos a metodo dona (grafica.js)
    });

    //---------------(13)---------------RESIVE LOS DATOS ACTUALIZADOS Y ACTUALIZA LOS DATOS EN TODOS LOS NAVEGAORES ABIERTOS
    socket.on('new voto', function(data) {
        $("#partidos").empty();
        $("#myLegend4").empty();

        //  cargar datos al html;
        var partidosHTML = "";
        var participnates = document.getElementById("partidos");
        var cont = 0;
        var cadena = "{";
        for (var index = 0; index < data.length; index++) {
            var element = data[index];
            partidosHTML += "<tr><td><input type='radio' name='partidos' value=" + element.sigla + ">" + "</td><td>" + element.candidato + "</td><td>" + element.votos + "</td><td bgcolor=" + COLORS[index] + "> </td> </tr>";
           
            if (index == data.length - 1) {
                cadena += "\"" + element.nombre + "\"" + ":" + element.votos + "";
                console.log(cadena);
            } else {
                cadena += "\"" + element.nombre + "\"" + ":" + element.votos + ",";               
                
            }
        }
        cadena += "}";
        participnates.innerHTML = partidosHTML;


        var myLegend4 = "";
        var myLegend5 = document.getElementById("myLegend4"); //captura el elemento mileyen4 del html

        for (var j = 0; j < data.length; j++) {            

            myLegend4 += "<div><span style='border-radius: 50%;display:inline-block;width:20px;background-color:" + COLORS[j] + ";'>&nbsp;</span> " + data[j].votos + "</div>";
        }

        myLegend5.innerHTML = myLegend4;
        console.log(cadena);
        var arrays = JSON.parse(cadena); //  convierte el estring EN JSON
        console.log(arrays);
        var myVinyls = arrays;
        var myCanvas = document.getElementById("myCanvas");
        dona(myCanvas, myVinyls);
    });

    //  metodo avisa al servidor que evia a todos el nuevo voto q se ingreso
    socket.on('load newvoto', function() {
        
        socket.emit('load broak');
        alert("GRACIAS POR VOTAR");
        location.reload();
        });    
});