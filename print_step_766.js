import fs from 'fs';
import readline from 'readline';

const logFile = 'C:/Users/haris/.gemini/antigravity/brain/2b85c97c-25a5-47f9-8683-66a212618ca9/.system_generated/logs/transcript_full.jsonl';

(async () => {
  const fileStream = fs.createReadStream(logFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (line.trim() === '') continue;
    const step = JSON.parse(line);
    if (step.step_index === 766) {
      console.log(step.content);
      break;
    }
  }
})();
