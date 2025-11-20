import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; 

const GRAPHQL_URL = import.meta.env.VITE_API_URL + '/graphql';


// ----------------------------------------------------
// 1. DEFINICIONES DE OPERACIONES GRAPHQL (Igual que antes)
// ----------------------------------------------------

// Query para Listar todas las comunidades
const LISTAR_COMUNIDADES_QUERY = `
  query {
    allComunidades {
      idComunidad: id_comunidad
      codigo
      nombre
      capital
      activo
      fechaCreacion
      fechaActualizacion
    }
  }
`;

// Query para Buscar por ID
const COMUNIDAD_BY_ID_QUERY = `
  query ComunidadById($id: Long!) {
    comunidadById(id: $id) {
      idComunidad: id_comunidad
      codigo
      nombre
      capital
      activo
      fechaCreacion
      fechaActualizacion
    }
  }
`;

// Mutation para Crear
const CREATE_COMUNIDAD_MUTATION = `
  mutation CreateComunidad($input: CreateComunidadDTO!) {
    createComunidad(input: $input) {
      idComunidad: id_comunidad
      nombre
      codigo
      activo
    }
  }
`;

// Mutation para Actualizar
const UPDATE_COMUNIDAD_MUTATION = `
  mutation UpdateComunidad($id: Long!, $input: UpdateComunidadDTO!) {
    updateComunidad(id: $id, input: $input) {
      idComunidad: id_comunidad
      nombre
      capital
      activo
      fechaActualizacion
    }
  }
`;

// Mutation para Eliminar (Soft Delete)
const DELETE_COMUNIDAD_MUTATION = `
  mutation DeleteComunidad($id: Long!) {
    deleteComunidad(id: $id)
  }
`;

// ----------------------------------------------------
// 2. COMPONENTE PRINCIPAL
// ----------------------------------------------------

const Comunidad = () => {
  // Estado para la lista de comunidades
  const [comunidades, setComunidades] = useState([]);
  
  // Estado para los datos del formulario (la comunidad actual)
  const [form, setForm] = useState({
    idComunidad: '',
    codigo: 'CM',
    nombre: 'Comunidad de Madrid',
    capital: 'Madrid',
    activo: true,
    fechaCreacion: 'Auto',
    fechaActualizacion: 'Auto',
  });
  
  // Estado para el área de resultados/respuesta
  const [result, setResult] = useState('Aquí verás las respuestas de las queries/mutations...');

  // -----------------------------------
  // Manejo de Cambios en el Formulario
  // -----------------------------------
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const keyMap = {
      comunidadId: 'idComunidad',
      comunidadCodigo: 'codigo',
      comunidadNombre: 'nombre',
      comunidadCapital: 'capital',
      comunidadActivo: 'activo',
    };
    const key = keyMap[id];
    
    setForm(prev => ({
      ...prev,
      [key]: type === 'checkbox' ? checked : value,
    }));
  };

  // -----------------------------------
  // Función Genérica para Llamadas GraphQL con AXIOS
  // -----------------------------------
  const executeGraphQL = async (query, variables = {}) => {
    setResult('Enviando petición a GraphQL...');
    try {
      const response = await axios.post(GRAPHQL_ENDPOINT, {
        query, 
        variables 
      });

      // Axios envuelve la respuesta en 'data', y no necesita conversión JSON
      const body = response.data; 
      
      if (body.errors) {
        setResult(JSON.stringify(body.errors, null, 2));
        toast.error("Error en GraphQL. Revise la consola.");
        return null;
      }
      
      setResult(JSON.stringify(body.data, null, 2));
      return body.data;

    } catch (error) {
      // Axios envuelve los errores HTTP en error.response
      const message = error.response ? error.response.statusText : error.message;
      setResult(JSON.stringify(message, null, 2));
      toast.error(`Error de conexión con el backend: ${message}`);
      console.error("Axios Error:", error);
      return null;
    }
  };

  // -----------------------------------
  // OPERACIONES CRUD
  // -----------------------------------

  // Carga inicial y Recarga (QUERY: Listar)
  const loadComunidades = useCallback(async () => {
    const data = await executeGraphQL(LISTAR_COMUNIDADES_QUERY);
    if (data && data.allComunidades) {
      setComunidades(data.allComunidades);
      toast.success(`Cargadas ${data.allComunidades.length} comunidades.`);
    }
  }, []);

  useEffect(() => {
    loadComunidades();
  }, [loadComunidades]);

  // Buscar por ID (QUERY: Buscar)
  const handleBuscar = async () => {
    const id = parseInt(form.idComunidad);
    if (isNaN(id)) {
      toast.warn("Debe ingresar un ID válido para buscar.");
      return;
    }

    const data = await executeGraphQL(COMUNIDAD_BY_ID_QUERY, { id });
    if (data && data.comunidadById) {
      const c = data.comunidadById;
      setForm({
        idComunidad: c.idComunidad,
        codigo: c.codigo,
        nombre: c.nombre,
        capital: c.capital,
        activo: c.activo,
        fechaCreacion: c.fechaCreacion,
        fechaActualizacion: c.fechaActualizacion,
      });
      toast.info(`Comunidad ${c.nombre} cargada.`);
    } else {
      toast.error(`Comunidad con ID ${id} no encontrada.`);
      setForm(prev => ({ ...prev, idComunidad: '' }));
    }
  };

  // Crear (MUTATION: Crear)
  const handleCrear = async () => {
    if (!form.codigo || !form.nombre || !form.capital) {
      toast.warn("Código, Nombre y Capital son obligatorios.");
      return;
    }

    const input = {
      codigo: form.codigo,
      nombre: form.nombre,
      capital: form.capital,
      activo: form.activo,
    };

    const data = await executeGraphQL(CREATE_COMUNIDAD_MUTATION, { input });
    if (data && data.createComunidad) {
      toast.success(`Comunidad ${data.createComunidad.nombre} creada.`);
      loadComunidades(); // Recargar lista
    }
  };

  // Actualizar (MUTATION: Actualizar)
  const handleActualizar = async () => {
    const id = parseInt(form.idComunidad);
    if (isNaN(id)) {
      toast.warn("Debe seleccionar o buscar un ID válido para actualizar.");
      return;
    }

    const input = {
      codigo: form.codigo,
      nombre: form.nombre,
      capital: form.capital,
      activo: form.activo,
    };

    const data = await executeGraphQL(UPDATE_COMUNIDAD_MUTATION, { id, input });
    if (data && data.updateComunidad) {
      toast.success(`Comunidad ${data.updateComunidad.nombre} actualizada.`);
      loadComunidades(); // Recargar lista
    }
  };

  // Eliminar (MUTATION: Desactivar/Soft Delete)
  const handleEliminar = async () => {
    const id = parseInt(form.idComunidad);
    if (isNaN(id) || !window.confirm(`¿Seguro que desea DESACTIVAR la comunidad con ID ${id}?`)) {
      return;
    }

    const data = await executeGraphQL(DELETE_COMUNIDAD_MUTATION, { id });
    if (data && data.deleteComunidad === true) {
      toast.success(`Comunidad ID ${id} desactivada (Soft Delete).`);
      setForm(prev => ({ ...prev, activo: false })); 
      loadComunidades(); 
    } else if (data && data.deleteComunidad === false) {
        toast.info(`Comunidad ID ${id} ya estaba desactivada.`);
    }
  };

  // -----------------------------------
  // Renderizado (Mismo JSX que antes)
  // -----------------------------------
  return (
    <div className="p-8">
      <h2 className="pb-2 mb-6 text-3xl font-bold text-gray-800 border-b">
        🇪🇸 Gestión de Comunidades Autónomas (GraphQL + **Axios**)
      </h2>
      
      <div className="p-6 mb-8 bg-white rounded-lg shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-700">Formulario Comunidad</h3>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          
          {/* ID (Auto-generado / Búsqueda) */}
          <div className="flex flex-col">
            <label htmlFor="comunidadId" className="text-sm font-medium text-gray-600">ID (Búsqueda)</label>
            <input 
                id="comunidadId" 
                type="number" 
                placeholder="ID" 
                className="p-2 border rounded" 
                value={form.idComunidad}
                onChange={handleChange}
            />
          </div>
          
          {/* Código */}
          <div className="flex flex-col">
            <label htmlFor="comunidadCodigo" className="text-sm font-medium text-gray-600">Código</label>
            <input 
                id="comunidadCodigo" 
                type="text" 
                placeholder="Código" 
                className="p-2 border rounded" 
                value={form.codigo}
                onChange={handleChange}
            />
          </div>
          
          {/* Nombre */}
          <div className="flex flex-col">
            <label htmlFor="comunidadNombre" className="text-sm font-medium text-gray-600">Nombre</label>
            <input 
                id="comunidadNombre" 
                type="text" 
                placeholder="Nombre" 
                className="p-2 border rounded" 
                value={form.nombre}
                onChange={handleChange}
            />
          </div>
          
          {/* Capital */}
          <div className="flex flex-col">
            <label htmlFor="comunidadCapital" className="text-sm font-medium text-gray-600">Capital</label>
            <input 
                id="comunidadCapital" 
                type="text" 
                placeholder="Capital" 
                className="p-2 border rounded" 
                value={form.capital}
                onChange={handleChange}
            />
          </div>

          {/* Activo Checkbox */}
          <div className="flex items-center mt-2">
            <input 
                id="comunidadActivo" 
                type="checkbox" 
                className="w-4 h-4 mr-2 text-green-600 border-gray-300 rounded focus:ring-green-500"
                checked={form.activo}
                onChange={handleChange}
            />
            <label htmlFor="comunidadActivo" className="text-sm font-medium text-gray-700">Activo</label>
          </div>
          
          {/* Fecha Creación (Disabled) */}
          <div className="flex flex-col">
            <label htmlFor="comunidadFechaCreacion" className="text-sm font-medium text-gray-600">Fecha Creación</label>
            <input 
                id="comunidadFechaCreacion" 
                type="text" 
                disabled 
                className="p-2 bg-gray-100 border rounded"
                value={form.fechaCreacion || 'Auto'}
            />
          </div>
          
          {/* Fecha Actualización (Disabled) */}
          <div className="flex flex-col">
            <label htmlFor="comunidadFechaActualizacion" className="text-sm font-medium text-gray-600">Fecha Actualización</label>
            <input 
                id="comunidadFechaActualizacion" 
                type="text" 
                disabled 
                className="p-2 bg-gray-100 border rounded"
                value={form.fechaActualizacion || 'Auto'}
            />
          </div>
        </div>
        
        {/* Botones de Acción */}
        <div className="flex mt-6 space-x-2">
          <button 
            className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:bg-indigo-300"
            onClick={handleCrear}
            disabled={!!form.idComunidad} 
          >
            Crear
          </button>
          <button 
            className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700 disabled:bg-gray-300"
            onClick={handleActualizar}
            disabled={!form.idComunidad} 
          >
            Actualizar
          </button>
          <button 
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            onClick={handleBuscar}
          >
            Buscar por ID
          </button>
          <button 
            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 disabled:bg-red-300"
            onClick={handleEliminar}
            disabled={!form.idComunidad || !form.activo} 
          >
            Eliminar
          </button>
        </div>
        
        {/* Área de Respuesta */}
        <label className="block mt-4 text-sm font-medium text-gray-600">Respuesta</label>
        <pre id="comunidadResult" className="p-3 mt-1 overflow-auto text-sm bg-gray-100 rounded min-h-[100px] whitespace-pre-wrap">
          {result}
        </pre>
      </div>

      {/* Listado de Comunidades */}
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-700">
          Listado de Comunidades Activas <span className="bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full ml-2">{comunidades.length}</span>
        </h3>
        <div id="comunidadList" className="list border p-3 rounded min-h-[50px]">
          {comunidades.length === 0 ? (
            <small className="text-gray-500">No hay comunidades cargadas.</small>
          ) : (
            <ul className="space-y-1">
              {comunidades.map(c => (
                <li 
                  key={c.idComunidad} 
                  className={`p-2 text-sm border-b cursor-pointer ${c.activo ? 'bg-white hover:bg-gray-50' : 'bg-red-50 text-gray-500 line-through'}`}
                  onClick={() => setForm({
                    idComunidad: c.idComunidad,
                    codigo: c.codigo,
                    nombre: c.nombre,
                    capital: c.capital,
                    activo: c.activo,
                    fechaCreacion: c.fechaCreacion,
                    fechaActualizacion: c.fechaActualizacion,
                  })}
                >
                  <span className={`font-bold ${c.activo ? 'text-green-600' : 'text-red-500'}`}>
                    [{c.activo ? 'ACTIVO' : 'INACTIVO'}]
                  </span> 
                  ID: {c.idComunidad} | {c.codigo} - {c.nombre} ({c.capital})
                </li>
              ))}
            </ul>
          )}
        </div>
        <button 
            className="px-4 py-2 mt-4 text-white bg-green-600 rounded hover:bg-green-700"
            onClick={loadComunidades}
        >
            Recargar Listado
        </button>
      </div>
    </div>
  );
};

export default Comunidad;