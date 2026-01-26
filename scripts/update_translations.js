const fs = require("fs").promises;
const path = require("path");
const OpenAI = require("openai");
const chalk = require("chalk");
require("dotenv").config();

// Configuration
const LOCALES_DIR = path.join(__dirname, "..", "web", "frontend", "locales");
const SOURCE_LOCALE = "en.json";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Load JSON file with error handling
 */
async function loadJson(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error(chalk.red(`\nError: File not found: ${filePath}`));
    } else if (error instanceof SyntaxError) {
      console.error(chalk.red(`\nError: Invalid JSON in file ${filePath}`));
      console.error(chalk.red(`Error details: ${error.message}`));
    } else {
      console.error(chalk.red(`\nError: Unexpected error reading ${filePath}`));
      console.error(chalk.red(`Error details: ${error.message}`));
    }
    throw error;
  }
}

/**
 * Save JSON file with proper formatting
 */
async function saveJson(filePath, data) {
  const jsonString = JSON.stringify(data, null, 2) + "\n";
  await fs.writeFile(filePath, jsonString, "utf-8");
}

/**
 * Extract variables like {count} or {{count}} from text
 */
function extractVariables(text) {
  const variables = new Set();
  const regex = /\{+([a-zA-Z]+)\}+/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    variables.add(match[1]);
  }
  return variables;
}

/**
 * Format variable name with double curly braces
 */
function formatVariable(varName) {
  return `{{${varName}}}`;
}

/**
 * Translate text to target language using OpenAI
 */
async function translateText(text, targetLang) {
  if (!openai) {
    throw new Error("OpenAI client is not initialized");
  }

  // Extract variables from original text
  const variables = extractVariables(text);

  // Build prompt based on whether there are variables
  const varInstruction =
    variables.size > 0
      ? `Keep the following variables intact with double curly braces: ${Array.from(variables)
          .map(formatVariable)
          .join(", ")}. `
      : "";

  let prompt =
    `Translate the following text from English to ${targetLang}. ` +
    `${varInstruction}` +
    `Return the translation in JSON format with a single key 'translation'.\n\n` +
    `Text: '${text}'\n\n` +
    `Example response format:\n` +
    `{"translation": "Translated text here"}`;

  const maxRetries = 3;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-5-nano",
        messages: [{ role: "user", content: prompt }],
      });

      const result = response.choices[0].message.content.trim();

      // Try to parse the JSON response
      try {
        const parsed = JSON.parse(result);
        if (parsed.translation) {
          let translation = parsed.translation;

          // Validate and fix variable formatting
          if (variables.size > 0) {
            for (const varName of variables) {
              // Find any instance of the variable with single or double braces
              const pattern = new RegExp(`\\{+(${varName})\\}+`, "g");
              // Replace with properly formatted variable
              translation = translation.replace(pattern, formatVariable(varName));
            }
          }

          return translation;
        }
      } catch (parseError) {
        // JSON parsing failed, continue to retry
      }

      // If we get here, either JSON parsing failed or "translation" key wasn't found
      if (attempt < maxRetries - 1) {
        // Try again with a more explicit prompt
        prompt =
          `Your previous response was not valid JSON. Please translate the following text ` +
          `from English to ${targetLang} and return ONLY a JSON object with a single key ` +
          `'translation' containing the translation. ` +
          `${varInstruction}\n\n` +
          `Text: '${text}'\n\n` +
          `Example response format:\n` +
          `{"translation": "Translated text here"}`;
        continue;
      }
    } catch (error) {
      if (attempt < maxRetries - 1) {
        continue;
      }
      throw new Error(`Failed to get translation after ${maxRetries} attempts: ${error.message}`);
    }
  }

  throw new Error(`Failed to get valid translation after ${maxRetries} attempts`);
}

/**
 * Collect all translation tasks needed for this language
 */
function collectTranslationTasks(source, target, lang, path = "") {
  const tasks = [];

  for (const [key, value] of Object.entries(source)) {
    const currentPath = path ? `${path}.${key}` : key;

    if (typeof value === "object" && value !== null) {
      if (!target[key] || typeof target[key] !== "object") {
        target[key] = {};
      }
      tasks.push(...collectTranslationTasks(value, target[key], lang, currentPath));
    } else {
      if (!(key in target)) {
        tasks.push([currentPath, value, lang]);
      }
    }
  }

  return tasks;
}

/**
 * Apply a translation result to the target dictionary at the specified path
 */
function applyTranslationResult(target, keyPath, translation) {
  const keys = keyPath.split(".");
  let current = target;

  // Navigate to the parent of the target key
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key];
  }

  // Set the translation
  current[keys[keys.length - 1]] = translation;
}

/**
 * Remove extra keys that don't exist in source
 */
function removeExtraKeys(src, tgt) {
  let removed = 0;
  const keysToRemove = [];

  for (const key of Object.keys(tgt)) {
    if (!(key in src)) {
      keysToRemove.push(key);
      removed++;
    }
  }

  for (const key of keysToRemove) {
    delete tgt[key];
  }

  // Also remove extra keys in nested dictionaries
  for (const [key, value] of Object.entries(src)) {
    if (
      typeof value === "object" &&
      value !== null &&
      key in tgt &&
      typeof tgt[key] === "object" &&
      tgt[key] !== null
    ) {
      removed += removeExtraKeys(value, tgt[key]);
    }
  }

  return removed;
}

/**
 * Ensure keys from source exist in target and remove keys not in source.
 * Uses parallel translation for better performance.
 */
async function ensureKeysParallel(source, target, lang) {
  let updated = false;
  let addedCount = 0;

  // First, remove keys that don't exist in source
  const removedCount = removeExtraKeys(source, target);
  if (removedCount > 0) {
    updated = true;
  }

  // Collect all translation tasks
  const translationTasks = collectTranslationTasks(source, target, lang);

  if (translationTasks.length > 0) {
    console.log(`  Found ${translationTasks.length} keys to translate for ${lang}`);

    // Execute translations in parallel
    const translationPromises = translationTasks.map(async ([keyPath, text, lang]) => {
      try {
        const translation = await translateText(text, lang);
        return { keyPath, translation, success: true, originalText: text };
      } catch (error) {
        console.error(chalk.red(`\nFailed to translate '${text}' for ${lang}: ${error.message}`));
        // Use original text as fallback
        return { keyPath, translation: text, success: false, originalText: text };
      }
    });

    // Wait for all translations to complete
    const results = await Promise.all(translationPromises);

    // Apply all translations
    for (const { keyPath, translation } of results) {
      applyTranslationResult(target, keyPath, translation);
      addedCount++;
      updated = true;
    }
  }

  return [updated, addedCount, removedCount];
}

/**
 * Sort dictionary keys recursively at all levels
 */
function sortDictRecursively(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  const sorted = {};
  const keys = Object.keys(obj).sort();

  for (const key of keys) {
    sorted[key] = sortDictRecursively(obj[key]);
  }

  return sorted;
}

/**
 * Recursively find all variables in a translation file
 */
function listVariablesInFile(data, prefix = "") {
  const variables = new Set();

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "object" && value !== null) {
      const nestedVars = listVariablesInFile(value, `${prefix}${key}.`);
      for (const v of nestedVars) {
        variables.add(v);
      }
    } else if (typeof value === "string") {
      const foundVars = extractVariables(value);
      if (foundVars.size > 0) {
        console.log(
          chalk.cyan(`Found variables in ${prefix}${key}: ${Array.from(foundVars).join(", ")}`)
        );
        for (const v of foundVars) {
          variables.add(v);
        }
      }
    }
  }

  return variables;
}

/**
 * Process a single language file
 */
async function processLanguage(filename, sourceData, mutex) {
  try {
    const langCode = filename.split(".")[0];
    const targetPath = path.join(LOCALES_DIR, filename);

    // Thread-safe console output using mutex
    await mutex.runExclusive(() => {
      console.log(`\nProcessing ${filename}...`);
    });

    const targetData = await loadJson(targetPath);
    const [, addedCount, removedCount] = await ensureKeysParallel(sourceData, targetData, langCode);

    // Always sort the data, regardless of whether updates were needed
    const sortedData = sortDictRecursively(targetData);

    // Print status with colored indicators
    const status = [];
    if (addedCount > 0) {
      status.push(chalk.green(`+${addedCount}`));
    }
    if (removedCount > 0) {
      status.push(chalk.red(`x${removedCount}`));
    }

    const statusStr = status.length > 0 ? status.join(" ") : "no changes";

    await mutex.runExclusive(() => {
      console.log(`Status for ${filename}: ${statusStr}`);
      console.log(`Saving sorted ${filename}`);
    });

    // Always save the sorted data
    await saveJson(targetPath, sortedData);

    return { filename, success: true, status: statusStr };
  } catch (error) {
    const errorMsg = `Failed to process ${filename}: ${error.message}`;
    await mutex.runExclusive(() => {
      console.error(chalk.red(`\n${errorMsg}`));
    });
    return { filename, success: false, status: errorMsg };
  }
}

/**
 * Simple mutex implementation for console output synchronization
 */
class Mutex {
  constructor() {
    this.queue = [];
    this.locked = false;
  }

  async runExclusive(callback) {
    return new Promise((resolve, reject) => {
      this.queue.push({ callback, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.locked || this.queue.length === 0) {
      return;
    }

    this.locked = true;
    const { callback, resolve, reject } = this.queue.shift();

    try {
      const result = await callback();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.locked = false;
      this.process();
    }
  }
}

/**
 * Main function
 */
async function main() {
  try {
    const sourcePath = path.join(LOCALES_DIR, SOURCE_LOCALE);
    console.log(`\nProcessing source file: ${SOURCE_LOCALE}`);
    const sourceData = await loadJson(sourcePath);

    // List variables in source file
    console.log(chalk.yellow(`\nVariables found in ${SOURCE_LOCALE}:`));
    const sourceVariables = listVariablesInFile(sourceData);
    if (sourceVariables.size > 0) {
      console.log(
        chalk.green(`Total unique variables: ${Array.from(sourceVariables).sort().join(", ")}`)
      );
    } else {
      console.log(chalk.yellow("No variables found"));
    }

    // Sort the source file first
    console.log(`\nProcessing ${SOURCE_LOCALE}...`);
    const sortedSourceData = sortDictRecursively(sourceData);
    console.log(`Saving sorted ${SOURCE_LOCALE}`);
    await saveJson(sourcePath, sortedSourceData);

    // Collect all translation files
    const files = await fs.readdir(LOCALES_DIR);
    const translationFiles = files.filter(
      (filename) => filename !== SOURCE_LOCALE && filename.endsWith(".json")
    );

    if (translationFiles.length === 0) {
      console.log(chalk.yellow("\nNo translation files found to process"));
      return;
    }

    // Process all languages in parallel
    console.log(chalk.cyan(`\nProcessing ${translationFiles.length} languages in parallel...`));

    // Create mutex for thread-safe console output
    const mutex = new Mutex();

    // Process languages in parallel with a reasonable concurrency limit
    const maxConcurrency = Math.min(translationFiles.length, 16); // Limit to avoid overwhelming the API
    const chunks = [];

    for (let i = 0; i < translationFiles.length; i += maxConcurrency) {
      chunks.push(translationFiles.slice(i, i + maxConcurrency));
    }

    let successful = 0;
    let failed = 0;

    // Process chunks sequentially, files within chunks in parallel
    for (const chunk of chunks) {
      const promises = chunk.map((filename) => processLanguage(filename, sortedSourceData, mutex));
      const results = await Promise.all(promises);

      for (const result of results) {
        if (result.success) {
          successful++;
        } else {
          failed++;
        }
      }
    }

    // Print final summary
    console.log(chalk.cyan("\nProcessing complete!"));
    console.log(chalk.green(`Successfully processed: ${successful} files`));
    if (failed > 0) {
      console.log(chalk.red(`Failed to process: ${failed} files`));
    }
  } catch (error) {
    console.error(chalk.red(`\nScript failed with error: ${error.message}`));
    throw error;
  }
}

// Run the script
if (require.main === module) {
  main().catch((error) => {
    console.error(chalk.red("Script execution failed:"), error);
    process.exit(1);
  });
}

module.exports = {
  main,
  translateText,
  loadJson,
  saveJson,
  extractVariables,
  formatVariable,
  sortDictRecursively,
  ensureKeysParallel,
};
