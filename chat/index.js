// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const MongoClient = require('mongodb').MongoClient;
var port = process.env.PORT || 3000;
var db;
var numUsers = 0;

app.use(express.static('public'));
server.listen(port, function() {
    console.log('Server listening at port %d', port);
});


//metodo para conectar a la base de datos
MongoClient.connect('mongodb://localhost:27017/votos', (err, database) => {
    if (err) return console.log(err)
    db = database;    
});



// esto se ejecuta cuando el ususario entra a la pagina
io.on('connection', function(socket) {
    console.log("Alguien se conecto a socketIo");
    var addedUser = false;
    db.collection('usuarios').find().toArray(function(err, result) {
        if (err) {
            throw err;
        }
        
        // console.log(result);
        //  res.render("index", { persons: result });
    });

    // ----------/12/--------------recive y guardar los botos a la base de datos 
    socket.on('save voto', function(data) {
        // we tell the client to execute 'new message'
        var gatos;
        var query = { sigla: data };
        db.collection('partidos').find(query).toArray(function(err, result) {
            if (err) {
                throw err;
            }
                      
            var votosn = result[0].votos + 1;
            // console.log(votosn);
            var voto = { $set: { votos: votosn } };
            db.collection("partidos").updateOne(query, voto, function(err, res) {
                if (err) throw err;
             
            });
            var ciuser = parseInt(socket.username);
            var query3 = { ci: ciuser };
            var quer4 = { $set: { voto: data } };
            db.collection('usuarios').updateOne(query3, quer4, function(err, res) {
                if (err) throw err;               
            });           
        });       
        socket.emit("load newvoto");
    });



    //(METODO QUE ENVIA LOS DATOS ACTUALISADOS A TODOS LOS CLIENTES CONECTADOS EN TIEMPO REAL)aumenta el marcador en uno cuando esta votando y muestra a todos en tiempo real
    socket.on('load broak', function() {
        db.collection('partidos').find().toArray(function(err, result) {
            
            if (err) {
                throw err;
            }
           
            socket.broadcast.emit('new voto', result)
        });
    });

    //------------(5)----------------envia los datos al cliente desde el servidor 
    socket.on('load data', function(username) {
        // console.log(username + "yoano");
        db.collection('partidos').find().toArray(function(err, result) {
            if (err) {
                throw err;
            }
            // console.log(result);
            //  res.render("index", { persons: result });
            var carnet = parseInt(username);


            //-----------(7)----------------esta funcion llamando por el carnet para verificar si existe en la base de datos
            db.collection('usuarios').find({ ci: carnet }).toArray(function(err, result2) {
                if (err) {
                    throw err;
                }
                var contador = result2.length;
                var contador2 = { value: contador };
                console.log(contador);
                socket.emit("load data", result, contador2);
                // socket.emit("load data", result);
            });


        });

    });
   

    
});