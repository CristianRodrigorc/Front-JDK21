import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // <-- Importación necesaria

const GRAPHQL_URL = 'http://localhost:8080/graphql';

const Centros = () => {
    // --- 1. ESTADOS ---

    const [formData, setFormData] = useState({
        idComunidad: 13,
        idEmpresa: 1,
        codigoCentro: 'CMD-001',
        nombre: 'Sede Central Madrid',
        responsable: 'Elena',
        capacidadMaxima: 150,
        activo: true,
        telefono: 987654321,
        email: 'centro@academia.es',
        web: 'www.academia.es/madrid',
        direccion: 'Av. de la Paz',
        numero: 25,
        piso: 3,
        puerta: 'A',
        codigoPostal: 28001,
        localidad: 'Madrid',
        provincia: 'Madrid',
    });

    const [centroId, setCentroId] = useState('');
    const [result, setResult] = useState('Aquí verás las respuestas de las queries/mutations...');
    const [centrosList, setCentrosList] = useState([]);

    // --- 2. MANEJADORES DE ESTADO ---

    // Mapeo para facilitar el 'handleChange'
    const fieldMapping = {
        centroIdComunidad: 'idComunidad',
        centroIdEmpresa: 'idEmpresa',
        centroCodigo: 'codigoCentro',
        centroNombre: 'nombre',
        centroResponsable: 'responsable',
        centroCapacidad: 'capacidadMaxima',
        centroActivo: 'activo',
        centroTelefono: 'telefono',
        centroEmail: 'email',
        centroWeb: 'web',
        centroDireccion: 'direccion',
        centroNumero: 'numero',
        centroPiso: 'piso',
        centroPuerta: 'puerta',
        centroCodPostal: 'codigoPostal',
        centroLocalidad: 'localidad',
        centroProvincia: 'provincia',
    };

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        const fieldName = fieldMapping[id] || id;

        setFormData(prev => ({
            ...prev,
            // Lógica de casteo a número o booleano
            [fieldName]: type === 'checkbox' ? checked : (type === 'number' || fieldName.startsWith('id') ? parseInt(value) || 0 : value)
        }));
    };

    const resetForm = () => {
        setCentroId('');
        setFormData({
            idComunidad: 13,
            idEmpresa: 1,
            codigoCentro: '',
            nombre: '',
            responsable: '',
            capacidadMaxima: 0,
            activo: true,
            telefono: 0,
            email: '',
            web: '',
            direccion: '',
            numero: 0,
            piso: 0,
            puerta: '',
            codigoPostal: 0,
            localidad: '',
            provincia: '',
        });
        setResult('Formulario limpiado. Listo para una nueva operación.');
        toast.info('Formulario reiniciado.');
    };


    // --- 3. FUNCIONES CRUD GRAPHQL (con Toastify) ---

    // 1. Cargar todos los centros (QUERY)
    const loadCentros = useCallback(async () => {
        setResult('Cargando centros activos (GraphQL)...');
        const GQL_QUERY = `
            query {
                getCentrosActivos {
                    id_centro
                    nombre
                    codigo_centro
                    activo
                }
            }
        `;
        try {
            const response = await axios.post(GRAPHQL_URL, { query: GQL_QUERY });

            const data = response.data.data;
            if (data && data.getCentrosActivos) {
                setCentrosList(data.getCentrosActivos);
                setResult(`✅ Listado de centros activos cargado. Total: ${data.getCentrosActivos.length}`);
                toast.success(`Cargados ${data.getCentrosActivos.length} centros activos.`);
            } else {
                setResult('⚠️ No se encontraron centros o error en la respuesta GraphQL.');
                toast.warn('No se encontraron centros activos.');
            }
        } catch (error) {
            let errorMessage = error.message === 'Network Error' 
                ? `Network Error. Verifica el Backend (8080) y CORS (5173).`
                : error.response?.data?.errors?.[0]?.message || error.message;

            setResult(`❌ Error al cargar la lista:\n${errorMessage}`);
            setCentrosList([]);
            toast.error('Error al cargar la lista de centros.');
        }
    }, []); // Dependencia vacía para que se ejecute solo al montar

    // 2. Crear un nuevo centro (MUTATION)
    const createCentro = async () => {
        if (!formData.nombre || !formData.codigoCentro) {
            toast.warn('Los campos Nombre y Código Centro son obligatorios.');
            return;
        }

        setResult('Creando centro (GraphQL)...');
        const GQL_MUTATION = `
            mutation CreateCentro($input: CreateCentroDTO!) {
                createCentro(input: $input) {
                    id_centro
                    nombre
                    codigo_centro
                }
            }
        `;

        // El payload debe coincidir con CreateCentroDTO (ajustando a snake_case)
        const inputPayload = {
            codigo_centro: formData.codigoCentro,
            nombre: formData.nombre,
            responsable: formData.responsable,
            id_empresa: formData.idEmpresa,
            id_comunidad: formData.idComunidad,
            capacidad_maxima: formData.capacidadMaxima,
            activo: formData.activo,
            telefono: formData.telefono,
            email: formData.email,
            web: formData.web,
            direccion: formData.direccion,
            numero: formData.numero,
            piso: formData.piso,
            puerta: formData.puerta,
            codigo_postal: formData.codigoPostal,
            localidad: formData.localidad,
            provincia: formData.provincia,
        };

        try {
            const response = await axios.post(GRAPHQL_URL, {
                query: GQL_MUTATION,
                variables: { input: inputPayload }
            });

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }

            const createdCentro = response.data.data.createCentro;
            setResult(`✅ Centro creado (ID: ${createdCentro.id_centro}):\n${JSON.stringify(createdCentro, null, 2)}`);
            toast.success(`Centro ${createdCentro.nombre} creado con éxito.`);
            resetForm(); 
            loadCentros();
        } catch (error) {
            setResult('❌ Error al crear:\n' + (error.message || 'Error desconocido.'));
            toast.error('Fallo al crear el centro.');
        }
    };

    // 3. Buscar centro por ID (QUERY)
    const getCentroById = async () => {
        const id = parseInt(centroId);
        if (isNaN(id) || !centroId) {
            setResult('⚠️ Por favor, introduce un ID de centro válido para buscar.');
            toast.warn('Debe introducir un ID válido.');
            return;
        }
        setResult(`Buscando centro con ID ${id} (GraphQL)...`);
        const GQL_QUERY = `
            query GetCentroById($id: ID!) {
                getCentroById(id: $id) {
                    id_centro
                    id_empresa
                    id_comunidad
                    codigo_centro
                    nombre
                    responsable
                    capacidad_maxima
                    activo
                    telefono
                    email
                    web
                    direccion
                    numero
                    piso
                    puerta
                    codigo_postal
                    localidad
                    provincia
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

            const foundCentro = response.data.data.getCentroById;

            if (foundCentro) {
                setResult(`✅ Centro encontrado:\n${JSON.stringify(foundCentro, null, 2)}`);
                // Mapear los campos snake_case de la respuesta al camelCase del formulario
                setFormData({
                    idComunidad: foundCentro.id_comunidad,
                    idEmpresa: foundCentro.id_empresa,
                    codigoCentro: foundCentro.codigo_centro,
                    nombre: foundCentro.nombre,
                    responsable: foundCentro.responsable,
                    capacidadMaxima: foundCentro.capacidad_maxima,
                    activo: foundCentro.activo,
                    telefono: foundCentro.telefono,
                    email: foundCentro.email,
                    web: foundCentro.web,
                    direccion: foundCentro.direccion,
                    numero: foundCentro.numero,
                    piso: foundCentro.piso,
                    puerta: foundCentro.puerta,
                    codigoPostal: foundCentro.codigo_postal,
                    localidad: foundCentro.localidad,
                    provincia: foundCentro.provincia,
                });
                setCentroId(foundCentro.id_centro.toString());
                toast.info(`Centro ${foundCentro.nombre} cargado en el formulario.`);
            } else {
                setResult(`⚠️ Centro con ID ${id} no encontrado.`);
                toast.warn(`Centro con ID ${id} no encontrado.`);
            }
        } catch (error) {
            setResult('❌ Error al buscar:\n' + (error.message || 'Error desconocido.'));
            toast.error('Fallo al buscar el centro.');
        }
    };

    // 4. Actualizar centro (MUTATION)
    const updateCentro = async () => {
        const id = parseInt(centroId);
        if (isNaN(id)) {
            setResult('⚠️ Introduce un ID válido en el campo de búsqueda para actualizar.');
            toast.warn('Debe introducir un ID para actualizar.');
            return;
        }
        setResult(`Actualizando centro con ID ${id} (GraphQL)...`);
        const GQL_MUTATION = `
            mutation UpdateCentro($id: ID!, $updateDTO: UpdateCentroDTO!) {
                updateCentro(id: $id, updateDTO: $updateDTO) {
                    id_centro
                    nombre
                    fechaActualizacion
                }
            }
        `;

        // El payload debe coincidir con UpdateCentroDTO
        const updatePayload = {
            codigo_centro: formData.codigoCentro,
            nombre: formData.nombre,
            responsable: formData.responsable,
            capacidad_maxima: formData.capacidadMaxima,
            activo: formData.activo,
            telefono: formData.telefono,
            email: formData.email,
            web: formData.web,
            direccion: formData.direccion,
            numero: formData.numero,
            piso: formData.piso,
            puerta: formData.puerta,
            codigo_postal: formData.codigoPostal,
            localidad: formData.localidad,
            provincia: formData.provincia,
        };

        try {
            const response = await axios.post(GRAPHQL_URL, {
                query: GQL_MUTATION,
                variables: { id: id, updateDTO: updatePayload }
            });

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }

            const updatedCentro = response.data.data.updateCentro;
            setResult(`✅ Centro actualizado (ID: ${updatedCentro.id_centro}):\n${JSON.stringify(updatedCentro, null, 2)}`);
            toast.success(`Centro ID ${id} actualizado correctamente.`);
            loadCentros();
        } catch (error) {
            setResult('❌ Error al actualizar:\n' + (error.message || 'Error desconocido.'));
            toast.error('Fallo al actualizar el centro.');
        }
    };

    // 5. Desactivar centro (MUTATION - equivalente a eliminar)
    const desactivarCentro = async () => {
        const id = parseInt(centroId);
        if (isNaN(id) || !window.confirm(`¿Seguro que desea DESACTIVAR (Eliminar) el centro con ID ${id}?`)) {
            return;
        }
        setResult(`Desactivando centro con ID ${id} (GraphQL)...`);
        const GQL_MUTATION = `
            mutation DesactivarCentro($id: ID!) {
                desactivarCentro(id: $id) {
                    id_centro
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

            const deactivatedCentro = response.data.data.desactivarCentro;

            if (deactivatedCentro && !deactivatedCentro.activo) {
                setResult(`✅ Centro con ID ${id} desactivado correctamente.`);
                toast.success(`Centro ID ${id} desactivado.`);
                resetForm();
                loadCentros();
            } else if (deactivatedCentro && deactivatedCentro.activo) {
                // Esto podría ocurrir si el backend no lo desactiva por alguna razón
                setResult(`⚠️ El centro con ID ${id} sigue activo.`);
                toast.warn(`El centro ID ${id} sigue activo. Revise el backend.`);
            } else {
                 setResult(`⚠️ No se pudo desactivar el centro con ID ${id}.`);
                 toast.error(`No se pudo desactivar el centro ID ${id}.`);
            }
        } catch (error) {
            setResult('❌ Error al desactivar:\n' + (error.message || 'Error desconocido.'));
            toast.error('Fallo al desactivar el centro.');
        }
    };

    // Cargar centros al montar el componente
    useEffect(() => {
        loadCentros();
    }, [loadCentros]); // Se incluye loadCentros en dependencias para useCallback

    // --- 4. RENDERIZADO JSX ---

    return (
        <div className="p-8">
            <h2 className="pb-2 mb-6 text-3xl font-bold text-gray-800 border-b">
                📍 Gestión de Centros/Sedes (GraphQL CRUD)
            </h2>

            <div className="p-6 mb-8 bg-white rounded-lg shadow-lg">
                <h3 className="mb-4 text-xl font-semibold text-gray-700">Formulario Centro</h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* ID */}
                    <div className="flex flex-col">
                        <label htmlFor="centroId" className="text-sm font-medium text-gray-600">ID (Búsqueda/Acción)</label>
                        <input
                            id="centroId"
                            type="text"
                            placeholder="ID"
                            value={centroId}
                            onChange={(e) => setCentroId(e.target.value)}
                            className="p-2 border rounded"
                        />
                    </div>
                    {/* Nombre */}
                    <div className="flex flex-col">
                        <label htmlFor="centroNombre" className="text-sm font-medium text-gray-600">Nombre</label>
                        <input id="centroNombre" type="text" value={formData.nombre} onChange={handleChange} className="p-2 border rounded" />
                    </div>
                    {/* Código Centro */}
                    <div className="flex flex-col">
                        <label htmlFor="centroCodigo" className="text-sm font-medium text-gray-600">Código Centro</label>
                        <input id="centroCodigo" type="text" value={formData.codigoCentro} onChange={handleChange} className="p-2 border rounded" />
                    </div>

                    {/* Responsable */}
                    <div className="flex flex-col">
                        <label htmlFor="centroResponsable" className="text-sm font-medium text-gray-600">Responsable</label>
                        <input id="centroResponsable" type="text" value={formData.responsable} onChange={handleChange} className="p-2 border rounded" />
                    </div>
                    {/* Capacidad Máxima */}
                    <div className="flex flex-col">
                        <label htmlFor="centroCapacidad" className="text-sm font-medium text-gray-600">Capacidad Máxima</label>
                        <input id="centroCapacidad" type="number" value={formData.capacidadMaxima} onChange={handleChange} className="p-2 border rounded" />
                    </div>
                    {/* ID Empresa */}
                    <div className="flex flex-col">
                        <label htmlFor="centroIdEmpresa" className="text-sm font-medium text-gray-600">ID Empresa</label>
                        <input id="centroIdEmpresa" type="number" value={formData.idEmpresa} onChange={handleChange} className="p-2 border rounded" />
                    </div>

                    {/* Teléfono */}
                    <div className="flex flex-col">
                        <label htmlFor="centroTelefono" className="text-sm font-medium text-gray-600">Teléfono</label>
                        <input id="centroTelefono" type="number" value={formData.telefono} onChange={handleChange} className="p-2 border rounded" />
                    </div>
                    {/* Email */}
                    <div className="flex flex-col">
                        <label htmlFor="centroEmail" className="text-sm font-medium text-gray-600">Email</label>
                        <input id="centroEmail" type="email" value={formData.email} onChange={handleChange} className="p-2 border rounded" />
                    </div>
                    {/* Web */}
                    <div className="flex flex-col">
                        <label htmlFor="centroWeb" className="text-sm font-medium text-gray-600">Web</label>
                        <input id="centroWeb" type="text" value={formData.web} onChange={handleChange} className="p-2 border rounded" />
                    </div>

                    {/* Dirección */}
                    <div className="flex flex-col">
                        <label htmlFor="centroDireccion" className="text-sm font-medium text-gray-600">Dirección</label>
                        <input id="centroDireccion" type="text" value={formData.direccion} onChange={handleChange} className="p-2 border rounded" />
                    </div>
                    {/* Número */}
                    <div className="flex flex-col">
                        <label htmlFor="centroNumero" className="text-sm font-medium text-gray-600">Número</label>
                        <input id="centroNumero" type="number" value={formData.numero} onChange={handleChange} className="p-2 border rounded" />
                    </div>
                    {/* Piso */}
                    <div className="flex flex-col">
                        <label htmlFor="centroPiso" className="text-sm font-medium text-gray-600">Piso</label>
                        <input id="centroPiso" type="number" value={formData.piso} onChange={handleChange} className="p-2 border rounded" />
                    </div>

                    {/* Puerta */}
                    <div className="flex flex-col">
                        <label htmlFor="centroPuerta" className="text-sm font-medium text-gray-600">Puerta</label>
                        <input id="centroPuerta" type="text" value={formData.puerta} onChange={handleChange} className="p-2 border rounded" />
                    </div>
                    {/* Cód. Postal */}
                    <div className="flex flex-col">
                        <label htmlFor="centroCodPostal" className="text-sm font-medium text-gray-600">Cód. Postal</label>
                        <input id="centroCodPostal" type="number" value={formData.codigoPostal} onChange={handleChange} className="p-2 border rounded" />
                    </div>
                    {/* Localidad */}
                    <div className="flex flex-col">
                        <label htmlFor="centroLocalidad" className="text-sm font-medium text-gray-600">Localidad</label>
                        <input id="centroLocalidad" type="text" value={formData.localidad} onChange={handleChange} className="p-2 border rounded" />
                    </div>

                    {/* Provincia */}
                    <div className="flex flex-col">
                        <label htmlFor="centroProvincia" className="text-sm font-medium text-gray-600">Provincia</label>
                        <input id="centroProvincia" type="text" value={formData.provincia} onChange={handleChange} className="p-2 border rounded" />
                    </div>
                    {/* ID Comunidad Autónoma */}
                    <div className="flex flex-col">
                        <label htmlFor="centroIdComunidad" className="text-sm font-medium text-gray-600">ID Comunidad Autónoma</label>
                        <input id="centroIdComunidad" type="number" value={formData.idComunidad} onChange={handleChange} className="p-2 border rounded" />
                    </div>

                    {/* Activo */}
                    <div className="flex items-center mt-6">
                        <input
                            id="centroActivo"
                            type="checkbox"
                            checked={formData.activo}
                            onChange={handleChange}
                            className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="centroActivo" className="text-sm font-medium text-gray-700">Activo</label>
                    </div>

                    {/* Fechas (Solo visualización) */}
                    <div className="flex flex-col">
                        <label htmlFor="centroFechaCreacion" className="text-sm font-medium text-gray-600">Fecha Creación</label>
                        <input id="centroFechaCreacion" type="text" disabled defaultValue="Auto" className="p-2 bg-gray-100 border rounded" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="centroFechaActualizacion" className="text-sm font-medium text-gray-600">Fecha Actualización</label>
                        <input id="centroFechaActualizacion" type="text" disabled defaultValue="Auto" className="p-2 bg-gray-100 border rounded" />
                    </div>
                </div>

                {/* Botones */}
                <div className="flex mt-6 space-x-2">
                    <button onClick={createCentro} className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700">Crear</button>
                    <button onClick={updateCentro} className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500">Actualizar</button>
                    <button onClick={getCentroById} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Buscar por ID</button>
                    <button onClick={desactivarCentro} className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">Desactivar</button>
                    <button onClick={resetForm} className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">Limpiar</button>
                </div>

                {/* Resultado */}
                <label className="block mt-4 text-sm font-medium text-gray-600">Respuesta</label>
                <pre id="centroResult" className="p-3 mt-1 overflow-auto text-sm whitespace-pre-wrap bg-gray-100 rounded">
                    {result}
                </pre>
            </div>

            {/* Listado */}
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <h3 className="mb-4 text-xl font-semibold text-gray-700">
                    Listado de Centros Activos <span className="bg-blue-200 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full ml-2">{centrosList.length}</span>
                </h3>
                <div id="centroList" className="list border p-3 rounded min-h-[50px]">
                    {centrosList.length > 0 ? (
                        <ul className="space-y-1">
                            {centrosList.map(c => (
                                <li 
                                    key={c.id_centro} 
                                    className="p-1 text-sm text-gray-700 border-b cursor-pointer last:border-b-0 hover:bg-blue-50"
                                    onClick={() => setCentroId(c.id_centro.toString())} // Permite cargar el ID con un clic
                                >
                                    <span className="font-bold text-blue-600">ID: {c.id_centro}</span> - **{c.nombre}** ({c.codigo_centro})
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <small className="text-gray-500">Cargando centros...</small>
                    )}
                </div>
                <button onClick={loadCentros} className="px-4 py-2 mt-4 text-white bg-green-600 rounded hover:bg-green-700">Recargar Listado</button>
            </div>
        </div>
    );
};

export default Centros;