// src/app/models/sign.model.ts
export interface Sign {
  id_signos_paciente: number;
  id_paciente: number;
  id_signo: number;
  valor: number;
  unidad: string;
  fecha: string;
  hora: string;
  turno?: string;
}
