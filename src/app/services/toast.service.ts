import { Injectable } from '@angular/core';
import { MdSnackBar } from '@angular/material';

@Injectable()
export class ToastService {

	simpleSnackBarRef: any; // Receberá a instância do snackBar/toast
	snackBarOpened: boolean; // Exibe o estado do snackBar/toast

	constructor(private _snack: MdSnackBar) { }

	open(message: string, time?: number) {
		if(this.snackBarOpened)
			this.simpleSnackBarRef.dismiss();

		this.simpleSnackBarRef = this._snack.open(message, 'Fechar');
		this.snackBarOpened = true;

		this.simpleSnackBarRef.afterDismissed().subscribe(null, null, () => {
			this.snackBarOpened = false;
		});

		if(time) setTimeout(() => this.simpleSnackBarRef.dismiss(), time);
	}

	close() {
		if(this.snackBarOpened) {
			this.simpleSnackBarRef.dismiss();
			this.snackBarOpened = false;
		}
	}
}