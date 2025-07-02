import Plot from "react-plotly.js";
import type { ScatterData, Layout } from "plotly.js"; 

const generateSampleData = (): Partial<ScatterData>[] => {
  const seriesCount = 10;
  const pointsPerSeries = 5;
  const data: Partial<ScatterData>[] = [];

  for (let i = 0; i < seriesCount; i++) {
    const x: number[] = [];
    const y: number[] = [];
    const base = 98 + Math.random() * 2;

    for (let j = 0; j < pointsPerSeries; j++) {
      x.push(j * 20);
      y.push(parseFloat((base + Math.random()).toFixed(2)));
    }

    data.push({
      x,
      y,
      type: "scatter",
      mode: "lines+markers",
      name: `00018${i.toString().padStart(4, "0")}`,
      line: { shape: "linear" },
      marker: { size: 6 },
    });
  }

  return data;
};

export default function CellViabilityPlot() {
  return (
    <Plot
      data={generateSampleData()}
      layout={
        {
          title: {
            text: "CELL VIABILITY - DUNBOYNE BIOCEL",
            font: { size: 16 },
            x: 0.5,
            xanchor: "center",
          },
          xaxis: {
            title: { text: "Elapsed Time (hrs)" },
            showgrid: true,
            zeroline: false,
          },
          yaxis: {
            title: { text: "Cell Viability (%)" },
            showgrid: true,
            zeroline: false,
            range: [98, 101],
          },
          legend: { orientation: "h" },
          margin: { t: 60 },
          hovermode: "closest",
        } as Partial<Layout> 
      }
      config={{
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
      }}
      style={{ width: "100%", height: 500 }}
      useResizeHandler
    />
  );
}
