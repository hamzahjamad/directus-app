# Interface: Toggle

This interface renders the toggle button. Useful for `Boolean` values.

## ⚙️ Options

Checkout common interface options(passed via `props`) [here.](../README.md)

| Option   | Default | Interface                                      | Desc                                 |
| -------- | ------- | ---------------------------------------------- | ------------------------------------ |
| labelOn  |         | [text-input]()                                 | Text to display when value is truthy |
| labelOff |         | [text-input]()                                 | Text to display when value is falsy  |
| checkbox | `false` | [toggle]() <br> _See! How cool Directus is_ 😎 | Text to display when value is falsy  |

## 🚧 Known Issues

- Need to click twice to uncheck when the default value is `true`. Happens in both `create` & `edit` mode.
- The `default` option only accepts `1` or `0`. It should accept `true` & `false` too.

## ⚡ Enhancements

- Show number of characters written.
