import { CartItem } from '../common/CartItem';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})

export class CartService {
    
    cartItems : CartItem[];

    totalPrice : Subject<number> = new Subject<number>();
    totalQuantity : Subject<number> = new Subject<number>();

    constructor() {
        this.cartItems = JSON.parse(sessionStorage.getItem('cartItems')) != null ? JSON.parse(sessionStorage.getItem('cartItems')):[];
      }

    addToCart(cartItem : CartItem){
        let alreadyExistsInCart : boolean = false;
        let existingCartItem : CartItem = undefined;

        if(this.cartItems.length > 0){

           existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id == cartItem.id);

        }
        alreadyExistsInCart = (existingCartItem != undefined);
        
        if(alreadyExistsInCart){
            existingCartItem.quantity++;
        }else{
            this.cartItems.push(cartItem);
        }

        this.computeCartTotals();
    }

    computeCartTotals(){
        let cartTotalPrice : number = 0;
        let cartTotalQuantity : number = 0;

        for(let tempCartItem of this.cartItems){
            cartTotalPrice += tempCartItem.quantity * tempCartItem.unitPrice;
            cartTotalQuantity += tempCartItem.quantity;
        }
        this.totalPrice.next(cartTotalPrice);
        this.totalQuantity.next(cartTotalQuantity);

        this.logCartData(cartTotalPrice , cartTotalQuantity);
        this.persistCartItems();
    }

    decrementQuantity(tempCartItem: CartItem) {
       tempCartItem.quantity--;

       if(tempCartItem.quantity == 0){
           this.remove(tempCartItem);
       }else{
        this.computeCartTotals();
       }

      }

      remove(tempCartItem : CartItem){
        const itemIndex = this.cartItems.findIndex(cartItem => cartItem.id == tempCartItem.id);

        if(itemIndex > -1){
            this.cartItems.splice(itemIndex , 1);
        }

        this.computeCartTotals();
      }

      persistCartItems(){
          sessionStorage.setItem('cartItems' , JSON.stringify(this.cartItems));
      }

      logCartData(totalPriceValue: number, totalQuantityValue: number) {
        console.log(`Contents of the cart`);
        for (let tempCartItem of this.cartItems) {
          const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
          console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
        }
     
        console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue} `)
        console.log(`-----`)
      }
}