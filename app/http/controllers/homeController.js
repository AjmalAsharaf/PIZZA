const Menu = require('../../models/menu')

function homeController(){

    return {
        index: async function(req,res){
            const pizzas= await Menu.find()
            return res.render('home',{pizzas:pizzas})

            // Menu.find().then(function (pizzas){
            //     console.log(pizzas)
            //     return res.render('home',{pizzas:pizzas})
            // })

            
        },
    }

}

module.exports=homeController