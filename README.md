# @soukadao/markdown-it-compare

`:::compare` ブロックと `::item` を比較表示用の HTML に変換する markdown-it プラグインです。

```js
const MarkdownIt = require("markdown-it");
const compare = require("@soukadao/markdown-it-compare");

const md = new MarkdownIt({ html: true }).use(compare);
```
