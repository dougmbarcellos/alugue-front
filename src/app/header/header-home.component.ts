import { Component, OnInit } 			from '@angular/core';
import { Location } 					from '@angular/common';

import { User } 						from '../models/user';
import { UserService } 					from '../services/user.service';

@Component({
	selector: 'al-header-home',
	templateUrl: 'header-home.component.html',
	styleUrls: [ 'header-home.component.css' ],
	providers: [ Location ]
})

export class HeaderHomeComponent implements OnInit {
	user = new User();
	
	constructor(public _userService: UserService, private location: Location) {
		_userService.loadUser(this.userInit.bind(this));
	}

	ngOnInit() { }

	userInit(response) {
		this.user = response.data.user;
	}

	/* Aciona a rota de logout */
	logout() {
		var logout = location.origin.split('#')[0] + '/logout';
		location.href = logout;
	}

	/* Mostra o perfil do usuário */
	showGuia() {
		this._userService.exibirGuia(this.user);
	}

}