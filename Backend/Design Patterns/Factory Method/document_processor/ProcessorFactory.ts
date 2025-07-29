import { IProcessor } from './IProcessor';
import { CsvProcessor } from './CsvProcessor';
import { JsonProcessor } from './JsonProcessor';

export enum ProcessorType {
  CSV,
  JSON,
}

export class ProcessorFactory {
  public static createProcessor(type: ProcessorType): IProcessor {
    switch (type) {
      case ProcessorType.CSV:
        return new CsvProcessor();
      case ProcessorType.JSON:
        return new JsonProcessor();
      default:
        throw new Error('Invalid processor type.');
    }
  }
}
