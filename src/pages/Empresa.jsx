// src/pages/Empresa.jsx
const Empresa = () => {
  return (
    <div className="p-8">
      <h2 className="pb-2 mb-6 text-3xl font-bold text-gray-800 border-b">
        🏢 Gestión de Empresa (CRUD)
      </h2>
      
      <div className="p-6 mb-8 bg-white rounded-lg shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-700">Formulario Empresa</h3>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col">
            <label htmlFor="empresaId" className="text-sm font-medium text-gray-600">ID (Auto-generado / Búsqueda)</label>
            <input id="empresaId" type="text" placeholder="ID" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="empresaCif" className="text-sm font-medium text-gray-600">CIF</label>
            <input id="empresaCif" type="text" defaultValue="A12345678" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="empresaNombreLegal" className="text-sm font-medium text-gray-600">Nombre Legal</label>
            <input id="empresaNombreLegal" type="text" defaultValue="Academia JDK21" className="p-2 border rounded" />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="empresaRazonSocial" className="text-sm font-medium text-gray-600">Razón Social</label>
            <input id="empresaRazonSocial" type="text" defaultValue="Formación Profesional" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="empresaRepresentante" className="text-sm font-medium text-gray-600">Representante</label>
            <input id="empresaRepresentante" type="text" defaultValue="Yo mismo" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="empresaTelefono" className="text-sm font-medium text-gray-600">Teléfono</label>
            <input id="empresaTelefono" type="text" defaultValue="987654321" className="p-2 border rounded" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="empresaEmail" className="text-sm font-medium text-gray-600">Email</label>
            <input id="empresaEmail" type="email" defaultValue="info@academia.es" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="empresaWeb" className="text-sm font-medium text-gray-600">Web</label>
            <input id="empresaWeb" type="text" defaultValue="www.academia.es" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="empresaDireccion" className="text-sm font-medium text-gray-600">Dirección</label>
            <input id="empresaDireccion" type="text" defaultValue="C/ Gran Vía" className="p-2 border rounded" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="empresaNumero" className="text-sm font-medium text-gray-600">Número</label>
            <input id="empresaNumero" type="text" defaultValue="10" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="empresaPiso" className="text-sm font-medium text-gray-600">Piso</label>
            <input id="empresaPiso" type="text" defaultValue="2" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="empresaPuerta" className="text-sm font-medium text-gray-600">Puerta</label>
            <input id="empresaPuerta" type="text" defaultValue="B" className="p-2 border rounded" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="empresaCodPostal" className="text-sm font-medium text-gray-600">Cód. Postal</label>
            <input id="empresaCodPostal" type="text" defaultValue="28013" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="empresaLocalidad" className="text-sm font-medium text-gray-600">Localidad</label>
            <input id="empresaLocalidad" type="text" defaultValue="Madrid" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="empresaProvincia" className="text-sm font-medium text-gray-600">Provincia</label>
            <input id="empresaProvincia" type="text" defaultValue="Madrid" className="p-2 border rounded" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="empresaIdComunidad" className="text-sm font-medium text-gray-600">ID Comunidad Autónoma</label>
            <input id="empresaIdComunidad" type="text" className="p-2 border rounded" />
          </div>
          
          <div className="flex items-center mt-6">
            <input id="empresaActivo" type="checkbox" defaultChecked className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label htmlFor="empresaActivo" className="text-sm font-medium text-gray-700">Activo</label>
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="empresaFechaCreacion" className="text-sm font-medium text-gray-600">Fecha Creación</label>
            <input id="empresaFechaCreacion" type="text" disabled defaultValue="Auto" className="p-2 bg-gray-100 border rounded" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="empresaFechaActualizacion" className="text-sm font-medium text-gray-600">Fecha Actualización</label>
            <input id="empresaFechaActualizacion" type="text" disabled defaultValue="Auto" className="p-2 bg-gray-100 border rounded" />
          </div>
        </div>
        
        <div className="flex mt-6 space-x-2">
          <button className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700">Crear</button>
          <button className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500">Actualizar</button>
          <button className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500">Buscar por ID</button>
          <button className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">Eliminar</button>
        </div>
        
        <label className="block mt-4 text-sm font-medium text-gray-600">Respuesta</label>
        <pre id="empresaResult" className="p-3 mt-1 overflow-auto text-sm bg-gray-100 rounded">
          Aquí verás las respuestas de las queries/mutations...
        </pre>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-700">
          Listado de Empresas Activas <span className="bg-red-200 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full ml-2">0</span>
        </h3>
        <div id="empresaList" className="list border p-3 rounded min-h-[50px]">
          <small className="text-gray-500">Cargando empresas...</small>
        </div>
        <button className="px-4 py-2 mt-4 text-white bg-green-600 rounded hover:bg-green-700">Recargar Listado</button>
      </div>
    </div>
  );
};

export default Empresa;