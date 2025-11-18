// src/pages/Centros.jsx
const Centros = () => {
  return (
    <div className="p-8">
      <h2 className="pb-2 mb-6 text-3xl font-bold text-gray-800 border-b">
        📍 Gestión de Centros/Sedes (CRUD)
      </h2>
      
      <div className="p-6 mb-8 bg-white rounded-lg shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-700">Formulario Centro</h3>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col">
            <label htmlFor="centroId" className="text-sm font-medium text-gray-600">ID (Auto-generado / Búsqueda)</label>
            <input id="centroId" type="text" placeholder="ID" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="centroNombre" className="text-sm font-medium text-gray-600">Nombre</label>
            <input id="centroNombre" type="text" defaultValue="Sede Central Madrid" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="centroCodigo" className="text-sm font-medium text-gray-600">Código Centro</label>
            <input id="centroCodigo" type="text" defaultValue="CMD-001" className="p-2 border rounded" />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="centroResponsable" className="text-sm font-medium text-gray-600">Responsable</label>
            <input id="centroResponsable" type="text" defaultValue="Elena" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="centroCapacidad" className="text-sm font-medium text-gray-600">Capacidad Máxima</label>
            <input id="centroCapacidad" type="number" defaultValue="150" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="centroIdEmpresa" className="text-sm font-medium text-gray-600">ID Empresa</label>
            <input id="centroIdEmpresa" type="text" defaultValue="1" className="p-2 border rounded" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="centroTelefono" className="text-sm font-medium text-gray-600">Teléfono</label>
            <input id="centroTelefono" type="text" defaultValue="987654321" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="centroEmail" className="text-sm font-medium text-gray-600">Email</label>
            <input id="centroEmail" type="email" defaultValue="centro@academia.es" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="centroWeb" className="text-sm font-medium text-gray-600">Web</label>
            <input id="centroWeb" type="text" defaultValue="www.academia.es/madrid" className="p-2 border rounded" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="centroDireccion" className="text-sm font-medium text-gray-600">Dirección</label>
            <input id="centroDireccion" type="text" defaultValue="Av. de la Paz" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="centroNumero" className="text-sm font-medium text-gray-600">Número</label>
            <input id="centroNumero" type="text" defaultValue="25" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="centroPiso" className="text-sm font-medium text-gray-600">Piso</label>
            <input id="centroPiso" type="text" defaultValue="3" className="p-2 border rounded" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="centroPuerta" className="text-sm font-medium text-gray-600">Puerta</label>
            <input id="centroPuerta" type="text" defaultValue="A" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="centroCodPostal" className="text-sm font-medium text-gray-600">Cód. Postal</label>
            <input id="centroCodPostal" type="text" defaultValue="28001" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="centroLocalidad" className="text-sm font-medium text-gray-600">Localidad</label>
            <input id="centroLocalidad" type="text" defaultValue="Madrid" className="p-2 border rounded" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="centroProvincia" className="text-sm font-medium text-gray-600">Provincia</label>
            <input id="centroProvincia" type="text" defaultValue="Madrid" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="centroIdComunidad" className="text-sm font-medium text-gray-600">ID Comunidad Autónoma</label>
            <input id="centroIdComunidad" type="text" defaultValue="13" className="p-2 border rounded" />
          </div>
          
          <div className="flex items-center mt-6">
            <input id="centroActivo" type="checkbox" defaultChecked className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label htmlFor="centroActivo" className="text-sm font-medium text-gray-700">Activo</label>
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="centroFechaCreacion" className="text-sm font-medium text-gray-600">Fecha Creación</label>
            <input id="centroFechaCreacion" type="text" disabled defaultValue="Auto" className="p-2 bg-gray-100 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="centroFechaActualizacion" className="text-sm font-medium text-gray-600">Fecha Actualización</label>
            <input id="centroFechaActualizacion" type="text" disabled defaultValue="Auto" className="p-2 bg-gray-100 border rounded" />
          </div>
        </div>
        
        <div className="flex mt-6 space-x-2">
          <button className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700">Crear</button>
          <button className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500">Actualizar</button>
          <button className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500">Buscar por ID</button>
          <button className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">Eliminar</button>
        </div>
        
        <label className="block mt-4 text-sm font-medium text-gray-600">Respuesta</label>
        <pre id="centroResult" className="p-3 mt-1 overflow-auto text-sm bg-gray-100 rounded">
          Aquí verás las respuestas de las queries/mutations...
        </pre>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-700">
          Listado de Centros Activos <span className="bg-blue-200 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full ml-2">0</span>
        </h3>
        <div id="centroList" className="list border p-3 rounded min-h-[50px]">
          <small className="text-gray-500">Cargando centros...</small>
        </div>
        <button className="px-4 py-2 mt-4 text-white bg-green-600 rounded hover:bg-green-700">Recargar Listado</button>
      </div>
    </div>
  );
};

export default Centros;