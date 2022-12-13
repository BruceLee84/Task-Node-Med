const router = require('express').Router();
const product = require('../model/product_schema');
const {authverify, isAdmin} = require('../middleware/auth');

router.post('/addPro', isAdmin,  async (req, res)=>{
    try {
        const data = new product(req.body);
        const result = await data.save();
        return res.status(200).json({'status':'success', 'message':'Data added', 'result':result})
    } catch (error) {
        return res.status(404).json({'status':'error found', 'message':error.message})
    }
})

router.get('/getAllPro', async(req, res)=>{
    try {
        const data = await product.find().exec()
        console.log("data", data)
        if(data.length){
        return res.status(200).json({'status':'success', 'message':'Data added', 'result': data})  
        }else{
            return res.status(400).json({'status':'failed', 'message':'data not faound'})
        }
    } catch (error) {
        return res.status(404).json({'status':'error found', 'message':error.message})
    }
})

router.get('/getIndPro', async(req, res)=>{
    try {
        const data = await product.find({uuid:req.query.uuid}).exec()
        if(data){
            return res.status(200).json({'status':'success', 'message':'Data added', 'result': data})  
        }else{
                return res.status(400).json({'status':'failed', 'message':'data not faound'})
        }
    } catch (error) {
        return res.status(404).json({'status':'error found', 'message':error.message})
    }
})



router.put('/updatePro', async(req, res)=>{
    try{
        const uuid = req.body.uuid;
        await product.findOneAndUpdate({uuid:uuid}, req.body, {new:true}).then(result=>{
            // console.log('edit', result)
            return res.status(200).json({'status':'Success', 'message':'data updated', 'result':result})
        }).catch(err=>{
            console.log(err.message)
            res.json({'err':err.message})
        })
    }catch (error) {
        return res.status(404).json({'status':'error found', 'message':error.message})
    }
})


router.delete('/deletePro', async(req, res)=>{
    try {
        const uuid = req.query.uuid;
        await product.findOneAndDelete({uuid:uuid}).then(result=>{
            return res.status(200).json({'status':'success', 'message':'data deleted', result})
        }).catch(err=>{
            console.log(err.message)
            res.json({'err':err.message})
        })    
    } catch (error) {
        return res.status(404).json({'status':'error found', 'message':error.message})
    }
})


router.get('/search', async(req, res)=>{
    try {
        const data = await product.find({Name:{$regex: req.query.Name, $options: 'i'}}).exec()
        if(data){
            return res.status(200).json({'status':'success', 'message':'search data', 'result':data})
        }else{
            return res.status(400).json({'status':'failed'})
        }
    } catch (error) {
        return res.status(404).json({'status':'error found', 'message':error.message})
    }
})






// Pagination

router.get('/getAllPage', async(req, res)=>{
    try {
        let {page, size} = req.query;
        if(!page){
            page = 1;
        }
         
        if(!size){
            size = 4;
        }

        const limits = parseInt(size)
        const skips = (page - 1) * size;
        const total = (await product.find()).length
    
        const data = await product.find().limit(limits).skip(skips);
        // console.log("data", data)
        if(data.length){
        // return res.status(200).json({'status':'success', 'message':'Data added', 'result': data})  
          return res.send({page, size, "total":total, "result":data,})
        }else{
            return res.status(400).json({'status':'failed', 'message':'data not faound'})
        }
    } catch (error) {
        return res.status(404).json({'status':'error found', 'message':error.message})
    }
})

module.exports = router;