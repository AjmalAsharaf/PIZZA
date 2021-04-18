function authController(){
    return{
        login(req,res){
            res.render('auth/login')
        },
        regiseter(req,res){
            res.render('auth/register')
        },
    }
}

module.exports=authController