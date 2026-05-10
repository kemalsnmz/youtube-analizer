export type InputType =
  | "channel_url"     // youtube.com/channel/UCxxx
  | "handle_url"      // youtube.com/@handle
  | "custom_url"      // youtube.com/c/name
  | "handle"          // @handle
  | "channel_id"      // UCxxxxx
  | "unknown";

export interface ParsedInput {
  type: InputType;
  value: string;
}

export function validateYoutubeInput(raw: string): boolean {
  if (!raw || raw.trim().length < 2) return false;
  return true;
}

export function parseYoutubeInput(raw: string): ParsedInput {
  const input = raw.trim();

  // youtube.com/channel/UCxxx
  const channelIdMatch = input.match(
    /(?:youtube\.com\/channel\/)([a-zA-Z0-9_-]{24})/
  );
  if (channelIdMatch) {
    return { type: "channel_url", value: channelIdMatch[1] };
  }

  // youtube.com/@handle
  const handleUrlMatch = input.match(/youtube\.com\/@([a-zA-Z0-9._-]+)/);
  if (handleUrlMatch) {
    return { type: "handle_url", value: handleUrlMatch[1] };
  }

  // youtube.com/c/name
  const customUrlMatch = input.match(/youtube\.com\/c\/([a-zA-Z0-9._-]+)/);
  if (customUrlMatch) {
    return { type: "custom_url", value: customUrlMatch[1] };
  }

  // @handle (bare)
  if (input.startsWith("@")) {
    return { type: "handle", value: input.slice(1) };
  }

  // Raw UCxxx channel ID
  if (/^UC[a-zA-Z0-9_-]{22}$/.test(input)) {
    return { type: "channel_id", value: input };
  }

  // Treat anything else as a search query / custom URL slug
  return { type: "unknown", value: input };
}

/** Parse ISO 8601 duration string (PT4M13S) → seconds */
export function parseDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] ?? "0", 10);
  const minutes = parseInt(match[2] ?? "0", 10);
  const seconds = parseInt(match[3] ?? "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

/** Shorts threshold: <= 60 seconds */
export function isShortVideo(durationSeconds: number): boolean {
  return durationSeconds > 0 && durationSeconds <= 60;
}
