"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProcessorFactory_1 = require("./ProcessorFactory");
const csvProcessor = ProcessorFactory_1.ProcessorFactory.createProcessor(ProcessorFactory_1.ProcessorType.CSV);
csvProcessor.process();
const jsonProcessor = ProcessorFactory_1.ProcessorFactory.createProcessor(ProcessorFactory_1.ProcessorType.JSON);
jsonProcessor.process();
