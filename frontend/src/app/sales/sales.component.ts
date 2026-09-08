import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SalesService } from '../services/sales.service';
import { SupplierService } from '../services/supplier.service';
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
  allSuppliers: any[] = [];
  suppliers: any[] = [];
  products: any[] = [];

  supplierName = '';
  currentStock = 0;
  price = 0;
  submitted = false;
  customerName = '';
  customerAddress = '';
  invoice: {
    number: string;
    date: Date;
    productName: string;
    category: string;
    supplierName: string;
    quantity: number;
    price: number;
    total: number;
    customerName: string;
    customerAddress: string;
  } | null = null;

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
    private supplierService: SupplierService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.salesForm = this.formBuilder.group({
      category: ['', Validators.required],
      supplierId: ['', Validators.required],
      productId: [0, [Validators.required, Validators.min(1)]],
      quantitySold: [0, [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)]],
      customerName: ['', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]],
      customerAddress: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadSuppliers();
  }

  loadCategories(): void {
    this.salesService.getCategories().subscribe({
      next: (data: any) => {
        this.categories = data;
      }
    });
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (data: any) => {
        this.allSuppliers = data;
        this.suppliers = data;
      }
    });
  }

  loadProducts(): void {
    const category = this.salesForm.controls['category'].value;
    const supplierId = this.salesForm.controls['supplierId'].value;

    if (!category) {
      this.suppliers = this.allSuppliers;
      this.products = [];
      this.salesForm.controls['supplierId'].setValue('');
      this.salesForm.controls['productId'].setValue(0);
      return;
    }

    this.salesService
      .getProductsByCategory(category)
      .subscribe({
        next: (data: any) => {
          const categorySupplierIds = new Set(
            data.map((product: any) => String(product.supplier_id))
          );

          this.suppliers = this.allSuppliers.filter((supplier: any) =>
            categorySupplierIds.has(String(supplier.supplier_id))
          );

          const selectedSupplierIsAvailable = this.suppliers.some(
            (supplier: any) => String(supplier.supplier_id) === String(supplierId)
          );

          if (!selectedSupplierIsAvailable) {
            this.salesForm.controls['supplierId'].setValue('');
          }

          this.products = selectedSupplierIsAvailable
            ? data.filter((product: any) => String(product.supplier_id) === String(supplierId))
            : [];
          this.salesForm.controls['productId'].setValue(0);
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
      const productId = Number(this.salesForm.controls['productId'].value);
      const selectedProduct = this.products.find(product => Number(product.product_id) === productId);
      const quantity = Number(this.salesForm.controls['quantitySold'].value);
      const customerName = this.salesForm.controls['customerName'].value.trim();
      const customerAddress = this.salesForm.controls['customerAddress'].value.trim();

      this.invoice = {
        number: `INV-${Date.now()}`,
        date: new Date(),
        productName: selectedProduct?.product_name || 'Product',
        category: this.salesForm.controls['category'].value,
        supplierName: this.supplierName,
        quantity,
        price: this.price,
        total: this.price * quantity,
        customerName,
        customerAddress
      };

      alert('Sale Recorded Successfully');

      this.salesForm.controls['quantitySold'].setValue(0);
      this.salesForm.controls['customerName'].reset('');
      this.salesForm.controls['customerAddress'].reset('');
      this.price = 0;
      this.submitted = false;

    },
    error: () => {

      alert('Error Recording Sale');

    }
  });

}

  printInvoice(): void {
    const goToSalesList = (): void => {
      this.router.navigate(['/sales-list']);
    };

    window.addEventListener('afterprint', goToSalesList, { once: true });
    window.print();
  }

  closeInvoice(): void {
    this.invoice = null;
  }
}
