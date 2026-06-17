---
title: Plot and Colorbar Authoring Guide
tags: [Site, Visualization, Plot, Data Science]
description: A practical guide to the portfolio site's lightweight plot blocks, built-in color maps, colorbars, and chart authoring patterns.
---

This note documents the lightweight visualization system used by this portfolio. The goal is to make research notes feel close to writing quick `matplotlib` snippets while keeping the published site static, small, and easy to host on GitHub Pages.

The preferred authoring format is a fenced `plot` block:

````md
```plot
const x = np.linspace(0, 10, 120)

plt.title("Training loss")
plt.xlabel("epoch")
plt.ylabel("loss")
plt.plot(x, x.map((v) => Math.exp(-v / 3)), { label: "train" })
```
````

When a note contains a `plot` or `chart` block, the site includes the chart renderer for that page only. The renderer converts the block into responsive SVG in the browser. Ordinary notes do not load the renderer.

## Runtime Model

The plot runtime provides two globals inside each `plot` block:

- `plt`: a small plotting API inspired by `matplotlib.pyplot`.
- `np`: a small numeric helper object inspired by NumPy.

The code runs as trusted first-party JavaScript. It is intended for notes written by the site owner, not for untrusted user input.

Useful `np` helpers:

| Helper | Purpose |
| --- | --- |
| `np.linspace(start, end, count)` | Evenly spaced values, including both endpoints. |
| `np.arange(start, end, step)` | Step-based range, excluding the end value. |
| `np.sin`, `np.cos`, `np.tan` | Element-wise trigonometric functions. |
| `np.exp`, `np.log`, `np.sqrt`, `np.abs` | Element-wise numeric transforms. |
| `np.pow`, `np.add`, `np.sub`, `np.mul`, `np.div` | Element-wise binary operations. |
| `np.pi`, `np.e` | Math constants. |

Global plot settings:

| API | Purpose |
| --- | --- |
| `plt.title(text)` | Chart title. |
| `plt.xlabel(text)` / `plt.ylabel(text)` | Axis labels. |
| `plt.xlim(min, max)` / `plt.ylim(min, max)` | Explicit axis limits. |
| `plt.grid(false)` | Disable grid lines. |
| `plt.legend(false)` | Disable legend output. |
| `plt.cmap(name)` / `plt.set_cmap(name)` | Set the default numeric color map. |
| `plt.colorbar(options)` | Configure the colorbar for mapped values. |

## Basic Line and Scatter

Use `plt.plot(x, y, options)` for lines and `plt.scatter(x, y, options)` for points. Both accept `label` and `color`.

````md
```plot
const epoch = np.arange(1, 11)
const train = epoch.map((x) => 0.92 * Math.exp(-x / 4) + 0.04)
const val = epoch.map((x) => 0.88 * Math.exp(-x / 5) + 0.08)

plt.title("Loss curve")
plt.xlabel("epoch")
plt.ylabel("loss")
plt.plot(epoch, train, { label: "train" })
plt.plot(epoch, val, { label: "validation" })
plt.scatter([2, 5, 8], [train[1], train[4], train[7]], { label: "checkpoints" })
```
````

Rendered:

```plot
const epoch = np.arange(1, 11)
const train = epoch.map((x) => 0.92 * Math.exp(-x / 4) + 0.04)
const val = epoch.map((x) => 0.88 * Math.exp(-x / 5) + 0.08)

plt.title("Loss curve")
plt.xlabel("epoch")
plt.ylabel("loss")
plt.plot(epoch, train, { label: "train" })
plt.plot(epoch, val, { label: "validation" })
plt.scatter([2, 5, 8], [train[1], train[4], train[7]], { label: "checkpoints" })
```

If only one array is supplied, it is treated as `y`, and the x-axis becomes the array index. When you need labels or colors, pass an explicit x array as well.

````md
```plot
plt.title("Index-based signal")
plt.ylabel("value")
plt.plot([0.1, 0.4, 0.2, 0.7, 0.55])
```
````

## Bar Plots

Use `plt.bar(labels, values, options)` for categorical comparisons. Labels are treated as category names.

````md
```plot
const tasks = ["pick", "place", "align", "recover"]
const success = [0.82, 0.76, 0.68, 0.58]

plt.title("Task success rate")
plt.ylabel("success")
plt.ylim(0, 1)
plt.bar(tasks, success, { label: "policy" })
```
````

Rendered:

```plot
const tasks = ["pick", "place", "align", "recover"]
const success = [0.82, 0.76, 0.68, 0.58]

plt.title("Task success rate")
plt.ylabel("success")
plt.ylim(0, 1)
plt.bar(tasks, success, { label: "policy" })
```

## Histograms

Use `plt.hist(values, { bins, label })`. Histograms are internally rendered as bars.

````md
```plot
const latency = [18, 21, 19, 23, 26, 24, 31, 28, 22, 20, 25, 27, 34, 29, 21, 24]

plt.title("Inference latency")
plt.xlabel("latency bucket")
plt.ylabel("count")
plt.hist(latency, { bins: 6, label: "edge device" })
```
````

Rendered:

```plot
const latency = [18, 21, 19, 23, 26, 24, 31, 28, 22, 20, 25, 27, 34, 29, 21, 24]

plt.title("Inference latency")
plt.xlabel("latency bucket")
plt.ylabel("count")
plt.hist(latency, { bins: 6, label: "edge device" })
```

## Box Plots

Use `plt.boxplot(groups, options)` for distribution summaries. The simplest form is an object whose keys become group labels.

````md
```plot
plt.title("Episode return distribution")
plt.ylabel("return")
plt.boxplot({
  baseline: [41, 45, 39, 44, 47, 43, 42],
  augmented: [48, 51, 49, 55, 53, 50, 52],
  deployed: [44, 46, 42, 49, 47, 45, 48]
})
```
````

Rendered:

```plot
plt.title("Episode return distribution")
plt.ylabel("return")
plt.boxplot({
  baseline: [41, 45, 39, 44, 47, 43, 42],
  augmented: [48, 51, 49, 55, 53, 50, 52],
  deployed: [44, 46, 42, 49, 47, 45, 48]
})
```

Array input also works:

````md
```plot
plt.boxplot(
  [
    [18, 21, 19, 23, 26],
    [33, 29, 37, 35, 31]
  ],
  { labels: ["edge", "server"] }
)
```
````

## Function Plots

Use `plt.func(expression, options)` or `plt.fplot(expression, options)` to draw mathematical functions. Expressions are evaluated with `Math` functions in scope, so `sin(x)`, `exp(x)`, `log(x)`, and similar names work.

````md
```plot
plt.title("Damped oscillation")
plt.xlabel("x")
plt.ylabel("f(x)")
plt.func("exp(-0.18 * x) * sin(2.4 * x)", {
  domain: [0, 12],
  samples: 360,
  label: "damped sin"
})
```
````

Rendered:

```plot
plt.title("Damped oscillation")
plt.xlabel("x")
plt.ylabel("f(x)")
plt.func("exp(-0.18 * x) * sin(2.4 * x)", {
  domain: [0, 12],
  samples: 360,
  label: "damped sin"
})
```

Options:

| Option | Purpose |
| --- | --- |
| `domain: [min, max]` | X range used for sampling. |
| `samples` | Number of sampled points. Clamped internally to a practical range. |
| `label` | Legend label. |
| `color` | Manual stroke color. |

## Interactive Parameters

Use `plt.param(name, { min, max, step, value })` to create a slider. Parameters become variables inside function expressions.

````md
```plot
plt.title("Parameterized controller response")
plt.xlabel("time")
plt.ylabel("response")
plt.param("gain", { min: 0.2, max: 2.4, step: 0.1, value: 1.1 })
plt.param("damping", { min: 0.05, max: 0.5, step: 0.01, value: 0.18 })
plt.func("gain * exp(-damping * x) * sin(2 * x)", {
  domain: [0, 12],
  samples: 360,
  label: "response"
})
```
````

Rendered:

```plot
plt.title("Parameterized controller response")
plt.xlabel("time")
plt.ylabel("response")
plt.param("gain", { min: 0.2, max: 2.4, step: 0.1, value: 1.1 })
plt.param("damping", { min: 0.05, max: 0.5, step: 0.01, value: 0.18 })
plt.func("gain * exp(-damping * x) * sin(2 * x)", {
  domain: [0, 12],
  samples: 360,
  label: "response"
})
```

You can also define parameters inside the function options:

````md
```plot
plt.func("a * sin(b * x)", {
  domain: [-6.28, 6.28],
  params: {
    a: { min: 0, max: 2, step: 0.1, value: 1 },
    b: { min: 0.1, max: 4, step: 0.1, value: 1 }
  }
})
```
````

## Built-in Color Maps

The visualization system exposes the portfolio color system through built-in color maps.

| Map | Kind | Intended Use |
| --- | --- | --- |
| `scalar` | Sequential | Heat, density, confidence, score, cost, magnitude. |
| `signed` | Diverging | Negative-to-positive deltas, residuals, errors, before/after difference. |
| `risk` | Sequential | Load, warning, failure probability, operational severity. |
| `signal` | Sequential | Phase, cluster, rarity, latent state, communication quality. |
| `series` | Categorical | Distinct traces and manually assigned categories. |

Aliases:

| Alias | Resolves To |
| --- | --- |
| `default`, `intensity`, `sequential` | `scalar` |
| `delta`, `diverging` | `signed` |
| `alert`, `warning` | `risk` |
| `halo`, `phase` | `signal` |
| `categorical`, `category` | `series` |

Use `plt.cmap(name)` to set the default numeric map for the current plot.

````md
```plot
const x = np.linspace(-3, 3, 120)
const y = x.map((v) => v * v - 2)

plt.title("Signed residual color")
plt.xlabel("x")
plt.ylabel("residual")
plt.cmap("signed")
plt.scatter(x, y, {
  label: "sample",
  colorBy: "y",
  vmin: -2,
  vmax: 7
})
plt.colorbar({ label: "residual", min: -2, max: 7, ticks: 6 })
```
````

Rendered:

```plot
const x = np.linspace(-3, 3, 120)
const y = x.map((v) => v * v - 2)

plt.title("Signed residual color")
plt.xlabel("x")
plt.ylabel("residual")
plt.cmap("signed")
plt.scatter(x, y, {
  label: "sample",
  colorBy: "y",
  vmin: -2,
  vmax: 7
})
plt.colorbar({ label: "residual", min: -2, max: 7, ticks: 6 })
```

## Color-Mapped Values

Use `colorBy` to map per-point or per-bar values to colors.

| Option | Behavior |
| --- | --- |
| `colorBy: "x"` | Use each x value as the color value. |
| `colorBy: "y"` | Use each y value as the color value. |
| `colorBy: [values]` | Use an explicit numeric array. |
| `colorValues: [values]` | Alternative explicit numeric array. |
| `colorBy: "group"` | Use boxplot group index as the color value. |

Trace-level range controls:

| Option | Purpose |
| --- | --- |
| `cmap` | Override the plot-level color map. |
| `vmin` / `vmax` | Fix the value range used for color mapping. |
| `reverse: true` | Reverse the selected color map. |
| `colorbar: false` | Disable the automatic colorbar for that mapped trace. |

Example using `risk` for utilization:

````md
```plot
const nodes = ["cpu", "gpu", "io", "net", "disk"]
const usage = [48, 91, 64, 38, 78]

plt.title("System utilization")
plt.ylabel("usage (%)")
plt.ylim(0, 100)
plt.bar(nodes, usage, {
  label: "load",
  colorBy: usage,
  cmap: "risk",
  vmin: 0,
  vmax: 100,
  colorbar: { label: "utilization (%)", ticks: 6 }
})
```
````

Rendered:

```plot
const nodes = ["cpu", "gpu", "io", "net", "disk"]
const usage = [48, 91, 64, 38, 78]

plt.title("System utilization")
plt.ylabel("usage (%)")
plt.ylim(0, 100)
plt.bar(nodes, usage, {
  label: "load",
  colorBy: usage,
  cmap: "risk",
  vmin: 0,
  vmax: 100,
  colorbar: { label: "utilization (%)", ticks: 6 }
})
```

## Colorbar System

A colorbar appears automatically when a trace uses `colorBy` or `colorValues`. You can also configure it explicitly:

```js
plt.colorbar({
  label: "confidence",
  min: 0,
  max: 1,
  ticks: 6,
  cmap: "scalar",
  reverse: false
})
```

Colorbar options:

| Option | Purpose |
| --- | --- |
| `label` | Vertical colorbar label. |
| `min` / `max` | Displayed numeric range. |
| `ticks` | Tick count, clamped internally. |
| `cmap` | Color map used by the colorbar. |
| `reverse` | Reverse color direction. |
| `show: false` | Hide a plot-level colorbar. |

The recommended pattern is:

1. Set a map with `plt.cmap("risk")` or with trace-level `cmap`.
2. Map values with `colorBy`.
3. Fix the range using `vmin` and `vmax` for stable comparisons across figures.
4. Add `plt.colorbar({ label, min, max })` if the automatic range or label is not explicit enough.

Example with reversed scalar color:

````md
```plot
const score = [0.12, 0.22, 0.41, 0.63, 0.82, 0.95]

plt.title("Distance-to-target score")
plt.ylabel("score")
plt.ylim(0, 1)
plt.bar(["A", "B", "C", "D", "E", "F"], score, {
  colorBy: "y",
  cmap: "scalar",
  reverse: true,
  vmin: 0,
  vmax: 1
})
plt.colorbar({ label: "lower is better", min: 0, max: 1, reverse: true })
```
````

## Manual Colors

Use `plt.colors(name, count)` when each trace should receive a distinct fixed color.

````md
```plot
const x = np.linspace(0, 6.28, 160)
const colors = plt.colors("series", 3)

plt.title("Manual categorical colors")
plt.xlabel("x")
plt.ylabel("y")
plt.plot(x, x.map((v) => Math.sin(v)), { label: "sin", color: colors[0] })
plt.plot(x, x.map((v) => Math.cos(v)), { label: "cos", color: colors[1] })
plt.plot(x, x.map((v) => Math.sin(v) * Math.cos(v)), { label: "sin cos", color: colors[2] })
```
````

Rendered:

```plot
const x = np.linspace(0, 6.28, 160)
const colors = plt.colors("series", 3)

plt.title("Manual categorical colors")
plt.xlabel("x")
plt.ylabel("y")
plt.plot(x, x.map((v) => Math.sin(v)), { label: "sin", color: colors[0] })
plt.plot(x, x.map((v) => Math.cos(v)), { label: "cos", color: colors[1] })
plt.plot(x, x.map((v) => Math.sin(v) * Math.cos(v)), { label: "sin cos", color: colors[2] })
```

Use `plt.color(value, options)` to sample a single numeric color:

```js
const warning = plt.color(0.82, { cmap: "risk", min: 0, max: 1 })
plt.plot(x, y, { color: warning, label: "warning zone" })
```

Use `plt.get_cmap(name)` when you want a reusable color function:

```js
const signal = plt.get_cmap("signal")
const c0 = signal(0.0)
const c1 = signal(0.5)
const c2 = signal(1.0)
```

## Box Plot Color Groups

For box plots, `colorBy: "group"` maps each group index to the selected color map.

````md
```plot
plt.title("Latency by deployment mode")
plt.ylabel("ms")
plt.boxplot(
  {
    local: [18, 21, 19, 23, 20, 22],
    edge: [26, 28, 25, 31, 29, 27],
    remote: [44, 48, 41, 52, 47, 45]
  },
  {
    colorBy: "group",
    cmap: "risk",
    colorbar: { label: "deployment index", min: 0, max: 2, ticks: 3 }
  }
)
```
````

Rendered:

```plot
plt.title("Latency by deployment mode")
plt.ylabel("ms")
plt.boxplot(
  {
    local: [18, 21, 19, 23, 20, 22],
    edge: [26, 28, 25, 31, 29, 27],
    remote: [44, 48, 41, 52, 47, 45]
  },
  {
    colorBy: "group",
    cmap: "risk",
    colorbar: { label: "deployment index", min: 0, max: 2, ticks: 3 }
  }
)
```

## JSON Chart Compatibility

Older `chart` blocks still work for simple cases. Use this format when you want declarative JSON instead of the `plot` DSL.

````md
```chart
{
  "kind": "bar",
  "title": "Ablation",
  "xLabel": "variant",
  "yLabel": "accuracy",
  "x": ["base", "aug", "aug+filter"],
  "y": [0.71, 0.78, 0.83],
  "colorBy": "y",
  "cmap": "scalar",
  "colorbar": { "label": "accuracy", "min": 0.65, "max": 0.85 }
}
```
````

Rendered:

```chart
{
  "kind": "bar",
  "title": "Ablation",
  "xLabel": "variant",
  "yLabel": "accuracy",
  "x": ["base", "aug", "aug+filter"],
  "y": [0.71, 0.78, 0.83],
  "colorBy": "y",
  "cmap": "scalar",
  "colorbar": { "label": "accuracy", "min": 0.65, "max": 0.85 }
}
```

Supported JSON `kind` values:

- `bar`
- `line`
- `scatter`
- `box`
- `function`

For new notes, prefer `plot` because it is more concise and easier to iterate on.

## Practical Patterns

### Training Curve

Use line plots for epoch-level metrics and scatter points for checkpoints.

```js
plt.plot(epoch, loss, { label: "train" })
plt.scatter(checkpointEpoch, checkpointLoss, { label: "saved checkpoints" })
```

### Benchmark Comparison

Use bars with `colorBy: "y"` and a fixed colorbar range.

```js
plt.bar(methods, scores, {
  colorBy: "y",
  cmap: "scalar",
  vmin: 0,
  vmax: 1
})
plt.colorbar({ label: "score", min: 0, max: 1 })
```

### Residual or Error Plot

Use the diverging `signed` map.

```js
plt.scatter(x, residual, {
  colorBy: residual,
  cmap: "signed",
  vmin: -1,
  vmax: 1
})
plt.colorbar({ label: "residual", min: -1, max: 1, cmap: "signed" })
```

### Risk or Load Plot

Use the `risk` map for operational severity.

```js
plt.bar(nodes, load, {
  colorBy: load,
  cmap: "risk",
  vmin: 0,
  vmax: 100
})
```

## Limitations

The lightweight plot renderer is intentionally small.

- It renders SVG, not Canvas or WebGL.
- It does not load Plotly, mathjs, Mermaid, or Three.js.
- It is suitable for compact research-note figures, not very large datasets.
- It does not implement full NumPy or matplotlib.
- It does not support 3D plots; use a `three` block for simple 3D scenes.
- It executes trusted JavaScript in the browser, so do not paste untrusted code into `plot` blocks.

For most portfolio notes, the best workflow is to keep data arrays small, make the chart explain one point, and use the built-in color maps consistently across related figures.
