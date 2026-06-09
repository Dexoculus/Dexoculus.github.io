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
- `plt.cmap(name)` or `plt.set_cmap(name)` to set the default numeric color map
- `plt.colorbar(options)` to configure the SVG colorbar
- `plt.color(value, options)` to sample one color from a numeric range
- `plt.colors(name, count)` to create a categorical or sampled color list
- `plt.get_cmap(name)` to get a reusable `(position) => color` function
- `plt.cmaps()` to list the built-in color map names

The `np` helper includes `linspace`, `arange`, `sin`, `cos`, `tan`, `exp`, `log`, `sqrt`, `pow`, `abs`, and simple element-wise arithmetic helpers.

## Built-in Color Maps

All maps use the portfolio color system. Aliases such as `intensity`, `delta`, `alert`, `halo`, and `categorical` are also accepted.

| Name | Intended use |
| --- | --- |
| `scalar` | Heat, density, confidence, score, cost, and other ordered values |
| `signed` | Negative-to-positive deltas, residuals, and before/after differences |
| `risk` | Load, warning, failure probability, and operational severity |
| `signal` | Phase, cluster, rarity, latent state, and communication quality |
| `series` | Distinct categorical traces; this is also the default line color cycle |

## Value-colored Plot

Use `colorBy: "y"` or `colorBy: "x"` for a shorthand, or pass a numeric array through `colorBy`/`colorValues`. A colorbar is shown automatically and can be disabled with `colorbar: false`.

````md
```plot
const confidence = [0.18, 0.42, 0.67, 0.84, 0.96]

plt.title("Model confidence")
plt.ylabel("confidence")
plt.cmap("scalar")
plt.bar(["A", "B", "C", "D", "E"], confidence, {
  label: "validation",
  colorBy: "y"
})
plt.colorbar({ label: "confidence", min: 0, max: 1 })
```
````

Trace-level settings override the plot default:

```js
plt.scatter(x, residual, {
  cmap: "signed",
  colorBy: residual,
  vmin: -1,
  vmax: 1,
  colorbar: { label: "residual" }
})
```

For manually assigned colors:

```js
const categoryColors = plt.colors("series", 4)
const signal = plt.get_cmap("signal")

plt.plot(x, y1, { color: categoryColors[0], label: "baseline" })
plt.plot(x, y2, { color: signal(0.75), label: "phase 3" })
```

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
