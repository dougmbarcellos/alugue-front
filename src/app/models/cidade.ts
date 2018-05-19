export class Cidade {
	estado: Number = 0; // Valor padrão para estado não selecionado
    sigla: string = '';
	cidade = {
		id: 0
		, nome: ''
		, locais: []
		, guias: []
		, coord: {
			latitude: 0
			, longitude: 0
		}
	};
}