import { ProcessorFactory, ProcessorType } from './ProcessorFactory';

const csvProcessor = ProcessorFactory.createProcessor(ProcessorType.CSV);
csvProcessor.process();

const jsonProcessor = ProcessorFactory.createProcessor(ProcessorType.JSON);
jsonProcessor.process();
