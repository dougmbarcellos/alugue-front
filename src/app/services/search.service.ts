import { Injectable } from '@angular/core';

import { AlCrudService } from './al-crud.service';

@Injectable()
export class SearchService {
	route: string = '/api/cidades/search';

	constructor(private alCrudService: AlCrudService) { }

	buscaCidades(next: any, err: any, termo: string) {
        this.alCrudService.post(this.route, { "termo": termo })
			.subscribe(next, err);
	}

	getCidadeById(next: any, id: number, estadoId: number) {
		let route: string = '/api/cidade/' + id + '/' + estadoId;
		this.alCrudService.get(route)
			.subscribe(next, null);
	}
}