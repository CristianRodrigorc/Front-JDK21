import React, { useState } from 'react';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const TabButton = ({ name, label, activeTab, setActiveTab }) => {
    const isActive = activeTab === name;
    
    const classes = `tab-button px-6 py-3 cursor-pointer border-none bg-transparent text-base font-medium transition duration-200 border-b-2 
        ${isActive 
            ? 'active text-accent border-accent' 
            : 'text-muted border-transparent hover:text-accent'
        }`;

    return (
        <button
            className={classes}
            onClick={() => setActiveTab(name)}
        >
            {label}
        </button>
    );
};

function Home() {
    const [activeTab, setActiveTab] = useState('Alumno');

    const renderTabContent = (tabName) => {
        if (activeTab !== tabName) {
            return null;
        }

        if (tabName === 'Alumno') {
            return (
                <div
                    id="Alumno"
                    className="tab-content active grid gap-6 lg:grid-cols-[420px_1fr] grid-cols-1"
                >
                    <div>
                        <div className="p-4 border card bg-surface border-border-color rounded-custom md:p-5 shadow-custom">
                            <h2 className="flex items-center gap-2 mt-0 mb-3 text-sm text-gray-800">
                                👩‍🎓 CRUD Alumno
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                {/* Los Inputs necesitan ser convertidos a componentes controlados con useState/onChange en un componente real */}
                                <div className="form-group">
                                    <label htmlFor="alumnoId" className="block mb-1 text-xs tracking-wider uppercase text-muted">
                                        ID (para Update/Delete/Get)
                                    </label>
                                    <input id="alumnoId" type="text" placeholder="Auto-generado o para buscar" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-text focus:outline-none focus:border-accent focus:shadow-outline-accent focus:bg-white" />
                                </div>
                                {/* ... Otros inputs de Alumno ... */}
                                <div className="form-group"><label htmlFor="nombre" className="block mb-1 text-xs tracking-wider uppercase text-muted">Nombre</label><input id="nombre" type="text" defaultValue="Juan" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-text focus:outline-none focus:border-accent focus:shadow-outline-accent focus:bg-white" /></div>
                                <div className="form-group"><label htmlFor="apellidos" className="block mb-1 text-xs tracking-wider uppercase text-muted">Apellidos</label><input id="apellidos" type="text" defaultValue="Perez" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-text focus:outline-none focus:border-accent focus:shadow-outline-accent focus:bg-white" /></div>
                                <div className="form-group"><label htmlFor="telefono" className="block mb-1 text-xs tracking-wider uppercase text-muted">Teléfono</label><input id="telefono" type="text" defaultValue="600123456" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-text focus:outline-none focus:border-accent focus:shadow-outline-accent focus:bg-white" /></div>
                                <div className="form-group"><label htmlFor="email" className="block mb-1 text-xs tracking-wider uppercase text-muted">Email</label><input id="email" type="email" defaultValue="juan.perez@test.es" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-text focus:outline-none focus:border-accent focus:shadow-outline-accent focus:bg-white" /></div>
                                <div className="form-group"><label htmlFor="contrasenia" className="block mb-1 text-xs tracking-wider uppercase text-muted">Contraseña</label><input id="contrasenia" type="password" defaultValue="pass123" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-text focus:outline-none focus:border-accent focus:shadow-outline-accent focus:bg-white" /></div>
                                <div className="form-group"><label htmlFor="fechaNacimiento" className="block mb-1 text-xs tracking-wider uppercase text-muted">Fecha Nacimiento</label><input id="fechaNacimiento" type="text" defaultValue="1990-01-01" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-text focus:outline-none focus:border-accent focus:shadow-outline-accent focus:bg-white" /></div>
                                <div className="form-group"><label htmlFor="localidad" className="block mb-1 text-xs tracking-wider uppercase text-muted">Localidad</label><input id="localidad" type="text" defaultValue="Madrid" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-text focus:outline-none focus:border-accent focus:shadow-outline-accent focus:bg-white" /></div>
                                <div className="form-group"><label htmlFor="provincia" className="block mb-1 text-xs tracking-wider uppercase text-muted">Provincia</label><input id="provincia" type="text" defaultValue="Madrid" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-text focus:outline-none focus:border-accent focus:shadow-outline-accent focus:bg-white" /></div>
                                
                                <div className="checkbox-row flex gap-1.5 items-center text-sm mt-1">
                                    <input id="activo" type="checkbox" defaultChecked />
                                    <span>Activo</span>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                                {/* Los `onclick` se reemplazan por manejadores de eventos de React */}
                                <button onClick={() => console.log('Llamada a createAlumno()')} className="bg-accent border-none text-white px-3.5 py-2 rounded-lg font-semibold text-xs cursor-pointer hover:bg-blue-700">Crear</button>
                                <button onClick={() => console.log('Llamada a updateAlumno()')} className="secondary bg-white border border-gray-100 text-text px-3.5 py-2 rounded-lg font-semibold text-xs cursor-pointer hover:bg-gray-50">Actualizar</button>
                                <button onClick={() => console.log('Llamada a getAlumnoById()')} className="secondary bg-white border border-gray-100 text-text px-3.5 py-2 rounded-lg font-semibold text-xs cursor-pointer hover:bg-gray-50">Buscar por ID</button>
                                <button onClick={() => console.log('Llamada a deleteAlumno()')} className="secondary bg-white border border-gray-100 text-text px-3.5 py-2 rounded-lg font-semibold text-xs cursor-pointer hover:bg-gray-50">Eliminar</button>
                            </div>
                            <label className="block mt-3 mb-1 text-xs tracking-wider uppercase text-muted">Respuesta</label>
                            <pre id="alumnoResult" className="p-3 overflow-x-auto text-xs whitespace-pre-wrap border border-gray-100 rounded-lg bg-gray-50">
                                Aquí verás las respuestas de las queries/mutations...
                            </pre>
                        </div>
                    </div>

                    <div className="p-4 border card bg-surface border-border-color rounded-custom md:p-5 shadow-custom">
                        <h2 className="flex items-center gap-2 mt-0 mb-3 text-sm text-gray-800">
                            📄 Alumnos Activos{" "}
                            <span id="alumnoCount" className="bg-orange-soft text-orange rounded-full px-2 py-0.5 text-xs font-semibold">
                                0
                            </span>
                        </h2>
                        <div id="alumnoList" className="grid gap-2">
                            <small className="text-muted">Cargando alumnos...</small>
                        </div>
                        <button onClick={() => console.log('Llamada a loadAlumnos()')} className="bg-accent border-none text-white px-3.5 py-2 rounded-lg font-semibold text-xs cursor-pointer hover:bg-blue-700 mt-4">
                            Recargar Alumnos
                        </button>
                    </div>
                </div>
            );
        }

        if (tabName === 'Matricula') {
            return (
                <div
                    id="Matricula"
                    className="tab-content active grid gap-6 lg:grid-cols-[420px_1fr] grid-cols-1"
                >
                    <div>
                        <div className="p-4 border card bg-surface border-border-color rounded-custom md:p-5 shadow-custom">
                            <h2 className="flex items-center gap-2 mt-0 mb-3 text-sm text-gray-800">
                                📝 CRUD Matrícula (REST)
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                {/* ... Inputs de Matrícula ... */}
                                <div className="form-group"><label htmlFor="matriculaId" className="block mb-1 text-xs tracking-wider uppercase text-muted">ID (para Update/Delete/Get)</label><input id="matriculaId" type="text" placeholder="Auto-generado o para buscar" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-text focus:outline-none focus:border-accent focus:shadow-outline-accent focus:bg-white" /></div>
                                <div className="form-group"><label htmlFor="matriculaFecha" className="block mb-1 text-xs tracking-wider uppercase text-muted">Fecha (YYYY-MM-DD)</label><input id="matriculaFecha" type="text" defaultValue="2025-11-17" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-text focus:outline-none focus:border-accent focus:shadow-outline-accent focus:bg-white" /></div>
                                <div className="form-group"><label htmlFor="matriculaCodigo" className="block mb-1 text-xs tracking-wider uppercase text-muted">Código</label><input id="matriculaCodigo" type="text" defaultValue="MATR-2025-001" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-text focus:outline-none focus:border-accent focus:shadow-outline-accent focus:bg-white" /></div>
                                <div className="form-group"><label htmlFor="matriculaPrecio" className="block mb-1 text-xs tracking-wider uppercase text-muted">Precio</label><input id="matriculaPrecio" type="number" defaultValue="1500" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-text focus:outline-none focus:border-accent focus:shadow-outline-accent focus:bg-white" /></div>
                                <div className="form-group"><label htmlFor="matriculaIdConvocatoria" className="block mb-1 text-xs tracking-wider uppercase text-muted">ID Convocatoria</label><input id="matriculaIdConvocatoria" type="text" defaultValue="1" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-text focus:outline-none focus:border-accent focus:shadow-outline-accent focus:bg-white" /></div>
                                <div className="form-group"><label htmlFor="matriculaIdAlumno" className="block mb-1 text-xs tracking-wider uppercase text-muted">ID Alumno</label><input id="matriculaIdAlumno" type="text" defaultValue="1" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-text focus:outline-none focus:border-accent focus:shadow-outline-accent focus:bg-white" /></div>
                            </div>
                            <div className="flex gap-2 mt-3">
                                <button onClick={() => console.log('Llamada a createMatricula()')} className="bg-accent border-none text-white px-3.5 py-2 rounded-lg font-semibold text-xs cursor-pointer hover:bg-blue-700">Crear</button>
                                <button onClick={() => console.log('Llamada a updateMatricula()')} className="secondary bg-white border border-gray-100 text-text px-3.5 py-2 rounded-lg font-semibold text-xs cursor-pointer hover:bg-gray-50">Actualizar</button>
                                <button onClick={() => console.log('Llamada a getMatriculaById()')} className="secondary bg-white border border-gray-100 text-text px-3.5 py-2 rounded-lg font-semibold text-xs cursor-pointer hover:bg-gray-50">Buscar por ID</button>
                                <button onClick={() => console.log('Llamada a deleteMatricula()')} className="secondary bg-white border border-gray-100 text-text px-3.5 py-2 rounded-lg font-semibold text-xs cursor-pointer hover:bg-gray-50">Eliminar</button>
                            </div>
                            <label className="block mt-3 mb-1 text-xs tracking-wider uppercase text-muted">Respuesta</label>
                            <pre id="matriculaResult" className="p-3 overflow-x-auto text-xs whitespace-pre-wrap border border-gray-100 rounded-lg bg-gray-50">
                                Aquí verás las respuestas de las peticiones REST...
                            </pre>
                        </div>
                    </div>

                    <div className="p-4 border card bg-surface border-border-color rounded-custom md:p-5 shadow-custom">
                        <h2 className="flex items-center gap-2 mt-0 mb-3 text-sm text-gray-800">
                            📄 Matrículas Activas{" "}
                            <span id="matriculaCount" className="bg-orange-soft text-orange rounded-full px-2 py-0.5 text-xs font-semibold">
                                0
                            </span>
                        </h2>
                        <div id="matriculaList" className="grid gap-2">
                            <small className="text-muted">Cargando matrículas...</small>
                        </div>
                        <button onClick={() => console.log('Llamada a loadMatriculas()')} className="bg-accent border-none text-white px-3.5 py-2 rounded-lg font-semibold text-xs cursor-pointer hover:bg-blue-700 mt-4">
                            Recargar Matrículas
                        </button>
                    </div>
                </div>
            );
        }

        if (tabName === 'Convocatoria') {
            return (
                <div
                    id="Convocatoria"
                    className="tab-content active grid gap-6 lg:grid-cols-[420px_1fr] grid-cols-1"
                >
                    <div>
                        <div className="p-4 border card bg-surface border-border-color rounded-custom md:p-5 shadow-custom">
                            <h2 className="flex items-center gap-2 mt-0 mb-3 text-sm text-gray-800">
                                🗓️ CRUD Convocatoria
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                {/* ... Inputs de Convocatoria ... */}
                                <div className="form-group"><label htmlFor="convocatoriaId" className="block mb-1 text-xs tracking-wider uppercase text-muted">ID (para Update/Delete/Get)</label><input id="convocatoriaId" type="text" placeholder="Auto-generado o para buscar" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-text focus:outline-none focus:border-accent focus:shadow-outline-accent focus:bg-white" /></div>
                                <div className="form-group"><label htmlFor="convocatoriaCodigo" className="block mb-1 text-xs tracking-wider uppercase text-muted">Código</label><input id="convocatoriaCodigo" type="text" defaultValue="CONV-2025-001" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-text focus:outline-none focus:border-accent focus:shadow-outline-accent focus:bg-white" /></div>
                                <div className="form-group"><label htmlFor="convocatoriaFechaInicio" className="block mb-1 text-xs tracking-wider uppercase text-muted">Fecha Inicio</label><input id="convocatoriaFechaInicio" type="text" defaultValue="2026-01-15" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-text focus:outline-none focus:border-accent focus:shadow-outline-accent focus:bg-white" /></div>
                                <div className="form-group"><label htmlFor="convocatoriaFechaFin" className="block mb-1 text-xs tracking-wider uppercase text-muted">Fecha Fin</label><input id="convocatoriaFechaFin" type="text" defaultValue="2026-06-30" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-text focus:outline-none focus:border-accent focus:shadow-outline-accent focus:bg-white" /></div>
                                <div className="form-group"><label htmlFor="convocatoriaIdCurso" className="block mb-1 text-xs tracking-wider uppercase text-muted">ID Curso</label><input id="convocatoriaIdCurso" type="text" defaultValue="1" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-text focus:outline-none focus:border-accent focus:shadow-outline-accent focus:bg-white" /></div>
                                <div className="form-group"><label htmlFor="convocatoriaIdCatalogo" className="block mb-1 text-xs tracking-wider uppercase text-muted">ID Catálogo</label><input id="convocatoriaIdCatalogo" type="text" defaultValue="1" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-text focus:outline-none focus:border-accent focus:shadow-outline-accent focus:bg-white" /></div>
                                <div className="form-group"><label htmlFor="convocatoriaIdProfesor" className="block mb-1 text-xs tracking-wider uppercase text-muted">ID Profesor</label><input id="convocatoriaIdProfesor" type="text" defaultValue="1" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-text focus:outline-none focus:border-accent focus:shadow-outline-accent focus:bg-white" /></div>
                                <div className="form-group"><label htmlFor="convocatoriaIdCentro" className="block mb-1 text-xs tracking-wider uppercase text-muted">ID Centro</label><input id="convocatoriaIdCentro" type="text" defaultValue="1" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-text focus:outline-none focus:border-accent focus:shadow-outline-accent focus:bg-white" /></div>
                            </div>
                            <div className="flex gap-2 mt-3">
                                <button onClick={() => console.log('Llamada a createConvocatoria()')} className="bg-accent border-none text-white px-3.5 py-2 rounded-lg font-semibold text-xs cursor-pointer hover:bg-blue-700">Crear</button>
                                <button onClick={() => console.log('Llamada a updateConvocatoria()')} className="secondary bg-white border border-gray-100 text-text px-3.5 py-2 rounded-lg font-semibold text-xs cursor-pointer hover:bg-gray-50">Actualizar</button>
                                <button onClick={() => console.log('Llamada a getConvocatoriaById()')} className="secondary bg-white border border-gray-100 text-text px-3.5 py-2 rounded-lg font-semibold text-xs cursor-pointer hover:bg-gray-50">Buscar por ID</button>
                                <button onClick={() => console.log('Llamada a deleteConvocatoria()')} className="secondary bg-white border border-gray-100 text-text px-3.5 py-2 rounded-lg font-semibold text-xs cursor-pointer hover:bg-gray-50">Eliminar</button>
                            </div>
                            <label className="block mt-3 mb-1 text-xs tracking-wider uppercase text-muted">Respuesta</label>
                            <pre id="convocatoriaResult" className="p-3 overflow-x-auto text-xs whitespace-pre-wrap border border-gray-100 rounded-lg bg-gray-50">
                                Aquí verás las respuestas de las queries/mutations...
                            </pre>
                        </div>
                    </div>

                    <div className="p-4 border card bg-surface border-border-color rounded-custom md:p-5 shadow-custom">
                        <h2 className="flex items-center gap-2 mt-0 mb-3 text-sm text-gray-800">
                            📄 Convocatorias Activas{" "}
                            <span id="convocatoriaCount" className="bg-orange-soft text-orange rounded-full px-2 py-0.5 text-xs font-semibold">
                                0
                            </span>
                        </h2>
                        <div id="convocatoriaList" className="grid gap-2">
                            <small className="text-muted">Cargando convocatorias...</small>
                        </div>
                        <button onClick={() => console.log('Llamada a loadConvocatorias()')} className="bg-accent border-none text-white px-3.5 py-2 rounded-lg font-semibold text-xs cursor-pointer hover:bg-blue-700 mt-4">
                            Recargar Convocatorias
                        </button>
                    </div>
                </div>
            );
        }
    };

    return (
        <>
            <div className="container grid flex-1 gap-6 p-6 lg:grid-cols-1">
                {/* Contenedor de Tabs */}
                <div className="flex mb-6 border-b tabs border-border-color">
                    <TabButton 
                        name="Alumno" 
                        label="👩‍🎓 Alumno" 
                        activeTab={activeTab} 
                        setActiveTab={setActiveTab} 
                    />
                    <TabButton 
                        name="Matricula" 
                        label="📝 Matrícula (REST)" 
                        activeTab={activeTab} 
                        setActiveTab={setActiveTab} 
                    />
                    <TabButton 
                        name="Convocatoria" 
                        label="🗓️ Convocatoria" 
                        activeTab={activeTab} 
                        setActiveTab={setActiveTab} 
                    />
                </div>

                {/* Contenido Dinámico de las Pestañas */}
                {renderTabContent('Alumno')}
                {renderTabContent('Matricula')}
                {renderTabContent('Convocatoria')}
                
            </div>
        </>
    );
}

export default Home;