// import Citas from './classes/Citas.js'
import UI from './classes/UI.js'
import {mascotaInput, propietarioInput, telefonoInput, fechaInput, horaInput, sintomasInput, formulario} from './selectores.js';

export let DB;

const ui = new UI();
// const administrarCitas = new Citas();

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
          
          // // Pasar el objeto de la cita a edicion
          // administrarCitas.editarCita({...citaObj});

          const transaction = DB.transaction(['citas'], 'readwrite');
          const objectStore = transaction.objectStore('citas');

          objectStore.put(citaObj);

          transaction.oncomplete = () => {
               ui.imprimirAlerta('Editado correctamente');
               
               // Reasignar el texto del boton
               formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
               
               // Quitar modo edicion
               editando = false;
          }

          transaction.onerror = () => {
               console.log('Hubo un error');
          }

     }else{
          // Generar un id unico
          citaObj.id = Date.now();
          
          // Agregando la cita 
          // administrarCitas.agregarCita({...citaObj});
          
          // Insertar registro en IndexedDB
          const transaction = DB.transaction(['citas'], 'readwrite');
          
          // Habilitar el objectStore
          const objectStore = transaction.objectStore('citas');
          
          // Insertar en la BD
          objectStore.add(citaObj);
          
          transaction.oncomplete = () => {
               console.log('Cita agregada');
               
               // Imprimir mensaje
               ui.imprimirAlerta('Se agrego correctamente');
          };
          
     }     
     
     // Mostrar el HTML de las citas
     ui.imprimirCitas();
     
     // Reiniciar el objeto
     reiniciarObjeto();
     
     // Resetear formulario
     formulario.reset();
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
     const transaction = DB.transaction(['citas'], 'readwrite');
     const objectStore = transaction.objectStore('citas');
     objectStore.delete(id);

     transaction.oncomplete = () => {
          // Muestre un mensaje
          ui.imprimirAlerta('La cita se elimino correctamente');
          // Refrescar las citas
          ui.imprimirCitas();
     };

     transaction.onerror = () => {
          console.log('Hubo un error');
     }
     
     
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

export function crearDB(){
     // crear la base de datos en version 1.0
     const crearDB = window.indexedDB.open('citas', 1);
     
     // Si hay un error
     crearDB.onerror = function(){
          console.log('Hubo un error');
     }
     
     // Si se crea correctamente
     crearDB.onsuccess = function(){
          console.log('DB Creada correctamente');
          DB = crearDB.result;
          console.log(DB);
          ui.imprimirCitas();
     }
     
     // Defininir el schema
     crearDB.onupgradeneeded = function(e){
          const db = e.target.result;
          
          const objectStore = db.createObjectStore('citas', {
               keyPath: 'id',
               autoIncrement: true
          });
          
          // Definir todas las columnas
          objectStore.createIndex('mascota','mascota', {unique: false});
          objectStore.createIndex('propietario','propietario', {unique: false});
          objectStore.createIndex('telefono','telefono', {unique: false});
          objectStore.createIndex('fecha','fecha', {unique: false});
          objectStore.createIndex('hora','hora', {unique: false});
          objectStore.createIndex('sintomas','sintomas', {unique: false});
          objectStore.createIndex('id','id', {unique: true});
     }
};