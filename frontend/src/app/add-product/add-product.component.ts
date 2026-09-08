import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProductService } from '../services/product.service';
import { SupplierService } from '../services/supplier.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  

  suppliers: any[] = [];
  categories = ['Home Appliance', 'Smartphone', 'Sound System', 'Laptop',  'Television', 'Camera', 'Gaming Console','Other'];
  isEditMode = false;
  editingProductId = 0;
  isSupplierEditMode = false;
  editingSupplierId = 0;
  productSubmitted = false;
  supplierSubmitted = false;

  productForm: FormGroup;
  supplierForm: FormGroup;

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

  blockNonNameCharacters(event: KeyboardEvent): void {
    if (!event.ctrlKey && !event.metaKey && !/[A-Za-z ]|Backspace|Delete|ArrowLeft|ArrowRight|Home|End|Tab/.test(event.key)) {
      event.preventDefault();
    }
  }

  // Product Fields
  product_id = 0;
  product_name = '';
  category = '';
  price = 0;
  stock_quantity = 0;
  supplier_id = 0;

  // Supplier Fields
  supplier_name = '';
  contact_number = '';
  email = '';
  address = '';

  constructor(
    private productService: ProductService,
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.productForm = this.formBuilder.group({
      product_name: ['', [Validators.required, Validators.minLength(2)]],
      price: [0, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      category: ['', Validators.required],
      stock_quantity: [0, [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]+$/)]],
      supplier_id: [0, [Validators.required, Validators.min(1)]]
    });

    this.supplierForm = this.formBuilder.group({
      supplier_name: ['', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]],
      contact_number: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.loadSuppliers();
    this.route.queryParamMap.subscribe(params => {
      const productId = Number(params.get('editProductId'));
      const supplierId = Number(params.get('editSupplierId'));

      if (productId) {
        this.isEditMode = true;
        this.isSupplierEditMode = false;
        this.editingProductId = productId;
        this.editingSupplierId = 0;
        this.loadProductForEdit(productId);
      } else if (supplierId) {
        this.isEditMode = false;
        this.isSupplierEditMode = true;
        this.editingProductId = 0;
        this.editingSupplierId = supplierId;
        this.loadSupplierForEdit(supplierId);
      } else {
        this.isEditMode = false;
        this.isSupplierEditMode = false;
        this.editingProductId = 0;
        this.editingSupplierId = 0;
        this.resetProductForm();
        this.resetSupplierForm();
      }
    });
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (data: any) => {
        this.suppliers = data;

        if (this.suppliers.length > 0 && !this.isEditMode) {
          this.productForm.controls['supplier_id'].setValue(this.suppliers[this.suppliers.length - 1].supplier_id);
        }
      },
      error: (error: any) => {
        console.error('Error loading suppliers', error);
      }
    });
  }

  loadProductForEdit(productId: number): void {
    this.productService.getProductById(productId).subscribe({
      next: (product: any) => {
        this.product_id = product.product_id;
        this.productForm.patchValue({
          product_name: product.product_name,
          category: product.category,
          price: product.price,
          stock_quantity: product.stock_quantity,
          supplier_id: product.supplier_id
        });
      },
      error: (error: any) => {
        console.error('Error loading product for edit', error);
      }
    });
  }

  loadSupplierForEdit(supplierId: number): void {
    this.supplierService.getSupplierById(supplierId).subscribe({
      next: (supplier: any) => {
        this.supplierForm.patchValue({
          supplier_name: supplier.supplier_name,
          contact_number: supplier.contact_number,
          email: supplier.email,
          address: supplier.address
        });
      },
      error: (error: any) => {
        console.error('Error loading supplier for edit', error);
      }
    });
  }

  resetProductForm(): void {
    this.product_id = 0;
    this.productForm.reset({
      product_name: '',
      category: '',
      price: 0,
      stock_quantity: 0,
      supplier_id: 0
    });

    if (this.suppliers.length > 0) {
      this.productForm.controls['supplier_id'].setValue(this.suppliers[this.suppliers.length - 1].supplier_id);
    }
  }

  resetSupplierForm(): void {
    this.supplierForm.reset({
      supplier_name: '',
      contact_number: '',
      email: '',
      address: ''
    });
  }

  saveProduct(): void {

    this.productSubmitted = true;

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const product = this.productForm.value;

    const request = this.isEditMode
      ? this.productService.updateProduct(this.editingProductId, product)
      : this.productService.addProduct(product);

    request.subscribe({
      next: () => {
        const message = this.isEditMode ? 'Product Updated Successfully' : 'Product Added Successfully';
        alert(message);

        if (this.isEditMode) {
          this.router.navigate(['/product']);
          return;
        }

        this.resetProductForm();
        this.productSubmitted = false;
      },
      error: () => {
        const message = this.isEditMode ? 'Error Updating Product' : 'Error Adding Product';
        alert(message);
      }
    });
  }

  saveSupplier(): void {

    this.supplierSubmitted = true;

    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }

    const supplier = this.supplierForm.value;

    const request = this.isSupplierEditMode
      ? this.supplierService.updateSupplier(this.editingSupplierId, supplier)
      : this.supplierService.addSupplier(supplier);

    request.subscribe({
      next: () => {
        const message = this.isSupplierEditMode ? 'Supplier Updated Successfully' : 'Supplier Added Successfully';
        alert(message);

        if (this.isSupplierEditMode) {
          this.router.navigate(['/supplier']);
          return;
        }

        this.resetSupplierForm();
        this.supplierSubmitted = false;
        this.loadSuppliers();
      },
      error: () => {
        const message = this.isSupplierEditMode ? 'Error Updating Supplier' : 'Error Adding Supplier';
        alert(message);
      }
    });
  }
}