import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import {
  MatTableModule,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {
  DispalyOfTableDataSource,
  DispalyOfTableItem,
  TableConfig,
} from './dispaly-of-table-datasource';

@Component({
  selector: 'app-display-table',
  templateUrl: './dispaly-of-table.component.html',
  styleUrl: './dispaly-of-table.component.css',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],
})
export class DispalyOfTableComponent<T> implements AfterViewInit {
  @Input() config!: TableConfig<T>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<T>;

  dataSource!: MatTableDataSource<T>;
  displayedColumns: string[] = [];
  searchValue: string = '';

  ngOnInit() {
    this.displayedColumns = this.config.columns.map((col) => col.key);
    this.dataSource = new MatTableDataSource(this.config.data);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
