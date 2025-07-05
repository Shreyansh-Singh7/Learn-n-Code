export function formatDateTimeNow(): { date: string, time: string } {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const time = now.toTimeString().split(" ")[0];
  return { date, time };
}