import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TimesTableCircleComponent } from './times-table-circle/times-table-circle.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, TimesTableCircleComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
