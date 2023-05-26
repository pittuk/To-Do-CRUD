console.log('Hola mundo');
const formulario = document.forms['formulario'];
const listaTarea = document.querySelector('#listaTarea');
const template = document.querySelector('#template').content;
const fragment = document.createDocumentFragment();
// let tareas = [
// 	{
// 		id: 2435674678,
// 		texto: 'tarea 2',
// 		estado: false,
// 	},
// 	{
// 		id: 9876345267,
// 		texto: 'tarea 1',
// 		estado: false,
// 	},
// ];
let tareas = [];
//detectamos el evento de carga de la pagina y pintamos la tarea
document.addEventListener('DOMContentLoaded', () => {
	//verificamos en localstorage si hay tareas guardadas, de ser asi cargamos las tareas
	if (localStorage.getItem('tareas')) {
		tareas = JSON.parse(localStorage.getItem('tareas'));
	}
	pintarTareas();
	console.log(tareas);
});
//detectamos el evento de clic en icono de listartarea en el DOM
listaTarea.addEventListener('click', (e) => {
	btnAccion(e);
});

// detectamos el evento de submit del boton para setear al tarea
formulario.addEventListener('submit', (e) => {
	e.preventDefault();
	// console.log(tarea.value);

	setTarea(e);
});

const setTarea = (e) => {
	if (formulario['tarea'].value.trim() === '') {
		console.log('Esta vacio');
		return;
	}
	// luego de validar que hayan escrito algo creamos la tarea
	let tarea = {
		id: Date.now(),
		texto: formulario['tarea'].value,
		estado: false,
	};
	// agregamos la nueva tarea en la 1ra posición a el objeto tareas
	tareas.unshift(tarea);
	console.log(tareas);
	// reseteamos el formulario
	formulario.reset();
	//cambiamos a focus en el input
	formulario['tarea'].focus();

	//mostramos las tareas
	pintarTareas();
};

//funcion para listar las tareas
const pintarTareas = () => {
	//guardamos nuestra lista de tareas en localstorage (se debe convertir a JSON)
	localStorage.setItem('tareas', JSON.stringify(tareas));
	//validamos, si la lista esta vacia sale un mensaje
	if (tareas.length == 0) {
		listaTarea.innerHTML = `<div class="alert alert-dark text-center">
					No hay tareas pendientes 👍
				</div>`;
		//al colocar un return vacio se sale de la funcion y no ejecuta el codigo siguiente
		return;
	}
	//limpiamos listarTarea en el DOM para cada que se ejecute pintarTareas, pinte una lista nueva
	listaTarea.innerHTML = '';
	tareas.forEach((tarea) => {
		const clone = template.cloneNode(true);
		//cambiamos el icono, clases y tachamos el texto si el estado es true
		if (tarea.estado) {
			clone.querySelector('div').classList.replace('alert-warning', 'alert-primary');
			clone.querySelector('p').classList.add('text-decoration-line-through');
			clone.querySelectorAll('i')[0].classList.replace('fa-check-circle', 'fa-undo-alt');
		}

		clone.querySelector('p').textContent = tarea.texto;
		clone.querySelectorAll('.fa')[0].dataset.id = tarea.id;
		clone.querySelectorAll('.fa')[1].dataset.id = tarea.id;

		fragment.appendChild(clone);
	});
	listaTarea.appendChild(fragment);
};

//funcion
const btnAccion = (e) => {
	// aca definimos 3 tipos de acciones segun el boton que pulsemos
	//si pulsamos clic en el check verde se ejecuta este if
	if (e.target.classList.contains('fa-check-circle')) {
		let tareaIndex = tareas.findIndex((t) => t.id == e.target.dataset.id);

		let tareaTrue = tareas[tareaIndex];
		tareaTrue.estado = true;
		tareas[tareaIndex] = tareaTrue;
		pintarTareas();
		// console.log(tareas);
	}
	//si pulsamos clic en el eliminar rojo se ejecuta este if
	if (e.target.classList.contains('fa-minus-circle')) {
		tareas = tareas.filter((t) => t.id != e.target.dataset.id);
		pintarTareas();
		// console.log(tareas);
	}
	//si pulsamos clic en actualizar verde se ejecuta este if
	if (e.target.classList.contains('fa-undo-alt')) {
		let tareaIndex = tareas.findIndex((t) => t.id == e.target.dataset.id);

		let tareaTrue = tareas[tareaIndex];
		tareaTrue.estado = false;
		tareas[tareaIndex] = tareaTrue;
		pintarTareas();
		// console.log(tareas);
	}
	//solo activamos los enventos que estan dentro del contenedor listatarea
	e.stopPropagation();
};
