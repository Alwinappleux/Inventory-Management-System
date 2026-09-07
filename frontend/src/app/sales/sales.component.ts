import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SalesService } from '../services/sales.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent implements OnInit {

  categories: any[] = [];
  products: any[] = [];

  supplierName = '';
  currentStock = 0;
  price = 0;
  submitted = false;
  customerName = '';
  customerAddress = '';

  salesForm: FormGroup;

  blockNumberKeys(event: KeyboardEvent): void {
    if (!event.ctrlKey && !event.metaKey && ['e', 'E', '+', '-'].includes(event.key)) {
      event.preventDefault();
    }
  }

  blockNonDigits(event: KeyboardEvent): void {
    if (!event.ctrlKey && !event.metaKey && !/\d|Backspace|Delete|ArrowLeft|ArrowRight|Home|End|Tab/.test(event.key)) {
      event.preventDefault();
    }
  }

  get totalPrice(): number {
    return this.price * (Number(this.salesForm.controls['quantitySold'].value) || 0);
  }

  constructor(
    private salesService: SalesService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.salesForm = this.formBuilder.group({
      category: ['', Validators.required],
      productId: [0, [Validators.required, Validators.min(1)]],
      quantitySold: [0, [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)]],
      customerName: ['', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]],
      customerAddress: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.salesService.getCategories().subscribe({
      next: (data: any) => {
        this.categories = data;
      }
    });
  }

  loadProducts(): void {
    const category = this.salesForm.controls['category'].value;

    if (!category) {
      this.products = [];
      return;
    }

    this.salesService
      .getProductsByCategory(category)
      .subscribe({
        next: (data: any) => {
          this.products = data;
          this.salesForm.controls['productId'].setValue(0);
          this.supplierName = '';
          this.currentStock = 0;
          this.price = 0;
          this.salesForm.controls['quantitySold'].setValue(0);
        }
      });
  }
  loadProductDetails(): void {

  const productId = Number(this.salesForm.controls['productId'].value);

  this.salesService
    .getProductDetails(productId)
    .subscribe({
      next: (data: any) => {

        this.supplierName = data.supplier_name;
        this.currentStock = data.stock_quantity;
        this.price = Number(data.price) || 0;
        this.salesForm.controls['quantitySold'].setValue(0);
        this.salesForm.controls['quantitySold'].setValidators([
          Validators.required,
          Validators.min(1),
          Validators.pattern(/^[0-9]+$/),
          Validators.max(this.currentStock)
        ]);
        this.salesForm.controls['quantitySold'].updateValueAndValidity();

      },
      error: (error: any) => {
        console.error(error);
      }
    });

}
saveSale(): void {
  this.submitted = true;

  if (this.salesForm.invalid) {
    return;
  }

  const sale = {
      user_id: this.authService.getUser()?.user_id,
    product_id: Number(this.salesForm.controls['productId'].value),
      quantity_sold: Number(this.salesForm.controls['quantitySold'].value),
      customer_name: this.salesForm.controls['customerName'].value.trim(),
      customer_address: this.salesForm.controls['customerAddress'].value.trim()
  };

  this.salesService.recordSale(sale).subscribe({
    next: () => {

      alert('Sale Recorded Successfully');

      this.salesForm.controls['quantitySold'].setValue(0);
      this.salesForm.controls['customerName'].reset('');
      this.salesForm.controls['customerAddress'].reset('');
      this.price = 0;
      this.submitted = false;
      this.router.navigate(['/sales-list']);

    },
    error: () => {

      alert('Error Recording Sale');

    }
  });

}
}
