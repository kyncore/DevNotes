import { IProcessor } from './IProcessor';

export class CsvProcessor implements IProcessor {
  public process(): void {
    console.log('Processing a CSV file.');
  }
}
