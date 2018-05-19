import { Component, OnInit, Input, Output, EventEmitter, Optional, NgZone } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { SearchService } from '../services/search.service';
import { UserService } from '../services/user.service';

import { Cidade } from '../models/cidade';
import { User } from '../models/user';

declare var google: any;

@Component({
	selector: 'al-cidade'
	, templateUrl: 'cidade.component.html'
	, styleUrls: [ 'cidade.component.css' ]
	, providers: [ SearchService, SearchService ]
})
export class CidadeComponent implements OnInit {
	/* Recebe as informações do component pai */
	@Input() cidadePesquisa: any;
	@Output() onClose = new EventEmitter<boolean>();

	lat: number;
	lng: number;

	public carousel: boolean = false;

	guias: Array<User> = [];
	loadMap?: boolean = false;
	gui4: boolean = null;

	// @Input() local: any;

	cidadeInfo = new Cidade();
	public static cidadeInfoStatic = new Cidade();

	constructor(
		private _search: SearchService
		, private _dialog: MdDialog
		, private _user: UserService
		, private _zone: NgZone) {
		
		/* Ativa carrousel de imagens caso a tela seja pequena */
		this.listenForMobile();
	 }

	 listenForMobile() {
		if(window.innerWidth <= 550) {
			this.carousel = true;
		}
		
		const mql: MediaQueryList = window.matchMedia('(min-width: 550px)');

		let _this = this;

		mql.addListener((mql: MediaQueryList) => {
			_this._zone.run( () => {
        		if(mql.matches)
					_this.carousel = false;
				else
					_this.carousel = true;
			});
    	});
	 }

	ngOnInit() {
		this._search.getCidadeById(
			this.successRequest.bind(this)
			, this.cidadePesquisa.cidadeId
			, this.cidadePesquisa.estadoId)
	}

	successRequest(response: any) {
		this.cidadeInfo = response.data;

		if(this.cidadeInfo.cidade.coord.latitude && this.cidadeInfo.cidade.coord.longitude) {
			this.lat = this.cidadeInfo.cidade.coord.latitude;
			this.lng = this.cidadeInfo.cidade.coord.longitude;
			this.loadMap = true;
		}

		if(this.cidadeInfo.cidade.guias.length > 0) {
			this.requestGuiaInfo();
		}
		else {
			this.gui4 = false;
		}

		CidadeComponent.cidadeInfoStatic = response.data;
	}

	requestGuiaInfo() {
		for(let guia of this.cidadeInfo.cidade.guias) {
			this._user.loadGuia(this.successGuia.bind(this), guia);
		}
	}

	successGuia(response) {
		var guiaTemp: User = response.data.user;
		this.guias.push(guiaTemp);
		if(this.guias.length == this.cidadeInfo.cidade.guias.length) this.gui4 = true;
	}

	close() {
    	this.onClose.emit(true);
  	}

	uploadImage() {
		let dialogRef = this._dialog.open(UploadDialog);

		dialogRef.afterClosed().subscribe(result => {
			console.log("dialog fechado")
		});
	}

	selectedGuia(guia: User) {
		let guiaTemp: User = guia;

		this._user.exibirGuia(guiaTemp);
	}
}

@Component({
  template: `
	<al-upload-image [cidadeInfo]="cidadeInfo"></al-upload-image>
  `,
})

export class UploadDialog {
	cidadeInfo = new Cidade();
	constructor(@Optional() public dialogRef: MdDialogRef<UploadDialog>) {
		this.cidadeInfo = CidadeComponent.cidadeInfoStatic;
	}
}