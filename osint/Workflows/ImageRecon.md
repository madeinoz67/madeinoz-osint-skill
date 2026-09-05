# Image Reconnaissance Workflow

Comprehensive image/photo OSINT analysis including metadata extraction, reverse search, and manipulation detection.

## Trigger Phrases
- "analyze image"
- "image OSINT"
- "reverse image search"
- "check photo metadata"
- "image forensics"
- "where was this photo taken"
- "is this image real"
- "photo reconnaissance"

## Input
- `image`: File path or URL to the image to analyze

## Process

### Step 1: Image Validation

**Local Tool Commands:**
```bash
# Detect file type (magic bytes, not extension)
file --mime-type <image_path>

# Get detailed file info
file -b <image_path>

# Calculate file hashes for tracking/verification
md5 <image_path>
shasum -a 256 <image_path>

# Get image dimensions and format details (ImageMagick)
identify -verbose <image_path> | head -50

# Check for corruption (returns error if corrupted)
identify -regard-warnings <image_path>

# Get file size
ls -lh <image_path>
stat -f "%z bytes" <image_path>
```

**Validation Checks:**
- Confirm file type (JPEG, PNG, TIFF, HEIC, WebP, RAW)
- Check file dimensions and resolution
- Verify file is not corrupted
- Calculate file hash (MD5, SHA256) for tracking
- Check file size and compression

### Step 2: EXIF/Metadata Extraction
```
Extract all embedded metadata:

Camera Information:
- Camera make and model
- Lens information
- Focal length, aperture, ISO, shutter speed
- Flash used

Location Data:
- GPS coordinates (latitude, longitude, altitude)
- GPS timestamp
- Location name (if embedded)

Temporal Data:
- Date/time original taken
- Date/time digitized
- Modification timestamps
- Time zone information

Software & Processing:
- Software used for editing
- Processing history
- Color profile
- Compression settings

Ownership:
- Copyright notice
- Author/artist name
- Credit information
- Usage rights
```

### Step 3: Reverse Image Search
```
Search across multiple engines for matches:

1. Google Images:
   - Visual matches
   - Similar images
   - Pages containing image

2. TinEye:
   - Exact matches with modification detection
   - Oldest known occurrence
   - Image usage history

3. Yandex Images:
   - Strong for faces and locations
   - Eastern European content coverage

4. Bing Visual Search:
   - Similar images
   - Related content

5. Specialized Engines:
   - Getty Images (stock photo matching)
   - Shutterstock (stock photo detection)
   - PimEyes (face matching - if applicable)

Compile Results:
- First appearance date
- Total occurrences found
- Domains where image appears
- Modifications/crops detected
```

### Step 4: Facial Analysis
```
If faces detected in image:

Face Detection:
- Number of faces detected
- Face locations in image
- Face quality/resolution

Identity Research (Public Sources Only):
- Reverse facial search (PimEyes, public databases)
- Social media profile matching
- News article appearances

Demographic Estimation:
- Approximate age range
- Expression analysis

Note: Only use publicly available facial recognition
services and respect privacy regulations.
```

### Step 5: Manipulation Detection
```
Analyze image authenticity:

Error Level Analysis (ELA):
- Compression level inconsistencies
- Edited regions detection
- Copy-paste artifacts

Metadata Consistency:
- Software version plausibility
- Timestamp coherence
- Camera model vs. image specs match
- GPS data vs. claimed location

Clone Detection:
- Repeated patterns indicating cloning
- Heal/patch tool artifacts

AI Generation Detection:
- GAN fingerprint analysis
- Diffusion model artifacts
- Unnatural patterns (fingers, text, reflections)
- Frequency domain analysis

Splicing Detection:
- Lighting inconsistency
- Shadow direction analysis
- Perspective anomalies
- Edge artifacts

Output Confidence:
- Authentic | Modified | AI-Generated | Inconclusive
- Confidence percentage
- Specific anomalies found
```

### Step 6: Context/Location Analysis
```
Identify location from image content:

Landmark Recognition:
- Buildings, monuments, statues
- Natural landmarks
- Notable infrastructure

Text/Signage Analysis:
- Street signs, store names
- Language identification
- Phone number formats (country codes)

Environmental Clues:
- Vegetation type (climate indicators)
- Sun position (time/latitude estimation)
- Weather conditions
- Season indicators

Architectural Style:
- Building design era
- Regional architecture patterns
- Window/door styles
- Roofing materials

Vehicle Analysis:
- License plate format (country/state)
- Vehicle makes common to region
- Traffic patterns (left/right drive)

Shadow Analysis:
- Sun angle for time estimation
- Date range estimation based on sun position
- Hemisphere determination
```

### Step: Store Findings (Memory Adapter)

Store each finding via the memory adapter (SKILL.md § Memory Adapter), group "osint-image". Path 1 stores one `muninn_remember` per finding (atomic, entity names in [[brackets]], tags `["osint-image", "osint"]`); Path 2 appends each finding to `./osint-findings/osint-image.md`.

```
Store the following findings (one memory/entry each):

1. Image Entity:
   - Label: "Image: {hash_short}"
   - Data: File hash, dimensions, format, capture date, source URL
   - Group: "osint-image"

2. Metadata Entity:
   - Label: "Metadata: {hash_short}"
   - Data: Camera info, GPS coords, timestamps, software, copyright
   - Relationships: metadata_for image entity (muninn_link relates_to)

3. Location Entity (if determined):
   - Label: "Location: {coordinates_or_name}"
   - Data: GPS coordinates, landmark names, confidence level, method
   - Relationships: captured_at image entity, located_in region

4. Reverse Search Results:
   - Label: "Appearances: {hash_short}"
   - Data: First seen date, occurrence count, domains list
   - Relationships: appears_on domain entities

5. Faces Entity (if applicable):
   - Label: "Faces: {hash_short}"
   - Data: Face count, potential matches, confidence levels
   - Relationships: depicts person entities

6. Authenticity Entity:
   - Label: "Authenticity: {hash_short}"
   - Data: Manipulation score, AI detection, ELA results, anomalies
   - Relationships: validates image entity
```

## Output Format

```
📋 IMAGE RECONNAISSANCE REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 IMAGE: photo_evidence.jpg
🔑 HASH: a3f2c1b8e9d4...
📅 ANALYSIS DATE: 2026-01-11

📊 FILE INFO:
• Format: JPEG
• Dimensions: 4032 x 3024
• Size: 3.2 MB
• Resolution: 72 DPI

📷 CAMERA DATA:
• Make: Apple
• Model: iPhone 14 Pro
• Lens: 6.86mm f/1.78
• Settings: ISO 50, 1/120s, f/1.78
• Flash: Not fired

📍 LOCATION DATA:
• GPS: 37.7749° N, 122.4194° W
• Altitude: 16m
• Location: San Francisco, CA, USA
• Confidence: HIGH (EXIF GPS)

⏰ TEMPORAL DATA:
• Taken: 2025-12-15 14:32:18 PST
• Digitized: 2025-12-15 14:32:18 PST
• Modified: Not detected
• Timezone: UTC-8

🔍 REVERSE IMAGE SEARCH:
• Google Images: 3 matches found
• TinEye: 1 exact match (first seen: 2025-12-16)
• Yandex: 5 similar images
• Oldest Occurrence: 2025-12-16 on example.com

👤 FACIAL ANALYSIS:
• Faces Detected: 2
• Identifiable: 1 (partial match)
• Public Matches: @johndoe (Twitter) - 72% confidence

🔬 AUTHENTICITY ANALYSIS:
• ELA Result: No significant anomalies
• Metadata Consistency: PASS
• AI Generation: Not detected
• Clone Detection: No cloning found
• Verdict: AUTHENTIC (94% confidence)

🌍 CONTEXT ANALYSIS:
• Landmarks: Golden Gate Bridge visible
• Signage: English text, US format
• Vegetation: Coastal California flora
• Architecture: Matches SF Bay Area
• Sun Position: Consistent with 2:30pm PST, December

⚠️ FLAGS:
• GPS coordinates present (privacy note)
• Camera serial number embedded
• Image shared publicly on 2 domains

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💾 Stored via memory adapter: osint-image (MuninnDB group | local findings file)
📎 Related entities: 3 linked via muninn_link
```

## Tools & APIs Used
- ExifTool - Comprehensive metadata extraction
- Jeffrey's EXIF Viewer - Web-based EXIF analysis
- TinEye API - Reverse image search with history
- Google Vision API - Object/landmark/face detection
- FotoForensics - ELA and forensic analysis
- Yandex Images API - Reverse search (faces/locations)
- PimEyes - Facial recognition (paid, optional)
- Hive Moderation - AI-generated image detection
- Illuminarty - Deepfake/AI detection
- SunCalc - Sun position verification

## Platform-Specific Notes

### JPEG Files
- Richest metadata support
- EXIF, IPTC, XMP data available
- Compression artifacts useful for forensics

### PNG Files
- Limited EXIF support
- Check for tEXt, iTXt, zTXt chunks
- Often indicates screenshot or processed image

### HEIC/HEIF Files
- Apple device indicator
- Full EXIF support
- May contain Live Photo data

### RAW Files
- Unprocessed sensor data
- Maximum metadata available
- Camera-specific formats (CR2, NEF, ARW)

### Screenshots
- Usually lack camera EXIF
- May contain device info
- Software/OS indicators present

## Ethical Notes
- Only analyze images you have rights to investigate
- Facial recognition requires legal basis in many jurisdictions
- GPS data can reveal sensitive personal locations
- Respect copyright and intellectual property
- Document chain of custody for evidence
- Do not share identified faces without proper authorization
- Consider GDPR and privacy regulations
- Store sensitive findings securely
