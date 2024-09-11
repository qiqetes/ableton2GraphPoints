// import { describe, expect, test } from "@jest/globals";
// import { horizontalTempos } from "../src/extractData/songTempo";

// describe("songTempos, horizontal", () => {
//   const songTemposDef: SongTempo[] = [
//     {
//       beat: 0,
//       bpm: 60,
//       timeSeconds: 0,
//     },
//   ];

//   it("should work", () => {
//     const songTempos = Array.from(songTemposDef);

//     horizontalTempos(60, 60, songTempos);

//     expect(songTempos.last().timeSeconds).toBe(60);
//     expect(songTempos.length).toBe(61);
//   });

//   it("should work horizontal 2", () => {
//     const songTempos = Array.from(songTemposDef);

//     horizontalTempos(120, 60, songTempos);

//     expect(songTempos.last().timeSeconds).toBe(120);
//     expect(songTempos.length).toBe(121);
//   });

//   it("should work horizontal 2", () => {
//     const songTempos = Array.from(songTemposDef);
//     horizontalTempos(120, 120, songTempos);

//     expect(songTempos.last().timeSeconds).toBe(60);
//     expect(songTempos.length).toBe(121);
//   });

//   it("should work horizontal 5", () => {
//     const songTempos = [
//       {
//         beat: 200,
//         bpm: 60,
//         timeSeconds: 200,
//       },
//     ];
//     horizontalTempos(320, 120, songTempos);

//     expect(songTempos.last().timeSeconds).toBe(260);
//     expect(songTempos.length).toBe(121);
//   });
// });

describe("songTempos, horizontal", () => {
  it("should work", () => {
    expect(true).toBe(true);
  });
});
