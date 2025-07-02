"use client";

import { useState, useEffect, useRef } from "react";
import Plot from "react-plotly.js";
import { Modal, Typography, Space, Divider, Input, Button, message } from "antd";
import type { ScatterData, Layout, PlotMouseEvent } from "plotly.js";
import FullChartDashboard from "./OtherCharts";
import { fetchPatients, updatePatientComment, DataPoint } from "@/app/actions/patient";

const { Title } = Typography;
const { TextArea } = Input;

export default function ScatterPlot() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [modalData, setModalData] = useState<DataPoint | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const [layoutState, setLayoutState] = useState<Partial<Layout>>({});
  const plotRef = useRef<Plot | null>(null);

  const computeTicks = (data: DataPoint[], range?: [number, number]) => {
    const filtered = range ? data.filter((d) => d.x >= range[0] && d.x <= range[1]) : data;
    if (filtered.length === 0) return { tickvals: [], ticktext: [] };
    const ticksCount = 6;
    const step = Math.max(1, Math.floor(filtered.length / ticksCount));
    const selected = filtered.filter((_, i) => i % step === 0);
    const tickvals = selected.map((d) => d.x);
    const ticktext = selected.map((d) => new Date(d.date).toLocaleDateString("en-GB"));
    return { tickvals, ticktext };
  };

  useEffect(() => {
    fetchPatients()
      .then((patients) => {
        const updated = patients.map((p) => ({
          ...p,
          hasComment: p.comment?.trim() !== "",
        }));
        setData(updated);
      })
      .catch(() => message.error("Error fetching patient data"));
  }, []);

  useEffect(() => {
    if (data.length === 0) return;
    const minY = Math.min(...data.map((d) => d.y), 0);
    const maxY = Math.max(...data.map((d) => d.y), 0);
    const finalMinY = Math.floor(minY - 10);
    const finalMaxY = Math.ceil(maxY + 10);
    const centerLineValue = 0;
    const upperLimitValue = 55;
    const lowerLimitValue = -55;
    const { tickvals, ticktext } = computeTicks(data);
    setLayoutState({
      dragmode: "zoom",
      hovermode: "closest",
      xaxis: {
        title: { text: "Date" },
        type: "linear",
        tickmode: "array",
        tickvals,
        ticktext,
        tickangle: -45,
        tickfont: { size: 10 },
        showgrid: true,
        showline: true,
        rangeslider: { visible: true },
        fixedrange: false,
      },
      yaxis: {
        title: { text: "Measurement Value" },
        range: [finalMinY, finalMaxY],
        fixedrange: false,
        showline: true,
        mirror: true,
        showgrid: true,
        zeroline: false,
        anchor: "x",
        domain: [0, 1],
      },
      margin: { t: 50, b: 50, l: 0, r: 50 },
      showlegend: false,
      shapes: [
        {
          type: "line",
          xref: "paper",
          yref: "y",
          x0: 0,
          x1: 1,
          y0: upperLimitValue,
          y1: upperLimitValue,
          line: { color: "green", width: 2, dash: "dash" },
        },
        {
          type: "line",
          xref: "paper",
          yref: "y",
          x0: 0,
          x1: 1,
          y0: lowerLimitValue,
          y1: lowerLimitValue,
          line: { color: "orange", width: 2, dash: "dash" },
        },
        {
          type: "line",
          xref: "paper",
          yref: "y",
          x0: 0,
          x1: 1,
          y0: centerLineValue,
          y1: centerLineValue,
          line: { color: "blue", width: 1, dash: "dot" },
        },
      ],
      annotations: [
        {
          x: 1,
          y: upperLimitValue,
          xref: "paper",
          yref: "y",
          text: "Upper Limit",
          showarrow: false,
          font: { color: "green", size: 12 },
          xanchor: "right",
          yanchor: "bottom",
          xshift: -10,
          yshift: 5,
          bgcolor: "rgba(255,255,255,0.7)",
        },
        {
          x: 1,
          y: upperLimitValue,
          xref: "paper",
          yref: "y",
          text: String(upperLimitValue),
          showarrow: false,
          font: { color: "green", size: 12, weight: 500 },
          xanchor: "right",
          yanchor: "top",
          xshift: -10,
          yshift: -5,
          bgcolor: "rgba(255,255,255,0.7)",
        },
        {
          x: 1,
          y: lowerLimitValue,
          xref: "paper",
          yref: "y",
          text: String(lowerLimitValue),
          showarrow: false,
          font: { color: "orange", size: 12 },
          xanchor: "right",
          yanchor: "top",
          xshift: -10,
          yshift: -5,
          bgcolor: "rgba(255,255,255,0.7)",
        },
        {
          x: 1,
          y: lowerLimitValue,
          xref: "paper",
          yref: "y",
          text: "Lower Limit",
          showarrow: false,
          font: { color: "orange", size: 12, weight: 500 },
          xanchor: "right",
          yanchor: "bottom",
          xshift: -10,
          yshift: 5,
          bgcolor: "rgba(255,255,255,0.7)",
        },
        {
          x: 1,
          y: centerLineValue,
          xref: "paper",
          yref: "y",
          text: `Center Line (${centerLineValue})`,
          showarrow: false,
          font: { color: "blue", size: 12 },
          xanchor: "right",
          yanchor: "bottom",
          xshift: -10,
          yshift: 5,
          bgcolor: "rgba(255,255,255,0.7)",
        },
        {
          x: 1,
          y: upperLimitValue,
          xref: "paper",
          yref: "y",
          showarrow: true,
          arrowhead: 1,
          arrowsize: 1.5,
          arrowwidth: 1.5,
          arrowcolor: "green",
          ax: -20,
          ay: 0,
        },
        {
          x: 1,
          y: lowerLimitValue,
          xref: "paper",
          yref: "y",
          showarrow: true,
          arrowhead: 1,
          arrowsize: 1.5,
          arrowwidth: 1.5,
          arrowcolor: "orange",
          ax: -20,
          ay: 0,
        },
      ],
    });
  }, [data]);

  const redData = data.filter((d) => d.valueCheck > 70).sort((a, b) => a.x - b.x);
  const blackData = data.filter((d) => d.valueCheck <= 70).sort((a, b) => a.x - b.x);

  const makeTrace = (subset: DataPoint[], color: string): Partial<ScatterData> => ({
    type: "scatter",
    mode: "text+lines+markers",
    x: subset.map((d) => d.x),
    y: subset.map((d) => d.y),
    marker: {
      color,
      symbol: subset.map((d) =>
        d.hasComment ? (d.isSquare ? "square-open" : "circle-open") : d.isSquare ? "square" : "circle"
      ),
      size: 10,
      opacity: 0.8,
      line: {
        color: subset.map((d) => (d.hasComment ? "blue" : "gray")),
        width: subset.map((d) => (d.hasComment ? 3 : 1)),
      },
    },
    text: subset.map((d) => String(d.valueCheck)),
    line: { width: 1, color, shape: "linear" },
    textposition: "top center",
    hovertext: subset.map(
      (d) =>
        `<b>${d.name}</b><br>Dosage: ${d.dosage} mg<br>Frequency: ${d.frequency}<br>ValueCheck: ${d.valueCheck}<br>Comment: ${
          d.comment || "(none)"
        }`
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
    e.event?.stopPropagation();
    if (e.event?.button === 2) {
      const point = e.points?.[0];
      if (point) {
        const traceIdx = point.curveNumber;
        const selectedArray = traceIdx === 0 ? redData : blackData;
        if (point.pointIndex !== undefined && selectedArray[point.pointIndex]) {
          setModalData(selectedArray[point.pointIndex]);
          setCommentInput(selectedArray[point.pointIndex].comment || "");
        }
      }
    }
  };

  const handleCommentSubmit = async () => {
    if (!modalData) return;
    try {
      const success = await updatePatientComment(modalData.id, commentInput.trim());
      if (success) {
        const patients = await fetchPatients();
        const updated = patients.map((p) => ({
          ...p,
          hasComment: p.comment?.trim() !== "",
        }));
        setData(updated);
        setModalData(null);
        message.success("Comment updated successfully");
      } else {
        message.error("Failed to update comment");
      }
    } catch {
      message.error("Error updating comment");
    }
  };

  const handleRelayout = (event: any) => {
    if (event["xaxis.range[0]"] && event["xaxis.range[1]"] && data.length) {
      const minX = event["xaxis.range[0]"];
      const maxX = event["xaxis.range[1]"];
      const { tickvals, ticktext } = computeTicks(data, [minX, maxX]);
      if (tickvals.length === 0) return;
      setLayoutState((prev) => ({
        ...prev,
        xaxis: {
          ...prev.xaxis,
          tickmode: "array",
          tickvals,
          ticktext,
        },
      }));
    }
    if (event["xaxis.autorange"] === true && data.length) {
      const { tickvals, ticktext } = computeTicks(data);
      setLayoutState((prev) => ({
        ...prev,
        xaxis: {
          ...prev.xaxis,
          tickmode: "array",
          tickvals,
          ticktext,
        },
      }));
    }
  };

  return (
    <>
      <Title level={3} style={{ textAlign: "center" }}>Scatter Plot with Patient Data from Server</Title>
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
            doubleClick: "autosize",
          }}
          style={{ width: "100%", height: 600 }}
          useResizeHandler
          onClick={handleRightClick}
          onRelayout={handleRelayout}
        />
      </div>
      <Space direction="vertical" size="large" style={{ width: "100%" }} />
      <Divider />
      <Title level={3} style={{ textAlign: "center" }}>Other Charts</Title>
      <Divider />
      <FullChartDashboard />
      {modalData && (
        <Modal open={true} onCancel={() => setModalData(null)} footer={null} title={`Details for ${modalData.name}`}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <div><b>Dosage:</b> {modalData.dosage} mg</div>
            <div><b>Frequency:</b> {modalData.frequency}</div>
            <div><b>ValueCheck:</b> {modalData.valueCheck}</div>
            <div><b>X:</b> {modalData.x.toFixed(2)}</div>
            <div><b>Y:</b> {modalData.y.toFixed(2)}</div>
            <div><b>Shape:</b> {modalData.isSquare ? "Square" : "Circle"}</div>
            <div><b>Color:</b> {modalData.valueCheck > 70 ? "Red" : "Black"}</div>
            <Divider />
            <b>Comment:</b>
            <TextArea rows={4} value={commentInput} onChange={(e) => setCommentInput(e.target.value)} />
            <Button type="primary" onClick={handleCommentSubmit} style={{ marginTop: 8 }}>Submit Comment</Button>
          </Space>
        </Modal>
      )}
    </>
  );
}
