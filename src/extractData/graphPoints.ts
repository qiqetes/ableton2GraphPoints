// import { timeInSongTempo } from "./songTempo";

import { AbletonGraphPoint } from "../types";
import { timeInSongTempo } from "./songTempo";

// Comes from mixmeisterFunctions
export const processLabelPoint = (
  label: string
): {
  zone: number;
  resistance: string;
  method: string;
} => {
  let zone: number | undefined; // Este valor debe ser undefined siempre al inicio.
  let resistance: number | undefined;
  let method: string = "";

  label.split("=").forEach((value) => {
    console.log(value);
    const numericValue = value.match(/^p?[0-9.,]+/)?.length;
    if (numericValue && !zone) {
      // Primer valor numerico es la zona
      zone = parseFloat(value.replace("p", "")) - 1;
    } else if (numericValue) {
      // segundo valor númerico es la resistencia
      resistance = parseFloat(value);
    } else if (isNaN(parseFloat(value))) {
      // cualquier string es el método de trabajo
      method = value;
    }
  });

  return {
    zone: zone ?? 0,
    resistance: ResistanceMap[resistance ?? 1],
    method: method,
  };
};

const extractGraphPoints = (
  abletonRaw: AbletonRaw,
  songTempos: SongTempo[],
  songs: Song[],
  songStart: number,
  songEnd: number
): AbletonGraphPoint[] => {
  const locators: AbletonGraphPoint[] = [];
  const locatorsRaw = abletonRaw.LiveSet.Locators.Locators.Locator.filter(
    (locatorRaw) =>
      parseFloat(locatorRaw.Time.Value) > songStart &&
      parseFloat(locatorRaw.Time.Value) < songEnd
  );

  locators.push(firstPoint);

  locatorsRaw.forEach((locatorRaw) => {
    const label = locatorRaw.Name.Value;
    const beat = parseInt(locatorRaw.Time.Value);
    const songTempo = timeInSongTempo(songTempos, beat);

    try {
      const { zone, resistance, method } = processLabelPoint(label);

      const song = songs.find(
        (song) => song.startBeat <= beat && song.endBeat >= beat
      );

      locators.push({
        zone,
        track: song?.name ?? "",
        artist: song?.artist ?? "",
        endOfInterval: 0,
        startOfInterval: 0,
        resistance: resistance as any,
        timeString: secondsToString(songTempo.timeSeconds),
        endTime: songTempo.timeSeconds,
        blockIndex: 0,
        intervalTime: 0,
        inLastBlock: false,
        nextRestAt: 0,
        startTime: songTempo.timeSeconds,
        block: "", // no sé que es
        method,
        rpm: songTempo.bpm.toString(),
      });
    } catch (error) {
      console.warn(error);
    }
  });

  // The zone is shifted to the left if its Watts
  locators.forEach((locator, index) => {
    locator.zone = locators[index + 1]?.zone;
  });

  const locatorsByTime = locators.sort((a, b) => a.startTime - b.startTime);

  //@ts-ignore
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
      seconds.toString().padStart(2, "0") +
      ":00"
    );

  return (
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0") +
    ":00"
  );
};

const ResistanceMap: { [key: number]: string } = {
  1: "Baja",
  2: "Media-Baja",
  3: "Media",
  4: "Media-Alta",
  5: "Alta",
};

// @ts-ignore - This is a dummy point that is added to the start of the
// graph, doesn't have some properties that the other points have
const firstPoint: AbletonGraphPoint = {
  zone: 0,
  resistance: "Baja",
  method: "",
  timeString: "00:00:00",
  startTime: 0,
  rpm: "",
  block: "",
  endOfInterval: 0,
  startOfInterval: 0,
};
