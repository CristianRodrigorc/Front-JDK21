import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // <-- Importación de Toastify

// URL única para todas las peticiones GraphQL (Backend)
const GRAPHQL_URL = 'http://localhost:8080/graphql';

const Curso = () => {
    // --- Estados ---
    
    // Estado para los datos del formulario (debe coincidir con CursoDto en Spring Boot)
    const [formData, setFormData] = useState({
        idMateria: 1, 
        nombre: 'Master Desarrollo FullStack',
        descripcion: 'Curso intensivo de programación.',
        duracionHoras: 210, 
    });

    // Estado para el ID de búsqueda/edición
    const [cursoId, setCursoId] = useState('');
    
    // Estado para la respuesta del API (log)
    const [result, setResult] = useState('Aquí verás las respuestas de las queries/mutations...');

    // Estado para la lista de cursos
    const [cursosList, setCursosList] = useState([]);

    // --- Manejadores de Formulario ---

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        
        // Mapeo de IDs de React a campos de CursoDto
        const fieldName = {
            cursoNombre: 'nombre',
            cursoDescripcion: 'descripcion',
            cursoDuracion: 'duracionHoras',
            cursoIdMateria: 'idMateria',
            cursoActivo: 'activo'
        }[id] || id;

        setFormData(prev => ({
            ...prev,
            // Convierte a número o booleano según el tipo de input
            [fieldName]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value)
        }));
    };

    const resetForm = () => {
        setCursoId('');
        setFormData({
            idMateria: 1, 
            nombre: '',
            descripcion: '',
            duracionHoras: 0, 
            activo: true,
        });
        setResult('Formulario limpiado. Listo para una nueva operación.');
        toast.info('Formulario de curso reiniciado.'); // <-- Notificación
    };

    // --- Funciones CRUD GraphQL (con Toastify y useCallback) ---

    // 1. Cargar todos los cursos (QUERY)
    const loadCursos = useCallback(async () => { // <-- Uso de useCallback
        setResult('Cargando cursos (GraphQL)...');
        const GQL_QUERY = `
                query {
                    allCursos {
                        idCurso
                        nombre
                        duracionHoras
                    }
                }
        `;
        try {
            const response = await axios.post(GRAPHQL_URL, { query: GQL_QUERY });
            
            const data = response.data.data;
            if (data && data.allCursos) {
                setCursosList(data.allCursos);
                setResult(`✅ Listado de cursos cargado. Total: ${data.allCursos.length}`);
                toast.success(`Cargados ${data.allCursos.length} cursos.`); // <-- Notificación de éxito
            } else {
                setResult('⚠️ No se encontraron cursos o error en la respuesta GraphQL.');
                toast.warn('No se encontraron cursos.'); // <-- Notificación de advertencia
            }
        } catch (error) {
            let errorMessage = 'Error desconocido.';
            
            if (error.message === 'Network Error') {
                errorMessage = `❌ ERROR DE CONEXIÓN: Network Error. Verifica el Backend y CORS.`;
            } else {
                errorMessage = error.response?.data?.errors?.[0]?.message || error.message;
            }
            
            setResult(`❌ Error al cargar la lista:\n${errorMessage}`);
            setCursosList([]);
            toast.error('Error al cargar la lista de cursos.'); // <-- Notificación de error
        }
    }, []);

    // 2. Crear un nuevo curso (MUTATION)
    const createCurso = async () => {
        if (!formData.nombre || formData.duracionHoras <= 0) {
            toast.warn('El Nombre y la Duración son obligatorios y deben ser válidos.');
            return;
        }

        setResult('Creando curso (GraphQL)...');
        const GQL_MUTATION = `
            mutation CreateCurso($input: CursoInput!) {
                createCurso(input: $input) {
                    idCurso
                    nombre
                }
            }
        `;

        const inputPayload = {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            duracionHoras: formData.duracionHoras,
            idMateria: formData.idMateria,
        };
        
        try {
            const response = await axios.post(GRAPHQL_URL, {
                query: GQL_MUTATION,
                variables: { input: inputPayload }
            });

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }
            
            const createdCurso = response.data.data.createCurso;
            setResult(`✅ Curso creado (ID: ${createdCurso.id}):\n${JSON.stringify(createdCurso, null, 2)}`);
            toast.success(`Curso "${createdCurso.nombre}" creado con éxito.`); // <-- Notificación de éxito
            resetForm(); 
            loadCursos();
        } catch (error) {
            setResult('❌ Error al crear:\n' + (error.message || 'Error desconocido.'));
            toast.error('Fallo al crear el curso.'); // <-- Notificación de error
        }
    };

    // 3. Buscar curso por ID (QUERY)
    const getCursoById = async () => {
        const id = parseInt(cursoId);
        if (isNaN(id) || !cursoId) {
            setResult('⚠️ Por favor, introduce un ID de curso válido para buscar.');
            toast.warn('Debe introducir un ID válido para buscar.'); // <-- Notificación de advertencia
            return;
        }
        setResult(`Buscando curso con ID ${id} (GraphQL)...`);
        const GQL_QUERY = `
                query CursoById($id: ID!) {
                cursoById(id: $id) {
                    idCurso
                    idMateria
                    idFormato
                    nombre
                    descripcion
                    duracionHoras
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

            const foundCurso = response.data.data.cursoById;
            
            if (foundCurso) {
                setResult(`✅ Curso encontrado:\n${JSON.stringify(foundCurso, null, 2)}`);
                // Cargar los datos encontrados al formulario para edición
                setFormData({
                    idMateria: foundCurso.idMateria,
                    nombre: foundCurso.nombre,
                    descripcion: foundCurso.descripcion,
                    duracionHoras: foundCurso.duracionHoras,
                    activo: foundCurso.activo,
                });
                setCursoId(foundCurso.idCurso.toString());
                toast.info(`Curso "${foundCurso.nombre}" cargado para edición.`); // <-- Notificación
            } else {
                setResult(`⚠️ Curso con ID ${id} no encontrado.`);
                toast.warn(`Curso con ID ${id} no encontrado.`); // <-- Notificación de advertencia
            }
        } catch (error) {
            setResult('❌ Error al buscar:\n' + (error.message || 'Error desconocido.'));
            toast.error('Fallo al buscar el curso.'); // <-- Notificación de error
        }
    };

    // 4. Actualizar curso (MUTATION)
    const updateCurso = async () => {
        const id = parseInt(cursoId);
        if (isNaN(id)) {
            setResult('⚠️ Introduce un ID válido en el campo de búsqueda para actualizar.');
            toast.warn('Debe introducir un ID para actualizar.');
            return;
        }
        setResult(`Actualizando curso con ID ${id} (GraphQL)...`);
        const GQL_MUTATION = `
            mutation UpdateCurso($id: ID!, $input: CursoInput!) {
                updateCurso(id: $id, input: $input) {
                    idCurso
                    nombre
                }
            }
        `;

        const inputPayload = {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            duracionHoras: formData.duracionHoras,
            idMateria: formData.idMateria,
        };
        
        try {
            const response = await axios.post(GRAPHQL_URL, {
                query: GQL_MUTATION,
                variables: { id: id, input: inputPayload }
            });

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }
            
            const updatedCurso = response.data.data.updateCurso;
            setResult(`✅ Curso actualizado (ID: ${updatedCurso.id}):\n${JSON.stringify(updatedCurso, null, 2)}`);
            toast.success(`Curso ID ${id} actualizado correctamente.`); // <-- Notificación de éxito
            loadCursos();
        } catch (error) {
            setResult('❌ Error al actualizar:\n' + (error.message || 'Error desconocido.'));
            toast.error('Fallo al actualizar el curso.'); // <-- Notificación de error
        }
    };

    // 5. Eliminar curso (MUTATION)
    const deleteCurso = async () => {
        const id = parseInt(cursoId);
        if (isNaN(id) || !window.confirm(`¿Seguro que desea ELIMINAR el curso con ID ${id}?`)) {
            return;
        }
        
        setResult(`Eliminando curso con ID ${id} (GraphQL)...`);
        const GQL_MUTATION = `
            mutation DeleteCurso($id: ID!) {
                deleteCurso(id: $id)
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
            
            if (response.data.data.deleteCurso) { // Si retorna true (o el ID)
                setResult(`✅ Curso con ID ${id} eliminado correctamente.`);
                toast.success(`Curso ID ${id} eliminado.`); // <-- Notificación de éxito
                resetForm(); 
                loadCursos();
            } else {
                setResult(`⚠️ No se pudo eliminar el curso con ID ${id}.`);
                toast.warn(`No se pudo eliminar el curso ID ${id}.`); // <-- Notificación de advertencia
            }
        } catch (error) {
            setResult('❌ Error al eliminar:\n' + (error.message || 'Error desconocido.'));
            toast.error('Fallo al eliminar el curso.'); // <-- Notificación de error
        }
    };


    // Cargar cursos al montar el componente
    useEffect(() => {
        loadCursos();
    }, [loadCursos]); // Dependencia para useCallback

    // --- Renderizado JSX ---

    return (
        <div className="p-8">
            <h2 className="pb-2 mb-6 text-3xl font-bold text-gray-800 border-b">
                🗓️ Gestión de Cursos (GraphQL CRUD)
            </h2>
            
            <div className="p-6 mb-8 bg-white rounded-lg shadow-lg">
                <h3 className="mb-4 text-xl font-semibold text-gray-700">Formulario Curso</h3>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    
                    {/* Campo ID de Búsqueda/Acción */}
                    <div className="flex flex-col">
                        <label htmlFor="cursoId" className="text-sm font-medium text-gray-600">ID (para Update/Delete/Get)</label>
                        <input 
                            id="cursoId" 
                            type="text" 
                            placeholder="ID" 
                            value={cursoId}
                            onChange={(e) => setCursoId(e.target.value)}
                            className="p-2 border rounded" 
                        />
                    </div>

                    {/* Nombre */}
                    <div className="flex flex-col">
                        <label htmlFor="cursoNombre" className="text-sm font-medium text-gray-600">Nombre</label>
                        <input id="cursoNombre" type="text" value={formData.nombre} onChange={handleChange} className="p-2 border rounded" />
                    </div>
                    
                    {/* ID Materia */}
                    <div className="flex flex-col">
                        <label htmlFor="cursoIdMateria" className="text-sm font-medium text-gray-600">ID Materia</label>
                        <input id="cursoIdMateria" type="number" value={formData.idMateria} onChange={handleChange} className="p-2 border rounded" />
                    </div>

                    {/* Duración (Horas) */}
                    <div className="flex flex-col">
                        <label htmlFor="cursoDuracion" className="text-sm font-medium text-gray-600">Duración (Horas)</label>
                        <input id="cursoDuracion" type="number" value={formData.duracionHoras} onChange={handleChange} className="p-2 border rounded" />
                    </div>

                    {/* Descripción */}
                    <div className="flex flex-col md:col-span-2">
                        <label htmlFor="cursoDescripcion" className="text-sm font-medium text-gray-600">Descripción</label>
                        <textarea id="cursoDescripcion" value={formData.descripcion} onChange={handleChange} rows="3" className="p-2 border rounded"></textarea>
                    </div>
                    
                    {/* Activo */}
                    <div className="flex items-center mt-2">
                        <input 
                            id="cursoActivo" 
                            type="checkbox" 
                            checked={formData.activo}
                            onChange={handleChange}
                            className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                        />
                        <label htmlFor="cursoActivo" className="text-sm font-medium text-gray-700">Activo</label>
                    </div>
                    
                    {/* Fechas (Solo visualización) */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">Fecha Creación</label>
                        <input type="text" disabled defaultValue="Auto (DB)" className="p-2 bg-gray-100 border rounded" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">Fecha Actualización</label>
                        <input type="text" disabled defaultValue="Auto (DB)" className="p-2 bg-gray-100 border rounded" />
                    </div>
                </div>
                
                <div className="flex mt-6 space-x-2">
                    <button onClick={createCurso} className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700">Crear</button>
                    <button onClick={updateCurso} className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500">Actualizar</button>
                    <button onClick={getCursoById} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Buscar por ID</button>
                    <button onClick={deleteCurso} className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">Eliminar</button>
                    <button onClick={resetForm} className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">Limpiar</button>
                </div>
                
                <label className="block mt-4 text-sm font-medium text-gray-600">Respuesta</label>
                <pre id="cursoResult" className="p-3 mt-1 overflow-auto text-sm whitespace-pre-wrap bg-gray-100 rounded">
                    {result}
                </pre>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-lg">
                <h3 className="mb-4 text-xl font-semibold text-gray-700">
                    Listado de Cursos <span className="px-2.5 py-0.5 ml-2 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">{cursosList.length}</span>
                </h3>
                <div id="cursoList" className="p-3 border rounded min-h-[50px]">
                    {cursosList.length > 0 ? (
                        <ul className="space-y-1">
                            {cursosList.map(c => (
                                <li 
                                    key={c.idCurso} 
                                    className="p-1 text-sm text-gray-700 border-b cursor-pointer last:border-b-0 hover:bg-yellow-50"
                                    onClick={() => setCursoId(c.idCurso.toString())} // <-- Usabilidad: carga el ID al hacer clic
                                >
                                    <span className="font-bold text-yellow-600">ID: {c.idCurso}</span> - **{c.nombre}** ({c.duracionHoras} hrs)
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <small className="text-gray-500">Cargando cursos...</small>
                    )}
                </div>
                <button onClick={loadCursos} className="px-4 py-2 mt-4 text-white bg-green-600 rounded hover:bg-green-700">Recargar Listado</button>
            </div>
        </div>
    );
};

export default Curso;