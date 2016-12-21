var express=require('express');
var router=express.Router();

var User=require('../models/users');

User.methods(['get','put','post','delete']);
User.register(router,'/users');

router.get('/users', function(request, response)
{
    response.send('test');
});

module.exports=router;