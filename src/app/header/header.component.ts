import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'al-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css'],
})

export class HeaderComponent implements OnInit {
    
    constructor() { }

    ngOnInit() { }

    login() {
        // let login = location.protocol + '//' + location.host + '/login/facebook';
        let login = location.origin.split('#')[0] + '/login/facebook';
        location.href = login;
    }
}