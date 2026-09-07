import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private apiUrl = 'http://localhost:3000/suppliers';

  constructor(private http: HttpClient) { }

  addSupplier(supplier: any) {
    return this.http.post(this.apiUrl, supplier);
  }

  getSuppliers() {
    return this.http.get(this.apiUrl);
  }

  getSupplierById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateSupplier(id: number, supplier: any) {
    return this.http.put(`${this.apiUrl}/${id}`, supplier);
  }

  deleteSupplier(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}