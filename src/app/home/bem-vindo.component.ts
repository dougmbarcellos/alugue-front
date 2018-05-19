import { Component
	, Input
	, OnInit
	, OnDestroy
	, AfterViewInit
	, AfterContentInit
	, DoCheck } 				from '@angular/core';
import { Location } 			from '@angular/common';
import { Router } 				from '@angular/router';
import { MdSnackBar } 			from '@angular/material';

import { User } 				from '../models/user';
import { UserService } 			from '../services/user.service';

@Component({
	selector: 'bem-vindo'
	, templateUrl: 'bem-vindo.component.html'
	, styleUrls: ['bem-vindo.component.css']
	, providers: [ MdSnackBar ]
})
export class BemVindoComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentInit, DoCheck {
	@Input() user: User; // VERIFICAR - uso deste atributo no html
	notChange: boolean = true;
	guia: boolean = null;
	body: any = document.getElementsByTagName('body')[0];
	simpleSnackBarRef: any; // Receberá a instância do snackBar
	snackBarOpened: boolean = false;
	activeFade: boolean = false;
	normalSelectedClicked: boolean = false;

	constructor(private _snackBar: MdSnackBar, private _user: UserService) { }

	guideSelected() {
		/* NÃO IMPLEMENTADO - Usada para animação de saída do componente */
		this.activeFade = true;

		

		/* Aguarda aproximadamente 2 segundos antes de iniciar o processo de cadastro do guia */
		// setTimeout(function() {
			this.setOverflowVisible();

			/* Quando guia for true o formulário para o guia será carregado */
			this.guia = true;

			this.onChangedOption();
		// }.bind(this));

	}

	normalSelected() {
		this.activeFade = true;

		/* Aguarda aproximadamente 2 segundos antes de iniciar o processo de cadastro do usuário */
		/* Usado para animação de saída */
		// setTimeout(function () {
			this.setOverflowVisible();

			if(!this.normalSelectedClicked)
				this._user.updateNewUser((response) => {
					/* Quando guia for false o formulário para o usuário será carregado */
					this.guia = false;

					this.onChangedOption();

					/* Recarrega a página, fazendo novamente as verificações de newUser */
					location.href = location.origin; 
				});

			this.normalSelectedClicked = true;
			
		// }.bind(this));
	}

	onChangedOption() {
		/* Usado para esconder o template de boas vindas */
		this.notChange = false;
		/* Fecha o snackBar */
		if(this.snackBarOpened)
			this.simpleSnackBarRef.dismiss();
	}

	/* Torna a barra de rolagem visível */
	setOverflowVisible() {
		this.body.style.overflow = 'visible';

		/* NÃO TESTADO - Também poderia ser utilizado o código abaixo */
		// document.body.setAttribute("style", "overflow: visible")
	}

	ngOnInit() {
		/* Esconde a barra de rolagem */
		// this.body.style.overflow = 'hidden';

		/* Aguarda 3 segundos antes de abrir o snackBar
		 * Um erro é causado quando é aberto imediatamente
		 */
		setTimeout(() => {
			/* Abre e recebe a instância do snackBar */
			this.simpleSnackBarRef = this._snackBar
				.open('Seja bem-vindo ao Alugue um Guia Amigo!', 'Fechar');
			this.snackBarOpened = true;

			this.simpleSnackBarRef.afterDismissed().subscribe(null, null, () => {
      			this.snackBarOpened = false;
			});

			/* Seta a cor de fundo do snack */
			document.getElementsByTagName('snack-bar-container')[0]
				.setAttribute('style', 'background: cadetblue');

		}, 3000);
	}

	ngAfterViewInit() {

	}

	ngAfterContentInit() {

	}

	ngDoCheck() {

	}

	ngOnDestroy() {
		this.setOverflowVisible();
	}
}