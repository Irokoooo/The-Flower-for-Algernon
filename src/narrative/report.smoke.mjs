import assert from 'node:assert/strict';
import { stripTypeScriptTypes } from 'node:module';
import { readFileSync } from 'node:fs';
const source=readFileSync('src/narrative/report.ts','utf8');
const js=stripTypeScriptTypes(source.replace(/import \{ firstSlice \}[^;]+;/, 'const firstSlice = [{id: ''diary.prompt''}];')).replace(/export /g,'');
const exports={};
Object.assign(exports, new Function(js + ';return {saveProgressReport,preserveFinalMemory};')());
const {saveProgressReport,preserveFinalMemory}=exports;
for(const raw of ['', '  我想记住阿尔吉侬。\n', 'My sister is waiting.', 'I remember because I really care.', 'Remember REALLy because']) {
  const saved=saveProgressReport(raw,'test','DECLINE');
  assert.equal(saved.rawText,raw);
  assert.equal(preserveFinalMemory(raw),raw);
  assert.equal(saveProgressReport(raw,'test','PEAK').expressedText,raw);
}
assert.equal(saveProgressReport('My sister is waiting.','test','DECLINE').expressedText,'My sister is waiting.');
assert.equal(saveProgressReport('I remember because I really care.','test','DECLINE').expressedText,'I remeber becuase I really care.');
console.log('Report preservation / bounded spelling / final memory smoke checks passed.');

