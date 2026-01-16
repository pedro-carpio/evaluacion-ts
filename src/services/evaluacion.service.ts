import { Injectable, signal } from '@angular/core';
import * as yaml from 'js-yaml';
import { Catalogo, Pregunta, PreguntaConOpciones } from '../models/pregunta.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionService {
  private catalogoCache = signal<Catalogo | null>(null);

  async cargarCatalogo(): Promise<Catalogo> {
    const cached = this.catalogoCache();
    if (cached) return cached;

    const response = await fetch('/catalogo.yaml');
    const text = await response.text();
    const catalogo = yaml.load(text) as Catalogo;
    this.catalogoCache.set(catalogo);
    return catalogo;
  }

  async cargarPreguntas(archivo: string): Promise<Pregunta[]> {
    const response = await fetch(`/${archivo}`);
    const text = await response.text();
    const preguntas = yaml.load(text) as Pregunta[];

    return preguntas.filter(p =>
      p.pregunta &&
      p.respuesta_correcta &&
      p.respuestas_incorrectas &&
      p.respuestas_incorrectas.length > 0
    );
  }

  generarPreguntasAleatorias(preguntas: Pregunta[], cantidad: number): PreguntaConOpciones[] {
    const shuffled = [...preguntas].sort(() => Math.random() - 0.5);
    const seleccionadas = shuffled.slice(0, Math.min(cantidad, preguntas.length));

    return seleccionadas.map(p => ({
      ...p,
      opciones: this.mezclarOpciones([p.respuesta_correcta, ...p.respuestas_incorrectas]),
      respuestaSeleccionada: undefined
    }));
  }

  private mezclarOpciones(opciones: string[]): string[] {
    return [...opciones].sort(() => Math.random() - 0.5);
  }

  calcularPuntaje(preguntas: PreguntaConOpciones[]): number {
    const respondidas = preguntas.filter(p => p.respuestaSeleccionada);
    if (respondidas.length === 0) return 0;

    const correctas = respondidas.filter(
      p => p.respuestaSeleccionada === p.respuesta_correcta
    ).length;

    return Math.round((correctas / respondidas.length) * 100);
  }
}
