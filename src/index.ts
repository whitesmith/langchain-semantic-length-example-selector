import {
  LengthBasedExampleSelectorInput,
  PromptTemplate,
  SemanticSimilarityExampleSelector,
  SemanticSimilarityExampleSelectorInput,
} from 'langchain/prompts';
import { Example } from 'langchain/schema';

/**
* Calculates the length of a text based on the number of words and lines.
*/
export function getLengthBased(text: string): number {
  return text.split(/\n| /).length;
}

export type SemanticSimilarityLengthBasedExampleSelectorInput = SemanticSimilarityExampleSelectorInput & LengthBasedExampleSelectorInput;

export class SemanticSimilarityLengthBasedExampleSelector extends SemanticSimilarityExampleSelector {
  examplePrompt!: PromptTemplate;

  getTextLength: (text: string) => number = getLengthBased;

  maxLength = 2048;

  constructor(data: SemanticSimilarityLengthBasedExampleSelectorInput) {
    super(data);
    this.examplePrompt = data.examplePrompt;
    this.maxLength = data.maxLength ?? 2048;
    this.getTextLength = data.getTextLength ?? getLengthBased;
  }
  
  async selectExamples<T>(
    inputVariables: Record<string, T>
  ): Promise<Example[]> {
    const SemanticSimilarityExamples = await super.selectExamples(inputVariables);

    const formattedExamples = await Promise.all(
      SemanticSimilarityExamples.map(e => this.examplePrompt.format(e))
    );
    
    const inputs = Object.values(inputVariables).join(' ');
    let remainingLength = this.maxLength - this.getTextLength(inputs);
    let i = 0;
    const examples: Example[] = [];
    
    while (remainingLength > 0 && i < formattedExamples.length) {
      const newLength = remainingLength - this.getTextLength(formattedExamples[i]);
      if (newLength < 0) {
        break;
      } else {
        examples.push(SemanticSimilarityExamples[i]);
        remainingLength = newLength;
      }
      i += 1;
    }
    
    return examples;
  }
}
