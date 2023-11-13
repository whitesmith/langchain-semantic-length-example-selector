"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticSimilarityLengthBasedExampleSelector = exports.getLengthBased = void 0;
const prompts_1 = require("langchain/prompts");
/**
* Calculates the length of a text based on the number of words and lines.
*/
function getLengthBased(text) {
    return text.split(/\n| /).length;
}
exports.getLengthBased = getLengthBased;
class SemanticSimilarityLengthBasedExampleSelector extends prompts_1.SemanticSimilarityExampleSelector {
    constructor(data) {
        var _a, _b;
        super(data);
        this.getTextLength = getLengthBased;
        this.maxLength = 2048;
        this.examplePrompt = data.examplePrompt;
        this.maxLength = (_a = data.maxLength) !== null && _a !== void 0 ? _a : 2048;
        this.getTextLength = (_b = data.getTextLength) !== null && _b !== void 0 ? _b : getLengthBased;
    }
    selectExamples(inputVariables) {
        const _super = Object.create(null, {
            selectExamples: { get: () => super.selectExamples }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const SemanticSimilarityExamples = yield _super.selectExamples.call(this, inputVariables);
            const formattedExamples = yield Promise.all(SemanticSimilarityExamples.map(e => this.examplePrompt.format(e)));
            const inputs = Object.values(inputVariables).join(' ');
            let remainingLength = this.maxLength - this.getTextLength(inputs);
            let i = 0;
            const examples = [];
            while (remainingLength > 0 && i < formattedExamples.length) {
                const newLength = remainingLength - this.getTextLength(formattedExamples[i]);
                if (newLength < 0) {
                    break;
                }
                else {
                    examples.push(SemanticSimilarityExamples[i]);
                    remainingLength = newLength;
                }
                i += 1;
            }
            return examples;
        });
    }
}
exports.SemanticSimilarityLengthBasedExampleSelector = SemanticSimilarityLengthBasedExampleSelector;
