# Lightweight Chart Blocks

Use fenced `plot` blocks for a small matplotlib-like authoring API. The renderer outputs responsive SVG and does not load Plotly, mathjs, Mermaid, or Three.js.

````md
```plot
const x = np.linspace(0, 10, 120)

plt.title("Training loss")
plt.xlabel("epoch")
plt.ylabel("loss")
plt.plot(x, x.map((v) => Math.exp(-v / 3)), { label: "train" })
plt.scatter([1, 3, 5, 7], [0.8, 0.42, 0.22, 0.12], { label: "checkpoints" })
```
````

## Supported API

- `plt.title(text)`, `plt.xlabel(text)`, `plt.ylabel(text)`
- `plt.xlim(min, max)`, `plt.ylim(min, max)`, `plt.grid(false)`, `plt.legend(false)`
- `plt.plot(x, y, options)`, `plt.scatter(x, y, options)`
- `plt.bar(labels, values, options)`
- `plt.hist(values, { bins, label })`
- `plt.boxplot({ groupA: values, groupB: values })`
- `plt.func(expression, options)` for lightweight function plots
- `plt.param(name, { min, max, step, value })` for slider-driven functions

The `np` helper includes `linspace`, `arange`, `sin`, `cos`, `tan`, `exp`, `log`, `sqrt`, `pow`, `abs`, and simple element-wise arithmetic helpers.

## Slider Example

````md
```plot
plt.title("Parametric sine")
plt.xlabel("x")
plt.ylabel("y")
plt.param("a", { min: 0, max: 2, step: 0.1, value: 1 })
plt.param("b", { min: 0.1, max: 4, step: 0.1, value: 1 })
plt.func("a * sin(b * x)", {
  domain: [-6.28, 6.28],
  samples: 240,
  label: "a sin(bx)"
})
```
````

Existing JSON `chart` blocks still work for simple `bar`, `line`, `scatter`, `box`, and `function` specs.
