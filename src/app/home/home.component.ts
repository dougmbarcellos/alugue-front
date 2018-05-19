import { Component, OnInit } from '@angular/core';

import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
	selector: 'al-home',
	templateUrl: 'home.component.html',
	styleUrls: [ 'home.component.css' ],
	providers: [ UserService ]
})
export class HomeComponent implements OnInit {
	user = new User();

	constructor(private userService: UserService) {
		userService.loadUser(this.userSuc.bind(this));
	}

	userSuc(response: any) {
		this.user = response.data.user;
	}

	ngOnInit() { }
}