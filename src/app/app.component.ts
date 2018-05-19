import { Component, OnInit } from '@angular/core';

import './rxjs-operators';

import { AlCrudService } from './services/al-crud.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {
	isLogged: boolean = null;

	lat: number = 51.678418;
	lng: number = 7.809007;
	
	constructor(private alCrudService: AlCrudService) {
		// Verifica se o usuário está logado
		alCrudService.get('/api/isLogged')
			.subscribe(this.successLogin.bind(this), this.error.bind(this));
	}

	ngOnInit() { }

	successLogin(response) {
		// Atribui a isLogged o resultado retornado do Back-End
		this.isLogged = response.auth;
	}

	error(err) {
		console.error(err);
	}

	ngOnChanges(changes) {
	}
	ngAfterContentInit() {
	}
	ngAfterContentChecked() {
	}
	ngAfterViewInit() {
	}
	ngAfterViewChecked() {
	}
}