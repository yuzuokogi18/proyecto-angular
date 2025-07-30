export interface SignoWebSocket {
  data: {
    id_signos_paciente: number;
    id_paciente: number;
    id_signo: number;
    valor: number;
    unidad: string;
    fecha: string;
    hora: string;
  };
  event: string;
  patient_id: string;
  timestamp: number;
}
