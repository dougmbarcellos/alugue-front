import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MdInput, MdSnackBar } from '@angular/material';

import { SearchService } from '../services/search.service';

@Component({
	selector: 'al-search'
	, templateUrl: 'search.component.html'
	, styleUrls: [ 'search.component.css' ]
	, providers: [ SearchService ]
})

export class SearchComponent implements OnInit {
	@ViewChild('searchInput') searchInput: MdInput;

	cidades: any;
	cidadeSelecionada: {};

	hasResult: boolean = false;
	viewCidade: boolean = false;

	termo: string = '';

	constructor(private _search: SearchService, private _snack: MdSnackBar) { }

	ngOnInit() {
		// this.searchInput.hintLabel = 'Mínimo: 3 caracteres';
		this.searchInput.required = true;
        this.searchInput.minlength = 3;
        this.searchInput.maxlength = 70;
	}

    buscarCidade() {
		this.viewCidade = false;

		if(this.termo.length >= 3)
			this._search.buscaCidades(
				this.successCidade.bind(this)
				, this.errCidade.bind(this)
				, this.termo);
		else
			this.openSnack("São necessários 3 ou mais caracteres para pesquisa.")
    }

	successCidade(response: any) {
		this.cidades = response.data;
		this.hasResult = true;
	}

	errCidade(errMessage: any) {
		this.hasResult = false;
		this._snack.open(errMessage, "Fechar")
	}

	openSnack(message: string) {
		this._snack.open(message, "Fechar")
	}

	visualizarCidade(estadoId, cidadeId) {
		this.cidadeSelecionada = {
			estadoId: estadoId
			, cidadeId: cidadeId
		}

		this.viewCidade = true;
	}

	fecharCidade(yes: boolean) {
		this.viewCidade = !yes;
	}
}