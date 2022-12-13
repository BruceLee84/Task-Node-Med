const router = require('express').Router();
const category = require('../model/category_schema');
const product = require('../model/product_schema');


router.post('/addCat', async(req, res)=>{
    try {
        const data = new category(req.body);
        const result = await data.save()
        return res.status(200).json({'status':'success', 'message':'category added', 'result':result})    
    } catch (error) {
        return res.status(404).json({'status':'error found', 'message':error.message})
    }
})

router.get('/getCat', async(req, res)=>{
    try {
        const data = await category.find().exec();
        if(data.length){
            return res.status(200).json({'status':'success', 'message':'all category', 'result':data})
        }else{
            return res.status(400).json({'status':'failed', 'message':'No data fetched'})
        }
    } catch (error) {
        return res.status(404).json({'status':'error found', 'message':error.message})
    }
})

router.get('/getOne', async(req, res)=>{
    try{
        const uuid = req.query.categoryuuid
        const data = await product.find({categoryuuid:uuid}).exec()
        console.log('data', data)
        if(data){
            return res.json({"status":"success", "meassage":"category based product", "result":data})
        }else{
            return res.json({"status":"failed", "message":"error found"})
        }

    }catch(err){
        return res.status(404).json({"status":"failed", "message":err.meassage})
    }
})

router.put('/updateCat', async(req, res)=>{
    try{
        const uuid = req.body.uuid;
        await category.findOneAndUpdate({uuid:uuid}, req.body, {new:true}).then(result=>{
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

router.delete('/deleteCat', async(req, res)=>{ 
    try {
        const uuid = req.query.uuid;
        await category.findOneAndDelete({uuid:uuid}).then(result=>{
            return res.status(200).json({'status':'success', 'message':'data deleted', result})
        }).catch(err=>{
            console.log(err.message)
            res.json({'err':err.message})
        })    
    } catch (error) {
        return res.status(404).json({'status':'error found', 'message':error.message})
    }
})

module.exports = router;