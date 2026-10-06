/**
 * Fetch env var by name, optionally only when in dev mode.
 * Also prevents compiler from optimizing out injected strings in Docker
 */
const getEnv = (name: string, devOnly?: boolean) =>
  !devOnly || import.meta.env.DEV
    ? (import.meta.env[name] as string)
    : undefined;

export default {
  /** API URL; defaults to `/api` on the current origin (reverse-proxied setup) */
  DEFAULT_API_URL:
    getEnv("VITE_DEV_API_URL", true) ||
    getEnv("VITE_API_URL") ||
    `${location.origin}/api`,
  /** Source code link shown in settings (AGPL); defaults to the Sonm repository */
  SOURCE_URL: getEnv("VITE_SOURCE_URL") || "https://github.com/krynce/sonm-web",
  /**
   * Base URL of the unicode emoji packs (`<base>/<pack>/<codepoint>.svg`).
   * ponytail: defaults to upstream's CDN until we host the packs ourselves.
   */
  EMOJI_URL: getEnv("VITE_EMOJI_URL") || "https://static.stoat.chat/emoji",
  /** Optional help / support page, linked from error and loading screens */
  SUPPORT_URL: getEnv("VITE_SUPPORT_URL"),
  /**
   * RNNoise worklet CDN host location. Defaults to blank, which uses the url provided by the livekit-rnnoise-processor package.
   */
  RNNOISE_WORKLET_CDN_URL: getEnv("VITE_RNNOISE_WORKLET_CDN_URL"),
  /**
   * Session ID to set during development.
   */
  DEVELOPMENT_SESSION_ID: getEnv("VITE_SESSION_ID", true),
  /**
   * Token to set during development.
   */
  DEVELOPMENT_TOKEN: getEnv("VITE_TOKEN", true),
  /**
   * User ID to set during development.
   */
  DEVELOPMENT_USER_ID: getEnv("VITE_USER_ID", true),
};
