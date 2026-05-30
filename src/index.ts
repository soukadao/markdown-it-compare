import type MarkdownIt from "markdown-it";

export type MarkdownItCompareOptions = {
  allowedKeys?: string[];
};

type CompareItem = {
  key: string;
  label: string;
  start: number;
  end: number;
};

function createToken(Token: any, type: string, tag: string, nesting: -1 | 0 | 1): any {
  return new Token(type, tag, nesting);
}

function titleTokens(Token: any, label: string, level: number): any[] {
  const open = createToken(Token, "paragraph_open", "p", 1);
  open.level = level;
  open.attrSet("class", "remark-compare-title");
  const inline = createToken(Token, "inline", "", 0);
  inline.level = level + 1;
  inline.content = "";
  inline.children = [createToken(Token, "text", "", 0)];
  inline.children[0].content = label;
  const close = createToken(Token, "paragraph_close", "p", -1);
  close.level = level;
  return [open, inline, close];
}

function parseBlockLines(md: MarkdownIt, state: any, startLine: number, endLine: number): void {
  const source = state.getLines(startLine, endLine, state.blkIndent, false);
  if (source.trim().length === 0) {
    return;
  }
  md.block.parse(source, md, state.env, state.tokens);
}

function markdownItCompare(md: MarkdownIt, _options: MarkdownItCompareOptions = {}): void {
  md.block.ruler.before("fence", "markdown_it_compare", (state, startLine, endLine, silent) => {
    const line = state.getLines(startLine, startLine + 1, 0, false).trim();
    if (line !== ":::compare") {
      return false;
    }
    if (silent) {
      return true;
    }

    let end = startLine + 1;
    while (end < endLine && state.getLines(end, end + 1, 0, false).trim() !== ":::") {
      end += 1;
    }

    const items: CompareItem[] = [];
    let current: Omit<CompareItem, "end"> | undefined;
    for (let lineNumber = startLine + 1; lineNumber < end; lineNumber += 1) {
      const text = state.getLines(lineNumber, lineNumber + 1, 0, false).trim();
      const start = text.match(/^::item\s+([A-Za-z0-9_-]+)(?:\s+(.+))?$/);
      if (start) {
        current = { key: start[1], label: (start[2] ?? start[1]).trim(), start: lineNumber + 1 };
        continue;
      }
      if (text === "::" && current) {
        items.push({ ...current, end: lineNumber });
        current = undefined;
      }
    }
    if (current) {
      items.push({ ...current, end });
    }

    const Token = (state as any).Token;
    const open = state.push("markdown_it_compare_open", "div", 1);
    open.block = true;
    open.map = [startLine, end + 1];
    open.attrSet("class", `remark-compare remark-compare-${items.length}`);
    open.attrSet("data-compare-count", String(items.length));

    for (const item of items) {
      const itemOpen = state.push("markdown_it_compare_item_open", "section", 1);
      itemOpen.block = true;
      itemOpen.attrSet("class", `remark-compare-item remark-compare-item-${item.key}`);
      itemOpen.attrSet("data-compare-key", item.key);
      state.tokens.push(...titleTokens(Token, item.label, state.level + 1));
      parseBlockLines(state.md, state, item.start, item.end);
      const itemClose = state.push("markdown_it_compare_item_close", "section", -1);
      itemClose.block = true;
    }

    const close = state.push("markdown_it_compare_close", "div", -1);
    close.block = true;
    state.line = end < endLine ? end + 1 : end;
    return true;
  });
}

export default markdownItCompare;
module.exports = markdownItCompare;
module.exports.default = markdownItCompare;
