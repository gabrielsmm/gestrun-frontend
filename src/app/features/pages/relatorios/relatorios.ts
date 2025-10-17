import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-relatorios',
  imports: [
    RouterOutlet,
    MatTabsModule,
    MatButtonModule
  ],
  templateUrl: './relatorios.html',
  styleUrl: './relatorios.scss'
})
export class Relatorios implements OnInit {

  selectedIndex = 2; // Resultados como padrão

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        if (url.includes('/corridas')) {
          this.selectedIndex = 0;
        } else if (url.includes('/inscricoes')) {
          this.selectedIndex = 1;
        } else if (url.includes('/resultados')) {
          this.selectedIndex = 2;
        }
      }
    });
  }

  onTabChange(index: number) {
    if (index === 0) {
      this.router.navigate(['corridas'], { relativeTo: this.route });
    } else if (index === 1) {
      this.router.navigate(['inscricoes'], { relativeTo: this.route });
    } else if (index === 2) {
      this.router.navigate(['resultados'], { relativeTo: this.route });
    }
  }

}
