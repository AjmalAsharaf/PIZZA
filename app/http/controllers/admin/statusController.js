const Order = require('../../../models/order')

function statuController(){
    return{
        update(req,res){
            Order.updateOne({_id:req.body.orderId},{status:req.body.status},(err,data)=>{
                if(err){
                   return res.redirect('/admin/orders')
                }
                return res.redirect('/admin/orders')
            })  
        }
    }
}

module.exports=statuController