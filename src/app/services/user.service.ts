import { Injectable }        from '@angular/core';
import { Subject }           from 'rxjs/Subject';

import { AlCrudService }     from './al-crud.service';
import { ToastService }      from './toast.service';
import { User }              from '../models/user';

@Injectable()
export class UserService {
    route: string = '/api/user/info';
    routeGuia: string = '/api/guias';
    routePoint: string = '/api/point';
    routeMySelf: string = '/api/user/myself';
    routeUpNewUser: string = '/api/user/updateNewUser';
    routeGuiaContato: string = '/api/contato';

    private goToGuia = new Subject<User>();

    guia$ = this.goToGuia.asObservable();

    constructor(private alCrudService: AlCrudService, private _toast: ToastService) { }
        sendMessage(user: User) {
        this.goToGuia.next(user);
    }

    /* Carrega o usuário logado na função passado no parâmetro */
	loadUser(next: any) {
        this.alCrudService.get(this.route)
			.subscribe(next, this.error.bind(this));
	}

    /* Faz requisição de informações específicas do usuário 
     * @param next    Função de sucesso, que recebe a resposta do Back-End
     * @param fields  Objeto com campos 
     */
    loadUserMore(next: any, fields: {}) {
        this.alCrudService.post(this.route, fields)
			.subscribe(next, this.error.bind(this));
	}

    /* Buca um guia 
     * @param next     Função de sucesso, que recebe a resposta do Back-End
     * @param guiaId   Identificador de usuário do guia
     */
    loadGuia(next: any, guiaId: number) {
        this.alCrudService
                .get(this.route + '/' + guiaId)
                .subscribe(next, this.error.bind(this));
	}

    error(err) {
        // Abre um Toast com a mensagem de erro e fecha após 10 segundos
        this._toast.open(err, 10000);
    }

    /* Service message commands */
    exibirGuia(guia: User) {
        this.goToGuia.next(guia);
    }
    
    /* Pega um número aleatório de guias. O máximo é 40 */
    getGuias(next, error, maxGuias: number) {
         this.alCrudService
                .post(this.routeGuia, { "maxGuias": maxGuias })
                .subscribe(next, error);
    }

    /* Remove um ponto/local do guia */
    newPoint(next, point: string) {
        this.alCrudService
                .post(this.routePoint, { "point": point })
                .subscribe(next, this.error.bind(this));
    }

    /* Remove um ponto/local do guia */
    removePoint(next, point: string) {
        this.alCrudService
                .delete(this.routePoint, point)
			    .subscribe(next, this.error.bind(this));
    }

    /* Verifica se o guia visualizado é do próprio usuário */
    myself(next, guiaId) {
        this.alCrudService
                .get(this.routeMySelf + '/' + guiaId)
			    .subscribe(next, this.error.bind(this));
    }

    /* Atualiza a flag newUser do usuário */
    updateNewUser(next) {
        this.alCrudService
                .post(this.routeUpNewUser, {})
			    .subscribe(next, this.error.bind(this));
    }

    /* */
    contactGuia(next: any, err: any, values: any) {
        this.alCrudService
                .post(this.routeGuiaContato, values)
			    .subscribe(next, err);
    }
}