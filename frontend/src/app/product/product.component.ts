import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  products: any[] = [];
  searchTerm = '';
  categoryFilter = '';
  stockFilter = 'all';
  sortColumn = 'product_name';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private productService: ProductService,
    private router: Router,
    private authService: AuthService
  ) {}

  get isAdmin(): boolean {
    return this.authService.hasRole('admin');
  }

  get categories(): string[] {
    return [...new Set(this.products.map(product => product.category).filter(Boolean))].sort();
  }

  get filteredProducts(): any[] {
    const search = this.searchTerm.trim().toLowerCase();
    return this.products
      .filter(product => {
        const matchesSearch = !search || [product.product_name, product.category].some(value => String(value ?? '').toLowerCase().includes(search));
        const matchesCategory = !this.categoryFilter || product.category === this.categoryFilter;
        const matchesStock = this.stockFilter === 'all' || (this.stockFilter === 'low' ? Number(product.stock_quantity) <= 5 : Number(product.stock_quantity) > 5);
        return matchesSearch && matchesCategory && matchesStock;
      })
      .sort((first, second) => this.compare(first, second, this.sortColumn));
  }

  setSort(column: string): void {
    this.sortDirection = this.sortColumn === column && this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortColumn = column;
  }

  private compare(first: any, second: any, column: string): number {
    const firstValue = first[column];
    const secondValue = second[column];
    const result = typeof firstValue === 'number' || typeof secondValue === 'number'
      ? Number(firstValue || 0) - Number(secondValue || 0)
      : String(firstValue ?? '').localeCompare(String(secondValue ?? ''));
    return this.sortDirection === 'asc' ? result : -result;
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        this.products = data;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  editProduct(product: any): void {
    this.router.navigate(['/add-product'], {
      queryParams: { editProductId: product.product_id }
    });
  }

  deleteProduct(productId: number): void {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        alert('Product deleted successfully');
        this.loadProducts();
      },
      error: (error: any) => {
        alert(error.status === 409
          ? error.error.message
          : 'Error deleting product');
      }
    });
  }
}