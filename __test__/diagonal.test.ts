import { describe, expect, test } from "@jest/globals";
import { diagonalTime } from "../src/extractData/songTempo";
// import { diagonalTempos, horizontalTempos } from "../src/extractData/songTempo";

describe("songTempos, horizontal", () => {
  const songTemposDef: SongTempo[] = [
    {
      beat: 0,
      bpm: 90,
      timeSeconds: 0,
    },
  ];

  it("Initial bpm 150, goes to 90 at beat 100", () => {
    const time = diagonalTime(0, 673, 84, 180, 673, 0);

    expect(Math.floor(time)).toBe(5 * 60 + 20);
  });

  it("Initial bpm 150, goes to 90 at beat 100", () => {
    const time = diagonalTime(673, 3329, 84, 177.83, 3329, 320.57);

    expect(time).toBeCloseTo(26 * 60 + 33.8);
  });

  it("Initial bpm 150, goes to 90 at beat 100", () => {
    const time = diagonalTime(673, 3329, 84, 177.83, 200, 320.57);

    expect(time).toBeCloseTo(26 * 60 + 33.8);
  });
});
