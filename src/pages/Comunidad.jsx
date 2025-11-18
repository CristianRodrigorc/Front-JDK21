// src/pages/Comunidad.jsx
const Comunidad = () => {
  return (
    <div className="p-8">
      <h2 className="pb-2 mb-6 text-3xl font-bold text-gray-800 border-b">
        🇪🇸 Gestión de Comunidades Autónomas (CRUD)
      </h2>
      
      <div className="p-6 mb-8 bg-white rounded-lg shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-700">Formulario Comunidad</h3>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col">
            <label htmlFor="comunidadId" className="text-sm font-medium text-gray-600">ID (Auto-generado / Búsqueda)</label>
            <input id="comunidadId" type="text" placeholder="ID" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="comunidadCodigo" className="text-sm font-medium text-gray-600">Código</label>
            <input id="comunidadCodigo" type="text" defaultValue="CM" className="p-2 border rounded" />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="comunidadNombre" className="text-sm font-medium text-gray-600">Nombre</label>
            <input id="comunidadNombre" type="text" defaultValue="Comunidad de Madrid" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="comunidadCapital" className="text-sm font-medium text-gray-600">Capital</label>
            <input id="comunidadCapital" type="text" defaultValue="Madrid" className="p-2 border rounded" />
          </div>

          <div className="flex items-center mt-2">
            <input id="comunidadActivo" type="checkbox" defaultChecked className="w-4 h-4 mr-2 text-green-600 border-gray-300 rounded focus:ring-green-500" />
            <label htmlFor="comunidadActivo" className="text-sm font-medium text-gray-700">Activo</label>
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="comunidadFechaCreacion" className="text-sm font-medium text-gray-600">Fecha Creación</label>
            <input id="comunidadFechaCreacion" type="text" disabled defaultValue="Auto" className="p-2 bg-gray-100 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="comunidadFechaActualizacion" className="text-sm font-medium text-gray-600">Fecha Actualización</label>
            <input id="comunidadFechaActualizacion" type="text" disabled defaultValue="Auto" className="p-2 bg-gray-100 border rounded" />
          </div>
        </div>
        
        <div className="flex mt-6 space-x-2">
          <button className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700">Crear</button>
          <button className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500">Actualizar</button>
          <button className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500">Buscar por ID</button>
          <button className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">Eliminar</button>
        </div>
        
        <label className="block mt-4 text-sm font-medium text-gray-600">Respuesta</label>
        <pre id="comunidadResult" className="p-3 mt-1 overflow-auto text-sm bg-gray-100 rounded">
          Aquí verás las respuestas de las queries/mutations...
        </pre>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-700">
          Listado de Comunidades Activas <span className="bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full ml-2">0</span>
        </h3>
        <div id="comunidadList" className="list border p-3 rounded min-h-[50px]">
          <small className="text-gray-500">Cargando comunidades...</small>
        </div>
        <button className="px-4 py-2 mt-4 text-white bg-green-600 rounded hover:bg-green-700">Recargar Listado</button>
      </div>
    </div>
  );
};

export default Comunidad;