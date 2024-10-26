import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DispalyOfTableComponent } from '../../dispaly-of-table/dispaly-of-table.component';
import {
  ProductsServicesService,
  Product,
} from '../../../Services/products-services.service';
import { TableConfig } from '../../dispaly-of-table/dispaly-of-table-datasource';

// واجهة لتمثيل بيانات البائع
interface SellerData {
  sellerId: string;
  productsCount: number;
  totalRevenue: number;
  products: Product[];
  lastProductDate: Date;
}

@Component({
  selector: 'app-sellers',
  standalone: true,
  imports: [CommonModule, DispalyOfTableComponent],
  templateUrl: './sellers.component.html',
  styleUrls: ['./sellers.component.css'],
})
// ... existing code ...
export class SellersComponent implements OnInit {
  productsTableConfig: TableConfig<Product> = {
    title: 'قائمة المنتجات',
    searchPlaceholder: 'ابحث عن منتج',
    columns: [
      // {
      //   key: 'brand',
      //   label: 'العلامة التجارية',
      //   sortable: true,
      // },
      {
        key: 'name',
        label: 'اسم المنتج',
        sortable: true,
        template: (item) => item.name.en,
      },
      {
        key: 'description.en',
        label: 'الوصف',
        sortable: true,
        template: (item) => item.description.en,
      },
      {
        key: 'price',
        label: 'السعر',
        sortable: true,
        template: (item) => `${item.price} جنيه`,
      },
      {
        key: 'reviews',
        label: 'التقييمات',
        sortable: true,
        template: (item) => `${item.reviews.length}`,
      },
      {
        key: 'stock',
        label: 'المخزون',
        sortable: true,
      },
      {
        key: 'createdAt',
        label: 'تاريخ الإنشاء',
        sortable: true,
        template: (item) =>
          new Date(item.createdAt).toLocaleDateString('ar-EG'),
      },
      {
        key: 'updatedAt',
        label: 'آخر تحديث',
        sortable: true,
        template: (item) =>
          new Date(item.updatedAt).toLocaleDateString('ar-EG'),
      },
      {
        key: 'actions',
        label: 'الإجراءات',
        type: 'actions',
      },
    ],
    data: [],
  };

  constructor(private productsService: ProductsServicesService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.productsTableConfig.data = products;
      },
      error: (error) => {
        console.error('خطأ في تحميل المنتجات:', error);
      },
    });
  }

  handleAction(action: string, product: Product): void {
    switch (action) {
      case 'view':
        this.viewProduct(product);
        break;
      case 'edit':
        this.editProduct(product);
        break;
      case 'delete':
        this.deleteProduct(product);
        break;
    }
  }

  viewProduct(product: Product): void {
    console.log('عرض تفاصيل المنتج:', product);
  }

  editProduct(product: Product): void {
    console.log('تعديل المنتج:', product);
  }

  deleteProduct(product: Product): void {
    console.log('حذف المنتج:', product);
  }
}
