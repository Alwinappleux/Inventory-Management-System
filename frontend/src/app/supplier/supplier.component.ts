import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SupplierService } from '../services/supplier.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit {

  suppliers: any[] = [];
  searchTerm = '';
  contactFilter = 'all';
  sortColumn = 'supplier_name';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private supplierService: SupplierService,
    private router: Router,
    private authService: AuthService
  ) {}

  get isAdmin(): boolean {
    return this.authService.hasRole('admin');
  }

  get filteredSuppliers(): any[] {
    const search = this.searchTerm.trim().toLowerCase();
    return this.suppliers
      .filter(supplier => {
        const matchesSearch = !search || [supplier.supplier_name, supplier.contact_number, supplier.email, supplier.address]
          .some(value => String(value ?? '').toLowerCase().includes(search));
        const hasEmail = Boolean(String(supplier.email ?? '').trim());
        const matchesContact = this.contactFilter === 'all'
          || (this.contactFilter === 'email' && hasEmail)
          || (this.contactFilter === 'no-email' && !hasEmail);
        return matchesSearch && matchesContact;
      })
      .sort((first, second) => this.compare(first, second, this.sortColumn));
  }

  setSort(column: string): void {
    this.sortDirection = this.sortColumn === column && this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortColumn = column;
  }

  private compare(first: any, second: any, column: string): number {
    const result = String(first[column] ?? '').localeCompare(String(second[column] ?? ''));
    return this.sortDirection === 'asc' ? result : -result;
  }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (data: any) => {
        this.suppliers = data;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  editSupplier(supplier: any): void {
    this.router.navigate(['/add-product'], {
      queryParams: { editSupplierId: supplier.supplier_id }
    });
  }

  deleteSupplier(supplierId: number): void {
    if (!confirm('Are you sure you want to delete this supplier?')) {
      return;
    }

    this.supplierService.deleteSupplier(supplierId).subscribe({
      next: () => {
        alert('Supplier deleted successfully');
        this.loadSuppliers();
      },
      error: () => {
        alert('Error deleting supplier');
      }
    });
  }
}