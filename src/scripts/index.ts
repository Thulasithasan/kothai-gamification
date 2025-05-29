import dotenv from 'dotenv';

dotenv.config();

const scriptName = process.argv[2]; // Pass script name as an argument

if (!scriptName) {
  console.error(
    'Please provide a script name. Usage: npm run run <scriptName>'
  );
  process.exit(1);
}

(async () => {
  try {
    const script = await import(`./${scriptName}`);
    if (typeof script.default === 'function') {
      await script.default();
    } else {
      console.error(`No default export found in ${scriptName}.ts`);
    }
  } catch (err) {
    console.error(`Error running ${scriptName}:`, err);
  }
})();
