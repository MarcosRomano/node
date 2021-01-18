const express = require ("express");
const bodyparser = require("body-parser");
const app = express();
const methodoverride = require("method-override");
const jwt = require("jsonwebtoken");


const router = express.Router();
const mongoose = require('mongoose');
const personaModel= require("./personaModel");
const publicacionModel=require("./publicacionModel");
const usuarioModel=require("./usuarioModel");
const { json } = require("body-parser");
app.use(bodyparser.urlencoded({extended:false}));

mongoose.connect('mongodb://localhost:27017/angular2020',(err , res)=> {
    if  (err) throw err;
    console.log('conexion exitosa')

});

app.use(bodyparser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(methodoverride());



app.use(bodyparser.json( {limit :'50mb'}));

app.listen(3000,()=>{console.log('servidor');

});




 router.get("/persona",(req,res) => {
    console.log('servicio funcionando');
    personaModel.find({},(error, respuesta)=>{
    
        if(error)res.send({estado:{codigo:0,respuesta:err.message}});
        res.send({estado:{codigo:0,respuesta:'buscar todos exitoso'},personas:respuesta});
    });
});

router.get("/persona/:id",(req,res) => {console.log('servicio get id funcionando');
    personaModel.findById(req.params.id, (err, retorno)=>{
        retorno.save( (err,respuesta) => {
            if(err) res.send({estado:{codigo:0,respuesta:err.message}});
            res.send({estado:{codigo:0,respuesta:'buscar por ID exitoso'},persona:retorno});
        });
    });
});



router.post("/persona",(req,res) => {console.log('servicio post funcionando');
   
var miobjetoAdd = new personaModel();
    miobjetoAdd.nombre =req.body.nombre;
    miobjetoAdd.apellido = req.body.apellido;
    miobjetoAdd.edad = req.body.edad;
    miobjetoAdd.IsProfesional = true;

    miobjetoAdd.save( (err,respuesta) => {
        if(err) res.send({estado:{codigo:0,respuesta:err.message}});
        res.send({estado:{codigo:0,respuesta:'sos un genio'},persona:respuesta});
    });
});

router.put("/persona/:id",(req,res) => {console.log('servicio put funcionando');
   
    personaModel.findById(req.params.id, (err, retorno)=>{
        retorno.nombre =req.body.nombre;
        retorno.apellido = req.body.apellido;
        retorno.edad = req.body.edad;
        retorno.IsProfesional = true;
        
        retorno.save( (err,respuesta) => {
            if(err) res.send({estado:{codigo:0,respuesta:err.message}});
            res.send({estado:{codigo:0,respuesta:'modificacion exitosa'},persona:respuesta});
        });
    });

});

router.delete("/persona/:id",(req,res) => {console.log('servicio delete funcionando');
     personaModel.findById(req.params.id, (err, retorno)=>{
        retorno.remove( (err,respuesta) => {
        if(err) res.send({estado:{codigo:0,respuesta:err.message}});
        res.send({estado:{codigo:0,respuesta:'modificacion exitosa'},persona:respuesta});
    });
});


});


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401) // if there isn't any token

    jwt.verify(token, "estoEsUnaClaveSecreta", (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next() // pass the execution off to whatever request the client intended
    })
}





router.post("/",(req,res) => {console.log('servicio postUsuario funcionando');
        


    var miUsuarioAdd = new usuarioModel();
   // miUsuarioAdd.nombre =req.body.nombre;
    miUsuarioAdd.password = req.body.password;
    var token = generateAccessToken({ nombre: req.body.nombre });
    res.send(token)
        

    miUsuarioAdd.save( (err,respuesta) => {
        if(err) res.send({estado:{codigo:0,respuesta:err.message}});
        res.send({estado:{codigo:0,respuesta:'mi usuario funcionando'},usuario:respuesta});
    });
});

router.get("/usuario",authenticateToken, (req,res) => {console.log('servicio usuario funcionando');
usuarioModel.find({},(error, respuesta)=>{
   

    if(error)res.send({estado:{codigo:0,respuesta:err.message}});
    res.send({estado:{codigo:0,respuesta:'buscar todos los uauarios exitoso'},usuarios:respuesta});

  });
});

router.post("/login",(req,res) => {
    console.log('servicio login funcionando');
    console.log('req.params', req.body);
    
    usuarioModel.findOne({
        nombre: req.body.nombre, 
        password: req.body.password
        
    },(error, respuesta)=>{

     if(error)res.send({ estado: false, token: ""});
     if(respuesta==null){
        res.send({ estado: false, token: ""});
     }
        else { 
            var token = generateAccessToken({ nombre: req.body.nombre });
            res.send({ estado: true, token: token})
        }   
    
    });
});
function generateAccessToken(username) {
    return jwt.sign(username, "estoEsUnaClaveSecreta", { expiresIn: '1800s' });
}
app.use(router);
