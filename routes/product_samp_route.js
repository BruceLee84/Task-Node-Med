const router = require('express').Router();
const sample = require('../model/product_samp');


router.post('/addPro', async (req, res)=>{
    try {
        const data = new sample(req.body);
        const result = await data.save();
        return res.status(200).json({'status':'success', 'message':'Data added', 'result':result})
    } catch (error) {
        return res.status(404).json({'status':'error found', 'message':error.message})
    }
})

router.get('/getAllPro', async(req, res)=>{
    try {
        const data = await sample.find().exec()
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
        const data = await sample.find({uuid:req.query.uuid}).exec()
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
        await sample.findOneAndUpdate({uuid:uuid}, req.body, {new:true}).then(result=>{
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
        await sample.findOneAndDelete({uuid:uuid}).then(result=>{
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
        const data = await sample.find({Name:{$regex: req.query.Name, $options: 'i'}}).exec()
        if(data){
            return res.status(200).json({'status':'success', 'message':'search data', 'result':data})
        }else{
            return res.status(400).json({'status':'failed'})
        }
    } catch (error) {
        return res.status(404).json({'status':'error found', 'message':error.message})
    }
})

module.exports = router;