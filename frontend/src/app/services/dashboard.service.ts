import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:3000/low-stock';

  constructor(private http: HttpClient) {}

  getLowStockProducts() {
    return this.http.get(this.apiUrl);
  }
  getTopSellingProducts() {
  return this.http.get(
    'http://localhost:3000/top-selling'
  );
}
}