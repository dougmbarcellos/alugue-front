import { Component, OnInit, ViewChild }  from '@angular/core';
import { Subscription }     			 from 'rxjs/Subscription';

import { AlCrudService }				 from '../services/al-crud.service';
import { SearchService }				 from '../services/search.service';
import { UserService }   			     from '../services/user.service';
import { User }          			     from '../models/user';
import { GuiaComponent }   				 from '../guia/guia.component';

const body: any = document.getElementsByTagName('body')[0];

@Component({
	selector: 'al-panel'
	, templateUrl: 'panel.component.html'
	, styleUrls: [ 'panel.component.css' ]
	, providers: [ SearchService ]
	, host: {'(window:scroll)': 'onScroll()'}
})
export class PanelComponent implements OnInit {
	

	@ViewChild(GuiaComponent) _guia: GuiaComponent;
	
	guiaHidden: boolean = true; // @Deprecated - também está na view - usado para bloquear aba

	indexTab: number = 0; // Atributo que controla a aba que será aberta

	guia: User = new User();
	subscription: Subscription;

	cidades: any = []; // Array que recebe informações básicas das cidades
	arrayCity: any = []; // Recebe informações detalhadas das cidades

	constructor(private _userService: UserService, private _crud: AlCrudService, private _search: SearchService) {
		const indexGuia = 2;
		
		/* Seta o background na cor snow */
		body.style.background = 'snow';

		this.getCidadesDashboard(); // Requisita as cidades a serem exibidas no Dashboard

		/* Quando um guia é clicado na aba de cidades, este componente
	     * muda o index das abas para a aba Guia */
		this.subscription = _userService.guia$.subscribe(
			guia => {
				this.indexTab = indexGuia;
				console.log(this._guia.showGuia);
				
				this._guia.showGuia(guia);
			}
		);
	}
	
	/* Faz a requisição de 3 imagens */
	getCidadesDashboard() {
		let route = '/api/dashboard';
		this._crud.post(route, {}).subscribe((response) => {
			this.cidades = response.data;

			for(let i = 0; i < this.cidades.length; i++) {
				this.getCidade(this.cidades[i]);
			}
		}
		, (err) => {
			console.error(err);
		});
	}

	hue(event: any) {
		console.log(event)
	}

	/* Requisita os dados de uma cidade específica */
	getCidade(cidade: any): void {
		this._search.getCidadeById(
			this.successRequest.bind(this)
			, cidade._id.id
			, cidade._id.estado);
	}
	
	successRequest(response: any) {
		this.arrayCity.push(response.data);
	}

	/* Função ativada toda vez que a página é rolada para baixo */
	onScroll() {
		/* Quando a barra de rolagem alcança os 95% do scroll bar inteiro, requisita +3 cidades */
		if(this.indexTab === 0 && getScrollPercent() > 95) this.getCidadesDashboard();

		function getScrollPercent() {
			var h = document.documentElement, 
				b = document.body,
				st = 'scrollTop',
				sh = 'scrollHeight';
			return (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
		}
	}

	ngOnInit() {
		
	}

}