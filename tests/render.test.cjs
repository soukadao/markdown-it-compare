const assert = require("node:assert/strict");
const test = require("node:test");
const MarkdownIt = require("markdown-it");
const compare = require("../dist/index.js");

test("renders compare items", () => {
  const html = new MarkdownIt({ html: true }).use(compare).render(":::compare\n::item before Before\nA\n::\n::item after After\nB\n::\n:::");
  assert.match(html, /class="remark-compare remark-compare-2"/);
  assert.match(html, /data-compare-key="before"/);
  assert.match(html, /class="remark-compare-title">After/);
});
