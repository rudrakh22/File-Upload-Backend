const File = require('../Models/File')
const cloudinary=require('cloudinary').v2;

exports.localFileUpload=async(req,res)=>{
    try{
        const file=req.files.file;

        console.log("File recieved :" ,file)
        let path = __dirname + '/files/' + Date.now() + '.' + file.name.split('.')[1];
        
        file.mv(path,(err)=>{
            console.error(err);
        })
        res.json({
            success:true,
            message:"Local File uploaded successfully",
        })
    }
    catch(err){
        console.log("Not able to upload file on server");
        console.log(err);
    }
}

const isFileTypeSupported = (type,supportedTypes)=>{
    return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file,folder,quality){
    
    const options={
        folder:folder,
        resource_type:"auto",
        public_id:file.name,
        use_filename:true,
        unique_filename:true,
    }

    console.log("Temp file path",file.tempFilePath);

    if(quality){
        options.quality = quality;
    }

    return await cloudinary.uploader.upload(file.tempFilePath,options)

}

const isLargeFile=(fileSize)=>{
    console.log(fileSize);
    const mbSize=fileSize/(1024*1024);
    console.log("File Size",mbSize);
    return mbSize>5
}

exports.imageUpload=async (req,res)=>{
    try{
        const {name,tags,email}=req.body;
        const file=req.files.imageFile;

        console.log(file);

        const supportedTypes=["jpg", "png", "jpeg"];
        const fileType=file.name.split(".")[1].toLowerCase();
        console.log("File type: " + fileType);

        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"File type not supported",
            })
        }

        console.log("Uploading to Cloudinary")
        const response=await uploadFileToCloudinary(file,"Rudraksh");

        console.log(response);

        const fileData=await File.create({
            name,
            tags,
            email,
            url:response.secure_url,
        })

        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:"Image Successfully Uploaded",
        })
    }
    catch(err){
        console.error(err);
        res.status(400).json({
            success:false,
            message:"Something went wrong ",
        })
    }
}

exports.videoUpload=async(req,res)=>{
    try{
        const {name,tags,email}=req.body;
        const file=req.files.videoFile;
        const supportedTypes=["mp4","mov"];
        const fileType=file.name.split(".")[1].toLowerCase();
        console.log(fileType);

        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"File type not supported",
            })
        }

        const fileSize=file.size;
        if(isLargeFile(fileSize)){
            return res.status(400).json({
                success:false,
                message:"File greater then 5mb",
            })
        }

        const response=await uploadFileToCloudinary(file,"Rudraksh");
        console.log(response);

        const fileData=await File.create({
            name,
            tags,
            email,
            url:response.secure_url,
        })

        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:"Video uploaded successfully",
        })
    }
    catch(err){
        console.error(err);
        res.status(400).json({
            success:false,
            message:"Something went wrong ",
        })
    }
}


exports.imageSizeReducer=async(req,res)=>{
    try{
        const {name,tags,email}=req.body;
        const file=req.files.imageFileReduce;

        const supportedTypes=["png", "jpg", "jpeg"];
        const fileType=file.name.split(".")[1].toLowerCase();

        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"File type not supported",
            })
        }

        const fileSize=file.size;
        if(isLargeFile(fileSize)){
            return res.status(400).json({
                success:false,
                message:"Files greater than 5 mb",
            })
        }

        const response =await uploadFileToCloudinary(file,"Rudraksh",80);
        console.log(response);

        const fileData=await File.create({
            name,tags,email,
            url:response.secure_url,
        })

        res.json({
            success:true,
            message:"Image successfully uploaded"
        })
    }
    catch(err){
        console.error(err);
        res.status(400).json({
            success:false,
            message:"Something went wrong ",
        })
    }
}