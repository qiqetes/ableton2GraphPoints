import fs from "fs";
import xml2json from "xml2json";
import extractSongTempo from "./extractData/songTempo";
import extractGraphPoints from "./extractData/graphPoints";
import extractSongs from "./extractData/extractSongs";
import extractSongStartAndEnd from "./extractData/extractSongStartAndEnd";
import { arrayBuffer } from "stream/consumers";
import { AbletonGraphPoint } from "./types";
import graphPointsFromAbletonJSON from ".";

const main = () => {
  const dirPath = "./ableton_readables/";
  const filePath = dirPath + "noruego.als";
  const abletonXML = fs.readFileSync(filePath, "utf8");
  const abletonJson = getJsonFromAbletonXML(abletonXML);
  const graphPoints = graphPointsFromAbletonJSON(abletonJson.Ableton);
  fs.writeFileSync(
    dirPath + "noruego.json",
    JSON.stringify(graphPoints, null, 2)
  );
};

const getJsonFromAbletonXML = (abletonXML: string) => {
  const abletonJson = xml2json.toJson(abletonXML);
  return JSON.parse(abletonJson);
};

main();
