import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get(`${this.apiUrl}/categories`);
  }

  getProductsByCategory(category: string) {
    return this.http.get(`${this.apiUrl}/products/category/${category}`);
  }

  getProductDetails(productId: number) {
    return this.http.get(`${this.apiUrl}/product-details/${productId}`);
  }
  recordSale(sale: any) {
  return this.http.post(
    'http://localhost:3000/sales',
    sale
  );
}

  getSales(userId?: number) {
    const url = userId ? `${this.apiUrl}/sales?user_id=${userId}` : `${this.apiUrl}/sales`;
    return this.http.get(url);
  }
}
