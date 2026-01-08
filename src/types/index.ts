export type AppStatus =
  | "idle"
  | "recording"
  | "processing_audio"
  | "transcribing"
  | "thinking"
  | "error";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
