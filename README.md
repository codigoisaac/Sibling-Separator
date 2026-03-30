# Sibling Separator 🍃

You'll never have to work with all that "stuck together" code again.

This extension helps you improve code readability by automatically separating sibling HTML-like elements with a blank line.

### Before

```jsx
<div>
  <Header />
  <main>
    <Article />
    <Sidebar />
    <Comments />
  </main>
  <Footer />
</div>
```

### After

```jsx
<div>
  <Header />

  <main>
    <Article />

    <Sidebar />

    <Comments />
  </main>

  <Footer />
</div>
```

## Usage

Sibling Separator can be triggered in two ways:

1. **Keyboard Shortcut**: Press `Ctrl+K Space` (Windows/Linux) or `Cmd+K Space` (Mac) while editing a file
2. **Command Palette**: Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and search for "Sibling Separator"

The extension will:

- Parse your JSX/TSX code
- Identify sibling elements that need spacing
- Insert blank lines with proper indentation
- Preserve existing spacing if elements already have blank lines between them

## Supported Files

- .tsx
- .jsx

## Known Issues

- The extension currently processes the entire file. For very large files, this may take a moment.
- Only formats JSX/TSX elements. Standard HTML files are not yet supported.

## Contributing

Found a bug or have a feature request? Please open an issue on the [GitHub repository](https://github.com/codigoisaac/Sibling-Separator).

## License

This extension is licensed under the MIT License.
