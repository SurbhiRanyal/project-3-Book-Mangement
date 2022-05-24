const mongoose = require("mongoose");
//const userModel = require("../model/userModel");
const bookModel = require("../model/bookModel");


const aws= require("aws-sdk")

///////////////////////// [ create book ] //////////////////////

const createBooks = async function (req, res) {
  try {
    const data = req.body;
    // console.log(file, data)

    const { title, excerpt, ISBN, category, subcategory, releasedAt } = data;

    if (title){
      const checkTitle = await bookModel.findOne({
        title: title,
        isDeleted: false,
      });
      if (checkTitle)
        return res
          .status(409)
          .send({ status: false, message: "Book already exist with this title" });
    }
     else{ return res
        .status(400)
        .send({ status: false, message: "Please provide title" })}
    if (!excerpt)
      return res
        .status(400)
        .send({ status: false, message: "please provide excerpt" })
    if (ISBN){
      const ISBNregex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;
      if (!ISBNregex.test(ISBN))
        return res
          .status(400)
          .send({ status: false, message: "please provide valid ISBN" });
          const checkISBN = await bookModel.findOne({
            ISBN: ISBN,
            isDeleted: false,
          });
      if (checkISBN)
           return res
            .status(409)
            .send({ status: false, message: "book alredy exist with this ISBN" });

    }
     else{ return res
        .status(400)
        .send({ status: false, message: "please provide ISBN" });}
          if (!category)
            return res
              .status(400)
              .send({ status: false, message: "please provide category" });
          if (!subcategory)
            return res
              .status(400)
              .send({ status: false, message: "please provide subcategory" });
          if (releasedAt){
            const dateRegex = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
          if (!dateRegex.test(releasedAt)) {
            return res.status(400).send({
            status: false,
            message: `Release date must be in "YYYY-MM-DD" format only And a "Valid Date"`})}
    }else{
      return res
        .status(400)
        .send({ status: false, message: "please provide releasedAt" });}

                  //////////
                  
          aws.config.update({
            accessKeyId: "AKIAY3L35MCRUJ6WPO6J",
            secretAccessKey: "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",
            region: "ap-south-1"
          })

          let uploadFile= async ( file) =>{
          return new Promise( function(resolve, reject) {
            // this function will upload file to aws and return the link
            let s3= new aws.S3({apiVersion: '2006-03-01'}); // we will be using the s3 service of aws

            var uploadParams= {
                ACL: "public-read",
                Bucket: "classroom-training-bucket",  //HERE
                Key: "Surbhi/" + file.originalname, //HERE 
                Body: file.buffer
            }


            s3.upload( uploadParams, function (err, data ){
                if(err) {
                    return reject({"error": err})
                }
                // console.log(data)
                console.log("file uploaded succesfully")
                return resolve(data.Location)
            })

            // let data= await s3.upload( uploadParams)
            // if( data) return data.Location
            // else return "there is an error"

          })
          }
                  let files = req.files;
                    if(files && files.length>0){
                        //upload to s3 and get the uploaded link
                        // res.send the link back to frontend/postman
                        let uploadedFileURL= await uploadFile( files[0] )
                      data.bookCover = uploadedFileURL
                    }
                    else{
                        res.status(400).send({ msg: "No file found" })
                    }
                  //////////////
        console.log(data)

    await bookModel.create(data);
    
    const savedDetails = await bookModel.findOne(data).select({__v:0})
    return res.status(201).send({
      status: true,
      message: "Success",
      data: savedDetails,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};



 module.exports.createBooks = createBooks;
