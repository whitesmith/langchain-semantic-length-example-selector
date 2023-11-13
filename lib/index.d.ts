import { LengthBasedExampleSelectorInput, PromptTemplate, SemanticSimilarityExampleSelector, SemanticSimilarityExampleSelectorInput } from 'langchain/prompts';
import { Example } from 'langchain/schema';
/**
* Calculates the length of a text based on the number of words and lines.
*/
export declare function getLengthBased(text: string): number;
export type SemanticLengthExampleSelectorInput = SemanticSimilarityExampleSelectorInput & LengthBasedExampleSelectorInput;
export declare class SemanticLengthExampleSelector extends SemanticSimilarityExampleSelector {
    examplePrompt: PromptTemplate;
    getTextLength: (text: string) => number;
    maxLength: number;
    constructor(data: SemanticLengthExampleSelectorInput);
    selectExamples<T>(inputVariables: Record<string, T>): Promise<Example[]>;
}
