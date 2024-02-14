const mongoose=require('mongoose');

require("dotenv").config();
exports.connect = ()=>{
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(()=>{
        console.log("DB Connection Established");
    })
    .catch((err)=>{
        console.error("Error in connectng ",err);
        process.exit(1);
    })
}
