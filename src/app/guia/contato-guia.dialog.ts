import { Component, OnInit, Optional }		 		from '@angular/core';
import { FormBuilder, FormGroup, Validators } 		from '@angular/forms';
import { MdDialogRef }	from '@angular/material';

import { User } 							  		from '../models/user';
import { UserService } 						  		from '../services/user.service';
import { ToastService } 						  		from '../services/toast.service';

@Component({
  templateUrl: 'contato-guia.dialog.html'
  , styleUrls: [ 'contato-guia.dialog.css' ]
})
export class ContatoGuiaDialog implements OnInit {
	guia: User;
	contatoForm: FormGroup; /* Armazena as informações do formulário */
	submitted: boolean = false;
	loading: boolean = false;

	myDatePickerOptions = {
		dateFormat: 'dd/mm/yyyy'
		, inputValueRequired: true
		, indicateInvalidDate: true
		, selectionTxtFontSize: '18px'
	};

	constructor(
		@Optional() public dialogRef: MdDialogRef<ContatoGuiaDialog>
		, private _fb: FormBuilder
		, private _user: UserService
		, private _toast: ToastService) {

			console.log(this.guia);
	}

	ngOnInit() {
		this.contatoForm = this._fb.group({
			'data': [null, Validators.required]
			, 'cidade': [null, Validators.required]
			, 'descricao': [null, Validators.compose([Validators.required, Validators.maxLength(300)])]
		});
	}

	isValid(controlName: string): boolean {
		let control = this.contatoForm.controls[controlName];
		return (control.valid || (control.pristine && !this.submitted))

		?
			true : false;
	}

	onDateChanged(event: any): void {
		this.contatoForm.controls['data'].patchValue(new Date(event.jsdate));
		console.log(new Date(event.jsdate));
	}

	save(formValues: any, isValid: boolean) {
		console.log(this.submitted);
		this.submitted = true;
		this.loading = true;

		formValues.guiaId = this.guia.id;
		
		if(isValid) this._user.contactGuia((response) => {
			this.loading = false;
			this.dialogRef.close();
			this._toast.open('O guia foi contatado. Aguarde a resposta.');
		}, 
		(err) => {
			this.loading = false;
			this._toast.open(err, 10000);
		},
		formValues);
	}
 }