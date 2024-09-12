import { skip } from "node:test";

const extractSongs = (
  abletonRaw: AbletonRaw,
  songTempos: SongTempo[]
): Song[] => {
  const songs: Song[] = [];
  const audioTracks = abletonRaw.LiveSet.Tracks.AudioTrack;
  if (!audioTracks || !audioTracks.length) throw Error("AudioTrack not found");

  audioTracks.forEach((songRaw) => {
    const audioClipRaw =
      songRaw.DeviceChain.MainSequencer.Sample.ArrangerAutomation.Events
        .AudioClip;
    if (!audioClipRaw) {
      console.error("AudioClip not found");
      return;
    }

    if (audioClipRaw instanceof Array) {
      audioClipRaw.forEach((audioClip) => {
        const newSong = extractSongFromAudioClipRaw(audioClip, songTempos);
        songs.push(newSong);
      });
    } else {
      const newSong = extractSongFromAudioClipRaw(audioClipRaw, songTempos);
      songs.push(newSong);
    }
  });

  return songs;
};
export default extractSongs;

const extractSongName = (name: string): { artist: string; song: string } => {
  // Example: "6A - 109 - Camarón De La Isla - Como El Agua - Vocals.mp3"
  const parts = name.split(" - ");
  if (parts.length < 4) {
    console.warn(`Invalid song name: ${name}`);
    return { artist: "", song: name };
  }

  // Extract artist and song
  const artist = parts[2];
  const song = parts[3];

  return { artist, song };
};

const extractSongFromAudioClipRaw = (
  audioClipRaw: AudioClipRaw,
  songTempos: SongTempo[]
): Song => {
  const { artist, song } = extractSongName(audioClipRaw.Name.Value);
  const newSong: Song = {
    name: song,
    artist,
    startBeat: parseFloat(audioClipRaw.CurrentStart.Value),
    endBeat: parseFloat(audioClipRaw.CurrentEnd.Value),
    startSecond:
      songTempos.find(
        (tempo) => tempo.beat == parseInt(audioClipRaw.CurrentStart.Value)
      )?.timeSeconds ?? 0,
    endSecond:
      songTempos.find(
        (tempo) => tempo.beat == parseInt(audioClipRaw.CurrentEnd.Value)
      )?.timeSeconds ?? songTempos.last().timeSeconds,
  };

  return newSong;
};
