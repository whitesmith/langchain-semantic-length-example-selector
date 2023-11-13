import { LengthBasedExampleSelectorInput, PromptTemplate, SemanticSimilarityExampleSelector, SemanticSimilarityExampleSelectorInput } from 'langchain/prompts';
import { Example } from 'langchain/schema';
/**
* Calculates the length of a text based on the number of words and lines.
*/
export declare function getLengthBased(text: string): number;
export type SemanticSimilarityLengthBasedExampleSelectorInput = SemanticSimilarityExampleSelectorInput & LengthBasedExampleSelectorInput;
export declare class SemanticSimilarityLengthBasedExampleSelector extends SemanticSimilarityExampleSelector {
    examplePrompt: PromptTemplate;
    getTextLength: (text: string) => number;
    maxLength: number;
    constructor(data: SemanticSimilarityLengthBasedExampleSelectorInput);
    selectExamples<T>(inputVariables: Record<string, T>): Promise<Example[]>;
}
