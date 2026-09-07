import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { SalesService } from '../services/sales.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css']
})
export class SalesListComponent implements OnInit {
  sales: any[] = [];
  loading = true;
  errorMessage = '';
  get isAdmin(): boolean {
    return this.authService.hasRole('admin');
  }
  searchTerm = '';
  categoryFilter = '';
  sortColumn = 'sale_id';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(
    private salesService: SalesService,
    private authService: AuthService
  ) {}

  get categories(): string[] {
    return [...new Set(this.sales.map(sale => sale.category).filter(Boolean))].sort();
  }

  get filteredSales(): any[] {
    const search = this.searchTerm.trim().toLowerCase();
    return this.sales
      .filter(sale => {
        const matchesSearch = !search || [sale.product_name, sale.category, sale.sale_id, sale.product_id, sale.customer_name, sale.customer_address]
          .some(value => String(value ?? '').toLowerCase().includes(search));
        return matchesSearch && (!this.categoryFilter || sale.category === this.categoryFilter);
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
    const userId = this.isAdmin ? undefined : this.authService.getUser()?.user_id;
    this.salesService.getSales(userId).subscribe({
      next: (data: any) => {
        this.sales = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load sales right now.';
        this.loading = false;
      }
    });
  }
}