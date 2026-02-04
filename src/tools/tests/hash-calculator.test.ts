/**
 * Unit tests for HashCalculator
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { HashCalculator } from '../hash-calculator';
import { PNG } from 'pngjs';

const isCI = process.env.CI === 'true';

describe('HashCalculator', () => {
  let calculator: HashCalculator;

  beforeEach(() => {
    calculator = new HashCalculator();
  });

  describe('isAvailable', () => {
    it('should check Sharp availability', async () => {
      const isAvailable = await calculator.isAvailable();
      // Just check that it returns a boolean - Sharp may not be available in all environments
      expect(typeof isAvailable).toBe('boolean');
    });
  });

  describe('metadata', () => {
    it('should have correct name and version', () => {
      expect(calculator.name).toBe('HashCalculator');
      expect(calculator.version).toBe('1.0.0');
    });
  });
});

// Skip process tests in CI where Sharp is unavailable
if (!isCI) {
  describe('HashCalculator', () => {
    let calculator: HashCalculator;

    beforeEach(() => {
      calculator = new HashCalculator();
    });

    describe('process', () => {
      it('should calculate all hash types for a valid image', async () => {
        const testImageData = Buffer.alloc(8 * 8, 128);

        // Create PNG with this data
        const png = new PNG({ width: 8, height: 8 });
        png.data = testImageData;
        const testBuffer = PNG.sync.write(png);

        const result = await calculator.process(testBuffer);

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data?.aHash).toBeDefined();
        expect(result.data?.pHash).toBeDefined();
        expect(result.data?.dHash).toBeDefined();
        expect(result.data?.wHash).toBeDefined();

        // Hashes should be hexadecimal strings
        expect(result.data?.aHash).toMatch(/^[0-9a-f]{16}$/);
        expect(result.data?.pHash).toMatch(/^[0-9a-f]{16}$/);
        expect(result.data?.dHash).toMatch(/^[0-9a-f]{16}$/);
        expect(result.data?.wHash).toMatch(/^[0-9a-f]{16}$/);
      });

      it('should return consistent hashes for same image', async () => {
        const png1 = new PNG({ width: 8, height: 8 });
        const png2 = new PNG({ width: 8, height: 8 });

        // Fill with same data
        for (let i = 0; i < png1.data.length; i += 4) {
          png1.data[i] = 128;
          png1.data[i + 1] = 128;
          png1.data[i + 2] = 128;
          png1.data[i + 3] = 255;

          png2.data[i] = 128;
          png2.data[i + 1] = 128;
          png2.data[i + 2] = 128;
          png2.data[i + 3] = 255;
        }

        const buffer1 = PNG.sync.write(png1);
        const buffer2 = PNG.sync.write(png2);

        const result1 = await calculator.process(buffer1);
        const result2 = await calculator.process(buffer2);

        expect(result1.success).toBe(true);
        expect(result2.success).toBe(true);
        expect(result1.data?.aHash).toBe(result2.data?.aHash);
        expect(result1.data?.pHash).toBe(result2.data?.pHash);
        expect(result1.data?.dHash).toBe(result2.data?.dHash);
        expect(result1.data?.wHash).toBe(result2.data?.wHash);
      });

      it('should return different hashes for different images', async () => {
        // Create first image - light gray
        const png1 = new PNG({ width: 8, height: 8 });
        for (let i = 0; i < png1.data.length; i += 4) {
          png1.data[i] = 200;
          png1.data[i + 1] = 200;
          png1.data[i + 2] = 200;
          png1.data[i + 3] = 255;
        }

        // Create second image - dark gray
        const png2 = new PNG({ width: 8, height: 8 });
        for (let i = 0; i < png2.data.length; i += 4) {
          png2.data[i] = 50;
          png2.data[i + 1] = 50;
          png2.data[i + 2] = 50;
          png2.data[i + 3] = 255;
        }

        const buffer1 = PNG.sync.write(png1);
        const buffer2 = PNG.sync.write(png2);

        const result1 = await calculator.process(buffer1);
        const result2 = await calculator.process(buffer2);

        expect(result1.success).toBe(true);
        expect(result2.success).toBe(true);
        expect(result1.data?.aHash).not.toBe(result2.data?.aHash);
      });

      it('should return error for invalid buffer', async () => {
        const invalidBuffer = Buffer.from('not an image');

        const result = await calculator.process(invalidBuffer);

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });
    });
  });
}
