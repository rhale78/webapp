var restful=require('node-restful');
var mongoose=restful.mongoose;

var userSchema=new mongoose.Schema({
    username:String,
    password:String
});

module.exports=restful.model('Users',userSchema);