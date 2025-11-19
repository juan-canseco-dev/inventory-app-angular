import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MenuService } from 'app/core/services/menu';

declare const $: any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  isCollapsed : boolean = true;

  @Output() logOut : EventEmitter<any> = new EventEmitter();

  menuItems: any[];

  constructor(private menuService : MenuService) { }

  ngOnInit() {
    this.menuItems = this.menuService.getMenu();
  }

  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  logOutClick() {
    this.logOut.emit(null);
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}
