/** Data ISO (YYYY-MM-DD) no fuso local, nunca em UTC. */
export function dataLocalISO(data = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${data.getFullYear()}-${pad(data.getMonth() + 1)}-${pad(data.getDate())}`;
}
