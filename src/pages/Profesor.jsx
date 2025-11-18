// src/pages/Profesor.jsx
const Profesor = () => {
  return (
    <div className="p-8">
      <h2 className="pb-2 mb-6 text-3xl font-bold text-gray-800 border-b">
        👩‍🎓 Gestión de Profesores (CRUD)
      </h2>
      
      <div className="p-6 mb-8 bg-white rounded-lg shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-700">Formulario Profesor</h3>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col">
            <label htmlFor="profesorId" className="text-sm font-medium text-gray-600">ID (Auto-generado / Búsqueda)</label>
            <input id="profesorId" type="text" placeholder="ID" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="profesorNombre" className="text-sm font-medium text-gray-600">Nombre</label>
            <input id="profesorNombre" type="text" defaultValue="Juan" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="profesorApellidos" className="text-sm font-medium text-gray-600">Apellidos</label>
            <input id="profesorApellidos" type="text" defaultValue="Perez" className="p-2 border rounded" />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="profesorTelefono" className="text-sm font-medium text-gray-600">Teléfono</label>
            <input id="profesorTelefono" type="text" defaultValue="600123456" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="profesorEmail" className="text-sm font-medium text-gray-600">Email</label>
            <input id="profesorEmail" type="email" defaultValue="juan.perez@test.es" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="profesorContrasenia" className="text-sm font-medium text-gray-600">Contraseña</label>
            <input id="profesorContrasenia" type="password" defaultValue="pass123" className="p-2 border rounded" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="profesorDireccion" className="text-sm font-medium text-gray-600">Dirección</label>
            <input id="profesorDireccion" type="text" defaultValue="C/ Principal" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="profesorLocalidad" className="text-sm font-medium text-gray-600">Localidad</label>
            <input id="profesorLocalidad" type="text" defaultValue="Madrid" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="profesorProvincia" className="text-sm font-medium text-gray-600">Provincia</label>
            <input id="profesorProvincia" type="text" defaultValue="Madrid" className="p-2 border rounded" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="profesorFechaNacimiento" className="text-sm font-medium text-gray-600">Fecha Nacimiento</label>
            <input id="profesorFechaNacimiento" type="text" defaultValue="1990-01-01" placeholder="YYYY-MM-DD" className="p-2 border rounded" />
          </div>
          
          <div className="flex items-center mt-6">
            <input id="profesorActivo" type="checkbox" defaultChecked className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label htmlFor="profesorActivo" className="text-sm font-medium text-gray-700">Activo</label>
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="profesorFechaCreacion" className="text-sm font-medium text-gray-600">Fecha Creación</label>
            <input id="profesorFechaCreacion" type="text" disabled defaultValue="Auto" className="p-2 bg-gray-100 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="profesorFechaActualizacion" className="text-sm font-medium text-gray-600">Fecha Actualización</label>
            <input id="profesorFechaActualizacion" type="text" disabled defaultValue="Auto" className="p-2 bg-gray-100 border rounded" />
          </div>
        </div>
        
        <div className="flex mt-6 space-x-2">
          <button className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700">Crear</button>
          <button className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500">Actualizar</button>
          <button className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500">Buscar por ID</button>
          <button className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">Eliminar</button>
        </div>
        
        <label className="block mt-4 text-sm font-medium text-gray-600">Respuesta</label>
        <pre id="profesorResult" className="p-3 mt-1 overflow-auto text-sm bg-gray-100 rounded">
          Aquí verás las respuestas de las queries/mutations...
        </pre>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-700">
          Listado de Profesores Activos <span className="bg-indigo-200 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full ml-2">0</span>
        </h3>
        <div id="profesorList" className="list border p-3 rounded min-h-[50px]">
          <small className="text-gray-500">Cargando profesores...</small>
        </div>
        <button className="px-4 py-2 mt-4 text-white bg-green-600 rounded hover:bg-green-700">Recargar Listado</button>
      </div>
    </div>
  );
};

export default Profesor;