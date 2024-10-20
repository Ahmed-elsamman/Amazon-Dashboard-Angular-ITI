import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Amazon';

  showHeader = true;

  constructor(private  router:Router, private spinner: NgxSpinnerService){
    router.events.subscribe(
      (val) => {
        if(val instanceof NavigationEnd){
          if(val.url == '/login'){
            this.showHeader=false
          }else{
            this.showHeader=true
          }
        }
      }
    )
  }

  ngOnInit() {
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }


  isSidenav = false;
  screenWidth = 0;
  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSidenav = data.collapsed;
  }
}
