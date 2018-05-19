import { Component, OnInit,  Optional }		 		from '@angular/core';
import { FormBuilder, FormGroup, Validators } 		from '@angular/forms';
import { MdDialogRef, MdDialog, MdDialogConfig }	from '@angular/material';

import { User } 							  		from '../models/user';
import { UserService } 						  		from '../services/user.service';
import { ContatoGuiaDialog }						from './contato-guia.dialog';

@Component({
	selector: 'al-guia'
	, templateUrl: 'guia.component.html'
	, styleUrls: [ 'guia.component.css' ]
	, providers: [ MdDialogConfig ]
})
export class GuiaComponent implements OnInit {
	guia: User = new User(); // Objeto que armazena as informações do guia a ser exibido
	guias = []; // Array de guias que recebe outros 3 arrays com 3 guias em cada

	infoGuia: boolean = false; // Controla a exibição de informações dos guias
	showGuias: boolean = false; // Controla a exibição da lista de guias aleatórios
	loading: boolean = false; // Controla a exibição do spinner
	self: boolean = false; // Indica se o próprio perfil está sendo visualizado

	dialogRef: MdDialogRef<PointDialog>;
	dialogRefContato: MdDialogRef<ContatoGuiaDialog>;

	constructor(public _userService: UserService, public dialog: MdDialog, private _conf: MdDialogConfig) {
		
		/* Faz a requisição dos guias
		 * Recebe os parâmetros de função de sucesso, de erro e o número de guias a serem listados
		 */
		_userService.getGuias(response => {
			var temp = response.data;
			var size = 3;
			// Entra no bloco existirem guias na resposta
			if(temp.length > 0) {
				// Este while quebra o array de guias em arrays menores com 3 guias cada
				while(temp.length > 0) 
					this.guias.push(temp.splice(0, size));

				this.loading = false;
				this.showGuias = true;
			}
			else {
				this.showGuias = false;
			}
			
		}, err => {
			console.error(err);

			this.loading = false;
			this.showGuias = false;
		}, 9);
	}

	ngOnInit() { }

	/* Fecha exibição de guia específico */
	close() {
		this.infoGuia = false;
	}

	/* Habilita a exibição de informações de um guia */
	showGuia(guia: User) {
		this.guia = guia;
		this.infoGuia = true;

		this._userService.myself((response) => {
			this.self = response.data.myself;
		}, guia.id);
	}

	/* Adiciona um novo Ponto/Local de recomendação do guia */
	addPoint(point: string) {
		if(point.length == 0) return;
		
		this.loading = true;
		this._userService.newPoint((response) => {
			this.guia.points = [];
			this.guia.points = response.data.points;
		}, point);
	}

	openDialog() {
		this.dialogRef = this.dialog.open(PointDialog, { disableClose: false });

		this.dialogRef.afterClosed().subscribe(result => {
			if(result) this.addPoint(result);
			this.dialogRef = null;
		});
	}

	openDialogContato() {
		this._conf.height = '350px';
		this._conf.width = '500px';
		this.dialogRefContato = this.dialog.open(ContatoGuiaDialog, this._conf);
		this.dialogRefContato.componentInstance.guia = this.guia;

		this.dialogRefContato.afterClosed().subscribe(result => {
			if(result) console.log(result);
			this.dialogRefContato = null;
		});
	}

	// Exclui um Ponto/Local
	removePoint(point: string) {
		this._userService.removePoint((response) => {
			this.guia.points = []; // Esvazia o array
			this.guia.points = response.data.points; // Preenche o array com os points atualizados

		}, point);
	}
}

@Component({
  template: `
  	<md-input-container>
		<input md-input
			id="point"
			name="point"
			type="text"
			placeholder="Novo local recomenado"
			[(ngModel)]="point"
			(keyup.enter)="dialogRef.close(point)">
	</md-input-container>

	<button
		[disabled]="point.length == 0"
		(click)="dialogRef.close(point)"
		md-raised-button>
		Confirmar
	</button>
  `
})

export class PointDialog {
	point: string = '';

	constructor(@Optional() public dialogRef: MdDialogRef<PointDialog>) { }
}
