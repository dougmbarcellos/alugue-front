import { BrowserModule }					   from '@angular/platform-browser';
import { NgModule }						       from '@angular/core';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { HttpModule }						   from '@angular/http';
import { RouterModule }						   from '@angular/router';
import { 
	Location
	, LocationStrategy
	, HashLocationStrategy
	, PathLocationStrategy }				   from '@angular/common';
import { MaterialModule }					   from '@angular/material';

import { HttpUtilService }					   from './services/http-util.service';
import { AgmCoreModule }					   from 'angular2-google-maps/core';
import { DatePickerModule } 				   from 'ng2-datepicker';
import { InfiniteScrollModule }				   from 'angular2-infinite-scroll';
import { MyDatePickerModule }				   from 'mydatepicker';
import 'hammerjs';

// import { TranslatePipe } from './pipes/translate.pipe';
// import { NvlPipe } from './pipes/nvl.pipe';

import { HeaderComponent } 					   from './header/header.component';
import { HeaderHomeComponent }				   from './header/header-home.component';
import { InitialContentComponent } 			   from './initial/initial-content.component';
import { HomeComponent }					   from './home/home.component';
import { BemVindoComponent } 				   from './home/bem-vindo.component';
import { GuiaFormComponent, SuccessDialog }    from './home/guia-form.component';
import { PanelComponent } 					   from './home/panel.component';
import { SearchComponent } 					   from './search/search.component';
import { CidadeComponent, UploadDialog }	   from './cidade/cidade.component';
import { UploadImageComponent }				   from './upload/upload-image.component';
import { GuiaComponent, PointDialog }		   from './guia/guia.component';
import { ContatoGuiaDialog }		  		   from './guia/contato-guia.dialog';
import { AppComponent }						   from './app.component';
import { Init }								   from './init.component';

import { AlCrudService }                       from './services/al-crud.service';
import { UserService }                         from './services/user.service';
import { ToastService }                        from './services/toast.service';

@NgModule({
	declarations: [
		AppComponent
		, Init
		, HeaderComponent
		, HeaderHomeComponent
		, InitialContentComponent
		, HomeComponent
		, BemVindoComponent
		, PanelComponent
		, GuiaFormComponent
		, SuccessDialog
		, SearchComponent
		, CidadeComponent
		, UploadDialog
		, UploadImageComponent
		, GuiaComponent
		, PointDialog
		, ContatoGuiaDialog
	]
	, imports: [
		BrowserModule
		, FormsModule
		, ReactiveFormsModule
		, HttpModule
		, RouterModule
		, RouterModule.forRoot([
			{ path: '', component: AppComponent }
		])
		, MaterialModule.forRoot()
		, AgmCoreModule.forRoot({ apiKey: 'AIzaSyB7kd7wt-k4mRzuxzdd9iDAZY48_ufZtMw' })
		, DatePickerModule
		, InfiniteScrollModule
		, MyDatePickerModule
	]
	, entryComponents: [ SuccessDialog, UploadDialog, PointDialog, ContatoGuiaDialog ]
	, providers: [
		HttpUtilService
		, ToastService
		, UserService
		, AlCrudService
		, { provide: LocationStrategy, useClass: PathLocationStrategy }
	]
	, bootstrap: [ Init ]
})
export class AppModule { }
