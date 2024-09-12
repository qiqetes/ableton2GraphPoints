import extractSongs from "./extractData/extractSongs";
import extractSongStartAndEnd from "./extractData/extractSongStartAndEnd";
import extractGraphPoints from "./extractData/graphPoints";
import extractSongTempo from "./extractData/songTempo";
import { AbletonGraphPoint } from "./types";

/**
 * Extracts graph points from an Ableton Json. .als files are XML files that contain all the information about a song in Ableton Live. To use this function
 * you need to convert the .als file to a .xml file.
 * @param abletonJSON ableton xml file in json format
 * @returns graphPoints used to create the graph
 */
const graphPointsFromAbletonJSON = (
  abletonJSON: AbletonRaw
): AbletonGraphPoint[] => {
  const AbletonData: AbletonData = {
    songStart: 0, // Start of the song in beats
    songEnd: 0, // End of the song in beats
    songTempo: [],
    songs: [],
    graphPoints: [],
  };
  const { start: songStart, end: songEnd } =
    extractSongStartAndEnd(abletonJSON);

  AbletonData.songStart = songStart;
  AbletonData.songEnd = songEnd;

  AbletonData.songTempo = extractSongTempo(abletonJSON, songStart, songEnd);
  AbletonData.songs = extractSongs(abletonJSON, AbletonData.songTempo);

  AbletonData.graphPoints = extractGraphPoints(
    abletonJSON,
    AbletonData.songTempo,
    AbletonData.songs,
    songStart,
    songEnd
  );

  return AbletonData.graphPoints;
};

export default graphPointsFromAbletonJSON;
