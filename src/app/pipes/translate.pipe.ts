import { Pipe, PipeTransform, Inject } from '@angular/core';

import { AlCrudService } from '../services/al-crud.service';

// COMPONENTE INSTÁVEL
@Pipe({
  name: 'translate'
  , pure: true // trocando para false são feitas requisições a todo instante
})

export class TranslatePipe  implements PipeTransform {
 
    private messageBundle:any;
    private request:any;
    
    constructor(private _crud: AlCrudService) {
        this.messageBundle = {};
    }
    
    transform(value:string, args:string[]):any {
        if(!this.request){
            this._crud.get('/assets/dictionary/dictionary.json')
			    .subscribe(data => this.messageBundle = data);
        }
        
        return this.messageBundle[value];
    }
}