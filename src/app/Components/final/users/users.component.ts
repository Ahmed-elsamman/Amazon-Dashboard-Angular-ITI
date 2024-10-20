import { DocumentData } from '@angular/fire/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IfirebaseUsers } from 'src/app/Models/ifirebase-users';
import { FirebasePrdService } from 'src/app/Services/fire-base-prd.service';
import { Observable } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output ,inject, AfterViewInit, ViewChild} from '@angular/core';
import { Storage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { UpdateUserFormComponent } from '../../update-user-form/update-user-form.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'createdAt', 'email', 'name', 'update', 'delete'];
  dataSource: MatTableDataSource<IfirebaseUsers> = new MatTableDataSource<IfirebaseUsers>([]);
  clickedRows = new Set<IfirebaseUsers>();
  date = new Date();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private firebasePrdService: FirebasePrdService, private router: Router,private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getUsers();
  }


  onRowClick(row: IfirebaseUsers): void {
    if (this.clickedRows.has(row)) {
      this.clickedRows.delete(row);
    } else {
      this.clickedRows.add(row);
    }
  }

  isRowClicked(row: IfirebaseUsers): boolean {
    return this.clickedRows.has(row);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
    goToForm(){
      this.router.navigate(['user-upload-form']);
    }

openUpdateUserForm(user: IfirebaseUsers): void {
  const dialogRef = this.dialog.open(UpdateUserFormComponent, {
    data: { user, isUpdate: true }, // Pass the data object with 'user' and 'isUpdate' properties
  });

  dialogRef.afterClosed().subscribe({
    next: (val) => {
      if (val) {
        this.getUsers();
      }
    },
  });
}


  getUsers(): void {
    this.firebasePrdService.getUsers().subscribe({
      next: (users: (DocumentData | (DocumentData & { id: string; }))[]) => {
        const mappedUsers: IfirebaseUsers[] = users.map((userData) => {
          if ('id' in userData) {
            const { id, ...rest } = userData;
            return { id: id, ...rest } as IfirebaseUsers;
          }
          return userData as IfirebaseUsers;
        });

        this.dataSource.data = mappedUsers;
      },
      error: (err) => {
        console.log('Error fetching users:', err);
      },
      complete: () => {
        console.log('User fetching completed.');
      },
    });
  }


  deleteUser(id: string) {
    console.log('Deleting user...');
    console.log(id);

    this.firebasePrdService.deleteUser(id)
      .then(() => {
        console.log(`User with ID ${id} deleted successfully.`);
        this.getUsers();
      })
      .catch((error) => {
        console.error(`Error deleting user with ID ${id}:`, error);
      });
  }


}
