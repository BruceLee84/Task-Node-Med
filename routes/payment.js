const router = require('express').Router();
const braintree = require('braintree');
require('dotenv').config();


const config = {
    environment:braintree.Environment.Sandbox,
    merchantId: process.env.merchantId,
    publicKey: process.env.publicKey,
    privateKey: process.env.privateKey
    
};


const gateway = new braintree.BraintreeGateway(config)

router.get('/tokenGenerate', async(req, res)=>{
    try {
        gateway.clientToken.generate({}, (err, resdata)=>{
          if(err){
              return res.status(400).send({'error':err})
          }else{
              console.log(resdata)
              return res.status(200).json({'status':'success', 'message':'token created', 'token':resdata.clientToken})
          }
        })
        
    } catch (error) {
        return res.status(404).json({'status':'failed', 'message':error.message})
    }
})




router.post('/saleTransaction', async(req, res)=>{
     try {
         const paymentDetail = gateway.transaction.sale({
             amount: req.body.amount,
             paymentMethodNonce: req.body.paymentMethodNonce,
            //  deviceData: req.body.deviceData,
             options: {
                 submitForSettlement: true
             }
         },(err, resData)=>{
             if(err){
                console.log('err', err.message)
             }else{
                console.log("data", resData)
             }
             if(resData.success){
                return res.json({'status':'success', 'message':'transaction success', 'result':resData.transaction})
                
             }else{
                return res.status(400).send({err:err})
             }
        })
    } catch (error) {
        console.log("catch", error.message)
         return res.status(404).json({'status':'failed', 'message':error.message})
         
     }
})



router.post('/refund', async(req, res)=>{
    try {
        const paymentDetails = gateway.transaction.submitForPartialSettlement(
            'transaction_id',
            'cancellation_fees',
            (err, resData)=>{
                if(resData.success){
                    return res.status(200).json({'status':'success', 'message':resData.transaction})
                }else{
                    return res.status(400).send({err:err})
                }
            }
        )

    } catch (error) {
        return res.status(404).json({'status':'failed', 'message':error.message})
        
    }
})

module.exports = router;