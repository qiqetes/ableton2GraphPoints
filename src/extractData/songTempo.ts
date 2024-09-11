import "../extensions";

const ERR_MSG = "SongTempoExtractor: ";
const throwError = (msg: string) => {
  throw new Error(ERR_MSG + msg);
};

const extractSongTempo = (
  rawData: AbletonRaw,
  songStart: number,
  songEnd: number
): SongTempo[] => {
  const mainTrack =
    rawData.Ableton.LiveSet.MasterTrack || rawData.Ableton.LiveSet.MainTrack;
  if (!mainTrack) throwError("Master or Main track not found");
  const automationEnvelopes =
    mainTrack.AutomationEnvelopes.Envelopes.AutomationEnvelope;
  if (!automationEnvelopes) throwError("Automation envelopes not found");
  const automationEnvelope = automationEnvelopes[1];
  if (!automationEnvelope)
    throwError(
      "Automation envelope not found, should be the second element of the array"
    );

  const songTempo: SongTempo[] = [];

  const floatEvents = automationEnvelope.Automation.Events.FloatEvent.map(
    (floatEvent) => {
      return {
        Time: parseFloat(floatEvent.Time),
        Value: parseFloat(floatEvent.Value),
      };
    }
  ).sort((a, b) => a.Time - b.Time);

  if (!floatEvents || floatEvents.length < 2)
    throwError("FloatEvents not found");

  // Initial point
  songTempo.push({
    bpm: floatEvents[0].Value,
    beat: songStart,
    timeSeconds: 0,
  });

  floatEvents.forEach((event, index) => {
    if (index === 0) return;
    if (songTempo.last().beat > event.Time) {
      throw new Error(
        `Beat ${songTempo.last().beat} is greater than ${event.Time}`
      );
    }
    const beat = event.Time;
    if (beat < songStart || beat > songEnd) return;

    const bpm = event.Value;
    const lastTempo = songTempo.last();

    let time: number;
    if (lastTempo.beat == beat) {
      // Vertical line
      time = lastTempo.timeSeconds;
    } else if (lastTempo.bpm == bpm) {
      // Horizontal line
      time = horizontalTime(lastTempo.beat, beat, bpm, lastTempo.timeSeconds);
      // horizontalTempos(beat, bpm, songTempo);
    } else {
      // Diagonal line
      time = diagonalTime(
        lastTempo.beat,
        beat,
        lastTempo.bpm,
        bpm,
        beat,
        lastTempo.timeSeconds
      );
    }

    songTempo.push({ bpm, beat, timeSeconds: time });
  });

  return songTempo;
};

export const timeInSongTempo = (
  songTempo: SongTempo[],
  beat: number
): SongTempo => {
  const exact = songTempo.find((t) => t.beat == beat);
  if (exact) {
    return exact;
  }

  // find prevPoint and nextPoint
  const prevTempo = songTempo.findLast((t) => t.beat < beat);
  const nextTempo = songTempo.find((t) => t.beat > beat);

  if (!prevTempo) {
    throw Error(`No previous or next tempo found for beat ${beat}`);
  } else if (!nextTempo || prevTempo.bpm == nextTempo.bpm) {
    return {
      beat,
      bpm: prevTempo.bpm,
      timeSeconds: horizontalTime(
        prevTempo.beat,
        beat,
        prevTempo.bpm,
        prevTempo.timeSeconds
      ),
    };
  } else {
    return {
      beat,
      bpm: nextTempo.bpm,
      timeSeconds: diagonalTime(
        prevTempo.beat,
        beat,
        prevTempo.bpm,
        nextTempo.bpm,
        beat,
        prevTempo.timeSeconds
      ),
    };
  }
};

export const diagonalTime = (
  initialBeat: number,
  finalBeat: number,
  initialBPM: number,
  finalBPM: number,
  beat: number,
  initialTimeSeconds: number
) => {
  const totalBeatsStretch = finalBeat - initialBeat;
  const totalBeats = beat - initialBeat;
  if (totalBeatsStretch < 0)
    throw new Error(`Total beats is negative: ${totalBeatsStretch}`);

  const incrementBPM = Math.abs((finalBPM - initialBPM) / totalBeatsStretch);
  const initialBPMCorrected = Math.min(initialBPM, finalBPM);

  let incrementOfTimeSeconds;

  incrementOfTimeSeconds =
    (60 / incrementBPM) *
    (Math.log(initialBPMCorrected + incrementBPM * totalBeats) -
      Math.log(initialBPMCorrected));

  if (initialTimeSeconds === undefined) {
    throw new Error("Initial time seconds is undefined");
  }
  const finalTimeSeconds = initialTimeSeconds + incrementOfTimeSeconds;

  console.log(
    `Initial time ${initialTimeSeconds}, Final time ${finalTimeSeconds}\nDifference: ${incrementOfTimeSeconds}`
  );

  if (isNaN(finalTimeSeconds)) {
    throw new Error(
      `NaN: initialTimeSeconds ${initialTimeSeconds}, incrementOfTimeSeconds ${incrementOfTimeSeconds}`
    );
  }
  return finalTimeSeconds;
};

const horizontalTime = (
  intialBeat: number,
  beat: number,
  bpm: number,
  initialTimeSeconds: number
): number => {
  console.log("horizontalTime", intialBeat, beat, bpm, initialTimeSeconds);

  const secPerBeat = 60 / bpm;
  const totalBeats = beat - intialBeat;
  const time = totalBeats * secPerBeat;
  return time + initialTimeSeconds;
};

export default extractSongTempo;
