import { Component, OnInit, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdInput, MdSnackBar } from '@angular/material';

import { AlCrudService } from '../services/al-crud.service';
import { Cidade } from '../models/cidade';

@Component({
	selector: 'al-upload-image'
	, templateUrl: 'upload-image.component.html'
	, styleUrls: [ 'upload-image.component.css' ]
	, providers: [ AlCrudService, MdSnackBar ]
})
export class UploadImageComponent implements OnInit {
	@ViewChild('localInput') localInput: MdInput;

	@Input('cidadeInfo') cidadeInfo: any = new Cidade(); /* Inicializa o objeto que armazena as informações da cidade */

	public file_src: string = '';

	loading: boolean = false;
	route: string = '/fileupload';
	xhr: any;

	localForm: FormGroup; /* Armazena as informações do formulário */

	imgUpload: any;
	imgChanged: boolean = false;

	constructor(
		private _crud: AlCrudService
		, private _fb: FormBuilder
		, private _snackBar: MdSnackBar
		, private changeDetectorRef: ChangeDetectorRef) {
		/* Instância para o XMLHttpRequest */
		this.xhr = new XMLHttpRequest();

		/* Checa o estado da requisição e dispara um callback quando completada */  
		this.xhr.onreadystatechange = this.xhrCallback.bind(this);
	}

	ngOnInit() {
		/* Adiciona os validadores aos campos do formulário */
		this.localForm = this._fb.group({
			'local': [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])]
			, 'descricao': [null, Validators.maxLength(100)]
		});

		/* Setando como required para o asterisco(*) aparecer no label */
		(function initLocal() {
			this.localInput.autocomplete = 'off';
			this.localInput.required = true;
		}).bind(this)();
		
	}

	xhrCallback() {
		if(this.xhr.readyState === XMLHttpRequest.DONE && this.xhr.status == 200) {
			this.loading = false;
			this.imgUpload = JSON.parse(this.xhr.responseText).data;
			this.registrarFotoLocal();
		}
		else if(this.xhr.status == 0) {
			// Nothing
			// A requisição ainda está ocorrendo
		}
		else if(this.xhr.status >= 400){
			this.loading = false;
			this.openSnackBar("Ocorreu um erro no envio da imagem. Tente novamente.");
		}
	}

	sendImage() {
		var _this = this;

		/* Em caso de erro na requisição */
		this.xhr.onerror = function(e) {
			console.error(_this.xhr.statusText);
			// _this.erroRegistro(_this.xhr.statusText);
		};
		
		var file = (<HTMLInputElement>document.getElementById("fileUp"));
		
		/* Create a FormData instance */
		var formData = new FormData();
		/* Add the file */ 
		formData.append("file", file.files[0]);

		this.xhr.open("post", this.route, true);
		this.xhr.send(formData);  /* Send to server */ 
   
	}

	/* Ação para o botão confirmar do formulário */
	confirmar() {
		if(this.localForm.valid) {
			this.loading = true;
			this.sendImage();
		}
	}

	registrarFotoLocal() {
		this.loading = true;

		var objectToSend = {
				localName: this.localForm.value['local']
				, localDescription: this.localForm.value['descricao'] || ''
				, estadoId: this.cidadeInfo.estado
				, cidadeId: this.cidadeInfo.cidade.id
				, imageId: this.imgUpload._id
			}
		this._crud
			.post('/api/local', objectToSend)
			.subscribe(this.sucessoRegistro.bind(this), this.erroRegistro.bind(this));
	}

	sucessoRegistro(response) {
		this.loading = false;
		this.openSnackBar("Local cadastrado com sucesso!");
		this.resetImage();
	}

	erroRegistro(err) {
		this.loading = false;
		this.openSnackBar(err);
	}

	openSnackBar(message: string) {
		this._snackBar.open(message, 'Fechar');
	}

	// The next two lines are just to show the resize debug
	// they can be removed
	public debug_size_before: string[] = [];
	public debug_size_after: string[] = [];

	// This is called when the user selects new files from the upload button
	fileChange(input: any) {
		this.readFiles(input.files);
	}

	readFile(file, reader, callback) {
		// Set a callback funtion to fire after the file is fully loaded
		reader.onload = () => {
			// callback with the results
			callback(reader.result);
		}

		// Read the file
		reader.readAsDataURL(file);
	}

	readFiles(files: any, index: any = 0) {
		// Create the file reader
		let reader = new FileReader();

		// If there is a file
		if (index in files) {
			// Start reading this file
			this.readFile(files[index], reader, (result) => {
				// Create an img element and add the image file data to it
				// var img = document.createElement("img");
				// img.src = result;
				this.file_src = result;

				this.imgChanged = true;
			});
		}
		else {
			// When all files are done This forces a change detection
			this.changeDetectorRef.detectChanges();
		}
	}

	resetImage() {
		var file = (<HTMLInputElement>document.getElementById("fileUp"));

		// Reseta o arquivo selecionado
		file.type = '';
		file.type = 'file';

		this.imgChanged = false;
	}
}