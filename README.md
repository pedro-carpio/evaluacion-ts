# Sistema de Evaluación - Aplicación Angular

Este proyecto es un sistema de evaluación interactivo desarrollado en Angular 21+ que permite realizar evaluaciones de prueba sobre diferentes materias académicas. La aplicación carga preguntas desde archivos YAML y ofrece una experiencia completa de evaluación con cronómetro, verificación instantánea y cálculo de puntajes.

## Características principales

### Vista de Inicio (Home)
- Muestra un catálogo de carreras y materias disponibles
- Carga dinámicamente desde `public/catalogo.yaml`
- Navegación intuitiva a las evaluaciones

### Vista de Evaluación (Materia)
- **Cantidad de preguntas configurable**: 10, 15, 25 o 50 preguntas
- **Cronómetro programable**: Configurable en minutos y segundos
  - Inicia/detiene con un botón
  - Cambia a rojo cuando el tiempo se agota (valores negativos)
- **Verificación instantánea**: Opción de mostrar respuestas correctas en tiempo real
- **Puntaje dinámico**: Cálculo de 0 a 100 basado en respuestas correctas
  - Solo cuenta preguntas respondidas mientras el cronómetro > 0
- **Preguntas aleatorias**: Se mezclan cada vez que se entra o cambia la cantidad
- **Componente Card**: Cada pregunta se muestra en una tarjeta con opciones mezcladas

## Rutas disponibles

- `/inicio` - Página de inicio con selección de evaluación
- `/trabajo-social/evaluacion?materia=comprension` - Evaluación de Comprensión Lectora
- `/trabajo-social/evaluacion?materia=estrategias` - Evaluación de Estrategias de Aprendizaje

## Estructura del proyecto

```
src/
├── app/                       # Configuración principal
├── components/
│   └── card.component.ts      # Tarjeta de pregunta
├── views/
│   ├── home.view.ts           # Vista de inicio
│   └── materia.view.ts        # Vista de evaluación
├── services/
│   └── evaluacion.service.ts  # Servicio de datos
└── models/
    └── pregunta.model.ts      # Interfaces TypeScript

public/
├── catalogo.yaml              # Catálogo de carreras y materias
└── trabajoSocial/
    └── preguntas/             # Archivos YAML con preguntas
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
