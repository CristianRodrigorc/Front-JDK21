// src/pages/Materia.jsx
const Materia = () => {
  return (
    <div className="p-8">
      <h2 className="pb-2 mb-6 text-3xl font-bold text-gray-800 border-b">
        📚 Gestión de Materias (CRUD)
      </h2>
      
      <div className="p-6 mb-8 bg-white rounded-lg shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-700">Formulario Materia</h3>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col">
            <label htmlFor="materiaId" className="text-sm font-medium text-gray-600">ID (Auto-generado / Búsqueda)</label>
            <input id="materiaId" type="text" placeholder="ID" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="materiaNombre" className="text-sm font-medium text-gray-600">Nombre</label>
            <input id="materiaNombre" type="text" defaultValue="Programación Web" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col md:col-span-2">
            <label htmlFor="materiaDescripcion" className="text-sm font-medium text-gray-600">Descripción</label>
            <textarea id="materiaDescripcion" defaultValue="Introducción a React y Spring Boot" rows="3" className="p-2 border rounded"></textarea>
          </div>
          
          <div className="flex items-center mt-2">
            <input id="materiaActivo" type="checkbox" defaultChecked className="w-4 h-4 mr-2 text-green-600 border-gray-300 rounded focus:ring-green-500" />
            <label htmlFor="materiaActivo" className="text-sm font-medium text-gray-700">Activo</label>
          </div>

          <div className="flex flex-col">
            <label htmlFor="materiaFechaCreacion" className="text-sm font-medium text-gray-600">Fecha Creación</label>
            <input id="materiaFechaCreacion" type="text" disabled defaultValue="Auto" className="p-2 bg-gray-100 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="materiaFechaActualizacion" className="text-sm font-medium text-gray-600">Fecha Actualización</label>
            <input id="materiaFechaActualizacion" type="text" disabled defaultValue="Auto" className="p-2 bg-gray-100 border rounded" />
          </div>
        </div>
        
        <div className="flex mt-6 space-x-2">
          <button className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700">Crear</button>
          <button className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500">Actualizar</button>
          <button className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500">Buscar por ID</button>
          <button className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">Eliminar</button>
        </div>
        
        <label className="block mt-4 text-sm font-medium text-gray-600">Respuesta</label>
        <pre id="materiaResult" className="p-3 mt-1 overflow-auto text-sm bg-gray-100 rounded">
          Aquí verás las respuestas de las queries/mutations...
        </pre>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-700">
          Listado de Materias Activas <span className="bg-green-200 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full ml-2">0</span>
        </h3>
        <div id="materiaList" className="list border p-3 rounded min-h-[50px]">
          <small className="text-gray-500">Cargando materias...</small>
        </div>
        <button className="px-4 py-2 mt-4 text-white bg-green-600 rounded hover:bg-green-700">Recargar Listado</button>
      </div>
    </div>
  );
};

export default Materia;