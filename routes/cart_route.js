const router = require('express').Router();
const cart = require('../model/cart_schema');
// const product = require('../model/product_schema');



router.post('/addCart',async(req,res)=>{
    try{
        const {productuuid, Name, image, Quantity, price} = req.body
        // console.log(req.body)
        const useruuid = req.query.useruuid
        const addCart = new cart(req.body)
        console.log('addcart', addCart)
        let order = await cart.findOne({useruuid:useruuid}).exec();
        // console.log('order', order)
        if(order){
            let data = order.products
            console.log('data', data)
            let item = data.findIndex(index=>index.productuuid==productuuid)
           console.log("items",item)
 
            if(item>-1){
                let NewItems = order.products[item];
                console.log("new",NewItems);
                NewItems.Quantity = Quantity;
                order.products[item] = NewItems; 
 
                NewItems.price = price * NewItems.Quantity;
 
                let total = NewItems.price
                console.log(total);
             
            }else{
                order.products.push({productuuid, Name, image, Quantity, price});
            }
            
            order = await order.save();
            console.log(order);
            return res.status(200).json({status:'success',"result":order})
        }else{
            let NewCart = await cart.create({useruuid, products:[{productuuid, Name, image, Quantity, price}]})
           return res.status(200).json({status:'success', message:'result', NewCart});
        }
    }catch(err){
        console.log(err.message);
        res.json({'err':err.message})
    }
 
 })





router.get('/order',async(req,res)=>{
    try{
        const uuid = req.query.uuid
        let data = await cart.findOne({uuid:uuid})
        if(data){
            let result = data.products.length
            let total = data.products
            console.log(total[0].price);
            let totalPrice =0;
            for(let i = 0;i<result;i++){
             totalPrice += total[i].price
            
            }
            console.log("total",totalPrice);

            const addtoCart = await cart.findOneAndUpdate({uuid:uuid},{total:totalPrice},{new:true}).exec();
            if(addtoCart){
                return res.status(200).json({status:'success', addtoCart})
            }
            
        }else{
            return res.status(400).json({status:'failure'})
        }

        // let userUuid = req.body.userUuid
      

       
    }catch(err){
        res.json({"err":err.message})
    }
})


router.get('/getCart', async(req, res)=>{
    try{
       const data = await cart.find({uuid:req.query.uuid}).exec()
       if(data){
        return res.status(200).json({'status':'success', 'message':'Data added', 'result': data})  
    }else{
            return res.status(400).json({'status':'failed', 'message':'data not faound'})
    }
    }catch(err){
        res.json({"err":err.message})
    }
})

router.get('/cancel',async(req,res)=>{
    try{
        const uuid = req.query.uuid
        await cart.findOneAndUpdate({useruuid:uuid},{status:'false'},{new:true}).exec().then(data=>{
            res.json({status:'success',message:'order is cancelled',data})
        }).catch(err=>{
            res.json({message:err.message})
        })
    }catch(err){
        console.log(err.message);
        res.json({'error':err.message})
    }
})

router.delete('/deleteCart', async(req, res)=>{
    try{
        await cart.findOneAndDelete({productuuid:req.query.productuuid}).exec()
        return res.json({"status":"success", "message":"deleted..."})

    }catch(err){
        return res.status(4040).json({"status":"failed", "message":err.meassage})
    }
})

module.exports = router;