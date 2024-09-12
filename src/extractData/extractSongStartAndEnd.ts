const extractSongStartAndEnd = (
  raw: AbletonRaw
): { start: number; end: number } => {
  const transport = raw.LiveSet.Transport;
  if (!transport) throw Error("Transport not found");

  const start = parseFloat(transport.LoopStart.Value);
  const end = start + parseFloat(transport.LoopLength.Value);

  return { start, end };
};

export default extractSongStartAndEnd;
