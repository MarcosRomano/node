var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var usuarioSchema= new Schema({
    nombre : String,
    password :String,
    create_at : {type: Date ,require:true,default:Date.now},
    


});
module.exports= mongoose.model('Usuario', usuarioSchema);