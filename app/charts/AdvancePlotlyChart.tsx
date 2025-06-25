"use client";

import { useState } from "react";
import Plot from "react-plotly.js";
import { Modal, Typography, Space, Divider } from "antd";
import type { ScatterData, Layout } from "plotly.js";
import FullChartDashboard from "./OtherCharts";

const { Title } = Typography;

type DataPoint = {
  id: number;
  x: number;
  y: number;
  name: string;
  dosage: number;
  frequency: string;
  isSquare: boolean;
  valueCheck: number;
};

const generateData = (): DataPoint[] => {
  return Array.from({ length: 1000 }, (_, i) => {
    const x = Math.random() * 1000;
    const y = (Math.random() - 0.5) * 100;
    const dosage = 5 + Math.floor(Math.random() * 495);
    const valueCheck = Math.floor(Math.random() * 100);
    return {
      id: i,
      x,
      y,
      dosage,
      valueCheck,
      name: `Patient ${i}`,
      frequency: ["Once a day", "Twice a day", "Three times a day", "As needed"][Math.floor(Math.random() * 4)],
      isSquare: Math.random() < 0.1,
    };
  });
};

export default function ScatterPlot() {
  const [data] = useState(generateData());
  const [modalData, setModalData] = useState<DataPoint | null>(null);

  const redData = data.filter((d) => d.valueCheck > 70);
  const blackData = data.filter((d) => d.valueCheck <= 70);

  const makeTrace = (subset: DataPoint[], color: string): Partial<ScatterData> => ({
    type: "scatter",
    mode: "markers",
    x: subset.map((d) => d.x),
    y: subset.map((d) => d.y),
    marker: {
      color,
      symbol: subset.map((d) => (d.isSquare ? "square" : "circle")),
      size: 8,
      opacity: 0.7,
      line: { color: "gray", width: 1 },
    },
    text: subset.map((d) => `<b>${d.name}</b><br>Dosage: ${d.dosage} mg<br>Frequency: ${d.frequency}<br>ValueCheck: ${d.valueCheck}`),
    hoverinfo: "text",
    hoverlabel: {
      bgcolor: "#f9f9f9",
      bordercolor: color,
      font: { color: "black", size: 12 },
    },
  });

  const layout: Partial<Layout> = {
    dragmode: "zoom",
    hovermode: "closest",
    // xaxis: { title: { text: 'Patient Index' }, range: [0, 1000] },
    // yaxis: { title: { text: 'Measurement Value' }, range: [-50, 50] },
    margin: { t: 10, b: 10, l: 10, r: 10 },
    showlegend: false,
    shapes: [
      {
        type: "line",
        xref: "x",
        yref: "y",
        x0: 0,
        x1: 1000,
        y0: 40,
        y1: 40,
        line: {
          color: "green",
          width: 2,
          dash: "dash",
        },
      },
      {
        type: "line",
        xref: "x",
        yref: "y",
        x0: 0,
        x1: 1000,
        y0: -45,
        y1: -45,
        line: {
          color: "orange",
          width: 2,
          dash: "dash",
        },
      },
    ],
  };

  return (
    <>
      <Title level={3} style={{ textAlign: "center" }}>
         Scatter Plot with Dummy Patient data
      </Title>

      <Plot
        data={[makeTrace(redData, "red"), makeTrace(blackData, "black")]}
        layout={layout}
        config={{
          scrollZoom: true,
          responsive: true,
          displayModeBar: true,
          modeBarButtonsToRemove: ["lasso2d"],
          displaylogo: false,
        }}
        style={{ width: "100%", height: 600 }}
        useResizeHandler
      />
      <Space direction="vertical" size="large" style={{ width: "100%" }}/>
      <Divider />
      <Title level={3} style={{ textAlign: "center" }}>
        Other Charts
      </Title>
      <Divider />
      <FullChartDashboard />
      {modalData && (
        <Modal open={true} onCancel={() => setModalData(null)} footer={null} title={`Details for ${modalData.name}`}>
          <Space direction="vertical">
            <div>
              <b>Dosage:</b> {modalData.dosage} mg
            </div>
            <div>
              <b>Frequency:</b> {modalData.frequency}
            </div>
            <div>
              <b>ValueCheck:</b> {modalData.valueCheck}
            </div>
            <div>
              <b>X:</b> {modalData.x.toFixed(2)}
            </div>
            <div>
              <b>Y:</b> {modalData.y.toFixed(2)}
            </div>
            <div>
              <b>Shape:</b> {modalData.isSquare ? "Square" : "Circle"}
            </div>
            <div>
              <b>Color:</b> {modalData.valueCheck > 70 ? "Red" : "Black"}
            </div>
          </Space>
        </Modal>
      )}
    </>
  );
}
