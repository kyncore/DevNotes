"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessorFactory = exports.ProcessorType = void 0;
const CsvProcessor_1 = require("./CsvProcessor");
const JsonProcessor_1 = require("./JsonProcessor");
var ProcessorType;
(function (ProcessorType) {
    ProcessorType[ProcessorType["CSV"] = 0] = "CSV";
    ProcessorType[ProcessorType["JSON"] = 1] = "JSON";
})(ProcessorType || (exports.ProcessorType = ProcessorType = {}));
class ProcessorFactory {
    static createProcessor(type) {
        switch (type) {
            case ProcessorType.CSV:
                return new CsvProcessor_1.CsvProcessor();
            case ProcessorType.JSON:
                return new JsonProcessor_1.JsonProcessor();
            default:
                throw new Error('Invalid processor type.');
        }
    }
}
exports.ProcessorFactory = ProcessorFactory;
