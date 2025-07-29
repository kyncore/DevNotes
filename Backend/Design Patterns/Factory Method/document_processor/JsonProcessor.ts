import { IProcessor } from './IProcessor';

export class JsonProcessor implements IProcessor {
  public process(): void {
    console.log('Processing a JSON file.');
  }
}
