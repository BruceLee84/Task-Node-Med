const router = require("express").Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads')
    },
    filename: (req, file, cb)=>{
        cb(null, Date.now() + '_' + file.originalname)
    }
})

router.post('/upload', async (req, res)=>{
    try {
    const upload = await multer({storage: storage}).single('file')
    upload(req, res, (err)=>{
    //   console.log(req)

      if(!req.file){
        return res.status(400).json({'alert':'upload a file'})
      }else if(err instanceof multer.MulterError){
        return res.status(404).json({'err': err})
      }else if(err){
        return res.status(404).json({'error': err})
      }else{
        // res.json({status: true, data: `uploads/${req.file.filename}`})
        return res.status(200).json({'status':"success", 'message':'uploaded'})
      }
    })
    } catch (error) {
    return res.status(404).json({'status':'failed', 'error':error.message})       
    }
})


module.exports =router;