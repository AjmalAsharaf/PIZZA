import axios from 'axios'
import Noty from 'noty'

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCount = document.querySelector('#cartCounter')

function updateCart(pizza){
    axios.post('/update-cart',pizza)
    .then(res=>{
        cartCount.innerText=res.data.totalQty
        new Noty({
            type:'success',
            timeout:1000,
            progressBar:false,
            text: "Notification text"
          }).show();
          
    })
}


addToCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
       
        let pizza = JSON.parse(btn.dataset.pizza)
       
        updateCart(pizza)
    })
})