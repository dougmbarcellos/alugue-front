import { IUser } from './user.interface';

export class User implements IUser {
	id: number = 0;
	name: string = 'Unknown';
	lastName: string = 'Unknown';
	displayName: string = 'Unknown';
	linkPicture: string = '';
	typeUser: string;
	newUser: boolean;
	email: string = ''; // Opcional
	local: {
		estado: ''
		, sigla: ''
		, estadoId: 0
		, cidade: ''
		, cidadeId: 0
	};
	points: string[] = [];
	comments: Array<Object> = []
}