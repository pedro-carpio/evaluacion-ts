import { Component, signal, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EvaluacionService } from '../services/evaluacion.service';
import { Carrera, Materia } from '../models/pregunta.model';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="container">
      <header class="header">
        <h1>Sistema de Evaluación</h1>
        <p class="subtitle">Selecciona una evaluación de prueba</p>
      </header>

      <div class="disclaimer">
        <h3>📋 Aviso Importante</h3>
        <p>
          Esta es una herramienta de <strong>práctica personal</strong> únicamente, no esta avalada por ningun docente.
          Los resultados obtenidos <strong>NO reflejan una nota de aprobación</strong> en ningún contexto académico oficial.
          Esta aplicación es solo para fines de autoevaluación y estudio.
        </p>
      </div>

      @if (cargando()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Cargando catálogo...</p>
        </div>
      } @else if (error()) {
        <div class="error">
          <p>{{ error() }}</p>
        </div>
      } @else {
        <div class="carreras">
          @for (carrera of carreras(); track carrera.id) {
            <section class="carrera-section">
              <h2 class="carrera-titulo">{{ carrera.nombre }}</h2>

              @if (carrera.advertencia) {
                <div class="advertencia-ia">
                  {{ carrera.advertencia }}
                </div>
              }

              <div class="materias-grid">
                @for (materia of carrera.materias; track materia.id) {
                  @if (!materia.privado) {
                    <button
                      type="button"
                      class="materia-card"
                      (click)="seleccionarMateria(carrera.id, materia)"
                    >
                      <h3 class="materia-nombre">
                        {{ materia.nombre }}
                        @if (materia.generadoPorIA) {
                          <span class="badge-ia">IA</span>
                        }
                      </h3>
                      <p class="materia-descripcion">{{ materia.descripcion }}</p>
                      <span class="materia-accion">Tomar evaluación →</span>
                    </button>
                  }
                }
              </div>
            </section>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
    }

    @media (max-width: 768px) {
      .container {
        padding: 20px 10px;
      }
    }

    .header {
      text-align: center;
      color: white;
      margin-bottom: 24px;
    }

    .header h1 {
      font-size: 48px;
      font-weight: 700;
      margin: 0 0 12px 0;
    }

    @media (max-width: 768px) {
      .header h1 {
        font-size: 32px;
      }
    }

    .subtitle {
      font-size: 20px;
      opacity: 0.9;
      margin: 0;
    }

    @media (max-width: 768px) {
      .subtitle {
        font-size: 16px;
      }
    }

    .disclaimer {
      max-width: 800px;
      margin: 0 auto 32px;
      background: #fff3cd;
      border: 2px solid #ffc107;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 768px) {
      .disclaimer {
        padding: 16px;
        margin-bottom: 24px;
      }
    }

    .disclaimer h3 {
      margin: 0 0 12px 0;
      color: #856404;
      font-size: 20px;
    }

    @media (max-width: 768px) {
      .disclaimer h3 {
        font-size: 18px;
      }
    }

    .disclaimer p {
      margin: 0;
      color: #856404;
      line-height: 1.6;
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .disclaimer p {
        font-size: 14px;
      }
    }

    .loading, .error {
      text-align: center;
      color: white;
      padding: 40px;
    }

    .spinner {
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .carreras {
      max-width: 1200px;
      margin: 0 auto;
    }

    .carrera-section {
      background: white;
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 32px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 768px) {
      .carrera-section {
        padding: 20px;
        margin-bottom: 20px;
      }
    }

    .carrera-titulo {
      font-size: 28px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 16px 0;
    }

    @media (max-width: 768px) {
      .carrera-titulo {
        font-size: 24px;
      }
    }

    .advertencia-ia {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 16px;
      margin-bottom: 24px;
      border-radius: 8px;
      color: #92400e;
      font-size: 14px;
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .advertencia-ia {
        padding: 12px;
        font-size: 13px;
      }
    }

    .materias-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    @media (max-width: 768px) {
      .materias-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }

    .materia-card {
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      border: 2px solid transparent;
      border-radius: 12px;
      padding: 24px;
      text-align: left;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    @media (max-width: 768px) {
      .materia-card {
        padding: 20px;
      }
    }

    .materia-card:hover {
      transform: translateY(-4px);
      border-color: #667eea;
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.2);
    }

    @media (max-width: 768px) {
      .materia-card:hover {
        transform: translateY(-2px);
      }
    }

    .materia-nombre {
      font-size: 20px;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    @media (max-width: 768px) {
      .materia-nombre {
        font-size: 18px;
      }
    }

    .badge-ia {
      display: inline-block;
      background: #f59e0b;
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 700;
    }

    .materia-descripcion {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
      flex: 1;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .materia-descripcion {
        font-size: 13px;
      }
    }

    .materia-accion {
      font-size: 14px;
      font-weight: 600;
      color: #667eea;
      align-self: flex-end;
    }
  `
})
export class HomeView implements OnInit {
  private readonly router = inject(Router);
  private readonly evaluacionService = inject(EvaluacionService);

  carreras = signal<Carrera[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string>('');

  async ngOnInit(): Promise<void> {
    try {
      const catalogo = await this.evaluacionService.cargarCatalogo();
      this.carreras.set(catalogo.carreras);
      this.cargando.set(false);
    } catch (e) {
      this.error.set('Error al cargar el catálogo de evaluaciones');
      this.cargando.set(false);
      console.error('Error cargando catálogo:', e);
    }
  }

  seleccionarMateria(carreraId: string, materia: Materia): void {
    this.router.navigate([`/${carreraId}/evaluacion`], {
      queryParams: { materia: materia.id }
    });
  }
}
