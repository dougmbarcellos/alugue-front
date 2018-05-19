import { Injectable }       from '@angular/core';
import { Http }             from '@angular/http';
import { Observable }       from 'rxjs/Observable';

import { HttpUtilService }  from './http-util.service';

@Injectable()
export class AlCrudService {
    /* Serviços http usando Observables */
    constructor(private http: Http, private httpUtil: HttpUtilService) { }

    post(path: string, obj: {}): Observable<any> {
        return this.http.post(this.httpUtil.url(path), JSON.stringify(obj), this.httpUtil.headers())
                .map((this.httpUtil.extrairDados))
                .catch(this.httpUtil.processarErros);
    }

    get(path: string): Observable<any> {
        return this.http.get(this.httpUtil.url(path), this.httpUtil.headers())
                .map(this.httpUtil.extrairDados)
                .catch(this.httpUtil.processarErros);
    }

    put(path: string, obj: {}): Observable<any> {
        return this.http.put(this.httpUtil.url(path), JSON.stringify(obj), this.httpUtil.headers())
                .map((this.httpUtil.extrairDados))
                .catch(this.httpUtil.processarErros);
    }

    delete(path: string, pointHeader?: string): Observable<any> {
        if(pointHeader)
            return this.http.delete(this.httpUtil.url(path), this.httpUtil.headers(null, pointHeader))
                    .map(this.httpUtil.extrairDados)
                    .catch(this.httpUtil.processarErros);

        else
            return this.http.delete(this.httpUtil.url(path), this.httpUtil.headers())
                    .map(this.httpUtil.extrairDados)
                    .catch(this.httpUtil.processarErros);
    }

    /* Não funcional pois o http do Angular 2.0.0 não tem suporte a arquivos */
    postFile(path: string, file: any): Observable<any> {
        return this.http.post(this.httpUtil.url(path), file, this.httpUtil.headers(true))
                .map((this.httpUtil.extrairDados))
                .catch(this.httpUtil.processarErros);
    }
}
