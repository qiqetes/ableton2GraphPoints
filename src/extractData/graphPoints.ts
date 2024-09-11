// import { timeInSongTempo } from "./songTempo";

export const processLabelPoint = (
  label: string
): {
  zone: number;
  resistance: string;
  method: string;
} => {
  // Split the label by '=' character
  const parts = label.split("=");

  if (parts.length < 1) {
    throw new Error(`Invalid label: ${label}`);
  }

  // Initialize variables
  let zone = 0;
  let resistance = "Baja";
  let method = "";

  // Process each part of the label
  parts.forEach((part, index) => {
    const trimmedPart = part.trim();

    if (index === 0 && /^p?[0-9.,]+/.test(trimmedPart)) {
      zone = parseFloat(trimmedPart);
    } else if (index === 1 && /^[1-5]$/.test(trimmedPart)) {
      resistance = ResistanceMap[parseInt(trimmedPart, 10)];
    } else if (isNaN(parseFloat(trimmedPart))) {
      method = trimmedPart;
    }
  });

  return { zone, resistance, method };
};

const extractGraphPoints = (
  abletonRaw: AbletonRaw,
  songTempos: SongTempo[],
  songs: Song[],
  songStart: number,
  songEnd: number
): GraphPoint[] => {
  const locators: GraphPoint[] = [];
  const locatorsRaw =
    abletonRaw.Ableton.LiveSet.Locators.Locators.Locator.filter(
      (locatorRaw) =>
        parseFloat(locatorRaw.Time.Value) > songStart &&
        parseFloat(locatorRaw.Time.Value) < songEnd
    );

  // TODO: añadir el primer punto??
  locators.push(firstPoint);

  locatorsRaw.forEach((locatorRaw) => {
    const label = locatorRaw.Name.Value;
    const beat = parseInt(locatorRaw.Time.Value);
    let songTempo = songTempos.find((tempo) => tempo.beat === beat);
    if (!songTempo) {
      // songTempo = timeInSongTempo(songTempos, beat);
      songTempo = songTempos.findLast((tempo) => tempo.beat <= beat);
      if (!songTempo) {
        throw new Error(`Song tempo not found for beat ${beat}`);
      }
    }

    try {
      const { zone, resistance, method } = processLabelPoint(label);
      const song = songs.find(
        (song) => song.startBeat <= beat && song.endBeat >= beat
      );

      locators.push({
        zone,
        track: song?.name,
        artist: song?.artist,
        endOfInterval: 0,
        startOfInterval: 0,
        resistance: resistance as any,
        timeString: secondsToString(songTempo.timeSeconds),
        timeSeconds: songTempo.timeSeconds,
        block: "", // no sé que es
        method,
        rpm: songTempo.bpm.toString(),
      });
    } catch (error) {
      console.warn(error);
    }
  });

  const locatorsByTime = locators.sort((a, b) => a.timeSeconds - b.timeSeconds);

  return locatorsByTime;
};

export default extractGraphPoints;

export const secondsToString = (secondsNumber: number) => {
  const dateObj = new Date(secondsNumber * 1000);

  const hours = dateObj.getUTCHours();
  const minutes = dateObj.getUTCMinutes();
  const seconds = dateObj.getSeconds();

  if (hours > 0)
    return (
      hours.toString().padStart(2, "0") +
      ":" +
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0")
    );

  return (
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0")
  );
};

const ResistanceMap: { [key: number]: string } = {
  1: "Baja",
  2: "Media-Baja",
  3: "Media",
  4: "Media-Alta",
  5: "Alta",
};

const firstPoint: GraphPoint = {
  zone: 0,
  resistance: "Baja",
  method: "",
  timeString: "00:00:00",
  timeSeconds: 0,
  rpm: "",
  block: "",
  endOfInterval: 0,
  startOfInterval: 0,
};
