import { getEnv } from "./stdfunc";

/**
 * Flag indicating whether detailed trace logging should be enabled.
 * - `true` forces verbose logging regardless of environment.
 * - `false` disables trace-level logging unless explicitly set elsewhere.
 */
export const needTrace = false;

/**
 * Flag indicating if the current environment is development.
 * - Determined by the `NODE_ENV` environment variable.
 * - `true` if `process.env.NODE_ENV === "development"`.
 */
export const isDev = getEnv("NODE_ENV", "development") === "development";

/**
 * Flag indicating if the current environment is production.
 * - `true` if `process.env.NODE_ENV === "production"`.
 * - Useful for conditional logic that should only run in production.
 */
export const isProd = getEnv("NODE_ENV", "development") === "production";

/**
 * Flag indicating if the current environment is a test environment.
 * - `true` if `process.env.NODE_ENV === "test"`.
 * - Useful for skipping certain behaviors or using mock data in tests.
 */
export const isTest = getEnv("NODE_ENV", "development") === "test";

/**
 * Flag indicating if the code is running in a browser environment.
 * - `true` if `window` is defined.
 * - Useful for distinguishing server vs client code execution.
 */
export const isBrowser = typeof window !== "undefined";

/**
 * Flag indicating if the code is running on the server.
 * - `true` when `window` is undefined (e.g., Node.js or SSR).
 * - Useful for distinguishing server vs client execution.
 */
export const isServer = !isBrowser;

/**
 * URL for the GitHub repository or project link.
 * - Defaults to `"#"` if the environment variable `GITHUB_LINK` is not set.
 */
export const githubUrl = getEnv("NEXT_PUBLIC_GITHUB_LINK", "#");

/**
 * Build timestamp for the current application run.
 * - Represents the exact time the code was executed or built.
 */
export const buildDate = new Date();

/**
 * Build year extracted from `buildDate`.
 * - Useful for copyright or display purposes.
 */
export const buildYear = buildDate.getFullYear();

/**
 * Name of the application.
 * - Used in logging, UI, or headers.
 */
export const appName = "fluffy fortnite";

/**
 * Version of the application.
 * - Useful for logging, cache busting, or displaying in UI.
 */
export const appVersion = "0.1.0";

/**
 * Asset prefix for static assets.
 * - Mirrors `assetPrefix` from Next.js config.
 * - Fetched from environment variable `NEXT_PUBLIC_ASSET_PREFIX`.
 * - Defaults to empty string if not set.
 */
export const assetPrefix = getEnv("NEXT_PUBLIC_ASSET_PREFIX", "");

/**
 * Default date format used throughout the application.
 * - Format string: `"DD.MM.YYYY"`.
 * - Example: `"07.01.2026"`.
 */
export const dateFormat = "DD.MM.YYYY";

/**
 * Default timezone used for date/time operations.
 * - Example: `"UTC"`.
 */
export const timeZone = "UTC";

/**
 * Default full date/time format including hours and minutes.
 * - Format string: `"HH:mm DD.MM.YYYY"`.
 * - Example: `"14:30 07.01.2026"`.
 */
export const dateTimeFormat = "HH:mm DD.MM.YYYY";
