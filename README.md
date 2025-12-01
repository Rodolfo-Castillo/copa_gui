# 🏆 Football Tournament Tracker

![Badge de Estado del Proyecto](https://img.shields.io/badge/Estado-Producción%20Listos-brightgreen)
![Badge de Tecnología](https://img.shields.io/badge/Framework-Vue%203-42b883?logo=vuejs)
![Badge de Licencia](https://img.shields.io/badge/Licencia-MIT-blue)

¡Bienvenido al repositorio de **Football Tournament Tracker**!

Esta aplicación es una herramienta completa para la gestión y seguimiento de un torneo de fútbol. Diseñada para manejar desde la creación de grupos y categorías, hasta la definición de campeones y el seguimiento de estadísticas individuales de jugadores.

---

## ⚽ Funcionalidades Clave del Torneo

La aplicación permite gestionar el flujo completo de un torneo, incluyendo:

### Fases de la Competición
* **Clasificación por Categorías:** Manejo de múltiples categorías (e.g., Infantil, Juvenil, Amateur) de forma simultánea.
* **Creación de Grupos:** Distribución de equipos en grupos para la fase inicial.
* **Fase de Grupos:** Cálculo de posiciones y gestión de resultados.
    * **Regla de Clasificación:** Los **dos (2) primeros equipos** de cada grupo avanzan a la siguiente ronda.
* **Fase Eliminatoria (Play-offs):** Estructura de partidos de eliminación directa hasta definir al campeón (Cuartos de Final, Semifinales, Final).

### Seguimiento de Estadísticas
* **Campeón Goleador:** Contabilidad detallada de los goles anotados por cada jugador.
* **Portero Menos Goleado:** Registro de los goles recibidos por cada guardameta.
* **Otros Premios:** Seguimiento de tarjetas (amarillas/rojas) y otros datos relevantes.

---

## 💻 Stack Tecnológico

El proyecto está desarrollado con una arquitectura moderna y escalable, utilizando el stack más reciente de Vue:

| Componente | Versión | Rol en el Proyecto |
| :--- | :--- | :--- |
| **Vue 3** | ^3.x | **Front-end Framework:** Reactividad y componentes con Composition API. |
| **Pinia** | ^2.x | **Gestión de Estado:** Manejo centralizado, ligero y modular de los datos del torneo. |
| **Vue Router** | ^4.x | **Navegación:** Permite la transición fluida entre la vista de Grupos, Play-offs y Estadísticas. |
| **[Añade tu librería CSS/UI si usas una]** | [Versión] | [Estilos y Componentes de UI] |

---

## ⚙️ Guía de Inicio Rápido

Sigue estos pasos para configurar el entorno de desarrollo y ejecutar la aplicación.

### Requisitos

* [Node.js](https://nodejs.org/) (versión LTS recomendada)
* npm o yarn

### 1. Obtener el Código

```bash
git clone https://github.com/Rodolfo-Castillo/copa_gui
cd copa_gui

### 2. Instalación
pnpm install

### 3. Ejecución
pnpm run dev
