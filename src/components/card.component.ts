import { Component, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { PreguntaConOpciones } from '../models/pregunta.model';

@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="card">
      <div class="card-header">
        <h3 class="pregunta-numero">Pregunta {{ numero() }}</h3>
        @if (pregunta().probabilidad) {
          <span class="probabilidad">Probabilidad: {{ pregunta().probabilidad }}</span>
        }
      </div>

      <p class="pregunta-texto">{{ pregunta().pregunta }}</p>

      <div class="opciones">
        @for (opcion of pregunta().opciones; track opcion; let i = $index) {
          <button
            type="button"
            class="opcion-btn"
            [class.seleccionada]="pregunta().respuestaSeleccionada === opcion"
            [class.correcta]="mostrarResultados() && pregunta().respuestaSeleccionada && opcion === pregunta().respuesta_correcta"
            [class.incorrecta]="mostrarResultados() && pregunta().respuestaSeleccionada === opcion && opcion !== pregunta().respuesta_correcta"
            [disabled]="deshabilitado()"
            (click)="seleccionarRespuesta(opcion)"
          >
            <span class="opcion-letra">{{ obtenerLetra(i) }}.</span>
            <span class="opcion-texto">{{ opcion }}</span>
          </button>
        }
      </div>
    </div>
  `,
  styles: `
    .card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
    }

    @media (max-width: 768px) {
      .card {
        padding: 16px;
        margin-bottom: 16px;
        border-radius: 8px;
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      gap: 12px;
      flex-wrap: wrap;
    }

    .pregunta-numero {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    @media (max-width: 768px) {
      .pregunta-numero {
        font-size: 16px;
      }
    }

    .probabilidad {
      font-size: 12px;
      color: #6b7280;
      background: #f3f4f6;
      padding: 4px 8px;
      border-radius: 4px;
    }

    @media (max-width: 768px) {
      .probabilidad {
        font-size: 11px;
        padding: 3px 6px;
      }
    }

    .pregunta-texto {
      font-size: 16px;
      color: #374151;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    @media (max-width: 768px) {
      .pregunta-texto {
        font-size: 14px;
        margin-bottom: 16px;
      }
    }

    .opciones {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    @media (max-width: 768px) {
      .opciones {
        gap: 10px;
      }
    }

    .opcion-btn {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
      width: 100%;
    }

    @media (max-width: 768px) {
      .opcion-btn {
        padding: 12px;
        gap: 10px;
      }
    }

    .opcion-btn:hover:not(:disabled) {
      border-color: #3b82f6;
      background: #eff6ff;
    }

    .opcion-btn.seleccionada {
      border-color: #3b82f6;
      background: #dbeafe;
    }

    .opcion-btn.correcta {
      border-color: #10b981;
      background: #d1fae5;
    }

    .opcion-btn.incorrecta {
      border-color: #ef4444;
      background: #fee2e2;
    }

    .opcion-btn:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    .opcion-letra {
      font-weight: 600;
      color: #1f2937;
      min-width: 24px;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .opcion-letra {
        min-width: 20px;
        font-size: 13px;
      }
    }

    .opcion-texto {
      flex: 1;
      color: #374151;
      line-height: 1.5;
      font-size: 15px;
    }

    @media (max-width: 768px) {
      .opcion-texto {
        font-size: 14px;
        line-height: 1.4;
      }
    }
  `
})
export class CardComponent {
  pregunta = input.required<PreguntaConOpciones>();
  numero = input.required<number>();
  mostrarResultados = input<boolean>(false);
  deshabilitado = input<boolean>(false);

  respuestaSeleccionada = output<{ pregunta: PreguntaConOpciones; respuesta: string }>();

  seleccionarRespuesta(respuesta: string): void {
    if (!this.deshabilitado()) {
      this.respuestaSeleccionada.emit({ pregunta: this.pregunta(), respuesta });
    }
  }

  obtenerLetra(index: number): string {
    return String.fromCharCode(65 + index);
  }
}
