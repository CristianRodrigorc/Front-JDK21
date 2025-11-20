import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; 

const GRAPHQL_URL = import.meta.env.VITE_API_URL + '/graphql';

const Materia = () => {
    // --- Estados ---
    
    // Estado para los datos del formulario (MateriaDto)
    const [formData, setFormData] = useState({
        nombre: 'Programación Web',
        descripcion: 'Introducción a React y Spring Boot',
        activo: true, // Manejado en el frontend, pero la mutación solo usa nombre/descripcion
    });

    // Estado para el ID de búsqueda/edición
    const [materiaId, setMateriaId] = useState('');
    
    // Estado para la respuesta del API (log)
    const [result, setResult] = useState('Aquí verás las respuestas de las queries/mutations...');

    // Estado para la lista de materias
    const [materiasList, setMateriasList] = useState([]);

    // --- Manejadores de Formulario ---

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        
        // Mapeo de IDs de React a campos
        const fieldName = {
            materiaNombre: 'nombre',
            materiaDescripcion: 'descripcion',
            materiaActivo: 'activo'
        }[id] || id;

        setFormData(prev => ({
            ...prev,
            [fieldName]: type === 'checkbox' ? checked : value
        }));
    };

    const resetForm = () => {
        setMateriaId('');
        setFormData({
            nombre: '',
            descripcion: '',
            activo: true,
        });
        setResult('Formulario limpiado. Listo para una nueva operación.');
        toast.info('Formulario de materia reiniciado.');
    };

    // --- Funciones CRUD GraphQL (con Toastify y useCallback) ---

    // 1. Cargar todas las materias (QUERY: retornarTodasMaterias)
    const loadMaterias = useCallback(async () => {
        setResult('Cargando materias (GraphQL)...');
        const GQL_QUERY = `
            query {
                retornarTodasMaterias {
                    idMateria
                    nombre
                    descripcion
                    activo
                }
            }
        `;
        try {
            const response = await axios.post(GRAPHQL_URL, { query: GQL_QUERY });
            
            const data = response.data.data;
            if (data && data.retornarTodasMaterias) {
                // Filtramos las activas para la lista visible (asumiendo que solo se listan activas)
                const activeMaterias = data.retornarTodasMaterias.filter(m => m.activo); 
                setMateriasList(activeMaterias);
                setResult(`✅ Listado de materias cargado. Total: ${activeMaterias.length} activas.`);
                toast.success(`Cargadas ${activeMaterias.length} materias activas.`);
            } else {
                setResult('⚠️ No se encontraron materias o error en la respuesta GraphQL.');
                toast.warn('No se encontraron materias.');
            }
        } catch (error) {
            let errorMessage = error.message;
            if (error.message === 'Network Error') {
                errorMessage = `❌ ERROR DE CONEXIÓN: Verifica el Backend y CORS.`;
            } else {
                errorMessage = error.response?.data?.errors?.[0]?.message || error.message;
            }
            
            setResult(`❌ Error al cargar la lista:\n${errorMessage}`);
            setMateriasList([]);
            toast.error('Error al cargar la lista de materias.');
        }
    }, []);

    // 2. Crear una nueva materia (MUTATION: crearMateria)
    const createMateria = async () => {
        if (!formData.nombre || !formData.descripcion) {
            toast.warn('El Nombre y la Descripción son obligatorios.');
            return;
        }

        setResult('Creando materia (GraphQL)...');
        const GQL_MUTATION = `
            mutation CrearMateria($input: MateriaInput!) {
                crearMateria(input: $input) {
                    idMateria
                    nombre
                }
            }
        `;

        // Solo enviamos los campos que acepta el MateriaInput
        const inputPayload = {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
        };
        
        try {
            const response = await axios.post(GRAPHQL_URL, {
                query: GQL_MUTATION,
                variables: { input: inputPayload }
            });

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }
            
            const createdMateria = response.data.data.crearMateria;
            setResult(`✅ Materia creada (ID: ${createdMateria.idMateria}):\n${JSON.stringify(createdMateria, null, 2)}`);
            toast.success(`Materia "${createdMateria.nombre}" creada con éxito.`);
            resetForm(); 
            loadMaterias();
        } catch (error) {
            setResult('❌ Error al crear:\n' + (error.message || 'Error desconocido.'));
            toast.error('Fallo al crear la materia.');
        }
    };

    // 3. Buscar materia por ID (QUERY: materiaPorId)
    const getMateriaById = async () => {
        const id = parseInt(materiaId);
        if (isNaN(id) || !materiaId) {
            setResult('⚠️ Por favor, introduce un ID de materia válido para buscar.');
            toast.warn('Debe introducir un ID válido para buscar.');
            return;
        }
        setResult(`Buscando materia con ID ${id} (GraphQL)...`);
        const GQL_QUERY = `
            query MateriaPorId($id: ID!) {
                materiaPorId(id: $id) {
                    idMateria
                    nombre
                    descripcion
                    activo
                    fechaCreacion
                    fechaActualizacion
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

            const foundMateria = response.data.data.materiaPorId;
            
            if (foundMateria) {
                setResult(`✅ Materia encontrada:\n${JSON.stringify(foundMateria, null, 2)}`);
                
                // Cargar los datos encontrados al formulario para edición
                setFormData({
                    nombre: foundMateria.nombre,
                    descripcion: foundMateria.descripcion,
                    activo: foundMateria.activo,
                });
                setMateriaId(foundMateria.idMateria.toString());
                toast.info(`Materia "${foundMateria.nombre}" cargada para edición.`);
            } else {
                setResult(`⚠️ Materia con ID ${id} no encontrada.`);
                toast.warn(`Materia con ID ${id} no encontrada.`);
            }
        } catch (error) {
            setResult('❌ Error al buscar:\n' + (error.message || 'Error desconocido.'));
            toast.error('Fallo al buscar la materia.');
        }
    };

    // 4. Actualizar materia (MUTATION: actualizarMateria)
    const updateMateria = async () => {
        const id = parseInt(materiaId);
        if (isNaN(id)) {
            setResult('⚠️ Introduce un ID válido en el campo de búsqueda para actualizar.');
            toast.warn('Debe introducir un ID para actualizar.');
            return;
        }
        setResult(`Actualizando materia con ID ${id} (GraphQL)...`);
        const GQL_MUTATION = `
            mutation ActualizarMateria($id: ID!, $input: MateriaInput!) {
                actualizarMateria(id: $id, input: $input) {
                    idMateria
                    nombre
                    fechaActualizacion
                }
            }
        `;

        // Solo enviamos los campos que acepta el MateriaInput del backend
        const inputPayload = {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
        };
        
        try {
            const response = await axios.post(GRAPHQL_URL, {
                query: GQL_MUTATION,
                variables: { id: id, input: inputPayload }
            });

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }
            
            const updatedMateria = response.data.data.actualizarMateria;
            setResult(`✅ Materia actualizada (ID: ${updatedMateria.idMateria}):\n${JSON.stringify(updatedMateria, null, 2)}`);
            toast.success(`Materia ID ${id} actualizada correctamente.`);
            loadMaterias();
        } catch (error) {
            setResult('❌ Error al actualizar:\n' + (error.message || 'Error desconocido.'));
            toast.error('Fallo al actualizar la materia.');
        }
    };

    // 5. Eliminar materia (MUTATION: eliminarMateria - Soft Delete)
    const deleteMateria = async () => {
        const id = parseInt(materiaId);
        if (isNaN(id) || !window.confirm(`¿Seguro que desea ELIMINAR (desactivar) la materia con ID ${id}?`)) {
            return;
        }
        
        setResult(`Eliminando (Soft Delete) materia con ID ${id} (GraphQL)...`);
        const GQL_MUTATION = `
            mutation EliminarMateria($id: ID!) {
                eliminarMateria(id: $id) {
                    idMateria
                    activo
                }
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
            
            const deletedMateria = response.data.data.eliminarMateria;

            if (deletedMateria && deletedMateria.activo === false) { 
                setResult(`✅ Materia con ID ${id} desactivada (eliminada lógicamente) correctamente.`);
                toast.success(`Materia ID ${id} desactivada.`);
                resetForm(); 
                loadMaterias();
            } else {
                setResult(`⚠️ No se pudo desactivar la materia con ID ${id}.`);
                toast.warn(`No se pudo desactivar la materia ID ${id}.`);
            }
        } catch (error) {
            setResult('❌ Error al eliminar:\n' + (error.message || 'Error desconocido.'));
            toast.error('Fallo al desactivar la materia.');
        }
    };


    // Cargar materias al montar el componente
    useEffect(() => {
        loadMaterias();
    }, [loadMaterias]); 

    // --- Renderizado JSX ---

    return (
        <div className="p-8">
            <h2 className="pb-2 mb-6 text-3xl font-bold text-gray-800 border-b">
                📚 Gestión de Materias (GraphQL CRUD)
            </h2>
            
            <div className="p-6 mb-8 bg-white rounded-lg shadow-lg">
                <h3 className="mb-4 text-xl font-semibold text-gray-700">Formulario Materia</h3>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    
                    {/* ID de Búsqueda/Acción */}
                    <div className="flex flex-col">
                        <label htmlFor="materiaId" className="text-sm font-medium text-gray-600">ID (Auto-generado / Búsqueda)</label>
                        <input 
                            id="materiaId" 
                            type="text" 
                            placeholder="ID" 
                            value={materiaId}
                            onChange={(e) => setMateriaId(e.target.value)}
                            className="p-2 border rounded" 
                        />
                    </div>
                    
                    {/* Nombre */}
                    <div className="flex flex-col">
                        <label htmlFor="materiaNombre" className="text-sm font-medium text-gray-600">Nombre</label>
                        <input id="materiaNombre" type="text" value={formData.nombre} onChange={handleChange} className="p-2 border rounded" />
                    </div>

                    {/* Descripción */}
                    <div className="flex flex-col md:col-span-2">
                        <label htmlFor="materiaDescripcion" className="text-sm font-medium text-gray-600">Descripción</label>
                        <textarea id="materiaDescripcion" value={formData.descripcion} onChange={handleChange} rows="3" className="p-2 border rounded"></textarea>
                    </div>
                    
                    {/* Activo (Para visualización o futuro uso) */}
                    <div className="flex items-center mt-2">
                        <input 
                            id="materiaActivo" 
                            type="checkbox" 
                            checked={formData.activo}
                            onChange={handleChange}
                            className="w-4 h-4 mr-2 text-green-600 border-gray-300 rounded focus:ring-green-500" 
                        />
                        <label htmlFor="materiaActivo" className="text-sm font-medium text-gray-700">Activo</label>
                    </div>

                    {/* Fechas (Solo visualización) */}
                    <div className="flex flex-col">
                        <label htmlFor="materiaFechaCreacion" className="text-sm font-medium text-gray-600">Fecha Creación</label>
                        <input id="materiaFechaCreacion" type="text" disabled defaultValue="Auto (DB)" className="p-2 bg-gray-100 border rounded" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="materiaFechaActualizacion" className="text-sm font-medium text-gray-600">Fecha Actualización</label>
                        <input id="materiaFechaActualizacion" type="text" disabled defaultValue="Auto (DB)" className="p-2 bg-gray-100 border rounded" />
                    </div>
                </div>
                
                <div className="flex mt-6 space-x-2">
                    <button onClick={createMateria} className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700">Crear</button>
                    <button onClick={updateMateria} className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500">Actualizar</button>
                    <button onClick={getMateriaById} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Buscar por ID</button>
                    <button onClick={deleteMateria} className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">Eliminar (Desactivar)</button>
                    <button onClick={resetForm} className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">Limpiar</button>
                </div>
                
                <label className="block mt-4 text-sm font-medium text-gray-600">Respuesta</label>
                <pre id="materiaResult" className="p-3 mt-1 overflow-auto text-sm whitespace-pre-wrap bg-gray-100 rounded">
                    {result}
                </pre>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-lg">
                <h3 className="mb-4 text-xl font-semibold text-gray-700">
                    Listado de Materias Activas <span className="px-2.5 py-0.5 ml-2 text-xs font-semibold text-green-800 bg-green-200 rounded-full">{materiasList.length}</span>
                </h3>
                <div id="materiaList" className="p-3 border rounded min-h-[50px]">
                    {materiasList.length > 0 ? (
                        <ul className="space-y-1">
                            {materiasList.map(m => (
                                <li 
                                    key={m.idMateria} 
                                    className="p-1 text-sm text-gray-700 border-b cursor-pointer last:border-b-0 hover:bg-green-50"
                                    onClick={() => setMateriaId(m.idMateria.toString())} // Usabilidad: carga el ID al hacer clic
                                >
                                    <span className="font-bold text-green-600">ID: {m.idMateria}</span> - **{m.nombre}** </li>
                            ))}
                        </ul>
                    ) : (
                        <small className="text-gray-500">Cargando materias...</small>
                    )}
                </div>
                <button onClick={loadMaterias} className="px-4 py-2 mt-4 text-white bg-green-600 rounded hover:bg-green-700">Recargar Listado</button>
            </div>
        </div>
    );
};

export default Materia;