import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { DashboardService } from '../services/dashboard.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  lowStockProducts: any[] = [];
  topSellingProducts: any[] = [];
  maxSales = 0;
  totalUnitsSold = 0;
  bestSellingProduct = '';
  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  get isAdmin(): boolean {
    return this.authService.hasRole('admin');
  }

  ngOnInit(): void {
    this.loadLowStockProducts();
    this.loadTopSellingProducts();
  }

  loadLowStockProducts(): void {
    this.dashboardService.getLowStockProducts().subscribe({
      next: (data: any) => {
        this.lowStockProducts = data;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }
  loadTopSellingProducts(): void {

  this.dashboardService
    .getTopSellingProducts()
    .subscribe({
      next: (data: any) => {
        this.topSellingProducts = data;
        this.maxSales = this.topSellingProducts.reduce(
          (maximum, item) => Math.max(maximum, Number(item.total_sold) || 0),
          0
        );
        this.totalUnitsSold = this.topSellingProducts.reduce(
          (total, item) => total + (Number(item.total_sold) || 0),
          0
        );
        this.bestSellingProduct = this.topSellingProducts.length > 0
          ? this.topSellingProducts.reduce((best, item) =>
              Number(item.total_sold) > Number(best.total_sold) ? item : best
            ).product_name
          : 'No sales yet';
      },
      error: (error: any) => {
        console.error(error);
      }
    });

  }

  getBarHeight(totalSold: number): number {
    if (!this.maxSales) {
      return 0;
    }

    return Math.max((Number(totalSold) / this.maxSales) * 100, 6);
  }
}