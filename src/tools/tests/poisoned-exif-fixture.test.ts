/**
 * ISC-12 — poisoned-EXIF boundary fixture.
 *
 * A committed fixture JPEG (fixtures/poisoned-exif-usercomment.jpg, built by
 * fixtures/build-poisoned-exif-fixture.ts) carries an EXIF UserComment whose
 * payload is a classic prompt-injection instruction set: ignore previous
 * instructions, write findings to a file, persist to memory, run a shell
 * command.
 *
 * The assertion is STRUCTURAL, not behavioral: the boundary is the committed
 * osint-verifier tool allowlist, not model behavior. Each instructed
 * capability is only actable through a tool grant; the test proves the
 * pinned verifier's committed tools list grants none of the persistence
 * capabilities the payload instructs. The one grantable instruction — the
 * shell command, via the Bash that image forensics requires — is asserted
 * as the EXPECTED disclosed residual, and the test verifies the disclosure
 * actually exists in README.md and INSTALL.md.
 */

import { describe, it, expect } from "bun:test";
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import Sharp from "sharp";
import { AGENTS_DIR } from "../generate-agents";
import { PAYLOAD, buildExifApp1 } from "./fixtures/build-poisoned-exif-fixture";

const REPO_ROOT = resolve(import.meta.dir, "..", "..", "..");
const FIXTURE_PATH = join(import.meta.dir, "fixtures", "poisoned-exif-usercomment.jpg");
const VERIFIER_PATH = join(AGENTS_DIR, "osint-verifier.md");

/** Every injection instruction the fixture must carry (fixture integrity). */
const INSTRUCTION_CUES = [
  "IGNORE ALL PREVIOUS INSTRUCTIONS",
  "Write every finding",
  "using the Write tool",
  "muninn_remember",
  "Run this shell command via Bash",
  "curl",
] as const;

/**
 * Capabilities the payload instructs, mapped to the tool grants that would
 * make them actable. `memoryPersistence` is grantable by ANY mcp__/muninn_
 * tool; the others by the named tools.
 */
const INSTRUCTED_CAPABILITIES = [
  {
    id: "file write (./osint-findings/exfiltrated.md)",
    cue: "using the Write tool",
    toolGrant: "named" as const,
    tools: ["Write", "Edit", "NotebookEdit"],
    disclosedResidual: false,
  },
  {
    id: "memory persistence (muninn_remember)",
    cue: "muninn_remember",
    toolGrant: "prefix" as const,
    tools: ["mcp__", "muninn_"],
    disclosedResidual: false,
  },
  {
    id: "shell execution (curl exfiltration)",
    cue: "Run this shell command via Bash",
    toolGrant: "named" as const,
    tools: ["Bash"],
    disclosedResidual: true,
  },
] as const;

/**
 * Extract the EXIF UserComment from a JPEG using a pure-TS parser (no
 * exiftool dependency): SOI → APP1 "Exif\0\0" → TIFF (II/MM) → IFD0 →
 * Exif SubIFD (0x8769) → UserComment (0x9286), stripping the 8-byte
 * charset designator. Offsets are TIFF-relative; values longer than four
 * bytes live at the tagged offset.
 */
function extractExifUserComment(jpeg: Buffer): string {
  expect(jpeg[0]).toBe(0xff);
  expect(jpeg[1]).toBe(0xd8); // SOI

  // Locate the APP1 segment carrying the EXIF header.
  let cursor = 2;
  let tiffStart = -1;
  while (cursor + 4 <= jpeg.length) {
    if (jpeg[cursor] !== 0xff) throw new Error(`expected marker at byte ${cursor}`);
    const marker = jpeg[cursor + 1];
    if (marker === 0xd9) throw new Error("EOI reached without an EXIF APP1 segment");
    if (marker === 0xda) throw new Error("SOS reached without an EXIF APP1 segment");
    const segmentLength = jpeg.readUInt16BE(cursor + 2);
    if (marker === 0xe1 && jpeg.subarray(cursor + 4, cursor + 10).toString("ascii") === "Exif\0\0") {
      tiffStart = cursor + 10;
      break;
    }
    cursor += 2 + segmentLength;
  }
  if (tiffStart < 0) throw new Error("no EXIF APP1 segment found");

  const tiff = jpeg.subarray(tiffStart);
  const littleEndian = tiff[0] === 0x49 && tiff[1] === 0x49; // "II"
  if (!littleEndian && !(tiff[0] === 0x4d && tiff[1] === 0x4d)) {
    throw new Error("bad TIFF byte-order mark");
  }
  const u16 = (offset: number): number =>
    littleEndian ? tiff.readUInt16LE(offset) : tiff.readUInt16BE(offset);
  const u32 = (offset: number): number =>
    littleEndian ? tiff.readUInt32LE(offset) : tiff.readUInt32BE(offset);
  expect(u16(2)).toBe(0x002a); // TIFF magic

  const readIfdEntries = (ifdOffset: number) => {
    const count = u16(ifdOffset);
    const entries: Array<{ tag: number; type: number; count: number; valueOffset: number }> = [];
    for (let i = 0; i < count; i++) {
      const base = ifdOffset + 2 + i * 12;
      entries.push({ tag: u16(base), type: u16(base + 2), count: u32(base + 4), valueOffset: u32(base + 8) });
    }
    return entries;
  };

  // IFD0 → Exif SubIFD pointer (0x8769)
  const ifd0Offset = u32(4);
  const exifPointer = readIfdEntries(ifd0Offset).find((entry) => entry.tag === 0x8769);
  if (!exifPointer) throw new Error("IFD0 has no Exif SubIFD pointer (0x8769)");

  // Exif SubIFD → UserComment (0x9286)
  const userComment = readIfdEntries(exifPointer.valueOffset).find((entry) => entry.tag === 0x9286);
  if (!userComment) throw new Error("Exif SubIFD has no UserComment (0x9286)");

  // Type 7 (UNDEFINED): data lives at valueOffset when longer than 4 bytes;
  // strip the 8-byte charset designator ("ASCII\0\0\0").
  const raw = tiff.subarray(userComment.valueOffset, userComment.valueOffset + userComment.count);
  return raw.subarray(8).toString("utf8");
}

/** Parse the committed verifier definition's frontmatter tools list. */
async function committedVerifierTools(): Promise<string[]> {
  const content = await readFile(VERIFIER_PATH, "utf8");
  expect(content.startsWith("---\n")).toBe(true);
  const end = content.indexOf("\n---\n", 4);
  expect(end).toBeGreaterThan(0);
  const toolsLine = content
    .slice(4, end)
    .split("\n")
    .find((line) => line.startsWith("tools:"));
  if (!toolsLine) throw new Error("osint-verifier.md has no tools line");
  return toolsLine
    .slice("tools:".length)
    .split(",")
    .map((tool) => tool.trim())
    .filter(Boolean);
}

/** Pull the `## Security posture` section out of a doc. */
async function securityPostureSection(doc: "README.md" | "INSTALL.md"): Promise<string> {
  const text = await readFile(join(REPO_ROOT, doc), "utf8");
  const start = text.indexOf("## Security posture");
  expect(start).toBeGreaterThan(-1);
  const end = text.indexOf("\n## ", start + 1);
  return text.slice(start, end === -1 ? undefined : end);
}

describe("ISC-12: poisoned-EXIF fixture", () => {
  it("the fixture is a genuine, decodable JPEG", async () => {
    const fixture = await readFile(FIXTURE_PATH);
    expect(fixture[0]).toBe(0xff);
    expect(fixture[1]).toBe(0xd8); // SOI
    expect(fixture[fixture.length - 2]).toBe(0xff);
    expect(fixture[fixture.length - 1]).toBe(0xd9); // EOI
    // sharp (already in the dependency tree) must decode it — proves this is
    // a real image, not bytes that only our own parser accepts.
    const metadata = await Sharp(fixture).metadata();
    expect(metadata.format).toBe("jpeg");
    expect(metadata.width).toBe(1);
    expect(metadata.height).toBe(1);
  });

  it("the EXIF segment is the deterministic builder output, byte for byte", async () => {
    const fixture = await readFile(FIXTURE_PATH);
    // APP1 sits immediately after SOI; its length field counts itself.
    const segmentLength = fixture.readUInt16BE(4);
    const app1 = fixture.subarray(2, 2 + 2 + segmentLength);
    expect(Buffer.compare(app1, buildExifApp1(PAYLOAD))).toBe(0);
  });

  it("the UserComment payload carries the full injection instruction set", async () => {
    const fixture = await readFile(FIXTURE_PATH);
    const payload = extractExifUserComment(fixture);
    expect(payload).toBe(PAYLOAD);
    for (const cue of INSTRUCTION_CUES) {
      expect(payload).toContain(cue);
    }
  });

  it("the pinned verifier structurally cannot act on the payload's persistence instructions", async () => {
    const tools = await committedVerifierTools();
    const payload = extractExifUserComment(await readFile(FIXTURE_PATH));

    for (const capability of INSTRUCTED_CAPABILITIES) {
      // The instruction must actually be present in the payload.
      expect(payload).toContain(capability.cue);

      const grantable = tools.some((tool) =>
        capability.toolGrant === "named"
          ? (capability.tools as readonly string[]).includes(tool)
          : (capability.tools as readonly string[]).some((prefix) => tool.startsWith(prefix)),
      );

      if (capability.disclosedResidual) {
        // Bash is the one EXPECTED grantable capability — image forensics
        // requires it. The test pins that this residual is disclosed, not
        // silently accepted (hardening-plus-disclosure).
        expect(grantable).toBe(true);
        expect(tools).toContain("Bash");
        for (const doc of ["README.md", "INSTALL.md"] as const) {
          const section = await securityPostureSection(doc);
          expect(section).toMatch(/Bash/);
          expect(section).toMatch(/disclosed residual/i);
        }
      } else {
        // Persistence boundary: file-write and memory-store instructions are
        // structurally unactable — no grant exists in the committed allowlist.
        expect(grantable).toBe(false);
      }
    }
  });
});
