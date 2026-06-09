export type VisualizationColorMapName =
  | "scalar"
  | "signed"
  | "risk"
  | "signal"
  | "series";

export type VisualizationColorMap = {
  label: string;
  kind: "sequential" | "diverging" | "categorical";
  colors: readonly string[];
};

export const visualizationColorMaps: Record<VisualizationColorMapName, VisualizationColorMap> = {
  scalar: {
    label: "Scalar / Intensity",
    kind: "sequential",
    colors: ["#08080a", "#272727", "#505050", "#909090", "#eec16c", "#fabe34", "#ffef01"]
  },
  signed: {
    label: "Signed Delta",
    kind: "diverging",
    colors: ["#1288f8", "#7cd0ff", "#fefefe", "#fbf273", "#fabe34"]
  },
  risk: {
    label: "Risk / Load",
    kind: "sequential",
    colors: ["#e1e2e4", "#cdf67b", "#fdf065", "#ff7000", "#e42525", "#920008"]
  },
  signal: {
    label: "Signal / Phase",
    kind: "sequential",
    colors: ["#2a425b", "#1288f8", "#00d6fa", "#9e8af9", "#f765ba", "#ff95c8"]
  },
  series: {
    label: "Categorical Series",
    kind: "categorical",
    colors: ["#ffef01", "#1288f8", "#00d6fa", "#99f120", "#f765ba", "#9e8af9", "#ff7000", "#e42525"]
  }
};

export const visualizationColorMapAliases: Record<string, VisualizationColorMapName> = {
  default: "scalar",
  intensity: "scalar",
  sequential: "scalar",
  delta: "signed",
  diverging: "signed",
  alert: "risk",
  warning: "risk",
  halo: "signal",
  phase: "signal",
  categorical: "series",
  category: "series"
};

export const visualizationSeries = visualizationColorMaps.series.colors;
