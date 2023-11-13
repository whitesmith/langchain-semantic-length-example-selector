import { FakeEmbeddings } from "langchain/embeddings/fake";
import { SemanticSimilarityLengthBasedExampleSelector, getLengthBased } from "../index";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import {
  PromptTemplate,
  FewShotPromptTemplate
} from "langchain/prompts";

const examples = [
  { query: "healthy food", output: "galbi" },
  { query: "healthy food", output: "schnitzel" },
  { query: "foo", output: "bar" },
];

test("Test using SemanticSimilarityExampleSelector", async () => {
  const vectorStore = await MemoryVectorStore.fromTexts(
    examples.map(({ query, output }) => `<example>\n<user_input>\n${query}\n</user_input>\n<output>\n${output}\n</output>\n</example>`),
    examples,
    new FakeEmbeddings() // not using  OpenAIEmbeddings() because would be extra dependency
  );
  
  // Create a prompt template that will be used to format the examples.
  const examplePrompt = PromptTemplate.fromTemplate(`<example>
  <user_input>
    {query}
  </user_input>
  <output>
    {output}
  </output>
</example>`);

  const promptPrefix = "Answer the user's question, using the below examples as reference:";
  const promptSuffix = "User question: {query}";

  const exampleSelector = new SemanticSimilarityLengthBasedExampleSelector({
    vectorStore,
    k: 6, // return up to 6 most similar examples
    inputKeys: ["query"],
    examplePrompt,
    // prompt max length in words
    maxLength: 50 - getLengthBased(promptPrefix) - getLengthBased(promptSuffix)
  });

  // Create a FewShotPromptTemplate that will use the example selector.
  const dynamicPrompt = new FewShotPromptTemplate({
    exampleSelector,
    examplePrompt,
    prefix: promptPrefix,
    suffix: promptSuffix,
    inputVariables: ["query"],
  });

  const chosen = await dynamicPrompt.format({
    query: "What is a healthy food?",
  });

  expect(chosen).toEqual(`Answer the user's question, using the below examples as reference:

<example>
  <user_input>
    healthy food
  </user_input>
  <output>
    galbi
  </output>
</example>

User question: What is a healthy food?`);
});