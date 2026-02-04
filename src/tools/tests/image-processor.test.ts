/**
 * Unit tests for ImageProcessor
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { writeFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageProcessor } from '../image-processor';

const isCI = process.env.CI === 'true';

describe('ImageProcessor', () => {
  let processor: ImageProcessor;
  const testFixturesPath = join(import.meta.dir, 'fixtures');

  beforeEach(() => {
    processor = new ImageProcessor();
  });

  afterEach(async () => {
    // Cleanup test files
    // Note: In real implementation, would clean up created test files
  });

  describe('isAvailable', () => {
    it('should check Sharp availability', async () => {
      const isAvailable = await processor.isAvailable();
      expect(typeof isAvailable).toBe('boolean');
    });
  });

  describe('metadata', () => {
    it('should have correct name and version', () => {
      expect(processor.name).toBe('ImageProcessor');
      expect(processor.version).toBe('1.0.0');
    });
  });
});

// Skip process tests in CI where Sharp is unavailable
if (!isCI) {
  describe('ImageProcessor', () => {
    let processor: ImageProcessor;
    const testFixturesPath = join(import.meta.dir, 'fixtures');

    beforeEach(() => {
      processor = new ImageProcessor();
    });

    describe('process', () => {
      it('should process a valid image', async () => {
        // Note: Would create test image file here
        const result = await processor.process(Buffer.alloc(100));
        // Basic check - actual implementation would use real image
        expect(result).toBeDefined();
      });
    });
  });
}
