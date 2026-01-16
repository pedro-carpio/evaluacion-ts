import { Component, signal, computed, OnInit, OnDestroy, ChangeDetectionStrategy, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EvaluacionService } from '../services/evaluacion.service';
import { CardComponent } from '../components/card.component';
import { PreguntaConOpciones } from '../models/pregunta.model';

@Component({
  selector: 'app-materia',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent, RouterLink],
  template: `
    <div class="container">
      @if (cargando()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Cargando preguntas...</p>
        </div>
      } @else {
        <header class="header">
          <a [routerLink]="['/inicio']" class="btn-volver">
            ← Volver
          </a>
          <h1 class="titulo-materia">{{ nombreMateria() }}</h1>
          @if (generadoPorIA()) {
            <span class="badge-ia" title="Contenido generado con Inteligencia Artificial">🤖 IA</span>
          }
        </header>

        <div class="controles">
          <div class="control-group">
            <label for="cantidad">Cantidad de preguntas:</label>
            <select
              id="cantidad"
              [value]="cantidadPreguntas()"
              (change)="cambiarCantidad($event)"
              class="select"
            >
              <option [value]="10" [selected]="cantidadPreguntas() === 10">10 preguntas</option>
              <option [value]="15" [selected]="cantidadPreguntas() === 15">15 preguntas</option>
              <option [value]="25" [selected]="cantidadPreguntas() === 25">25 preguntas</option>
              <option [value]="50" [selected]="cantidadPreguntas() === 50">50 preguntas</option>
            </select>
          </div>

          <button
            type="button"
            (click)="generarPreguntasAleatorias()"
            class="btn-randomizar"
          >
            🔀 Randomizar
          </button>

          <div class="cronometro-group">
            <div class="cronometro-inputs">
              <input
                type="number"
                [value]="minutosConfig()"
                (input)="actualizarMinutos($event)"
                min="0"
                max="180"
                placeholder="Min"
                class="tiempo-input"
                [disabled]="cronometroIniciado()"
              />
              <span>:</span>
              <input
                type="number"
                [value]="segundosConfig()"
                (input)="actualizarSegundos($event)"
                min="0"
                max="59"
                placeholder="Seg"
                class="tiempo-input"
                [disabled]="cronometroIniciado()"
              />
            </div>
            <button
              type="button"
              (click)="toggleCronometro()"
              class="btn-cronometro"
            >
              {{ cronometroIniciado() ? 'Detener' : 'Iniciar' }}
            </button>
          </div>

          <div class="verificacion">
            <label class="checkbox-label">
              <input
                type="checkbox"
                [checked]="verificacionInstantanea()"
                (change)="toggleVerificacion()"
              />
              Verificación instantánea
            </label>
          </div>

          @if (!evaluacionConcluida()) {
            <button
              type="button"
              (click)="concluirEvaluacion()"
              class="btn-concluir"
            >
              ✓ Concluir
            </button>
          } @else {
            <button
              type="button"
              (click)="reiniciar()"
              class="btn-reintentar-top"
            >
              ↻ Volver a intentar
            </button>
          }
        </div>

        <div class="cronometro-flotante" [class.tiempo-agotado]="tiempoRestante() < 0">
          <span class="cronometro-tiempo">{{ tiempoFormateado() }}</span>
        </div>

        @if (verificacionInstantanea() || evaluacionConcluida()) {
          <div class="puntaje-flotante" [class.puntaje-bajo]="puntaje() < 51">
            <span class="puntaje-valor">{{ puntaje() }}/100</span>
          </div>
        }

        <div class="preguntas-lista">
          @for (pregunta of preguntasActuales(); track $index) {
            <app-card
              [pregunta]="pregunta"
              [numero]="$index + 1"
              [mostrarResultados]="verificacionInstantanea() || evaluacionConcluida()"
              [deshabilitado]="evaluacionConcluida()"
              (respuestaSeleccionada)="onRespuestaSeleccionada($event)"
            />
          }
        </div>

        @if (!evaluacionConcluida()) {
          <div class="boton-final-container">
            <button
              type="button"
              (click)="concluirYSubir()"
              class="btn-concluir-final"
            >
              ✓ Concluir Evaluación
            </button>
          </div>
        }

        @if (mostrarBotonArriba()) {
          <button type="button" class="btn-arriba" (click)="irArriba()">
            ↑
          </button>
        }
      }
    </div>
  `,
  styles: `
    .container {
      min-height: 100vh;
      background: #f9fafb;
      padding: 0;
    }

    .header {
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 20px;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .btn-volver {
      padding: 8px 16px;
      background: #6366f1;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      font-size: 14px;
      white-space: nowrap;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .btn-volver:hover {
      background: #4f46e5;
    }

    .titulo-materia {
      font-size: 20px;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
      flex: 1;
    }

    .badge-ia {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      cursor: help;
    }

    @media (max-width: 768px) {
      .header {
        padding: 12px 16px;
        gap: 12px;
      }

      .titulo-materia {
        font-size: 16px;
      }

      .badge-ia {
        font-size: 11px;
        padding: 4px 8px;
      }
    }

    .loading {
      text-align: center;
      padding: 60px 20px;
    }

    .spinner {
      border: 4px solid #e5e7eb;
      border-top: 4px solid #667eea;
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

    .controles {
      background: white;
      border-radius: 12px;
      padding: 16px;
      margin: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
      align-items: center;
    }

    @media (max-width: 768px) {
      .controles {
        grid-template-columns: 1fr;
        padding: 12px;
      }
    }

    .control-group, .cronometro-group {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    @media (max-width: 768px) {
      .control-group, .cronometro-group {
        flex-direction: column;
        align-items: stretch;
      }
    }

    .control-group label {
      font-weight: 500;
      color: #374151;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .control-group label {
        font-size: 12px;
      }
    }

    .select {
      padding: 8px 12px;
      border: 2px solid #e5e7eb;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      background: white;
      min-width: 120px;
    }

    .select:focus {
      outline: none;
      border-color: #667eea;
    }

    .btn-randomizar {
      padding: 8px 16px;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
      font-size: 14px;
      white-space: nowrap;
    }

    .btn-randomizar:hover:not(:disabled) {
      background: #059669;
    }

    .btn-randomizar:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .btn-concluir {
      padding: 8px 16px;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      font-size: 14px;
      white-space: nowrap;
    }

    .btn-concluir:hover {
      background: #dc2626;
    }

    .btn-reintentar-top {
      padding: 8px 16px;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      font-size: 14px;
      white-space: nowrap;
      grid-column: span 2;
    }

    .btn-reintentar-top:hover {
      background: #059669;
    }

    @media (max-width: 768px) {
      .btn-reintentar-top {
        grid-column: span 1;
      }
    }

    .cronometro-inputs {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .tiempo-input {
      width: 60px;
      padding: 8px;
      border: 2px solid #e5e7eb;
      border-radius: 6px;
      text-align: center;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .tiempo-input {
        width: 50px;
        padding: 6px;
      }
    }

    .tiempo-input:disabled {
      background: #f3f4f6;
      cursor: not-allowed;
    }

    .btn-cronometro {
      padding: 8px 16px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
      white-space: nowrap;
    }

    .btn-cronometro:hover:not(:disabled) {
      background: #5568d3;
    }

    .btn-cronometro:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .cronometro-flotante {
      position: fixed;
      top: 70px;
      right: 20px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 12px 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 999;
      transition: all 0.3s;
      border: 2px solid rgba(16, 185, 129, 0.5);
    }

    .cronometro-flotante.tiempo-agotado {
      background: rgba(254, 226, 226, 0.95);
      border-color: rgba(220, 38, 38, 0.8);
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2); }
      50% { transform: scale(1.05); box-shadow: 0 6px 16px rgba(220, 38, 38, 0.3); }
    }

    @media (max-width: 768px) {
      .cronometro-flotante {
        top: 80px;
        right: 10px;
        padding: 8px 16px;
      }
    }

    .cronometro-flotante .cronometro-tiempo {
      font-size: 24px;
      font-weight: 700;
      color: #10b981;
      font-variant-numeric: tabular-nums;
      font-family: 'Courier New', monospace;
      display: block;
    }

    .cronometro-flotante.tiempo-agotado .cronometro-tiempo {
      color: #dc2626;
    }

    @media (max-width: 768px) {
      .cronometro-flotante .cronometro-tiempo {
        font-size: 20px;
      }
    }

    .puntaje-flotante {
      position: fixed;
      right: 20px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 8px;
      padding: 6px 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 999;
      transition: all 0.3s;
      border: 2px solid rgba(59, 130, 246, 0.5);
    }

    .puntaje-flotante.puntaje-bajo {
      border-color: rgba(239, 68, 68, 0.6);
    }

    @media (max-width: 768px) {
      .puntaje-flotante {
        top: 135px;
        right: 10px;
        padding: 5px 10px;
      }
    }

    .puntaje-flotante .puntaje-valor {
      font-size: 16px;
      font-weight: 700;
      color: #3b82f6;
      font-variant-numeric: tabular-nums;
      font-family: 'Courier New', monospace;
      display: block;
    }

    .puntaje-flotante.puntaje-bajo .puntaje-valor {
      color: #ef4444;
    }

    @media (max-width: 768px) {
      .puntaje-flotante .puntaje-valor {
        font-size: 14px;
      }
    }

    .verificacion {
      grid-column: span 2;
    }

    @media (max-width: 768px) {
      .verificacion {
        grid-column: span 1;
      }
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-weight: 500;
      color: #374151;
      font-size: 14px;
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .checkbox-label input[type="checkbox"]:disabled {
      cursor: not-allowed;
    }

    .preguntas-lista {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 20px;
    }

    @media (max-width: 768px) {
      .preguntas-lista {
        max-width: 100%;
        padding: 0 16px;
      }
    }

    .boton-final-container {
      max-width: 800px;
      margin: 30px auto;
      padding: 0 20px;
      text-align: center;
    }

    .btn-concluir-final {
      padding: 16px 48px;
      background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 18px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    }

    .btn-concluir-final:hover {
      background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
    }

    @media (max-width: 768px) {
      .btn-concluir-final {
        padding: 14px 32px;
        font-size: 16px;
      }
    }

    .resultado-final {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 12px;
      padding: 40px 20px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 768px) {
      .resultado-final {
        margin: 20px auto;
        padding: 30px 16px;
      }
    }

    .resultado-final h2 {
      font-size: 28px;
      color: #1f2937;
      margin: 0 0 16px 0;
    }

    @media (max-width: 768px) {
      .resultado-final h2 {
        font-size: 24px;
      }
    }

    .puntaje-final {
      font-size: 22px;
      color: #667eea;
      font-weight: 600;
      margin: 0 0 32px 0;
    }

    @media (max-width: 768px) {
      .puntaje-final {
        font-size: 20px;
      }
    }

    .btn-reintentar {
      padding: 12px 32px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-reintentar:hover {
      background: #5568d3;
    }

    .btn-arriba {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 50%;
      font-size: 24px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      transition: all 0.3s;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-arriba:hover {
      background: #5568d3;
      transform: translateY(-3px);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
    }

    @media (max-width: 768px) {
      .btn-arriba {
        bottom: 20px;
        right: 20px;
        width: 45px;
        height: 45px;
        font-size: 20px;
      }
    }
  `
})
export class MateriaView implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly evaluacionService = inject(EvaluacionService);

  cargando = signal<boolean>(true);
  cantidadPreguntas = signal<number>(10);
  preguntasActuales = signal<PreguntaConOpciones[]>([]);
  verificacionInstantanea = signal<boolean>(false);
  evaluacionConcluida = signal<boolean>(false);
  mostrarBotonArriba = signal<boolean>(false);

  minutosConfig = signal<number>(15);
  segundosConfig = signal<number>(0);
  cronometroIniciado = signal<boolean>(false);
  tiempoRestante = signal<number>(900); // 15 minutos en segundos
  nombreMateria = signal<string>('');
  generadoPorIA = signal<boolean>(false);

  private intervalId: any = null;
  private todasLasPreguntas: any[] = [];

  puntaje = computed(() => {
    if (this.evaluacionConcluida()) {
      return this.evaluacionService.calcularPuntaje(this.preguntasActuales());
    }
    if (!this.verificacionInstantanea()) return 0;
    const preguntasRespondidas = this.preguntasActuales().filter(p => p.respuestaSeleccionada);
    if (preguntasRespondidas.length === 0) return 0;
    return this.evaluacionService.calcularPuntaje(preguntasRespondidas);
  });

  tiempoFormateado = computed(() => {
    const tiempo = this.tiempoRestante();
    const minutos = Math.floor(Math.abs(tiempo) / 60);
    const segundos = Math.abs(tiempo) % 60;
    const signo = tiempo < 0 ? '-' : '';
    return `${signo}${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  });

  async ngOnInit(): Promise<void> {
    const materiaId = this.route.snapshot.queryParams['materia'];

    try {
      const catalogo = await this.evaluacionService.cargarCatalogo();
      let archivoMateria = '';

      for (const carrera of catalogo.carreras) {
        const materia = carrera.materias.find((m: any) => m.id === materiaId);
        if (materia) {
          archivoMateria = materia.archivo;
          this.nombreMateria.set(materia.nombre);
          this.generadoPorIA.set(materia.generadoPorIA || false);
          break;
        }
      }

      if (archivoMateria) {
        this.todasLasPreguntas = await this.evaluacionService.cargarPreguntas(archivoMateria);
        this.generarPreguntasAleatorias();
      }

      this.cargando.set(false);
    } catch (e) {
      console.error('Error cargando preguntas:', e);
      this.cargando.set(false);
    }

    // Listener para mostrar botón de ir arriba
    window.addEventListener('scroll', () => {
      this.mostrarBotonArriba.set(window.scrollY > 300);
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  cambiarCantidad(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.cantidadPreguntas.set(Number(select.value));
    this.generarPreguntasAleatorias();
  }

  generarPreguntasAleatorias(): void {
    const preguntas = this.evaluacionService.generarPreguntasAleatorias(
      this.todasLasPreguntas,
      this.cantidadPreguntas()
    );
    this.preguntasActuales.set(preguntas);
  }

  actualizarMinutos(event: Event): void {
    const input = event.target as HTMLInputElement;
    const minutos = Math.max(0, Math.min(180, Number(input.value) || 0));
    this.minutosConfig.set(minutos);
    this.tiempoRestante.set(minutos * 60 + this.segundosConfig());
  }

  actualizarSegundos(event: Event): void {
    const input = event.target as HTMLInputElement;
    const segundos = Math.max(0, Math.min(59, Number(input.value) || 0));
    this.segundosConfig.set(segundos);
    this.tiempoRestante.set(this.minutosConfig() * 60 + segundos);
  }

  toggleCronometro(): void {
    if (this.cronometroIniciado()) {
      this.detenerCronometro();
    } else {
      this.iniciarCronometro();
    }
  }

  iniciarCronometro(): void {
    this.cronometroIniciado.set(true);
    this.intervalId = setInterval(() => {
      this.tiempoRestante.update(t => t - 1);
    }, 1000);
  }

  detenerCronometro(): void {
    this.cronometroIniciado.set(false);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  toggleVerificacion(): void {
    this.verificacionInstantanea.update(v => !v);
  }

  onRespuestaSeleccionada(event: { pregunta: PreguntaConOpciones; respuesta: string }): void {
    this.preguntasActuales.update(preguntas =>
      preguntas.map(p =>
        p === event.pregunta
          ? { ...p, respuestaSeleccionada: event.respuesta }
          : p
      )
    );
  }

  concluirEvaluacion(): void {
    this.evaluacionConcluida.set(true);
    this.verificacionInstantanea.set(true);
    this.detenerCronometro();
  }

  concluirYSubir(): void {
    this.concluirEvaluacion();
    this.irArriba();
  }

  reiniciar(): void {
    this.detenerCronometro();
    this.evaluacionConcluida.set(false);
    this.verificacionInstantanea.set(false);
    this.tiempoRestante.set(this.minutosConfig() * 60 + this.segundosConfig());
    this.generarPreguntasAleatorias();
  }

  irArriba(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
