type AbletonRaw = {
  LiveSet: {
    Tracks: {
      AudioTrack: {
        DeviceChain: {
          MainSequencer: {
            Sample: {
              ArrangerAutomation: {
                Events: {
                  AudioClip: AudioClipRaw | AudioClipRaw[];
                };
              };
            };
          };
        };
      }[];
    };
    MasterTrack: MainTrackRaw;
    MainTrack: MainTrackRaw;
    Locators: {
      Locators: {
        Locator: {
          Time: { Value: string }; // beat
          Name: { Value: string }; // "p3.5=4=HIIT"
          IsSongStart: { Value: string }; // "false"
        }[];
      };
    };
    Transport: {
      LoopStart: { Value: string }; // Start of the song
      LoopLength: { Value: string }; // End of the song
      LoopIsSongStart: { Value: string }; // boolean, We assume it's always true
    };
  };
};

type AudioClipRaw = {
  Time: string;
  CurrentStart: {
    Value: string; // start in beats in timeline
  };
  CurrentEnd: {
    Value: string; // end in beats in timeline
  };
  Name: {
    Value: string; // Name of the song (with artist)
  };
};

type MainTrackRaw = {
  AutomationEnvelopes: {
    Envelopes: {
      AutomationEnvelope: {
        Id: string;
        Automation: {
          Events: {
            FloatEvent: {
              Id: string;
              Time: string; // tiempo en beats
              Value: string; // BPM
            }[]; // El primer elemento del array tiene un tiempo negativo, pero como si fuese 0
          };
        };
      }[];
    };
  };
};

type AbletonData = {
  songStart: number;
  songEnd: number;
  songTempo: SongTempo[];
  graphPoints: AbletonGraphPoint[];
  songs: Song[];
};

type SongTempo = {
  bpm: number;
  beat: number;
  timeSeconds: number;
};

type Song = {
  name: string;
  artist: string;
  startBeat: number;
  endBeat: number;
  startSecond: number;
  endSecond: number;
};
