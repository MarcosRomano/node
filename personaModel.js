var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var personaSchema= new Schema({
    nombre : String,
    apellido : String,
    edad : Number,
    create_at : {type: Date ,require:true,default:Date.now},
    IsProfesional :Boolean,


});
module.exports= mongoose.model('Persona', personaSchema);