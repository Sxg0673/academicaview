# AcadémicaView

Dashboard de rendimiento académico estudiantil basado en microservicios, desplegado sobre infraestructura de red con servidores Ubuntu, DNS y servidor web Apache.

**Proyecto de curso — Redes e Infraestructura 2026-01**
Ingeniería de Datos e Inteligencia Artificial

---

## ¿Qué es AcadémicaView?

AcadémicaView es una aplicación web que permite a estudiantes registrar sus hábitos académicos y obtener una estimación de su puntaje final mediante un modelo de regresión múltiple (R² = 0.74) entrenado con datos reales. Los profesores pueden gestionar estudiantes, visualizar estadísticas del curso y asignar puntajes finales.

---

## Arquitectura de red
```
Cliente (navegador)
        ↓  consulta DNS
ServidorUbuntu1 — 192.168.100.2
  ├── BIND9 (puerto 53)     → resuelve www.academicaview.edu
  └── Apache2 (puerto 80)   → sirve el frontend

        ↓  llamadas REST por red privada
ServidorUbuntu2 — 192.168.100.3
  ├── MS-Usuarios    (puerto 3001)
  ├── MS-Estudiantes (puerto 3002)
  ├── MS-Analítica   (puerto 3003)
  └── MySQL          (puerto 3306)
```

Ambos servidores corren Ubuntu 22.04 LTS sobre VirtualBox, gestionados con Vagrant. Los microservicios en el servidor 2 son administrados por pm2 para arranque automático.

---

## Estructura del repositorio
```
academicaview/
├── infra/
│   ├── Vagrantfile              → define las 2 VMs Ubuntu
│   ├── netplan-servidor1.yaml   → configuración de red servidor 1
│   └── netplan-servidor2.yaml   → configuración de red servidor 2
├── dns/
│   ├── named.conf.options       → configuración BIND9 (forwarders)
│   ├── named.conf.local         → zonas del dominio
│   ├── db.academicaview         → zona directa (nombre → IP)
│   └── db.192.168.100           → zona inversa (IP → nombre)
├── backend/
│   ├── ms-usuarios/             → Node.js, puerto 3001
│   │   ├── index.js
│   │   └── src/
│   │       ├── controllers/usuariosController.js
│   │       └── models/
│   │           ├── db.js
│   │           └── usuariosModel.js
│   ├── ms-estudiantes/          → Node.js, puerto 3002
│   │   ├── index.js
│   │   └── src/
│   │       ├── controllers/estudiantesController.js
│   │       └── models/
│   │           ├── db.js
│   │           └── estudiantesModel.js
│   └── ms-analitica/            → Node.js, puerto 3003
│       ├── index.js
│       └── src/
│           ├── controllers/analiticaController.js
│           └── models/
│               ├── db.js
│               └── analiticaModel.js
├── frontend/
│   ├── index.html               → landing page
│   ├── login.html               → inicio de sesión
│   ├── dashboard-estudiante.html
│   ├── dashboard-profesor.html
│   ├── css/
│   │   ├── styles.css
│   │   └── login.css
│   └── js/
│       ├── config.js            → URLs de los microservicios
│       └── login.js             → lógica de autenticación
└── data/
    ├── base_imputada_knn.csv    → dataset original (n=1220)
    ├── 04_modelo_regresion.R    → código R del modelo
    ├── modelo_coeficientes.md   → coeficientes extraídos
    ├── schema.sql               → estructura de la base de datos
    ├── seed_estudiantes.sql     → 30 estudiantes anonimizados
    └── generar_seed.py          → script generador del seed
```

---

## Microservicios

### MS-Usuarios — Puerto 3001
Gestiona autenticación y creación de cuentas.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/usuarios/login | Valida credenciales y devuelve rol del usuario |
| POST | /api/usuarios/registro | Crea un nuevo usuario (estudiante o profesor) |

### MS-Estudiantes — Puerto 3002
Gestiona los datos académicos y hábitos de los estudiantes.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/estudiantes | Todos los estudiantes (profesor) |
| GET | /api/estudiantes/:id | Datos de un estudiante específico |
| POST | /api/estudiantes | Crea registro académico vacío |
| PUT | /api/estudiantes/:id | Actualiza hábitos del estudiante |
| PUT | /api/estudiantes/:id/puntaje | Asigna puntaje real (profesor) |

### MS-Analítica — Puerto 3003
Aplica el modelo de regresión y calcula estadísticas del curso.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/analitica/predecir | Calcula puntaje estimado con el modelo |
| GET | /api/analitica/estadisticas | Promedios, máximo y mínimo del curso |
| GET | /api/analitica/distribucion | Distribución de estudiantes por rangos |

---

## Modelo de Regresión Múltiple

Entrenado en R con el dataset `base_imputada_knn.csv` (n = 1.220 estudiantes). Los coeficientes fueron extraídos e implementados directamente en Node.js dentro del MS-Analítica.
```
puntaje_estimado = 64.56
  + 1.6483 × horas_estudio
  + 5.5341 × promedio_previo
  - 1.6507 × horas_sueno
  + 7.5828 × (modalidad === 'Presencial' ? 1 : 0)
  + 0.2015 × asistencia
  - 1.3381 × uso_redes

R² = 0.7440  |  R² ajustado = 0.7428  |  n = 1.220
```

---

## Base de datos

Dos tablas en MySQL:

**usuarios** — credenciales y rol de acceso (estudiante / profesor)

**estudiantes** — datos académicos vinculados al usuario mediante `usuario_id` (FK). Incluye hábitos ingresados por el estudiante, puntaje estimado calculado por el modelo y puntaje real asignado por el profesor.

El archivo `data/seed_estudiantes.sql` contiene 30 registros reales anonimizados del dataset original para poblar el sistema desde el inicio.

---

## Flujo de la aplicación

**Estudiante:**
1. Accede a `www.academicaview.edu` → DNS resuelve → Apache sirve el index
2. Hace login → MS-Usuarios valida credenciales
3. Dashboard carga sus datos desde MS-Estudiantes
4. MS-Analítica calcula su puntaje estimado con el modelo
5. Puede editar sus hábitos → el estimado se recalcula automáticamente
6. Cuando el profesor asigna el puntaje real, aparece en su dashboard

**Profesor:**
1. Hace login con rol profesor → accede al panel administrativo
2. Ve estadísticas del curso y gráficas desde MS-Analítica
3. Ve la lista completa de estudiantes desde MS-Estudiantes
4. Puede agregar nuevos estudiantes (crea usuario + registro académico)
5. Puede asignar el puntaje real a cada estudiante
6. El dashboard se actualiza automáticamente cada 30 segundos

---

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Infraestructura | Vagrant + VirtualBox + Ubuntu 22.04 |
| DNS | BIND9 |
| Servidor web | Apache2 con Virtual Host |
| Frontend | HTML + Bootstrap 5 + Chart.js |
| Backend | Node.js + Express + Morgan + CORS |
| Base de datos | MySQL 8.0 |
| Gestión de procesos | pm2 |
| Modelo estadístico | Regresión múltiple (R → Node.js) |
| Control de versiones | Git + GitHub |

---

## Repositorio

[github.com/Sxg0673/academicaview](https://github.com/Sxg0673/academicaview)
