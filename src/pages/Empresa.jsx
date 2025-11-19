import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; 

// URL única para todas las peticiones GraphQL (Backend)
const GRAPHQL_URL = 'http://localhost:8080/graphql';

const Empresa = () => {
    // --- Estados ---
    
    // Estado para los datos del formulario (debe coincidir con los campos de la entidad, incluyendo los extras del formulario)
    const [formData, setFormData] = useState({
        // Campos principales (EmpresaInput en GraphQL)
        cif: 'A12345678', 
        nombreLegal: 'Academia JDK21',
        razonSocial: 'Formación Profesional',
        representante: 'Yo mismo',
        
        // Campos extra del formulario (no en el input de GraphQL, pero mantenidos)
        telefono: '987654321',
        email: 'info@academia.es',
        web: 'www.academia.es',
        direccion: 'C/ Gran Vía',
        numero: '10',
        piso: '2',
        puerta: 'B',
        codPostal: '28013',
        localidad: 'Madrid',
        provincia: 'Madrid',
        idComunidad: '1', // Suponemos que es un string o ID
        
        // Estado de actividad (Activo)
        activo: true,
    });

    // Estado para el ID de búsqueda/edición
    const [empresaId, setEmpresaId] = useState('');
    
    // Estado para la respuesta del API (log)
    const [result, setResult] = useState('Aquí verás las respuestas de las queries/mutations...');

    // Estado para la lista de empresas
    const [empresasList, setEmpresasList] = useState([]);

    // --- Mapeo y Manejadores ---

    const FIELD_MAPPING = {
        empresaCif: 'cif',
        empresaNombreLegal: 'nombreLegal',
        empresaRazonSocial: 'razonSocial',
        empresaRepresentante: 'representante',
        empresaTelefono: 'telefono',
        empresaEmail: 'email',
        empresaWeb: 'web',
        empresaDireccion: 'direccion',
        empresaNumero: 'numero',
        empresaPiso: 'piso',
        empresaPuerta: 'puerta',
        empresaCodPostal: 'codPostal',
        empresaLocalidad: 'localidad',
        empresaProvincia: 'provincia',
        empresaIdComunidad: 'idComunidad',
        empresaActivo: 'activo',
    };

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        
        const fieldName = FIELD_MAPPING[id] || id;

        setFormData(prev => ({
            ...prev,
            // Los campos como numero, piso, puerta, idComunidad se mantienen como strings aquí.
            [fieldName]: type === 'checkbox' ? checked : value
        }));
    };

    const resetForm = () => {
        setEmpresaId('');
        setFormData({
            cif: '', 
            nombreLegal: '',
            razonSocial: '',
            representante: '',
            telefono: '',
            email: '',
            web: '',
            direccion: '',
            numero: '',
            piso: '',
            puerta: '',
            codPostal: '',
            localidad: '',
            provincia: '',
            idComunidad: '',
            activo: true,
        });
        setResult('Formulario limpiado. Listo para una nueva operación.');
        toast.info('Formulario de empresa reiniciado.');
    };

    // --- Funciones CRUD GraphQL (con Toastify y useCallback) ---
    
    // 1. Cargar todas las empresas (QUERY)
    const loadEmpresas = useCallback(async () => {
        setResult('Cargando empresas (GraphQL)...');
        const GQL_QUERY = `
            query {
                allEmpresas {
                    id
                    cif
                    nombreLegal
                    razonSocial
                    representante
                }
            }
        `;
        try {
            const response = await axios.post(GRAPHQL_URL, { query: GQL_QUERY });
            
            const data = response.data.data;
            if (data && data.allEmpresas) {
                setEmpresasList(data.allEmpresas);
                setResult(`✅ Listado de empresas cargado. Total: ${data.allEmpresas.length}`);
                toast.success(`Cargadas ${data.allEmpresas.length} empresas.`);
            } else {
                setResult('⚠️ No se encontraron empresas o error en la respuesta GraphQL.');
                toast.warn('No se encontraron empresas.');
            }
        } catch (error) {
            let errorMessage = error.message;
            if (error.message === 'Network Error') {
                errorMessage = `❌ ERROR DE CONEXIÓN: Verifica el Backend y CORS.`;
            } else {
                errorMessage = error.response?.data?.errors?.[0]?.message || error.message;
            }
            
            setResult(`❌ Error al cargar la lista:\n${errorMessage}`);
            setEmpresasList([]);
            toast.error('Error al cargar la lista de empresas.');
        }
    }, []);

    // 2. Crear una nueva empresa (MUTATION)
    const createEmpresa = async () => {
        if (!formData.cif || !formData.nombreLegal) {
            toast.warn('El CIF y el Nombre Legal son obligatorios.');
            return;
        }

        setResult('Creando empresa (GraphQL)...');
        const GQL_MUTATION = `
            mutation CreateEmpresa($input: EmpresaInput!) {
                createEmpresa(input: $input) {
                    id
                    nombreLegal
                }
            }
        `;

        // Solo enviamos los campos que acepta el EmpresaInput del backend
        const inputPayload = {
            cif: formData.cif,
            nombreLegal: formData.nombreLegal,
            razonSocial: formData.razonSocial,
            representante: formData.representante,
            // Los demás campos del formulario NO se envían aquí
        };
        
        try {
            const response = await axios.post(GRAPHQL_URL, {
                query: GQL_MUTATION,
                variables: { input: inputPayload }
            });

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }
            
            const createdEmpresa = response.data.data.createEmpresa;
            setResult(`✅ Empresa creada (ID: ${createdEmpresa.id}):\n${JSON.stringify(createdEmpresa, null, 2)}`);
            toast.success(`Empresa "${createdEmpresa.nombreLegal}" creada con éxito.`);
            resetForm(); 
            loadEmpresas();
        } catch (error) {
            setResult('❌ Error al crear:\n' + (error.message || 'Error desconocido.'));
            toast.error('Fallo al crear la empresa.');
        }
    };

    // 3. Buscar empresa por ID (QUERY)
    const getEmpresaById = async () => {
        const id = parseInt(empresaId);
        if (isNaN(id) || !empresaId) {
            setResult('⚠️ Por favor, introduce un ID de empresa válido para buscar.');
            toast.warn('Debe introducir un ID válido para buscar.');
            return;
        }
        setResult(`Buscando empresa con ID ${id} (GraphQL)...`);
        const GQL_QUERY = `
            query EmpresaById($id: ID!) {
                empresaById(id: $id) {
                    id
                    cif
                    nombreLegal
                    razonSocial
                    representante
                }
            }
        `;
        
        try {
            const response = await axios.post(GRAPHQL_URL, { 
                query: GQL_QUERY,
                variables: { id: id }
            });
            
            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }

            const foundEmpresa = response.data.data.empresaById;
            
            if (foundEmpresa) {
                setResult(`✅ Empresa encontrada:\n${JSON.stringify(foundEmpresa, null, 2)}`);
                
                // Cargar los datos encontrados al formulario para edición (solo los que vienen en el response)
                setFormData(prev => ({
                    ...prev, // Mantiene los campos extra no devueltos
                    cif: foundEmpresa.cif,
                    nombreLegal: foundEmpresa.nombreLegal,
                    razonSocial: foundEmpresa.razonSocial || '',
                    representante: foundEmpresa.representante || '',
                }));
                setEmpresaId(foundEmpresa.id.toString());
                toast.info(`Empresa "${foundEmpresa.nombreLegal}" cargada para edición.`);
            } else {
                setResult(`⚠️ Empresa con ID ${id} no encontrada.`);
                toast.warn(`Empresa con ID ${id} no encontrada.`);
            }
        } catch (error) {
            setResult('❌ Error al buscar:\n' + (error.message || 'Error desconocido.'));
            toast.error('Fallo al buscar la empresa.');
        }
    };

    // 4. Actualizar empresa (MUTATION)
    const updateEmpresa = async () => {
        const id = parseInt(empresaId);
        if (isNaN(id)) {
            setResult('⚠️ Introduce un ID válido en el campo de búsqueda para actualizar.');
            toast.warn('Debe introducir un ID para actualizar.');
            return;
        }
        setResult(`Actualizando empresa con ID ${id} (GraphQL)...`);
        const GQL_MUTATION = `
            mutation UpdateEmpresa($id: ID!, $input: EmpresaInput!) {
                updateEmpresa(id: $id, input: $input) {
                    id
                    nombreLegal
                }
            }
        `;

        // Solo enviamos los campos que acepta el EmpresaInput del backend
        const inputPayload = {
            cif: formData.cif,
            nombreLegal: formData.nombreLegal,
            razonSocial: formData.razonSocial,
            representante: formData.representante,
        };
        
        try {
            const response = await axios.post(GRAPHQL_URL, {
                query: GQL_MUTATION,
                variables: { id: id, input: inputPayload }
            });

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }
            
            const updatedEmpresa = response.data.data.updateEmpresa;
            setResult(`✅ Empresa actualizada (ID: ${updatedEmpresa.id}):\n${JSON.stringify(updatedEmpresa, null, 2)}`);
            toast.success(`Empresa ID ${id} actualizada correctamente.`);
            loadEmpresas();
        } catch (error) {
            setResult('❌ Error al actualizar:\n' + (error.message || 'Error desconocido.'));
            toast.error('Fallo al actualizar la empresa.');
        }
    };

    // 5. Eliminar empresa (MUTATION)
    const deleteEmpresa = async () => {
        const id = parseInt(empresaId);
        if (isNaN(id) || !window.confirm(`¿Seguro que desea ELIMINAR la empresa con ID ${id}?`)) {
            return;
        }
        
        setResult(`Eliminando empresa con ID ${id} (GraphQL)...`);
        const GQL_MUTATION = `
            mutation DeleteEmpresa($id: ID!) {
                deleteEmpresa(id: $id)
            }
        `;
        
        try {
            const response = await axios.post(GRAPHQL_URL, { 
                query: GQL_MUTATION,
                variables: { id: id }
            });

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }
            
            // El backend retorna Boolean, esperamos 'true' si fue exitoso
            if (response.data.data.deleteEmpresa) { 
                setResult(`✅ Empresa con ID ${id} eliminada correctamente.`);
                toast.success(`Empresa ID ${id} eliminada.`);
                resetForm(); 
                loadEmpresas();
            } else {
                setResult(`⚠️ No se pudo eliminar la empresa con ID ${id}.`);
                toast.warn(`No se pudo eliminar la empresa ID ${id}.`);
            }
        } catch (error) {
            setResult('❌ Error al eliminar:\n' + (error.message || 'Error desconocido.'));
            toast.error('Fallo al eliminar la empresa.');
        }
    };


    // Cargar empresas al montar el componente
    useEffect(() => {
        loadEmpresas();
    }, [loadEmpresas]); 

    // --- Renderizado JSX ---

    return (
        <div className="p-8">
            <h2 className="pb-2 mb-6 text-3xl font-bold text-gray-800 border-b">
                🏢 Gestión de Empresa (GraphQL CRUD)
            </h2>
            
            <div className="p-6 mb-8 bg-white rounded-lg shadow-lg">
                <h3 className="mb-4 text-xl font-semibold text-gray-700">Formulario Empresa</h3>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    
                    {/* ID de Búsqueda/Acción */}
                    <div className="flex flex-col">
                        <label htmlFor="empresaId" className="text-sm font-medium text-gray-600">ID (Auto-generado / Búsqueda)</label>
                        <input 
                            id="empresaId" 
                            type="text" 
                            placeholder="ID" 
                            value={empresaId}
                            onChange={(e) => setEmpresaId(e.target.value)}
                            className="p-2 border rounded" 
                        />
                    </div>
                    
                    {/* CIF (Obligatorio) */}
                    <div className="flex flex-col">
                        <label htmlFor="empresaCif" className="text-sm font-medium text-gray-600">CIF *</label>
                        <input id="empresaCif" type="text" value={formData.cif} onChange={handleChange} className="p-2 border rounded" />
                    </div>

                    {/* Nombre Legal (Obligatorio) */}
                    <div className="flex flex-col">
                        <label htmlFor="empresaNombreLegal" className="text-sm font-medium text-gray-600">Nombre Legal *</label>
                        <input id="empresaNombreLegal" type="text" value={formData.nombreLegal} onChange={handleChange} className="p-2 border rounded" />
                    </div>
                    
                    {/* Razón Social */}
                    <div className="flex flex-col">
                        <label htmlFor="empresaRazonSocial" className="text-sm font-medium text-gray-600">Razón Social</label>
                        <input id="empresaRazonSocial" type="text" value={formData.razonSocial} onChange={handleChange} className="p-2 border rounded" />
                    </div>

                    {/* Representante */}
                    <div className="flex flex-col">
                        <label htmlFor="empresaRepresentante" className="text-sm font-medium text-gray-600">Representante</label>
                        <input id="empresaRepresentante" type="text" value={formData.representante} onChange={handleChange} className="p-2 border rounded" />
                    </div>
                    
                    {/* Teléfono (Extras) */}
                    <div className="flex flex-col">
                        <label htmlFor="empresaTelefono" className="text-sm font-medium text-gray-600">Teléfono</label>
                        <input id="empresaTelefono" type="text" value={formData.telefono} onChange={handleChange} className="p-2 border rounded" />
                    </div>

                    {/* Email (Extras) */}
                    <div className="flex flex-col">
                        <label htmlFor="empresaEmail" className="text-sm font-medium text-gray-600">Email</label>
                        <input id="empresaEmail" type="email" value={formData.email} onChange={handleChange} className="p-2 border rounded" />
                    </div>

                    {/* Web (Extras) */}
                    <div className="flex flex-col">
                        <label htmlFor="empresaWeb" className="text-sm font-medium text-gray-600">Web</label>
                        <input id="empresaWeb" type="text" value={formData.web} onChange={handleChange} className="p-2 border rounded" />
                    </div>

                    {/* Dirección (Extras) */}
                    <div className="flex flex-col">
                        <label htmlFor="empresaDireccion" className="text-sm font-medium text-gray-600">Dirección</label>
                        <input id="empresaDireccion" type="text" value={formData.direccion} onChange={handleChange} className="p-2 border rounded" />
                    </div>

                    {/* Número (Extras) */}
                    <div className="flex flex-col">
                        <label htmlFor="empresaNumero" className="text-sm font-medium text-gray-600">Número</label>
                        <input id="empresaNumero" type="text" value={formData.numero} onChange={handleChange} className="p-2 border rounded" />
                    </div>

                    {/* Piso (Extras) */}
                    <div className="flex flex-col">
                        <label htmlFor="empresaPiso" className="text-sm font-medium text-gray-600">Piso</label>
                        <input id="empresaPiso" type="text" value={formData.piso} onChange={handleChange} className="p-2 border rounded" />
                    </div>

                    {/* Puerta (Extras) */}
                    <div className="flex flex-col">
                        <label htmlFor="empresaPuerta" className="text-sm font-medium text-gray-600">Puerta</label>
                        <input id="empresaPuerta" type="text" value={formData.puerta} onChange={handleChange} className="p-2 border rounded" />
                    </div>

                    {/* Cód. Postal (Extras) */}
                    <div className="flex flex-col">
                        <label htmlFor="empresaCodPostal" className="text-sm font-medium text-gray-600">Cód. Postal</label>
                        <input id="empresaCodPostal" type="text" value={formData.codPostal} onChange={handleChange} className="p-2 border rounded" />
                    </div>

                    {/* Localidad (Extras) */}
                    <div className="flex flex-col">
                        <label htmlFor="empresaLocalidad" className="text-sm font-medium text-gray-600">Localidad</label>
                        <input id="empresaLocalidad" type="text" value={formData.localidad} onChange={handleChange} className="p-2 border rounded" />
                    </div>

                    {/* Provincia (Extras) */}
                    <div className="flex flex-col">
                        <label htmlFor="empresaProvincia" className="text-sm font-medium text-gray-600">Provincia</label>
                        <input id="empresaProvincia" type="text" value={formData.provincia} onChange={handleChange} className="p-2 border rounded" />
                    </div>

                    {/* ID Comunidad Autónoma (Extras) */}
                    <div className="flex flex-col">
                        <label htmlFor="empresaIdComunidad" className="text-sm font-medium text-gray-600">ID Comunidad Autónoma</label>
                        <input id="empresaIdComunidad" type="text" value={formData.idComunidad} onChange={handleChange} className="p-2 border rounded" />
                    </div>
                    
                    {/* Activo */}
                    <div className="flex items-center mt-6">
                        <input 
                            id="empresaActivo" 
                            type="checkbox" 
                            checked={formData.activo}
                            onChange={handleChange} 
                            className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                        />
                        <label htmlFor="empresaActivo" className="text-sm font-medium text-gray-700">Activo</label>
                    </div>
                    
                    {/* Fechas (Solo visualización) */}
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
                    <button onClick={createEmpresa} className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700">Crear</button>
                    <button onClick={updateEmpresa} className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500">Actualizar</button>
                    <button onClick={getEmpresaById} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Buscar por ID</button>
                    <button onClick={deleteEmpresa} className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">Eliminar</button>
                    <button onClick={resetForm} className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">Limpiar</button>
                </div>
                
                <label className="block mt-4 text-sm font-medium text-gray-600">Respuesta</label>
                <pre id="empresaResult" className="p-3 mt-1 overflow-auto text-sm whitespace-pre-wrap bg-gray-100 rounded">
                    {result}
                </pre>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-lg">
                <h3 className="mb-4 text-xl font-semibold text-gray-700">
                    Listado de Empresas <span className="px-2.5 py-0.5 ml-2 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">{empresasList.length}</span>
                </h3>
                <div id="empresaList" className="p-3 border rounded min-h-[50px]">
                    {empresasList.length > 0 ? (
                        <ul className="space-y-1">
                            {empresasList.map(e => (
                                <li 
                                    key={e.id} 
                                    className="p-1 text-sm text-gray-700 border-b cursor-pointer last:border-b-0 hover:bg-yellow-50"
                                    onClick={() => setEmpresaId(e.id.toString())} // Usabilidad: carga el ID al hacer clic
                                >
                                    <span className="font-bold text-yellow-600">ID: {e.id}</span> - **{e.nombreLegal}** (CIF: {e.cif})
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <small className="text-gray-500">Cargando empresas...</small>
                    )}
                </div>
                <button onClick={loadEmpresas} className="px-4 py-2 mt-4 text-white bg-green-600 rounded hover:bg-green-700">Recargar Listado</button>
            </div>
        </div>
    );
};

export default Empresa;