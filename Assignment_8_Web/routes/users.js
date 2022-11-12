var express = require('express');
var router = express.Router();
var user=require('../models/user.models');
/* GET users listing. */
router.get('/getAll',async function(req, res, next) {
  try{
    let userList = await user.find();
    res.send({message:'User retrived successfully', users :  userList});
  }catch(err){
    console.log(err);
    res.send({message:'User retrive failed', error :  err.value});
  }
});
router.post('/add', function(req, res, next) {
  let newUser = new user({...req.body});
  newUser.save(function(err, newUser){
    if(err){
      res.send({message: err.message})
    }else{
      res.setHeader('Content-Type', 'application/json');
      res.send({message:'User added successfully', newUserObj :  newUser});
    }
  });
});

router.put('/edit', async function(req, res, next) {
  try{
  const exuser = req.body;
  let existingUser = await user.where("email").equals(exuser.email).findOne();
  if(existingUser != null){
    existingUser.fullname = exuser.fullname;
    existingUser.password = exuser.password;
  }else{
    res.send({message: "provided email ID is not available" , exuser});
  }
  await existingUser.save();
  res.send(existingUser);
}catch(err){
  res.send({message: err.message});
}
});

router.delete('/delete', async function(req, res, next) {
  try{
    console.log(req.query.email)
    const userEmail = req.query.email;
    let existingUser = await user.where("email").equals(userEmail).deleteOne();
    res.send({message: "User deleted", existingUser});
  }catch(err){
    res.send({message: "deltion failed"});
  }
});
module.exports = router;