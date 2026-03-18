import fs from 'fs';
import path from 'path';

/**
 * Utility to read JSON test data from the testdata folder.
 */
export class TestDataReader {
  /**
   * The absolute path to the testdata directory.
   */
  private static readonly testDataPath = path.resolve(__dirname, '../testdata');

  /**
   * Reads a JSON file and returns the parsed object.
   * @param fileName The name of the JSON file (e.g., 'user.json').
   * @returns The parsed JSON object.
   * @throws Error if the file does not exist.
   */
  public static readJSON<T>(fileName: string): T {
    const filePath = path.join(this.testDataPath, fileName);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Test data file not found: ${filePath}`);
    }
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData) as T;
  }
}
