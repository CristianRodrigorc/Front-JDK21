# 🎓 Academia Panel - Proyecto Full Stack Demo

Este proyecto es una aplicación web de demostración para la gestión de un panel académico, utilizando una arquitectura Full Stack moderna. El frontend se desarrolla con **React** y **Tailwind CSS**, y se comunica con un backend basado en **Spring Boot** que expone APIs **REST** y **GraphQL**.

---

## 🚀 Tecnologías Clave

### Frontend (Este Repositorio)
* **Framework:** React 18+
* **Enrutamiento:** React Router DOM (v6)
* **Estilos:** Tailwind CSS (Clases utilitarias) y Bootstrap Icons
* **Comunicaciones:** Axios (para peticiones HTTP)

### Backend (Proyecto Separado)
* **Framework:** Spring Boot (Java)
* **Base de Datos:** [Indica tu DB aquí, ej: MySQL, PostgreSQL, H2]
* **APIs:** RESTful Services & GraphQL Endpoints
* **Persistencia:** JPA / Hibernate

---

## 🛠️ Estructura de Componentes

El proyecto está organizado para reflejar las entidades de la base de datos y facilitar las operaciones CRUD (Crear, Leer, Actualizar, Eliminar).

| Ruta              |       Componente                      |       Descripción de Gestión |
| :---              |       :---                            |       :--- |
| `/` | `Home`      |       Página de bienvenida del panel. |
| `/profesor`       |       `Profesor.jsx`                  |       Gestión completa de datos de profesores. |
| `/materia`        |       `Materia.jsx`                   |       CRUD de las asignaturas impartidas. |
| `/curso`          |       `Curso.jsx`                     |       Definición de cursos y sus características (duración, descripción). |
| `/centros`        |       `Centros.jsx`                   |       Administración de las diferentes sedes físicas. |
| `/empresa`        |       `Empresa.jsx`                   |       Configuración de la información legal y contacto de la academia. |
| `/comunidad`      |       `Comunidad.jsx`                 |       Gestión del catálogo de Comunidades Autónomas (para direcciones). |

---

## 📦 Instalación y Puesta en Marcha

Sigue estos pasos para levantar el proyecto en tu entorno local.

### 1. Configuración del Backend (Spring Boot)

Asegúrate de que tu proyecto Spring Boot esté operativo y escuchando en el puerto configurado (generalmente `8080`).

* **Verifica las APIs:** Confirma que los *endpoints* CRUD (ej. `/api/profesores`, `/api/materias`) estén accesibles.
* **Configura CORS:** Es esencial que el backend permita peticiones desde el puerto de React (`http://localhost:3000`).

    ```java
    // Ejemplo de configuración CORS en Spring Boot (WebConfig.java)
    registry.addMapping("/**")
            .allowedOrigins("http://localhost:3000") 
            .allowedMethods("GET", "POST", "PUT", "DELETE");
    ```

### 2. Configuración del Frontend (React)

Clona este repositorio y ejecuta los siguientes comandos:

```bash
# 1. Clonar el repositorio
git clone ""
cd academia-panel-frontend 

# 2. Instalar dependencias
npm install 

# 3. Instalar la librería para peticiones HTTP
npm install axios 

# 4. Iniciar la aplicación en modo desarrollo
npm run dev 
# o
npm start