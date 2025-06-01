import {bootstrapApplication} from '@angular/platform-browser';
import {provideHttpClient} from '@angular/common/http';
import {provideRouter} from '@angular/router';
import {routes} from './app/app.routes';
import {AppComponent} from './app/app.component';
import {importProvidersFrom} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      BrowserAnimationsModule, // Cấu hình BrowserAnimationsModule
      ToastrModule.forRoot()    // Cấu hình ToastrModule.forRoot()
    )
  ]
}).catch(err => console.error(err));
