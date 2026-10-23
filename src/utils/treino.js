/** Índice do treino apontado por ?treino=<id>; -1 quando o parâmetro é inválido. */
export function indiceTreinoDaUrl(treinos = [], param) {
  if (param == null || !/^\d+$/.test(param)) return -1;
  const id = Number(param);
  if (!Number.isInteger(id) || id <= 0) return -1;
  return treinos.findIndex((treino) => treino.id === id);
}
