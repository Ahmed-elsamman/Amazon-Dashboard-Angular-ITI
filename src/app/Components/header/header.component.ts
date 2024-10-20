import { Router } from '@angular/router';
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { languages, notifications, userItem } from './header-dummy-data';
import { FirebasePrdService } from 'src/app/Services/fire-base-prd.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { Dialog2Component } from './dialog2/dialog2.component';
import { UserAuthenServiceService } from 'src/app/Services/user-authen-service.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('menuTrigger')  menuTrigger!: MatMenuTrigger;
  user:boolean = true

  constructor(private Toster:ToastrService ,private Router: Router,  private productService:FirebasePrdService, public dialog: MatDialog  , private UserAuthenService:UserAuthenServiceService) { }


  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialog2() {
    const dialogRef = this.dialog.open(Dialog2Component, {restoreFocus: false});
    dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
  }

  hidden = false;
  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
  }

  ngOnInit(): void {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
    this.selectedLanguage = this.languages[0];
  }

  @Input() collapsed = false;
  @Input() screenWidth = 0;

  canShowSearchAsOverlay = false;
  selectedLanguage : any;

  languages = languages;
  notifications = notifications;
  userItem = userItem;


  getHeadClass(): string {
    let styleClass = '';
    if(this.collapsed && this.screenWidth > 768){
      styleClass = 'head-trimmed';
    }else if (this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0) {
      styleClass = 'head-m-screen';
    }
    return styleClass;
  }
  

  checkCanShowSearchAsOverlay(innerWidth: number):void{
    if(innerWidth < 845){
      this.canShowSearchAsOverlay = true;
    }else {
      this.canShowSearchAsOverlay = false;
    }
  }

  set listFilter (value: string){
    this.productService.PerformSearch(value);
    this.productService.filterProducts(value);
  }


  logOut(){
    this.UserAuthenService.userLogout()
    this.user = this.UserAuthenService.isUserLoggedInOrNot;
    localStorage.removeItem('currentUser');
    this.Toster.error("logOut", "logOut Success")


  }


  onLanguageClick(selectedLanguage: any) {
    console.log('Selected language:', selectedLanguage.language);
    this.selectedLanguage = selectedLanguage;
  }

  onUserItemClick(item: any) {
    console.log('Item Clicked:', item);
    if (item.lable === 'Profile') {
      console.log('Navigating to /settings/profile');
      this.Router.navigate(['/settings/profile']);
    }else if (item.lable === 'Logout') {
      console.log('Logging out. Redirecting to login page.');

      this.Router.navigate(['/login']);
      this.logOut()

    }
  }

  }








