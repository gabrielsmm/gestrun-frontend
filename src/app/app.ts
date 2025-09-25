import { Component, OnInit, signal } from '@angular/core';
import { NgxMaskDirective } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-root',
  imports: [
    NgxMaskDirective,
    NgxUiLoaderModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  protected readonly title = signal('gestrun-frontend');

  constructor(private toastr: ToastrService,
              private ngxService: NgxUiLoaderService
  ) {

  }

  ngOnInit(): void {

  }

  showSuccess() {
    this.ngxService.start();
    this.ngxService.startBackground("do-background-things");

    setTimeout(() => {
      this.ngxService.stop();
      this.ngxService.stopBackground("do-background-things");
      this.toastr.success('Tarefa concluída com sucesso!', 'Processamento finalizado');
    }, 5000);
  }

}
