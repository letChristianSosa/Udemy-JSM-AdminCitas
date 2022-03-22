import Citas from './classes/Citas.js'
import UI from './classes/UI.js'
import {mascotaInput, propietarioInput, telefonoInput, fechaInput, horaInput, sintomasInput, formulario} from './selectores.js'

const ui = new UI();
const administrarCitas = new Citas();

let editando;

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
export function datosCita(e){
     citaObj[e.target.name] = e.target.value;
};

// Valida y agrega una nueva cita a la clase de Citas
export function nuevaCita(e){
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

export function reiniciarObjeto(){
     citaObj.mascota='';
     citaObj.propietario='';
     citaObj.telefono='';
     citaObj.fecha='';
     citaObj.hora='';
     citaObj.sintomas='';
}; 

export function eliminarCita(id){
     //Eliminar la cita
     administrarCitas.eliminarCita(id);

     // Muestre un mensaje
     ui.imprimirAlerta('La cita se elimino correctamente');

     // Refrescar las citas
     ui.imprimirCitas(administrarCitas);
};

export function cargarEdicion(cita){
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
};