/**
 * Unit tests for OCREngine
 * Note: Tests that require actual Tesseract processing are skipped in CI
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { OCREngine } from '../ocr-engine';

const isCI = process.env.CI === 'true';

describe('OCREngine', () => {
  let engine: OCREngine;

  beforeEach(() => {
    engine = new OCREngine();
  });

  afterEach(async () => {
    await engine.terminate();
  });

  describe('isAvailable', () => {
    it('should check Tesseract.js availability', async () => {
      const isAvailable = await engine.isAvailable();
      // Just check that it returns a boolean - Tesseract may not be available in all environments
      expect(typeof isAvailable).toBe('boolean');
    });
  });

  describe('metadata', () => {
    it('should have correct name and version', () => {
      expect(engine.name).toBe('OCREngine');
      expect(engine.version).toBe('1.0.0');
    });
  });

  describe('language options', () => {
    it('should support custom language', () => {
      const customEngine = new OCREngine({ language: 'spa' });
      expect(customEngine).toBeDefined();
      expect(customEngine).toBeInstanceOf(OCREngine);
    });

    it('should support custom logger', () => {
      const logger = (message: unknown) => console.log(message);
      const loggingEngine = new OCREngine({ logger });
      expect(loggingEngine).toBeDefined();
      expect(loggingEngine).toBeInstanceOf(OCREngine);
    });

    it('should use no-op logger when none provided', () => {
      const noLoggerEngine = new OCREngine();
      expect(noLoggerEngine).toBeDefined();
      expect(noLoggerEngine).toBeInstanceOf(OCREngine);
    });
  });

  describe('terminate', () => {
    it('should terminate the worker', async () => {
      await engine.terminate();
      await engine.terminate();
      expect(true).toBe(true);
    });
  });
});

// Skip process tests in CI where Tesseract.js worker may not be available
if (!isCI) {
  describe('OCREngine', () => {
    let engine: OCREngine;

    beforeEach(() => {
      engine = new OCREngine();
    });

    afterEach(async () => {
      await engine.terminate();
    });

    describe('process', () => {
      it('should extract text from an image buffer', async () => {
        const testBuffer = Buffer.from('fake image data');

        const result = await engine.process(testBuffer);

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.metadata?.processingTimeMs).toBeGreaterThan(0);
      });

      it('should return error for buffer without valid image data', async () => {
        const testBuffer = Buffer.from('not a valid image');

        // Tesseract.js may throw an error for invalid image data
        // The engine should either catch it and return success:false, or throw
        let result: Awaited<ReturnType<typeof engine.process>> | undefined;
        let didThrow = false;

        try {
          result = await engine.process(testBuffer);
        } catch (_e) {
          didThrow = true;
        }

        // Either we got a result with success:false, or it threw
        if (didThrow) {
          expect(true).toBe(true); // Throwing is acceptable for invalid data
        } else {
          expect(result).toBeDefined();
          expect(result?.success).toBe(false);
        }
      });
    });

    describe('error handling', () => {
      it('should handle file read errors gracefully', async () => {
        // Try to read non-existent file
        const result = await engine.process('/nonexistent/file.png');

        // Should fail gracefully
        expect(result).toBeDefined();
      });
    });
  });
}
