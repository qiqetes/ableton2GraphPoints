import fs from "fs";
import xml2json from "xml2json";
import extractSongTempo from "./extractData/songTempo";
import extractGraphPoints from "./extractData/graphPoints";
import extractSongs from "./extractData/extractSongs";
import extractSongStartAndEnd from "./extractData/extractSongStartAndEnd";
import { arrayBuffer } from "stream/consumers";

const main = () => {
  const dirPath = "./ableton_readables/";
  const filePath = dirPath + "noruego.als";
  const abletonXML = fs.readFileSync(filePath, "utf8");
  const abletonRaw = graphPointsFromAbletonXML(abletonXML);
};

const getJsonFromAbletonXML = (abletonXML: string) => {
  const abletonJson = xml2json.toJson(abletonXML);
  return JSON.parse(abletonJson);
};

const graphPointsFromAbletonXML = (abletonXML: string) => {
  const abletonRaw = getJsonFromAbletonXML(abletonXML);

  const AbletonData: AbletonData = {
    songStart: 0, // Start of the song in beats
    songEnd: 0, // End of the song in beats
    songTempo: [],
    songs: [],
    graphPoints: [],
  };
  const { start: songStart, end: songEnd } = extractSongStartAndEnd(abletonRaw);

  AbletonData.songStart = songStart;
  AbletonData.songEnd = songEnd;

  AbletonData.songTempo = extractSongTempo(abletonRaw, songStart, songEnd);
  AbletonData.songs = extractSongs(abletonRaw, AbletonData.songTempo);

  AbletonData.graphPoints = extractGraphPoints(
    abletonRaw,
    AbletonData.songTempo,
    AbletonData.songs,
    songStart,
    songEnd
  );

  return AbletonData.graphPoints;
};

main();
