# 🦜️🔗 LangChain.js Semantic Length Example Selector
When you want to provide examples as context for a LLM you can use LangChain.js ["Select by length"](https://js.langchain.com/docs/modules/model_io/prompts/example_selectors/length_based) or ["Select by similarity"](https://js.langchain.com/docs/modules/model_io/prompts/example_selectors/similarity) Prompt Selectors. However what if you need to select by similarity while ensuring a max length? This package solves that issue by combining the `LengthBasedExampleSelector` and the `SemanticSimilarityExampleSelector` into the `SemanticLengthExampleSelector`.

### Install package

```bash
yarn add whitesmith/langchain-semantic-length-example-selector
```

### Usage

```js
import { SemanticLengthExampleSelector, getLengthBased } from '@whitesmith/langchain-semantic-length-example-selector';

// ...

const promptPrefix = "Generate ... using the below examples as reference:";
const promptSuffix = "You are ... ";
const examplePrompt = PromptTemplate.fromTemplate("<example>{content}</example>");

const embeddings = new OpenAIEmbeddings();
const vectorStore = new MemoryVectorStore(embeddings);

// ...

const exampleSelector = new SemanticLengthExampleSelector({
  vectorStore: vectorStore,
  k: 6, // return up to 6 most similar examples
  inputKeys: ["content"],
  examplePrompt: examplePrompt,
  // prompt max length in words
  maxLength: 50 - getLengthBased(promptPrefix) - getLengthBased(promptSuffix)
});

const dynamicPrompt = new FewShotPromptTemplate({
  exampleSelector,
  examplePrompt,
  prefix: promptPrefix,
  suffix: promptSuffix,
  inputVariables: ["content"],
});

// ...

// For testing purposes
const formattedValue = await dynamicPrompt.format({
  content: "...",
});
console.log(formattedValue);

// ...

const model = new ChatOpenAI(...);
const chain = dynamicPrompt.pipe(model);

const result = await chain.invoke({ content: exampleContent });
console.log(result.content);
```

For a full example check the file in `/examples/index.js` ([link](https://github.com/whitesmith/langchain-semantic-length-example-selector/blob/main/examples/index.js))

<br/>

---

<br/>

### Development

Run

```bash
yarn build
```

### Test the package

You can test the code with [Jest](https://jestjs.io/)

```bash
yarn test
```

You can find the test coverage in `coverage/lcov-report/index.html`.

### Check dependencies

You can check and upgrade dependencies to the latest versions, ignoring specified versions. with [npm-check-updates](https://www.npmjs.com/package/npm-check-updates):

```bash
yarn run check-updates
```

You can also use `npm run check-updates:minor` to update only patch and minor.

Instead `npm run check-updates:patch` only updates patch.

### Publish

First commit the changes to GitHub. Then login to your [NPM](https://www.npmjs.com) account (If you don’t have an account you can do so on [https://www.npmjs.com/signup](https://www.npmjs.com/signup))

```bash
npm login
```

Then run publish:

```bash
npm publish
```

If you're using a scoped name use:

```bash
npm publish --access public
```

### Bumping a new version

To update the package use:

```bash
npm version patch
```

and then

```bash
npm publish
```


Thank you to @el3um4s for the [@el3um4s/typescript-npm-package-starter](https://www.npmjs.com/package/@el3um4s/typescript-npm-package-starter).
