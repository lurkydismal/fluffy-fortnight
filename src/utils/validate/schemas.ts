import { z } from "zod";
import { sanitizeFilename } from "@/utils/stdfunc";
import dayjs from "@/utils/dayjs";
import { Dayjs } from "dayjs";

export const emptyToNull = <T extends z.ZodTypeAny>(schema: T) =>
    z.preprocess((val) => (val === "" ? null : val), schema.nullable());

/**
 * Schema for validating and sanitizing filenames.
 *
 * - Preprocesses the input using `sanitizeFilename`.
 * - Ensures the resulting string is non-empty.
 * - Throws if filename is invalid after sanitization.
 */
export const filenameSchema = z.preprocess(
    (v) => sanitizeFilename(v),
    z.string().min(1, { message: "File name became incorrect" }),
);

/**
 * Schema for validating a file path.
 *
 * - Must be a non-empty string.
 * - Must not start with "/".
 * - Must not contain backslashes "\".
 * - Must not contain ".." (parent traversal).
 * - Automatically appends a trailing "/" if missing.
 */
export const pathSchema = z
    .string()
    .min(1)
    .refine((p) => !p.startsWith("/"), "Must not start with '/'")
    .refine((p) => !p.includes("\\"), "Backslashes not allowed")
    .refine((p) => !p.includes(".."), "Parent traversal not allowed")
    .transform((p) => (p.endsWith("/") ? p : `${p}/`));

/**
 * Zod schema for validating date input.
 *
 * Accepts three types of values:
 * - `string` – a date string that Day.js can parse
 * - `Date` – a native JavaScript Date object
 * - `Dayjs` – an existing Day.js instance
 *
 * Validation behavior:
 * - `superRefine` runs a semantic check using `dayjs(v).isValid()`
 *   to ensure the value represents a valid date.
 * - If invalid, a Zod issue with the message "Invalid date" is added.
 *
 * Transformation behavior:
 * - `.transform((v) => dayjs(v))` converts all valid input types
 *   into a normalized Day.js instance.
 *
 * The schema is described as "Date input (string, Date, or Dayjs)" for
 * documentation and tooling purposes.
 */
export const dateInputSchema = z
    .union([
        z.string(),
        z.date(),
        // TODO: Maybe this
        // .refine(
        //     (d) => !Number.isNaN(d.getTime()),
        //     "Invalid date"
        // ),
        z.custom<Dayjs>((v) => dayjs.isDayjs(v)),
    ])
    .superRefine((v, ctx) => {
        if (!dayjs(v).isValid()) {
            ctx.addIssue({
                code: "custom",
                message: "Invalid date",
            });
        }
    })
    .transform((v) => dayjs(v))
    .describe("Date input (string, Date, or Dayjs)");
