var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var PublicacionSchema= new Schema({
    texto : String,
    imagen : String,
    titulo : String,
    create_at : {type:Date ,require:true,default:Date.now},
    IdPersona: {type:Schema.ObjectId, ref:'Persona' }


});
module.exports= mongoose.model('Publicacion', PublicacionSchema);