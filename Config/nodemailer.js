const nodemailer=require('nodemailer');
require('dotenv').config();

exports.connect=()=>{
    try{
        let transporter=nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        })
        return transporter;
    }
    catch(err){
        console.log(err);
    }
}