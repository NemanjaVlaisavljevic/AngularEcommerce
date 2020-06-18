import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/Product';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart-service';
import { CartItem } from 'src/app/common/CartItem';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products : Product[];
  currentCategoryId : number = 1;
  previousCategoryId: number = 1;
  currentCategoryName : string;
  searchMode : boolean = false;

  // new properties for pagination
  thePageNumber : number = 1;
  thePageSize : number = 10;
  theTotalElements : number = 0;

  constructor(private productService : ProductService ,
     private route : ActivatedRoute , private cartService : CartService) { }

  ngOnInit(){
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  updatePageSize(currentPageNumber : number){
      this.thePageSize = currentPageNumber;
      this.thePageNumber = 1;
      this.listProducts();
  }

  public listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }
  }

  handleListProducts(){

    const hasCategoryId : boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
     this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
     this.currentCategoryName = this.route.snapshot.paramMap.get('name');
    }else{
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId = ${this.currentCategoryId} , thePageNumber = ${this.thePageNumber}`);

    this.productService.getProductListPaginate(this.thePageNumber -1 , this.thePageSize,this.currentCategoryId).subscribe(
      data => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number +1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      }
    );
  }

  handleSearchProducts(){
    const theKeyword : string = this.route.snapshot.paramMap.get('keyword');

    this.productService.searchProductsPaginate(this.thePageNumber - 1 ,this.thePageSize,theKeyword).subscribe(
      data => {
       this.products = data._embedded.products;
       this.thePageNumber = data.page.number + 1;
       this.thePageSize = data.page.size;
       this.theTotalElements = data.page.totalElements;
      }
    );
  }

  addToCart(theProduct : Product){
    console.log(`Adding to cart: ${theProduct.name} , ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }
}
