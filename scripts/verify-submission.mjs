#!/usr/bin/env node

import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '..');

const requiredFiles = [
  'LICENSE',
  'THIRD_PARTY_NOTICES.md',
  'licenses/fflate.txt',
  'licenses/ical.js.txt',
  'licenses/react-family.txt',
  'licenses/vite.txt',
  'licenses/rolldown.txt',
  'licenses/modulepreload.txt',
  'submission/README.md',
  'submission/DEMO_VIDEO_SCRIPT.md',
  'submission/DEVPOST_SUBMISSION.md',
  'submission/COLLABORATION_STORY.md',
  'submission/video/README.md',
  'submission/video/RECORDING_RUNBOOK.md',
  'submission/video/SHOT_LIST.md',
  'submission/video/ANSWER_KEYS.md',
  'submission/video/RESET_AND_FALLBACK.md',
  'submission/video/TELEPROMPTER.txt',
  'submission/video/CAPTIONS.srt',
  'submission/video/YOUTUBE_METADATA.md',
  'submission/video/DEVPOST_FINAL.md',
  'submission/video/MANUAL_STEPS.md',
  'submission/video/QA_CHECKLIST.md',
  'submission/assets/ASSET_MANIFEST.md',
  'submission/assets/storyboard.html',
  'submission/assets/youtube-thumbnail-source.svg',
  'submission/assets/youtube-thumbnail.png',
  'submission/assets/devpost-thumbnail-source.svg',
  'submission/assets/devpost-thumbnail.png',
  'submission/assets/01-home-desktop.png',
  'submission/assets/02-verdict-desktop.png',
  'submission/assets/03-cost-of-yes-desktop.png',
  'submission/assets/04-sample-triage-desktop.png',
  'submission/assets/05-today-map-desktop.png',
  'submission/assets/06-room-making-desktop.png',
  'submission/assets/07-home-mobile.png',
  'submission/assets/08-verdict-mobile.png',
];

const expectedPngDimensions = new Map([
  ['submission/assets/youtube-thumbnail.png', [1280, 720]],
  ['submission/assets/devpost-thumbnail.png', [1200, 800]],
  ['submission/assets/01-home-desktop.png', [1440, 900]],
  ['submission/assets/02-verdict-desktop.png', [1440, 900]],
  ['submission/assets/03-cost-of-yes-desktop.png', [1440, 900]],
  ['submission/assets/04-sample-triage-desktop.png', [1440, 900]],
  ['submission/assets/05-today-map-desktop.png', [1440, 900]],
  ['submission/assets/06-room-making-desktop.png', [1440, 900]],
  ['submission/assets/07-home-mobile.png', [390, 844]],
  ['submission/assets/08-verdict-mobile.png', [390, 844]],
]);

const approvedTokens = new Set([
  '{{YOUTUBE_URL}}',
  '{{FEEDBACK_SESSION_ID}}',
  '{{DEVPOST_URL}}',
]);

const approvedTokenFiles = new Set([
  'submission/README.md',
  'submission/video/DEVPOST_FINAL.md',
  'submission/video/YOUTUBE_METADATA.md',
  'submission/video/MANUAL_STEPS.md',
  'submission/video/QA_CHECKLIST.md',
]);

const lockedVideoFiles = [
  'submission/DEMO_VIDEO_SCRIPT.md',
  'submission/video/TELEPROMPTER.txt',
  'submission/video/CAPTIONS.srt',
  'submission/video/SHOT_LIST.md',
  'submission/video/RECORDING_RUNBOOK.md',
];

const avoidableVideoBrandPhrases = [
  'Google Calendar',
  'React app',
  'GitHub',
];

const ignoredDirectories = new Set([
  '.git',
  'coverage',
  'dist',
  'node_modules',
]);

const textExtensionsForPlaceholderAudit = new Set([
  '.html',
  '.md',
  '.srt',
  '.svg',
  '.txt',
]);

const errors = [];
const warnings = [];
const results = [];

function pass(message) {
  results.push(`[PASS] ${message}`);
}

function info(message) {
  results.push(`[INFO] ${message}`);
}

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function relativePath(absolutePath) {
  return path.relative(repositoryRoot, absolutePath).split(path.sep).join('/');
}

async function isNonEmptyFile(relativeFile) {
  try {
    const fileStat = await stat(path.join(repositoryRoot, relativeFile));
    return fileStat.isFile() && fileStat.size > 0;
  } catch {
    return false;
  }
}

async function collectFiles(directory, predicate) {
  const collected = [];
  let entries;

  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return collected;
  }

  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      continue;
    }

    const absoluteEntry = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      collected.push(...await collectFiles(absoluteEntry, predicate));
    } else if (entry.isFile() && predicate(absoluteEntry)) {
      collected.push(absoluteEntry);
    }
  }

  return collected;
}

function stripFencedCode(markdown) {
  const lines = markdown.split(/\r?\n/);
  const visibleLines = [];
  let fence = null;

  for (const line of lines) {
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (fence === null) {
        fence = marker;
      } else if (fence === marker) {
        fence = null;
      }
      continue;
    }

    if (fence === null) {
      visibleLines.push(line);
    }
  }

  return visibleLines.join('\n');
}

function extractMarkdownTargets(markdown) {
  const targets = [];
  const visibleMarkdown = stripFencedCode(markdown);
  const linkPattern = /!?\[[^\]]*\]\(\s*(<[^>]+>|[^\s)]+)(?:\s+[^)]*)?\)/g;

  for (const match of visibleMarkdown.matchAll(linkPattern)) {
    let target = match[1].trim();
    if (target.startsWith('<') && target.endsWith('>')) {
      target = target.slice(1, -1);
    }
    targets.push(target);
  }

  return targets;
}

function isExternalOrVirtualMarkdownTarget(target) {
  return target.startsWith('#')
    || target.startsWith('//')
    || /^[a-z][a-z\d+.-]*:/i.test(target)
    || /\{\{[A-Z\d_]+\}\}/.test(target);
}

function isGitHubRepositoryRoute(target) {
  const withoutFragment = target.split(/[?#]/, 1)[0];
  return /^\.\.\/\.\.\/(issues|pull)\/\d+\/?$/.test(withoutFragment);
}

async function verifyRequiredFiles() {
  let present = 0;
  for (const requiredFile of requiredFiles) {
    if (await isNonEmptyFile(requiredFile)) {
      present += 1;
    } else {
      fail(`Missing or empty required file: ${requiredFile}`);
    }
  }

  if (present === requiredFiles.length) {
    pass(`Required file manifest (${present} files)`);
  } else {
    info(`Required file manifest: ${present}/${requiredFiles.length} present and non-empty`);
  }
}

async function verifyMarkdownLinks() {
  const markdownFiles = await collectFiles(
    repositoryRoot,
    (file) => path.extname(file).toLowerCase() === '.md',
  );
  let localLinkCount = 0;

  for (const markdownFile of markdownFiles) {
    const source = await readFile(markdownFile, 'utf8');
    for (const rawTarget of extractMarkdownTargets(source)) {
      if (isExternalOrVirtualMarkdownTarget(rawTarget) || isGitHubRepositoryRoute(rawTarget)) {
        continue;
      }

      let decodedTarget;
      try {
        decodedTarget = decodeURIComponent(rawTarget);
      } catch {
        fail(`Invalid percent-encoding in Markdown link: ${relativePath(markdownFile)} -> ${rawTarget}`);
        continue;
      }

      const fileTarget = decodedTarget.split(/[?#]/, 1)[0];
      if (fileTarget.length === 0) {
        continue;
      }

      localLinkCount += 1;
      const resolvedTarget = path.resolve(path.dirname(markdownFile), fileTarget);
      const relativeResolvedTarget = path.relative(repositoryRoot, resolvedTarget);
      if (
        relativeResolvedTarget === '..'
        || relativeResolvedTarget.startsWith(`..${path.sep}`)
        || path.isAbsolute(relativeResolvedTarget)
      ) {
        fail(`Relative Markdown link escapes the repository: ${relativePath(markdownFile)} -> ${rawTarget}`);
        continue;
      }
      try {
        await stat(resolvedTarget);
      } catch {
        fail(`Broken relative Markdown link: ${relativePath(markdownFile)} -> ${rawTarget}`);
      }
    }
  }

  if (!errors.some((error) => error.includes('Markdown link'))) {
    pass(`Relative Markdown links (${localLinkCount} local targets across ${markdownFiles.length} files)`);
  }
}

function timestampToMilliseconds(timestamp) {
  const match = timestamp.match(/^(\d{2}):([0-5]\d):([0-5]\d),(\d{3})$/);
  if (!match) {
    return null;
  }

  const [, hours, minutes, seconds, milliseconds] = match;
  return (((Number(hours) * 60 + Number(minutes)) * 60) + Number(seconds)) * 1000
    + Number(milliseconds);
}

function formatDuration(milliseconds) {
  const roundedSeconds = Math.round(milliseconds / 1000);
  const minutes = Math.floor(roundedSeconds / 60);
  const seconds = roundedSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function normalizeNarration(text) {
  return text
    .replace(/^\uFEFF/, '')
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .replace(/\s*([—–])\s*/g, '$1')
    .trim();
}

function parseSrt(source) {
  const normalizedSource = source.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').trim();
  if (normalizedSource.length === 0) {
    return [];
  }

  return normalizedSource.split(/\n{2,}/).map((block, blockIndex) => {
    const lines = block.split('\n');
    const sequence = Number(lines[0]);
    const timing = lines[1]?.match(/^(\d{2}:[0-5]\d:[0-5]\d,\d{3})\s+-->\s+(\d{2}:[0-5]\d:[0-5]\d,\d{3})$/);

    return {
      blockIndex,
      sequence,
      start: timing ? timestampToMilliseconds(timing[1]) : null,
      end: timing ? timestampToMilliseconds(timing[2]) : null,
      text: lines.slice(2).join(' ').trim(),
      timingValid: timing !== null,
    };
  });
}

async function verifyCaptions() {
  const teleprompterPath = 'submission/video/TELEPROMPTER.txt';
  const captionsPath = 'submission/video/CAPTIONS.srt';

  if (!(await isNonEmptyFile(teleprompterPath)) || !(await isNonEmptyFile(captionsPath))) {
    info('Caption checks skipped until TELEPROMPTER.txt and CAPTIONS.srt are both present');
    return;
  }

  const [teleprompter, captions] = await Promise.all([
    readFile(path.join(repositoryRoot, teleprompterPath), 'utf8'),
    readFile(path.join(repositoryRoot, captionsPath), 'utf8'),
  ]);
  const cues = parseSrt(captions);

  if (cues.length === 0) {
    fail('CAPTIONS.srt contains no cues');
    return;
  }

  let previousEnd = null;
  for (const cue of cues) {
    const expectedSequence = cue.blockIndex + 1;
    if (!Number.isInteger(cue.sequence) || cue.sequence !== expectedSequence) {
      fail(`CAPTIONS.srt cue ${expectedSequence} has invalid sequence number: ${String(cue.sequence)}`);
    }
    if (!cue.timingValid || cue.start === null || cue.end === null) {
      fail(`CAPTIONS.srt cue ${expectedSequence} has an invalid timestamp line`);
      continue;
    }
    if (cue.start >= cue.end) {
      fail(`CAPTIONS.srt cue ${expectedSequence} must end after it starts`);
    }
    if (previousEnd !== null && cue.start < previousEnd) {
      fail(`CAPTIONS.srt cue ${expectedSequence} overlaps the preceding cue`);
    }
    if (cue.text.length === 0) {
      fail(`CAPTIONS.srt cue ${expectedSequence} has no caption text`);
    }
    previousEnd = cue.end;
  }

  const finalEnd = cues.at(-1)?.end;
  if (finalEnd !== null && finalEnd !== undefined) {
    if (finalEnd >= 180_000) {
      fail(`CAPTIONS.srt ends at ${formatDuration(finalEnd)}; it must finish before 3:00`);
    } else if (finalEnd >= 165_000) {
      warn(`Caption timeline ends at ${formatDuration(finalEnd)}, leaving less than 15 seconds of safety margin`);
    }
  }

  const normalizedTeleprompter = normalizeNarration(teleprompter);
  const normalizedCaptions = normalizeNarration(cues.map((cue) => cue.text).join(' '));
  if (normalizedTeleprompter !== normalizedCaptions) {
    let mismatchIndex = 0;
    const shortestLength = Math.min(normalizedTeleprompter.length, normalizedCaptions.length);
    while (
      mismatchIndex < shortestLength
      && normalizedTeleprompter[mismatchIndex] === normalizedCaptions[mismatchIndex]
    ) {
      mismatchIndex += 1;
    }
    fail(`Caption text does not match TELEPROMPTER.txt (first normalized mismatch at character ${mismatchIndex + 1})`);
  } else {
    pass('Normalized caption text matches TELEPROMPTER.txt');
  }

  const wordCount = normalizedTeleprompter.length === 0
    ? 0
    : normalizedTeleprompter.split(/\s+/).length;
  const estimatedMilliseconds = (wordCount / 130) * 60_000;
  info(`Narration: ${wordCount} words; estimated ${formatDuration(estimatedMilliseconds)} at 130 words per minute`);

  if (!errors.some((error) => error.startsWith('CAPTIONS.srt'))) {
    const ending = finalEnd === null || finalEnd === undefined ? 'unknown end time' : `${formatDuration(finalEnd)} end time`;
    pass(`SRT structure and timing (${cues.length} cues; ${ending}; hard limit < 3:00)`);
  }
}

async function verifyVideoTrademarkGuardrail() {
  const sources = new Map();

  for (const relativeFile of lockedVideoFiles) {
    if (!(await isNonEmptyFile(relativeFile))) {
      continue;
    }

    const source = await readFile(path.join(repositoryRoot, relativeFile), 'utf8');
    sources.set(relativeFile, source);
    for (const phrase of avoidableVideoBrandPhrases) {
      if (source.includes(phrase)) {
        fail(`Avoidable third-party video phrase ${JSON.stringify(phrase)} appears in ${relativeFile}`);
      }
    }
  }

  const teleprompter = sources.get('submission/video/TELEPROMPTER.txt') ?? '';
  if (!teleprompter.includes('calendar export ZIP')) {
    fail('TELEPROMPTER.txt must use the neutral phrase "calendar export ZIP"');
  }
  if (!teleprompter.includes('browser app')) {
    fail('TELEPROMPTER.txt must use the neutral phrase "browser app"');
  }

  const canonicalScript = sources.get('submission/DEMO_VIDEO_SCRIPT.md') ?? '';
  const canonicalNarration = canonicalScript
    .split(/\r?\n/)
    .filter((line) => line.startsWith('>'))
    .map((line) => line.replace(/^>\s?/, ''))
    .join(' ');
  if (normalizeNarration(canonicalNarration) !== normalizeNarration(teleprompter)) {
    fail('Canonical DEMO_VIDEO_SCRIPT.md narration does not match TELEPROMPTER.txt');
  }

  const shotList = normalizeNarration(sources.get('submission/video/SHOT_LIST.md') ?? '');
  const narrationParagraphs = teleprompter
    .replace(/^\uFEFF/, '')
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .map(normalizeNarration)
    .filter(Boolean);
  for (const paragraph of narrationParagraphs) {
    if (!shotList.includes(paragraph)) {
      fail('SHOT_LIST.md does not contain every locked narration paragraph');
      break;
    }
  }

  const evidenceInstructions = [
    canonicalScript,
    sources.get('submission/video/SHOT_LIST.md') ?? '',
    sources.get('submission/video/RECORDING_RUNBOOK.md') ?? '',
  ];
  if (evidenceInstructions.some((source) => (
    !source.includes('local Markdown')
    || (!source.includes('local git') && !source.includes('git log'))
  ))) {
    fail('Every collaboration-capture instruction must require local Markdown and local git history');
  }

  const videoErrors = errors.filter((error) => (
    error.includes('third-party video phrase')
    || error.includes('TELEPROMPTER.txt must use')
    || error.includes('DEMO_VIDEO_SCRIPT.md narration')
    || error.includes('SHOT_LIST.md does not contain')
    || error.includes('collaboration-capture instruction')
  ));
  if (videoErrors.length === 0 && sources.size === lockedVideoFiles.length) {
    pass(`Video trademark and synchronization guardrail (${sources.size} locked files)`);
  }
}

function readPngDimensions(buffer) {
  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (buffer.length < 24 || !buffer.subarray(0, 8).equals(pngSignature)) {
    return null;
  }
  if (buffer.readUInt32BE(8) !== 13 || buffer.toString('ascii', 12, 16) !== 'IHDR') {
    return null;
  }

  return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
}

async function verifyPngDimensions() {
  let verified = 0;

  for (const [relativeFile, [expectedWidth, expectedHeight]] of expectedPngDimensions) {
    if (!(await isNonEmptyFile(relativeFile))) {
      continue;
    }

    const contents = await readFile(path.join(repositoryRoot, relativeFile));
    const dimensions = readPngDimensions(contents);
    if (dimensions === null) {
      fail(`Expected PNG has an invalid PNG signature or IHDR chunk: ${relativeFile}`);
      continue;
    }

    const [actualWidth, actualHeight] = dimensions;
    if (actualWidth !== expectedWidth || actualHeight !== expectedHeight) {
      fail(`Wrong PNG dimensions: ${relativeFile} is ${actualWidth}x${actualHeight}; expected ${expectedWidth}x${expectedHeight}`);
      continue;
    }

    verified += 1;
  }

  if (verified === expectedPngDimensions.size) {
    pass(`PNG signatures and dimensions (${verified} assets)`);
  } else {
    info(`PNG dimensions: ${verified}/${expectedPngDimensions.size} required assets verified`);
  }
}

async function verifyPlaceholders() {
  const textFiles = await collectFiles(
    repositoryRoot,
    (file) => textExtensionsForPlaceholderAudit.has(path.extname(file).toLowerCase()),
  );
  const seenApprovedTokens = new Set();

  for (const textFile of textFiles) {
    const repositoryRelativeFile = relativePath(textFile);
    const source = await readFile(textFile, 'utf8');

    const legacyPatterns = [
      /\[ADD(?:[^\]]*)\]/gi,
      /\[(?:INSERT|PASTE)(?:[^\]]*)\]/gi,
      /\bTODO\b/gi,
      /\bTBD\b/gi,
    ];
    for (const pattern of legacyPatterns) {
      for (const match of source.matchAll(pattern)) {
        fail(`Unapproved placeholder ${JSON.stringify(match[0])} in ${repositoryRelativeFile}`);
      }
    }

    for (const match of source.matchAll(/\{\{[A-Z\d_]+\}\}/g)) {
      const token = match[0];
      if (!approvedTokens.has(token)) {
        fail(`Unknown template token ${token} in ${repositoryRelativeFile}`);
      } else if (!approvedTokenFiles.has(repositoryRelativeFile)) {
        fail(`Approved token ${token} appears in an undesignated file: ${repositoryRelativeFile}`);
      } else {
        seenApprovedTokens.add(token);
      }
    }
  }

  for (const token of approvedTokens) {
    if (!seenApprovedTokens.has(token)) {
      fail(`Required human-only template token is absent from designated submission files: ${token}`);
    }
  }

  const placeholderErrors = errors.filter((error) => (
    error.includes('placeholder')
    || error.includes('template token')
    || error.includes('Approved token')
  ));
  if (placeholderErrors.length === 0) {
    pass(`Placeholder policy (${seenApprovedTokens.size} approved human-only tokens; no legacy placeholders)`);
  }
}

console.log('Maybe Tomorrow. submission verification\n');

await verifyRequiredFiles();
await verifyMarkdownLinks();
await verifyVideoTrademarkGuardrail();
await verifyCaptions();
await verifyPngDimensions();
await verifyPlaceholders();

for (const result of results) {
  console.log(result);
}

if (warnings.length > 0) {
  console.log('\nWarnings:');
  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
}

if (errors.length > 0) {
  console.error('\nErrors:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  console.error(`\nSUBMISSION VERIFICATION FAILED (${errors.length} error${errors.length === 1 ? '' : 's'}).`);
  process.exitCode = 1;
} else {
  console.log('\nSUBMISSION VERIFICATION PASSED.');
}
