import { Component, OnInit, Optional }				  from '@angular/core';
import { FormBuilder, FormGroup, Validators }		  from '@angular/forms';
import { MdSnackBar, MdInput, MdDialog, MdDialogRef } from '@angular/material';

import { AlCrudService } 							  from '../services/al-crud.service';
import { User } 									  from '../models/user';
import { Estado } 									  from '../models/estado';

@Component({
	selector: 'guia-form'
	, templateUrl: 'guia-form.component.html'
	, styleUrls: [ 'guia-form.component.css' ]
	// , encapsulation: ViewEncapsulation.None
	, providers: [ MdSnackBar ]
})

export class GuiaFormComponent implements OnInit {
	guiaForm: FormGroup; /* Armazena as informações do formulário */
	user: any = new User; /* Objeto que recebe dados do usuário */
	loading: boolean = false; /* Controla o spinner do botão Confirmar */

	/* Referência do snackBar aberto */
	simpleSnackBarRef: any;
	snackBarOpened: boolean = false;

	/* Valor inicial passado no array de estados */
	estado: any = new Estado;
	estados: any = [];
	cidades: any = [];

	constructor(
		private _fb: FormBuilder
		, private _crud: AlCrudService
		, private _snackBar: MdSnackBar
		, private _dialog: MdDialog) {
		
		this.getUser();
		this.getEstados();
	}

	/* Faz a requisição das informações do usuário logado */
	getUser() {
		var object = {
			extraFields: [ "email" ]
		};
		this._crud.post('/api/user/info', object).subscribe((response) => {
			/* Se o usuário já estiver com email cadastrado no banco este bloco vai ser acionado.
			 * Caso contrário, o bloco de erro será acionado.
			 */
			this.user = response.data.user;
			this.guiaForm.controls['email'].patchValue(this.user.email);
			this.guiaForm.controls['email'].disable();
		}, (err) => {
			console.info(err);
			
			/* Seta o valor do email para null.
			   Com isso o placeholder fica em estado de floating - BUG de componente do material@2.0.0-beta.1 */
			this.guiaForm.controls['email'].patchValue(null);

		});
	}

	/* Faz a requisição dos estados para popular o select */
	getEstados() {
		this._crud
			.get('/api/estados')
			.subscribe(success.bind(this), (err) => console.error(err));
		
		function success(response) {
			/* Atribui os estados de forma ordenada */
			this.estados = response.data.estados.sort(function (a, b) {
				if (a.nome > b.nome) return 1;
				if (a.nome < b.nome) return -1;
				
				return 0; // Retorna 0 se os atributos forem iguais
			});
		};
	}

	ngOnInit() {
		this.initConfInputs();
	}

	/* Inicializa atributos nos inputs de email e senha */
	initConfInputs() {

		/* Adiciona os validadores aos campos do formulário */
		this.guiaForm = this._fb.group({
			'estado': [null, Validators.required]
			, 'cidade': [null, Validators.required]
			, 'email': ['example@example.com', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(320)])]
			, 'senha': [null, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(50)])]
		});

		/* O email é o único valor que pode ser pré definido no formulário para guia.
		 * Com a atualização para o material@2.0.0-beta.1 o placeholder não flutuava
		 * ao inserir o email já pré definidio. Para corrigir esse erro um valor deve
		 * ser setado no builder do form acima, neste caso, foi setado "example@example.com"
		 */
	}

	/* Faz a requisição das cidades de acordo com o estado selecionado */
	getCidades(estadoId: number) {
		this._crud
			.post('/api/cidades', { "id": estadoId })
			.subscribe(this.setCidades.bind(this), (err) => { console.error(err) });
	}

	/* Método de sucesso para as requisições de cidade */
	setCidades(response: any) {
		this.cidades = response.data.cidades;
	}

	/* Quando um novo estado é selecionado, é feita uma chamada para requsitar as cidades */
	onChange(event: any) {
		this.getCidades(event.id);
	}

	/* Ação para enviar o formulário para o servidor */
	confirmar(param) {
		if(this.guiaForm.valid) {
			this.loading = true;
			this._crud
				.post('/api/newGuia', this.guiaForm.value)
				.subscribe(this.sucessoCadastro.bind(this), this.erroCadastro.bind(this));
		}
	}

	/* Se estiver tudo ok com o cadastro, uma mensagem de sucesso é mostrada para o usuário */
	sucessoCadastro(response: any) {
		this.loading = false;
		this.openDialog();
	}

	/* Disparado se houver erro no método confirmar() */
	erroCadastro(err) {
		this.loading = false;
		this.openSnackBar(err);
	}

	openSnackBar(message: string) {
		this.simpleSnackBarRef = this._snackBar.open(message, 'Fechar');
		this.snackBarOpened = true;
		this.simpleSnackBarRef.afterDismissed().subscribe(null, null, () => {
			this.snackBarOpened = false;
		});
	}

	openDialog() {
		let dialogRef = this._dialog.open(SuccessDialog);

		dialogRef.afterClosed().subscribe(result => {
			location.href = location.origin;
		});
	}

	/* Método que recarrega a aplicação no navegador */
	goBack() {
		location.href = location.origin;
	}
}

@Component({
  template: `
	<div style="font-family: Lobster; text-align: center; color: cadetblue;">
		<h2 style="font-weight: normal;">
			Cadastro efetuado com sucesso!
		</h2>
		<p>
			<button md-button (click)="dialogRef.close()">PROSSEGUIR</button>
		</p>
	</div>
  `,
})

export class SuccessDialog {
	constructor( @Optional() public dialogRef: MdDialogRef<SuccessDialog>) { }
}