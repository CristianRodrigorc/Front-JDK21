// src/pages/Curso.jsx
const Curso = () => {
  return (
    <div className="p-8">
      <h2 className="pb-2 mb-6 text-3xl font-bold text-gray-800 border-b">
        🗓️ Gestión de Cursos (CRUD)
      </h2>
      
      <div className="p-6 mb-8 bg-white rounded-lg shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-700">Formulario Curso</h3>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col">
            <label htmlFor="cursoId" className="text-sm font-medium text-gray-600">ID (Auto-generado / Búsqueda)</label>
            <input id="cursoId" type="text" placeholder="ID" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="cursoNombre" className="text-sm font-medium text-gray-600">Nombre</label>
            <input id="cursoNombre" type="text" defaultValue="Master Desarrollo FullStack" className="p-2 border rounded" />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="cursoIdMateria" className="text-sm font-medium text-gray-600">ID Materia</label>
            <input id="cursoIdMateria" type="text" defaultValue="1" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="cursoDuracion" className="text-sm font-medium text-gray-600">Duración (Horas)</label>
            <input id="cursoDuracion" type="number" defaultValue="210" className="p-2 border rounded" />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label htmlFor="cursoDescripcion" className="text-sm font-medium text-gray-600">Descripción</label>
            <textarea id="cursoDescripcion" defaultValue="Curso intensivo de programación." rows="3" className="p-2 border rounded"></textarea>
          </div>
          
          <div className="flex items-center mt-2">
            <input id="cursoActivo" type="checkbox" defaultChecked className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label htmlFor="cursoActivo" className="text-sm font-medium text-gray-700">Activo</label>
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="cursoFechaCreacion" className="text-sm font-medium text-gray-600">Fecha Creación</label>
            <input id="cursoFechaCreacion" type="text" disabled defaultValue="Auto" className="p-2 bg-gray-100 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="cursoFechaActualizacion" className="text-sm font-medium text-gray-600">Fecha Actualización</label>
            <input id="cursoFechaActualizacion" type="text" disabled defaultValue="Auto" className="p-2 bg-gray-100 border rounded" />
          </div>
        </div>
        
        <div className="flex mt-6 space-x-2">
          <button className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700">Crear</button>
          <button className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500">Actualizar</button>
          <button className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500">Buscar por ID</button>
          <button className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">Eliminar</button>
        </div>
        
        <label className="block mt-4 text-sm font-medium text-gray-600">Respuesta</label>
        <pre id="cursoResult" className="p-3 mt-1 overflow-auto text-sm bg-gray-100 rounded">
          Aquí verás las respuestas de las queries/mutations...
        </pre>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-700">
          Listado de Cursos Activos <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full ml-2">0</span>
        </h3>
        <div id="cursoList" className="list border p-3 rounded min-h-[50px]">
          <small className="text-gray-500">Cargando cursos...</small>
        </div>
        <button className="px-4 py-2 mt-4 text-white bg-green-600 rounded hover:bg-green-700">Recargar Listado</button>
      </div>
    </div>
  );
};

export default Curso;