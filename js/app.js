// Selectores de campos del formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

let editando;

// UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

// Clases
class Citas {
     constructor() {
          this.citas = [];
     }

     agregarCita(cita){
          this.citas = [...this.citas, cita];
     }

     eliminarCita(id){
          this.citas = this.citas.filter(cita => cita.id !== id);
     }

     editarCita(citaActualizada){
          this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
     }
}

class UI {

     imprimirAlerta(mensaje, tipo){
          // Crear el div de la alerta
          const divMensaje = document.createElement('div');
          divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

          // Agregar clase con base al tipo de error
          if(tipo === 'error'){
               divMensaje.classList.add('alert-danger');
          }else {
               divMensaje.classList.add('alert-success');
          }

          // Mensaje de error
          divMensaje.textContent = mensaje;

          // Agregar al DOM
          document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

          setTimeout(()=>{
               divMensaje.remove();
          },3000)

     };

     imprimirCitas({citas}){

          // Limpia el HTML antes de imprimir 
          this.limpiarHTML();
          
          citas.forEach(cita => {
               const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

               const divCita = document.createElement('div');
               divCita.classList.add('cita', 'p-3');
               divCita.dataset.id = id;

               // Scripting de los elementos de la cita
               const mascotaParrafo = document.createElement('h2');
               mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
               mascotaParrafo.textContent = mascota;

               const propietarioParrafo = document.createElement('p');
               propietarioParrafo.innerHTML = `
                    <span class="font-weight-bolder">Propietario: </span> ${propietario}
               `;

               const telefonoParrafo = document.createElement('p');
               telefonoParrafo.innerHTML = `
                    <span class="font-weight-bolder">Telefono: </span> ${telefono}
               `;

               const fechaParrafo = document.createElement('p');
               fechaParrafo.innerHTML = `
                    <span class="font-weight-bolder">Fecha: </span> ${fecha}
               `;

               const horaParrafo = document.createElement('p');
               horaParrafo.innerHTML = `
                    <span class="font-weight-bolder">Hora: </span> ${hora}
               `;

               const sintomasParrafo = document.createElement('p');
               sintomasParrafo.innerHTML = `
                    <span class="font-weight-bolder">Sintomas: </span> ${sintomas}
               `;

               // Boton para eliminar esta cita
               const btnEliminar = document.createElement('button');
               btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
               btnEliminar.innerHTML =`Eliminar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
               <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>`;
               btnEliminar.onclick = () => eliminarCita(id);
               
               // Boton para Editar una cita
               const btnEditar = document.createElement('button');
               btnEditar.classList.add('btn', 'btn-info');
               btnEditar.innerHTML =`Editar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
               <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
               </svg>`;
               btnEditar.onclick = () => cargarEdicion(cita);
               
               
               // Agregar los parrafos al divCita
               divCita.appendChild(mascotaParrafo);
               divCita.appendChild(propietarioParrafo);
               divCita.appendChild(telefonoParrafo);
               divCita.appendChild(fechaParrafo);
               divCita.appendChild(horaParrafo);
               divCita.appendChild(sintomasParrafo);
               divCita.appendChild(btnEliminar);
               divCita.appendChild(btnEditar);

               // Agregar las citas al HTML
               contenedorCitas.appendChild(divCita);
          })
     };

     limpiarHTML(){
          while(contenedorCitas.firstChild){
               contenedorCitas.removeChild(contenedorCitas.firstChild);
          }
     }
};

const ui = new UI();
const administrarCitas = new Citas();

// Registrar eventos
eventListeners();
function eventListeners(){
     mascotaInput.addEventListener('input', datosCita);
     propietarioInput.addEventListener('input', datosCita);
     telefonoInput.addEventListener('input', datosCita);
     fechaInput.addEventListener('input', datosCita);
     horaInput.addEventListener('input', datosCita);
     sintomasInput.addEventListener('input', datosCita);

     formulario.addEventListener('submit', nuevaCita)
};

// Objeto con la info de la cita
const citaObj = {
     mascota: '',
     propietario: '',
     telefono: '',
     fecha: '',
     hora: '',
     sintomas: ''
}

// Funcion del evento que agrega datos al objeto de cita
function datosCita(e){
     citaObj[e.target.name] = e.target.value;
};

// Valida y agrega una nueva cita a la clase de Citas
function nuevaCita(e){
     e.preventDefault();

     const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;

     // Validar
     if( mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === ''){
          ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
          return;
     }else if(isNaN(telefono)){
          ui.imprimirAlerta('Telefono invalido', 'error');
          return;
     };

     if(editando){
          ui.imprimirAlerta('Editado correctamente');

          // Pasar el objeto de la cita a edicion
          administrarCitas.editarCita({...citaObj});

          // Reasignar el texto del boton
          formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

          // Quitar modo edicion
          editando = false;
     }else{
          // Generar un id unico
          citaObj.id = Date.now();

          // Agregando la cita 
          administrarCitas.agregarCita({...citaObj});

          // Imprimir mensaje
          ui.imprimirAlerta('Se agrego correctamente');
     }     
     
     // Reiniciar el objeto
     reiniciarObjeto();
     
     // Resetear formulario
     formulario.reset();

     // Mostrar el HTML de las citas
     ui.imprimirCitas(administrarCitas);
};

function reiniciarObjeto(){
     citaObj.mascota='';
     citaObj.propietario='';
     citaObj.telefono='';
     citaObj.fecha='';
     citaObj.hora='';
     citaObj.sintomas='';
} 

function eliminarCita(id){
     //Eliminar la cita
     administrarCitas.eliminarCita(id);

     // Muestre un mensaje
     ui.imprimirAlerta('La cita se elimino correctamente');

     // Refrescar las citas
     ui.imprimirCitas(administrarCitas);
};

function cargarEdicion(cita){
     const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

     mascotaInput.value = mascota;
     propietarioInput.value = propietario;
     telefonoInput.value = telefono;
     fechaInput.value = fecha;
     horaInput.value = hora;
     sintomasInput.value = sintomas;

     citaObj.mascota = mascota; 
     citaObj.propietario = propietario;
     citaObj.telefono = telefono;
     citaObj.fecha = fecha;
     citaObj.hora = hora;
     citaObj.sintomas = sintomas;
     citaObj.id = id;

     // Cambiar el texto del boton
     formulario.querySelector('button[type="submit"]').textContent = 'Guadar cambios';

     editando = true;
}