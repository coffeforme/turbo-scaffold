import { Fragment, type ReactNode } from "react";
import styles from "./markdownContent.module.scss";

type MarkdownContentProps = {
  markdown: string;
  className?: string;
};

type CodeBlock = {
  language?: string;
  code: string;
};

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={`inline-${index}`} className={styles.inlineCode}>
          {part.slice(1, -1)}
        </code>
      );
    }

    return <Fragment key={`text-${index}`}>{part}</Fragment>;
  });
}

function renderCodeBlock(block: CodeBlock, key: string) {
  return (
    <pre key={key} className={styles.codeBlock}>
      {block.language ? <span className={styles.codeLanguage}>{block.language}</span> : null}
      <code>{block.code}</code>
    </pre>
  );
}

function parseMarkdown(markdown: string) {
  const lines = markdown.trim().split(/\r?\n/);
  const nodes: ReactNode[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];
  let codeBlock: CodeBlock | null = null;

  const flushParagraph = () => {
    if (!paragraphLines.length) {
      return;
    }

    nodes.push(
      <p key={`paragraph-${nodes.length}`} className={styles.paragraph}>
        {renderInlineMarkdown(paragraphLines.join(" "))}
      </p>,
    );
    paragraphLines = [];
  };

  const flushList = () => {
    if (!listItems.length) {
      return;
    }

    nodes.push(
      <ul key={`list-${nodes.length}`} className={styles.list}>
        {listItems.map((item, index) => (
          <li key={`item-${index}`}>{renderInlineMarkdown(item)}</li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  const flushCodeBlock = () => {
    if (!codeBlock) {
      return;
    }

    nodes.push(renderCodeBlock(codeBlock, `code-${nodes.length}`));
    codeBlock = null;
  };

  lines.forEach((line) => {
    if (codeBlock) {
      if (line.startsWith("```")) {
        flushCodeBlock();
      } else {
        codeBlock.code = codeBlock.code ? `${codeBlock.code}\n${line}` : line;
      }
      return;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      return;
    }

    if (line.startsWith("```")) {
      flushParagraph();
      flushList();
      codeBlock = {
        language: line.replace("```", "").trim() || undefined,
        code: "",
      };
      return;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      nodes.push(
        <h3 key={`heading-${nodes.length}`} className={styles.heading}>
          {renderInlineMarkdown(line.slice(3).trim())}
        </h3>,
      );
      return;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      listItems.push(line.slice(2).trim());
      return;
    }

    paragraphLines.push(line.trim());
  });

  flushParagraph();
  flushList();
  flushCodeBlock();

  return nodes;
}

export function MarkdownContent({ markdown, className }: MarkdownContentProps) {
  return <div className={[styles.root, className].filter(Boolean).join(" ")}>{parseMarkdown(markdown)}</div>;
}
