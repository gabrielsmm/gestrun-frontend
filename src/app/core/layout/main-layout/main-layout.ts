import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Sidenav } from '../sidenav/sidenav';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    Navbar,
    Sidenav
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {

}
