import * as vscode from "vscode";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import MagicString from "magic-string";

export function activate(context: vscode.ExtensionContext) {
  function showVscodeMessage(type: "info" | "error", message: string) {
    const messageIntro = `Code Breathe:`;
    const messageBody = `${messageIntro} ${message}`;

    switch (type) {
      case "info":
        vscode.window.showInformationMessage(messageBody);
        break;

      case "error":
        vscode.window.showErrorMessage(messageBody);
        break;
    }
  }

  const disposable = vscode.commands.registerCommand(
    "code-breathe.separate-siblings",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        showVscodeMessage("error", "No active editor found.");
        return;
      }

      const document = editor.document;
      const code = document.getText();
      const magic = new MagicString(code);

      let abstractSyntaxTree;

      try {
        abstractSyntaxTree = parse(code, {
          sourceType: "module",
          plugins: ["typescript", "jsx"],
          tokens: true,
        });
      } catch (err) {
        showVscodeMessage("error", "Failed to parse document as JS/TSX.");

        console.error(err);

        return;
      }

      function isElementNode(node: any) {
        return (
          node && (node.type === "JSXElement" || node.type === "JSXFragment")
        );
      }

      traverse(abstractSyntaxTree as any, {
        JSXElement(path: any) {
          handleChildrenArray(path.node.children);
        },
        JSXFragment(path: any) {
          handleChildrenArray(path.node.children);
        },
      });

      function handleChildrenArray(children: any[]) {
        if (!children || children.length < 2) {
          return;
        }

        const elementItems: { idx: number; node: any }[] = [];

        for (let i = 0; i < children.length; i++) {
          const ch = children[i];

          if (isElementNode(ch)) {
            elementItems.push({ idx: i, node: ch });
          }
        }

        for (let i = 0; i < elementItems.length - 1; i++) {
          const a = elementItems[i].node;
          const b = elementItems[i + 1].node;

          const between = code.slice(a.end, b.start);

          // If already two or more newlines, skip
          if (/\n\s*\n/.test(between)) {
            continue;
          }

          // Determine the indentation of the next sibling
          const bLineStart = code.lastIndexOf("\n", b.start) + 1;
          const bIndentMatch = /^(\s*)/.exec(code.slice(bLineStart, b.start));
          const bIndent = bIndentMatch ? bIndentMatch[1] : "";

          // Insert a blank line with the same indentation as the next element
          magic.appendLeft(b.start, "\n" + bIndent);
        }
      }

      const result = magic.toString();

      if (result === code) {
        return;
      }

      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(code.length),
      );

      await editor.edit((editBuilder) => {
        editBuilder.replace(fullRange, result);
      });
    },
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
