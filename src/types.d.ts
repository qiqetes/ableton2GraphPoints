export type AbletonGraphPoint = {
  artist: string;
  block: string;
  blockIndex: number;
  endOfInterval: number;
  endTime: number;
  inLastBlock: boolean;
  intervalTime: number;
  method: string;
  nextRestAt: number;
  resistance: "Baja" | "Media-Baja" | "Media" | "Media-Alta" | "Alta";
  rpm: string;
  startOfInterval: number;
  startTime: number;
  timeString: string;
  track: string;
  zone: number;
};
