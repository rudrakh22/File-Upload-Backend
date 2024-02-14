const mongoose=require('mongoose');
const nodemailer=require('../Config/nodemailer');

const fileSchema=new mongoose.Schema({
    name:{
        type:'String',
        required:true,
    },
    url:{
        type:'String',
    },
    tags:{
        type:'String',
    },
    email:{
        type:'String',
    }
})



fileSchema.post("save",async (doc)=>{
    try{
        const transporter=nodemailer.connect();

        let info = await transporter.sendMail({
            from:`rudrakshg1914@gmail.com`,
            to: doc.email,
            subject:"New File Uploaded Successfully on Cloudinary",
            html: `<h2>Hello ${doc.name}</h2>
                <p>File has been successfully uploaded</p>
                <p>View here: <a href="${doc.url}">${doc.url}</a></p>
            `
        })
        console.log("INFO of mail : ",info);
    }
    catch(err){
        console.error(err);
    }
})


module.exports=mongoose.model("File",fileSchema);