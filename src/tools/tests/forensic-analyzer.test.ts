/**
 * Unit tests for ForensicAnalyzer
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { ForensicAnalyzer } from '../forensic-analyzer';
import { PNG } from 'pngjs';

const isCI = process.env.CI === 'true';

describe('ForensicAnalyzer', () => {
  let analyzer: ForensicAnalyzer;

  beforeEach(() => {
    analyzer = new ForensicAnalyzer();
  });

  describe('isAvailable', () => {
    it('should check Sharp availability', async () => {
      const isAvailable = await analyzer.isAvailable();
      expect(typeof isAvailable).toBe('boolean');
    });
  });

  describe('metadata', () => {
    it('should have correct name and version', () => {
      expect(analyzer.name).toBe('ForensicAnalyzer');
      expect(analyzer.version).toBe('1.0.0');
    });
  });
});

// Skip process tests in CI where Sharp is unavailable
if (!isCI) {
  describe('ForensicAnalyzer', () => {
    let analyzer: ForensicAnalyzer;

    beforeEach(() => {
      analyzer = new ForensicAnalyzer();
    });

    describe('process', () => {
      it('should analyze a valid image', async () => {
        // Create a simple test PNG
        const png = new PNG({ width: 100, height: 100 });

        // Fill with gradient
        for (let y = 0; y < 100; y++) {
          for (let x = 0; x < 100; x++) {
            const i = (y * 100 + x) * 4;
            png.data[i] = Math.floor(255 * (y / 100));
            png.data[i + 1] = Math.floor(255 * (x / 100));
            png.data[i + 2] = Math.floor(255 * ((x + y) / 200));
            png.data[i + 3] = 255;
          }
        }

        const testBuffer = PNG.sync.write(png);
        const result = await analyzer.process(testBuffer);

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
      });
    });
  });
}
