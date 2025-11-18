import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; 

// URL única para todas las peticiones GraphQL
const GRAPHQL_URL = 'http://localhost:8080/graphql';

// Estado inicial del formulario reflejando los campos del Profesor
const initialFormData = {
    nombre: 'Juan',
    apellidos: 'Perez García',
    telefono: '600123456',
    email: 'juan.perez@test.es',
    contrasenia: 'pass123', // Necesario para crear
    direccion: 'C/ Principal, 10',
    localidad: 'Madrid',
    provincia: 'Madrid',
    activo: true,
    fechaNacimiento: '1990-01-01', // Aunque no está en GQL, lo mantenemos en el estado
};

const Profesor = () => {
    // --- Estados ---
    const [formData, setFormData] = useState(initialFormData);
    const [profesorId, setProfesorId] = useState('');
    const [result, setResult] = useState('Aquí verás las respuestas de las queries/mutations...');
    const [profesoresList, setProfesoresList] = useState([]);

    // --- Mapeo y Manejo de Formulario ---
    const formFieldMap = {
        profesorNombre: 'nombre',
        profesorApellidos: 'apellidos',
        profesorTelefono: 'telefono',
        profesorEmail: 'email',
        profesorContrasenia: 'contrasenia',
        profesorDireccion: 'direccion',
        profesorLocalidad: 'localidad',
        profesorProvincia: 'provincia',
        profesorActivo: 'activo',
        profesorFechaNacimiento: 'fechaNacimiento',
    };

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        const fieldName = formFieldMap[id];
        
        if (fieldName) {
            setFormData(prev => ({
                ...prev,
                [fieldName]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const resetForm = () => {
        setProfesorId('');
        setFormData(initialFormData);
        setResult('Formulario de profesor reiniciado.');
        toast.info('Formulario limpiado.');
    };

    // --- Funciones de Utilidad GraphQL ---

    // Función genérica para enviar peticiones GraphQL
    const executeGQL = async (query, variables, operationName) => {
        setResult(`Ejecutando ${operationName} (GraphQL)...`);
        try {
            const response = await axios.post(GRAPHQL_URL, {
                query: query,
                variables: variables
            });

            if (response.data.errors) {
                // GraphQL devolvió errores
                const errorMsg = response.data.errors.map(e => e.message).join('\n');
                throw new Error(errorMsg);
            }

            const data = response.data.data;
            setResult(`✅ ${operationName} exitosa:\n${JSON.stringify(data, null, 2)}`);
            return data;

        } catch (error) {
            let errorMessage = error.message;
            if (error.response && error.response.data && error.response.data.errors) {
                errorMessage = error.response.data.errors.map(e => e.message).join('\n');
            } else if (error.message === 'Network Error') {
                errorMessage = '❌ ERROR DE CONEXIÓN: Verifica el Backend y CORS.';
            } else if (error.response) {
                errorMessage = error.response.data || error.response.statusText;
            }
            
            setResult(`❌ Error en ${operationName}:\n${errorMessage}`);
            toast.error(`Fallo en la operación: ${operationName}.`);
            return null;
        }
    };

    // 1. Cargar todos los profesores (QUERY: profesores)
    const loadProfesores = useCallback(async () => {
        const GQL_QUERY = `
            query {
                profesores {
                    idProfesor
                    nombre
                    apellidos
                    email
                    activo
                }
            }
        `;
        const data = await executeGQL(GQL_QUERY, {}, 'Listado de Profesores');
        
        if (data && data.profesores) {
            // Filtramos solo los profesores activos para la lista
            const activeProfesores = data.profesores.filter(p => p.activo);
            setProfesoresList(activeProfesores);
            setResult(`✅ Listado de profesores cargado. Total: ${activeProfesores.length} activos.`);
            toast.success(`Cargados ${activeProfesores.length} profesores activos.`);
        } else {
             setProfesoresList([]);
        }
    }, []);

    // 2. Buscar profesor por ID (QUERY: profesorById)
    const getProfesorById = async () => {
        const id = parseInt(profesorId);
        if (isNaN(id) || !profesorId) {
            toast.warn('Por favor, introduce un ID de profesor válido.');
            return;
        }
        
        const GQL_QUERY = `
            query ProfesorById($id: ID!) {
                profesorById(id: $id) {
                    idProfesor
                    nombre
                    apellidos
                    telefono
                    email
                    direccion
                    localidad
                    provincia
                    activo
                    # Contraseña no se trae por seguridad
                }
            }
        `;
        
        const data = await executeGQL(GQL_QUERY, { id: id }, `Búsqueda por ID ${id}`);
        
        if (data && data.profesorById) {
            const foundProfesor = data.profesorById;
            
            // Cargar los datos encontrados al formulario para edición
            setFormData({
                nombre: foundProfesor.nombre || '',
                apellidos: foundProfesor.apellidos || '',
                telefono: foundProfesor.telefono || '',
                email: foundProfesor.email || '',
                contrasenia: '', // No cargamos la contraseña, debe ser reingresada si se necesita.
                direccion: foundProfesor.direccion || '',
                localidad: foundProfesor.localidad || '',
                provincia: foundProfesor.provincia || '',
                activo: foundProfesor.activo,
                fechaNacimiento: initialFormData.fechaNacimiento, // Mantener valor por defecto o cargar si estuviera en el DTO
            });
            setProfesorId(foundProfesor.idProfesor.toString());
            toast.info(`Profesor "${foundProfesor.nombre}" cargado para edición.`);
        } else if (data) {
            toast.warn(`Profesor con ID ${id} no encontrado.`);
        }
    };

    // 3. Crear un nuevo profesor (MUTATION: crearProfesor)
    const createProfesor = async () => {
        // Validación mínima de campos obligatorios
        if (!formData.nombre || !formData.email || !formData.contrasenia) {
            toast.warn('Nombre, Email y Contraseña son obligatorios para crear.');
            return;
        }

        const GQL_MUTATION = `
            mutation CrearProfesor($nombre: String!, $apellidos: String, $telefono: String, $email: String!, $direccion: String, $localidad: String, $provincia: String, $contrasenia: String!) {
                crearProfesor(
                    nombre: $nombre, 
                    apellidos: $apellidos, 
                    telefono: $telefono, 
                    email: $email, 
                    direccion: $direccion, 
                    localidad: $localidad, 
                    provincia: $provincia, 
                    contrasenia: $contrasenia
                ) {
                    idProfesor
                    nombre
                    email
                }
            }
        `;

        const variables = {
            nombre: formData.nombre,
            apellidos: formData.apellidos,
            telefono: formData.telefono,
            email: formData.email,
            direccion: formData.direccion,
            localidad: formData.localidad,
            provincia: formData.provincia,
            contrasenia: formData.contrasenia,
        };
        
        const data = await executeGQL(GQL_MUTATION, variables, 'Creación de Profesor');
        
        if (data && data.crearProfesor) {
            toast.success(`Profesor "${data.crearProfesor.nombre}" creado con ID: ${data.crearProfesor.idProfesor}`);
            resetForm(); 
            loadProfesores();
        }
    };

    // 4. Actualizar profesor (MUTATION: actualizarProfesor)
    const updateProfesor = async (overrideActivo = null) => {
        const id = parseInt(profesorId);
        if (isNaN(id)) {
            toast.warn('Introduce un ID válido en el campo de búsqueda para actualizar.');
            return;
        }
        
        // Validación mínima de campos obligatorios
        if (!formData.nombre || !formData.email) {
            toast.warn('Nombre y Email son obligatorios para actualizar.');
            return;
        }

        const GQL_MUTATION = `
            mutation ActualizarProfesor($id: ID!, $nombre: String!, $apellidos: String, $telefono: String, $email: String!, $direccion: String, $localidad: String, $provincia: String, $activo: Boolean) {
                actualizarProfesor(
                    id: $id, 
                    nombre: $nombre, 
                    apellidos: $apellidos, 
                    telefono: $telefono, 
                    email: $email, 
                    direccion: $direccion, 
                    localidad: $localidad, 
                    provincia: $provincia, 
                    activo: $activo
                ) {
                    idProfesor
                    nombre
                    activo
                }
            }
        `;

        const variables = {
            id: id,
            nombre: formData.nombre,
            apellidos: formData.apellidos,
            telefono: formData.telefono,
            email: formData.email,
            direccion: formData.direccion,
            localidad: formData.localidad,
            provincia: formData.provincia,
            // Si overrideActivo es proporcionado (para Desactivar), úsalo. Si no, usa el valor del formulario.
            activo: overrideActivo !== null ? overrideActivo : formData.activo, 
        };
        
        const data = await executeGQL(GQL_MUTATION, variables, 'Actualización de Profesor');
        
        if (data && data.actualizarProfesor) {
            const statusMsg = overrideActivo === false ? 'desactivado' : 'actualizado';
            toast.success(`Profesor ID ${id} ${statusMsg} correctamente.`);
            // Si se desactivó, limpiamos el formulario.
            if (overrideActivo === false) {
                 resetForm();
            }
            loadProfesores();
        }
    };

    // 5. Desactivar (Soft Delete) profesor
    const deactivateProfesor = async () => {
        const id = parseInt(profesorId);
        if (isNaN(id)) {
            toast.warn('Introduce un ID válido para desactivar.');
            return;
        }
        
        if (window.confirm(`¿Seguro que desea DESACTIVAR (Eliminar Lógicamente) al profesor con ID ${id}?`)) {
            // Llama a la función de actualizar, forzando activo a false
            await updateProfesor(false); 
        }
    };


    // Cargar profesores al montar el componente
    useEffect(() => {
        loadProfesores();
    }, [loadProfesores]); 

    // --- Renderizado JSX ---

    return (
        <div className="p-8">
            <h2 className="pb-2 mb-6 text-3xl font-bold text-gray-800 border-b">
                👩‍🎓 Gestión de Profesores (GraphQL CRUD)
            </h2>
            
            <div className="p-6 mb-8 bg-white rounded-lg shadow-xl">
                <h3 className="mb-4 text-xl font-semibold text-gray-700">Formulario Profesor</h3>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* ID de Búsqueda/Acción */}
                    <div className="flex flex-col">
                        <label htmlFor="profesorId" className="text-sm font-medium text-gray-600">ID (Auto-generado / Búsqueda)</label>
                        <input 
                            id="profesorId" 
                            type="text" 
                            placeholder="ID" 
                            value={profesorId}
                            onChange={(e) => setProfesorId(e.target.value)}
                            className="p-2 transition duration-150 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" 
                        />
                    </div>
                    {/* Nombre */}
                    <div className="flex flex-col">
                        <label htmlFor="profesorNombre" className="text-sm font-medium text-gray-600">Nombre (*)</label>
                        <input id="profesorNombre" type="text" value={formData.nombre} onChange={handleChange} className="p-2 border border-gray-300 rounded" />
                    </div>
                    {/* Apellidos */}
                    <div className="flex flex-col">
                        <label htmlFor="profesorApellidos" className="text-sm font-medium text-gray-600">Apellidos</label>
                        <input id="profesorApellidos" type="text" value={formData.apellidos} onChange={handleChange} className="p-2 border border-gray-300 rounded" />
                    </div>
                    
                    {/* Teléfono */}
                    <div className="flex flex-col">
                        <label htmlFor="profesorTelefono" className="text-sm font-medium text-gray-600">Teléfono</label>
                        <input id="profesorTelefono" type="text" value={formData.telefono} onChange={handleChange} className="p-2 border border-gray-300 rounded" />
                    </div>
                    {/* Email */}
                    <div className="flex flex-col">
                        <label htmlFor="profesorEmail" className="text-sm font-medium text-gray-600">Email (*)</label>
                        <input id="profesorEmail" type="email" value={formData.email} onChange={handleChange} className="p-2 border border-gray-300 rounded" />
                    </div>
                    {/* Contraseña */}
                    <div className="flex flex-col">
                        <label htmlFor="profesorContrasenia" className="text-sm font-medium text-gray-600">Contraseña (Solo para Crear)</label>
                        <input id="profesorContrasenia" type="password" value={formData.contrasenia} onChange={handleChange} className="p-2 border border-gray-300 rounded" />
                    </div>

                    {/* Dirección */}
                    <div className="flex flex-col">
                        <label htmlFor="profesorDireccion" className="text-sm font-medium text-gray-600">Dirección</label>
                        <input id="profesorDireccion" type="text" value={formData.direccion} onChange={handleChange} className="p-2 border border-gray-300 rounded" />
                    </div>
                    {/* Localidad */}
                    <div className="flex flex-col">
                        <label htmlFor="profesorLocalidad" className="text-sm font-medium text-gray-600">Localidad</label>
                        <input id="profesorLocalidad" type="text" value={formData.localidad} onChange={handleChange} className="p-2 border border-gray-300 rounded" />
                    </div>
                    {/* Provincia */}
                    <div className="flex flex-col">
                        <label htmlFor="profesorProvincia" className="text-sm font-medium text-gray-600">Provincia</label>
                        <input id="profesorProvincia" type="text" value={formData.provincia} onChange={handleChange} className="p-2 border border-gray-300 rounded" />
                    </div>
                    
                    {/* Campo de fecha no usado en GQL, solo en UI */}
                    <div className="flex flex-col">
                        <label htmlFor="profesorFechaNacimiento" className="text-sm font-medium text-gray-600">Fecha Nacimiento (UI)</label>
                        <input id="profesorFechaNacimiento" type="text" value={formData.fechaNacimiento} onChange={handleChange} placeholder="YYYY-MM-DD" className="p-2 border border-gray-300 rounded" />
                    </div>
                    
                    {/* Activo */}
                    <div className="flex items-center mt-6">
                        <input 
                            id="profesorActivo" 
                            type="checkbox" 
                            checked={formData.activo}
                            onChange={handleChange}
                            className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                        />
                        <label htmlFor="profesorActivo" className="text-sm font-medium text-gray-700">Activo</label>
                    </div>
                    
                    {/* Fechas (Solo visualización) */}
                    <div className="flex flex-col">
                        <label htmlFor="profesorFechaCreacion" className="text-sm font-medium text-gray-600">Fecha Creación</label>
                        <input id="profesorFechaCreacion" type="text" disabled defaultValue="Auto (DB)" className="p-2 bg-gray-100 border rounded" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="profesorFechaActualizacion" className="text-sm font-medium text-gray-600">Fecha Actualización</label>
                        <input id="profesorFechaActualizacion" type="text" disabled defaultValue="Auto (DB)" className="p-2 bg-gray-100 border rounded" />
                    </div>
                </div>
                
                <div className="flex mt-6 space-x-2">
                    <button onClick={createProfesor} className="px-4 py-2 text-white transition duration-150 bg-indigo-600 rounded shadow-md hover:bg-indigo-700">Crear</button>
                    <button onClick={updateProfesor} className="px-4 py-2 text-white transition duration-150 bg-blue-500 rounded shadow-md hover:bg-blue-600">Actualizar</button>
                    <button onClick={getProfesorById} className="px-4 py-2 text-white transition duration-150 bg-green-500 rounded shadow-md hover:bg-green-600">Buscar por ID</button>
                    <button onClick={deactivateProfesor} className="px-4 py-2 text-white transition duration-150 bg-red-600 rounded shadow-md hover:bg-red-700">Desactivar (Soft Delete)</button>
                    <button onClick={resetForm} className="px-4 py-2 text-gray-700 transition duration-150 bg-gray-200 rounded shadow-md hover:bg-gray-300">Limpiar</button>
                </div>
                
                <label className="block mt-4 text-sm font-medium text-gray-600">Respuesta</label>
                <pre id="profesorResult" className="p-3 mt-1 overflow-auto text-sm whitespace-pre-wrap bg-gray-100 rounded border border-gray-300 min-h-[100px]">
                    {result}
                </pre>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-xl">
                <h3 className="mb-4 text-xl font-semibold text-gray-700">
                    Listado de Profesores Activos <span className="px-2.5 py-0.5 ml-2 text-xs font-semibold text-indigo-800 bg-indigo-200 rounded-full">{profesoresList.length}</span>
                </h3>
                <div id="profesorList" className="p-3 border rounded border-gray-300 min-h-[50px] max-h-96 overflow-y-auto">
                    {profesoresList.length > 0 ? (
                        <ul className="space-y-1">
                            {profesoresList.map(p => (
                                <li 
                                    key={p.idProfesor} 
                                    className="flex items-center justify-between p-2 text-sm text-gray-700 transition duration-150 border-b rounded-md cursor-pointer last:border-b-0 hover:bg-indigo-50"
                                    onClick={() => setProfesorId(p.idProfesor.toString())} // Usabilidad: carga el ID al hacer clic
                                >
                                    <div>
                                        <span className="font-bold text-indigo-600">ID: {p.idProfesor}</span> - **{p.nombre} {p.apellidos}** ({p.email})
                                    </div>
                                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${p.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {p.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <small className="text-gray-500">No hay profesores activos o esperando carga...</small>
                    )}
                </div>
                <button onClick={loadProfesores} className="px-4 py-2 mt-4 text-white transition duration-150 bg-purple-600 rounded shadow-md hover:bg-purple-700">Recargar Listado</button>
            </div>
        </div>
    );
};

export default Profesor;