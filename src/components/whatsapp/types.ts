export type WaDirection = "inbound" | "outbound";
export type WaType =
  | "text" | "image" | "video" | "audio" | "document" | "sticker" | "location"
  | "contacts" | "interactive" | "template" | "reaction" | "system" | "unsupported";
export type WaStatus = "queued" | "sending" | "sent" | "delivered" | "read" | "failed" | "received";

export type WaMessage = {
  id: string;
  direction: WaDirection;
  type: WaType;
  status: WaStatus;
  body: string | null;
  payload: unknown;
  mediaKey: string | null;
  mediaMime: string | null;
  mediaFilename: string | null;
  mediaSizeBytes: number | null;
  replyToProviderId: string | null;
  reactionToProviderId: string | null;
  isForwarded: boolean;
  providerMessageId: string | null;
  errorTitle: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  occurredAt: string;
};

export type WaThread = {
  id: string;
  displayName: string;
  phone: string | null;
  waProfileName: string | null;
  waLastMessageAt: string | null;
  waLastMessagePreview: string | null;
  waUnreadCount: number;
  waAwaitingReply: boolean;
  waWindowExpiresAt: string | null;
};
