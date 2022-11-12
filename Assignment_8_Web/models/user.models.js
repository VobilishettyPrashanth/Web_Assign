const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const sch= new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
        validate: {
            validator: r => {
                const reg = /^[A-Za-z]{5,10}$/i;
                return r.match(reg)
            },
            message : out => `Username must have 5 alphabets`
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate: {
            validator: r => {
                const reg = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                return r.match(reg)
            },
            message : out => `Given mail is Invalid`
        }
    },
    password:{
        type:String,
        required:true,
        validate: {
            validator : r => {
                const reg =  /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{10,16}$/;
                return r.match(reg);
            },
            message: out => `Password needs to have spl char,Caps`
        }
    }
});
sch.pre('save', async function(next){
    try{
        const st = await bcrypt.genSalt(10);
        const ps = await bcrypt.hash(this.password,st);
        this.password = ps;
        next();
    }catch(err){
        next(err);
    }
});
module.exports = mongoose.model('User_Collection', sch);









