export interface Pregunta {
  pregunta: string;
  probabilidad: number;
  respuesta_correcta: string;
  respuestas_incorrectas: string[];
}

export interface Materia {
  id: string;
  nombre: string;
  archivo: string;
  descripcion: string;
  generadoPorIA?: boolean;
}

export interface Carrera {
  id: string;
  nombre: string;
  advertencia?: string;
  materias: Materia[];
}

export interface Catalogo {
  carreras: Carrera[];
}

export interface PreguntaConOpciones extends Pregunta {
  opciones: string[];
  respuestaSeleccionada?: string;
}
