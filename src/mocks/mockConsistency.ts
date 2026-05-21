

export const mockSessionsData = {
  // Dias concluídos (Azul Escuro)
  "2026-05-01": "completed",
  "2026-05-04": "completed",
  "2026-05-05": "completed",
  "2026-05-08": "completed",
  "2026-05-11": "completed",
  "2026-05-12": "completed",
  "2026-05-13": "completed",
  "2026-05-15": "completed",
  "2026-05-18": "completed",
  "2026-05-19": "completed",

  // Dias apenas iniciados, mas não concluídos (Azul Claro)
  "2026-05-06": "started",
  "2026-05-14": "started",
  "2026-05-20": "started", // ontem
  "2026-05-21": "started", // HOJE (ficará com a borda azul destacada + fundo azul claro)

  // Exemplo de meses anteriores para testar a navegação das setas
  "2026-04-10": "completed",
  "2026-04-11": "completed",
  "2026-04-12": "started",
  "2026-04-25": "completed",
  
  "2026-03-15": "completed",
  "2026-03-16": "completed"
};