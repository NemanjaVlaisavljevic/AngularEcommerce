import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/ProductCategory';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';

  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  

  getProductList(theCategoryId: number): Observable<Product[]> {

    // need to build URL based on category id 
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  
  getProductListPaginate(thePage: number ,
                        thePageSize: number ,
                        theCategoryId: number): Observable<GetResponseProducts> {

    // need to build URL based on category id 
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);

  }



  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }



  searchProductsPaginate(thePage : number , thePageSize : number , 
                        name : string) : Observable<GetResponseProducts>{

     const searchUrl1 = `${this.baseUrl}/search/findByNameContaining?name=${name}&page=${thePage}&size=${thePageSize}`;

     return this.httpClient.get<GetResponseProducts>(searchUrl1);
    
  }
  

  getProduct(productId : number) : Observable<Product> { 
      const searchUrl2 = `${this.baseUrl}/${productId}`;

      return this.httpClient.get<Product>(searchUrl2);
  }

}



interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }
  page : {
    size : number , 
    totalElements : number , 
    totalPages : number , 
    number : number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
