import { Injectable } 							from '@angular/core';
import { Response, Headers, RequestOptions } 	from '@angular/http';
import { Observable } 							from 'rxjs/Observable';

@Injectable()
export class HttpUtilService {

	private API_URL: string = 'http://localhost:8080';
	// private API_URL: string = 'https://guire.herokuapp.com';

	url(path: string) {
		return this.API_URL + path;
	}

	headers(file?: boolean, pointHeader?: string) {
			let headersParams;
		if(file) 
			headersParams = {'Content-Type': 'multipart/form-data'};
		else
			headersParams = {'Content-Type': 'application/json'};
		
		/* Usado para passar um local recomendado na rota de DELETE */
		if(pointHeader) headersParams['Al-Point'] = pointHeader; 

		let headers = new Headers(headersParams);
    	let options = new RequestOptions({ headers: headers });
    	
		return options;
	}

	extrairDados(response: Response) {
    	let data = response.json();
    	return data || {};
  	}
	
  	processarErros(error: Response | any) {
		let errMsg: string;
		if (error instanceof Response) {
			/* body recebe o corpo da resposta 
			 * a resposta está no formato @JSON
			 * {
			 * 		error: {
			 * 			type: String
			 * 			, message: String
			 * 		}
			 * }
			 */
			const body = error.json() || '';
			const err = body.error || JSON.stringify(body);
			errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
			console.log(errMsg);
			return Observable.throw(err.message || 'Ocorreu um erro! Tente novamente!');
		} else {
			errMsg = error.message ? error.message : error.toString();
			console.log(errMsg);
			return Observable.throw('Ocorreu um erro! Tente novamente!');
		}
	}
}
