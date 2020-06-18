import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart-service';
import { CartItem } from 'src/app/common/CartItem';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems : CartItem[] = [];
  totalPrice : number = 0;
  totalQuantity : number = 0;

  constructor(private cartService : CartService) { }

  ngOnInit(): void {
   this.listCartItems();
  }

  listCartItems(){
    this.cartItems = this.cartService.cartItems;

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
    this.cartService.computeCartTotals();
  }

  incrementItem(tempCartItem : CartItem){
    this.cartService.addToCart(tempCartItem);
  }

  decrementItem(tempCartItem : CartItem){
    this.cartService.decrementQuantity(tempCartItem);
  }

  removeItem(tempCartItem : CartItem){
    this.cartService.remove(tempCartItem);
  }
}
