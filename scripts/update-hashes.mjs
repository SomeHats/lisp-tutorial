import * as path from 'path';
import * as fs from 'fs/promises';
import assert from 'assert';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { read } from 'fs';

const START_TAG = '<!-- commits-index-start -->';
const END_DAY = '<!-- commits-index-end -->';

const execFileAsync = promisify(execFile);
const readmeSource = await fs.readFile('README.md', 'utf-8');

const commits = (await runAsync('git', 'log', 'steps', '--pretty=format:%H %s'))
  .split('\n')
  .map((commit) => ({
    hash: commit.slice(0, 40),
    message: commit.slice(41),
  }));

const getHash = (prefix) => {
  const commit = commits.find(({ message }) => message.startsWith(prefix));
  assert(commit, `commit with prefix ${prefix} not found`);
  return commit.hash;
};

const startTagIndex = readmeSource.indexOf(START_TAG);
const endTagIndex = readmeSource.indexOf(END_DAY);
assert(startTagIndex !== -1 && endTagIndex !== -1);

const readmeSourceBefore = readmeSource.slice(0, startTagIndex);
const readmeSourceAfter = readmeSource.slice(endTagIndex); // includes end tag

const commitRefs = new Set();
let match;
const re = /\[.*?]\[(.*?)\]/gs;
while ((match = re.exec(readmeSource))) {
  const commitRef = match[1];
  if (commitRef.match(/^(file [^@]*@.*)|(commit .*)$/)) {
    commitRefs.add(commitRef);
  }
}

console.log(`Found ${commitRefs.size} refs`);

const refLines = [...commitRefs]
  .map((ref) => {
    const commitMatch = ref.match(/^commit (.*)$/);
    if (commitMatch) {
      return [ref, `commit/${getHash(commitMatch[1])}`];
    }

    const fileMatch = ref.match(/^file (.*)@(.*)$/);
    if (fileMatch) {
      return [ref, `blob/${getHash(fileMatch[2])}/${fileMatch[1]}`];
    }

    throw new Error(`Bad commit ref: ${ref}`);
  })
  .map(
    ([ref, url]) =>
      `[${ref}]: https://github.com/SomeHats/lisp-tutorial/${url}`,
  );

const readmeResult = [
  readmeSourceBefore,
  START_TAG,
  refLines.join('\n'),
  readmeSourceAfter,
].join('\n');

await fs.writeFile('README.md', readmeResult, 'utf-8');
await runAsync('./node_modules/.bin/prettier', '--write', 'README.md');
console.log(`Updated!`);

async function runAsync(command, ...args) {
  const result = await execFileAsync(command, args);
  const stdout = result.stdout.trimEnd();
  return stdout;
}
