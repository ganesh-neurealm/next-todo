"use client";

import { useState, useRef } from "react";
import Plot from "react-plotly.js";
import { Modal, Typography, Space, Divider } from "antd";
import type { ScatterData, Layout, PlotMouseEvent } from "plotly.js";
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
  const plotRef = useRef<Plot | null>(null);
  
  const [layoutState] = useState<Partial<Layout>>({
    dragmode: "zoom",
    hovermode: "closest",
    xaxis: { title: { text: 'Patient Index' }, range: [0, 1000], automargin: true },
    yaxis: { title: { text: 'Measurement Value' }, range: [-50, 50], automargin: true },
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
  });

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
    text: subset.map(
      (d) => `<b>${d.name}</b><br>Dosage: ${d.dosage} mg<br>Frequency: ${d.frequency}<br>ValueCheck: ${d.valueCheck}`
    ),
    hoverinfo: "text",
    hoverlabel: {
      bgcolor: "#f9f9f9",
      bordercolor: color,
      font: { color: "black", size: 12 },
    },
  });

  const handleRightClick = (e: PlotMouseEvent) => {
    e.event?.preventDefault();

    if(e.event?.button === 2){
        const point = e.points?.[0];

        if (point) {
          const traceIdx = point.curveNumber;
          const selectedArray = traceIdx === 0 ? redData : blackData;

          if (point.pointIndex !== undefined && selectedArray[point.pointIndex]) {
            setModalData(selectedArray[point.pointIndex]);
          }
        }
    }
  };


  return (
    <>
      <Title level={3} style={{ textAlign: "center" }}>
        Scatter Plot with Dummy Patient data
      </Title>

      <div onContextMenu={(e) => e.preventDefault()}>
        <Plot
          ref={plotRef}
          data={[makeTrace(redData, "red"), makeTrace(blackData, "black")]}
          layout={layoutState}
          config={{
            scrollZoom: true,
            responsive: true,
            displayModeBar: true,
            modeBarButtonsToRemove: ["lasso2d"],
            displaylogo: false,
          }}
          style={{ width: "100%", height: 600 }}
          useResizeHandler
          onClick={handleRightClick}
        />
      </div>

      <Space direction="vertical" size="large" style={{ width: "100%" }} />
      <Divider />
      <Title level={3} style={{ textAlign: "center" }}>
        Other Charts
      </Title>
      <Divider />
      <FullChartDashboard />

      {modalData && (
        <Modal
          open={true}
          onCancel={() => setModalData(null)}
          footer={null}
          title={`Details for ${modalData.name}`}
        >
          <Space direction="vertical">
            <div><b>Dosage:</b> {modalData.dosage} mg</div>
            <div><b>Frequency:</b> {modalData.frequency}</div>
            <div><b>ValueCheck:</b> {modalData.valueCheck}</div>
            <div><b>X:</b> {modalData.x.toFixed(2)}</div>
            <div><b>Y:</b> {modalData.y.toFixed(2)}</div>
            <div><b>Shape:</b> {modalData.isSquare ? "Square" : "Circle"}</div>
            <div><b>Color:</b> {modalData.valueCheck > 70 ? "Red" : "Black"}</div>
          </Space>
        </Modal>
      )}
    </>
  );
}