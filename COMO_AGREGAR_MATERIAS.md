# Guía para agregar nuevas materias

## Paso 1: Crear el archivo de preguntas

Crea un nuevo archivo YAML en `public/<carrera>/preguntas/<materia>.ia.yaml` con el siguiente formato:

```yaml
- pregunta: "¿Cuál es tu pregunta?"
  probabilidad: 0.95
  respuesta_correcta: "La respuesta correcta"
  respuestas_incorrectas:
    - "Respuesta incorrecta 1"
    - "Respuesta incorrecta 2"
    - "Respuesta incorrecta 3"

- pregunta: "Segunda pregunta..."
  probabilidad: 0.88
  respuesta_correcta: "Otra respuesta correcta"
  respuestas_incorrectas:
    - "Incorrecta 1"
    - "Incorrecta 2"
    - "Incorrecta 3"
```

**Notas importantes:**
- Cada pregunta debe tener al menos 1 respuesta incorrecta
- La probabilidad es opcional pero recomendada (valor entre 0 y 1)
- Las respuestas se mezclarán aleatoriamente al mostrarlas

## Paso 2: Actualizar el catálogo

Edita `public/catalogo.yaml` y agrega la nueva materia:

```yaml
carreras:
  - id: trabajo-social
    nombre: Trabajo Social
    materias:
      - id: comprension
        nombre: Comprensión Lectora
        archivo: trabajoSocial/preguntas/comprension.ia.yaml
        descripcion: Evaluación sobre comprensión de textos académicos
      
      # Nueva materia
      - id: nueva-materia
        nombre: Nombre de la Nueva Materia
        archivo: trabajoSocial/preguntas/nueva-materia.ia.yaml
        descripcion: Descripción breve de la materia
```

## Paso 3: Agregar una nueva carrera (opcional)

Si quieres agregar una carrera completamente nueva:

```yaml
carreras:
  - id: trabajo-social
    nombre: Trabajo Social
    materias: [...]
  
  # Nueva carrera
  - id: psicologia
    nombre: Psicología
    materias:
      - id: desarrollo-humano
        nombre: Desarrollo Humano
        archivo: psicologia/preguntas/desarrollo-humano.ia.yaml
        descripcion: Evaluación sobre desarrollo humano y ciclo vital
```

## Rutas generadas automáticamente

El sistema generará automáticamente las rutas:
- `/:carreraId/evaluacion?materia=:materiaId`

Ejemplo: `/psicologia/evaluacion?materia=desarrollo-humano`

## Atributos opcionales que puedes agregar

En el archivo YAML de preguntas, puedes agregar:
- `probabilidad`: Importancia de la pregunta (0-1)
- Cualquier otro campo que necesites (se ignorarán campos no utilizados)

En el catálogo, puedes agregar:
- `color`: Color personalizado para la carrera
- `icono`: Nombre de icono para la UI
- `nivel`: Dificultad de la materia

## Validación

El sistema filtra automáticamente preguntas incompletas o mal formadas. Asegúrate de que cada pregunta tenga:
- ✅ Campo `pregunta`
- ✅ Campo `respuesta_correcta`
- ✅ Campo `respuestas_incorrectas` con al menos 1 elemento

## Ejemplo completo

```yaml
# public/derecho/preguntas/constitucional.ia.yaml
- pregunta: "¿Qué es la separación de poderes?"
  probabilidad: 0.95
  respuesta_correcta: "División del poder público en ejecutivo, legislativo y judicial"
  respuestas_incorrectas:
    - "Separación geográfica de las instituciones"
    - "División entre poder civil y militar"
    - "Independencia de los partidos políticos"

- pregunta: "¿Cuál es el principio de legalidad?"
  probabilidad: 0.90
  respuesta_correcta: "Nadie puede ser obligado a hacer lo que la ley no manda"
  respuestas_incorrectas:
    - "Toda ley debe ser aprobada por el congreso"
    - "Las leyes deben ser públicas y conocidas"
    - "Los jueces deben aplicar las leyes estrictamente"
```

```yaml
# Actualización del catalogo.yaml
carreras:
  - id: derecho
    nombre: Derecho
    materias:
      - id: constitucional
        nombre: Derecho Constitucional
        archivo: derecho/preguntas/constitucional.ia.yaml
        descripcion: Evaluación sobre derecho constitucional y garantías
```

No se requiere modificar código TypeScript. El sistema carga todo dinámicamente.
