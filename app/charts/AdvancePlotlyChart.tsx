"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Plot from "react-plotly.js";
import { Modal, Typography, Space, Divider, Input, Button, message } from "antd";
import type { ScatterData, Layout, PlotMouseEvent, PlotRelayoutEvent } from "plotly.js";
import FullChartDashboard from "./OtherCharts";
import { fetchPatients, updatePatientComment, DataPoint } from "@/app/actions/patient";
import CellViabilityPlot from "./LineConnectedChart";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const { Title } = Typography;
const { TextArea } = Input;

export default function ScatterPlot() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [modalData, setModalData] = useState<DataPoint | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const [layoutState, setLayoutState] = useState<Partial<Layout>>({});
  const plotRef = useRef<Plot | null>(null);

  const [addLineModalOpen, setAddLineModalOpen] = useState(false);
  const [lineText, setLineText] = useState("");
  const [linePosition, setLinePosition] = useState<number | null>(null);
  const [hoverPoints, setHoverPoints] = useState<Partial<ScatterData>[]>([]);

  const [break1, setBreak1] = useState<number | null>(null);
  const [break2, setBreak2] = useState<number | null>(null);
  const chartWrapperRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    const chartElement = chartWrapperRef.current;
    if (!chartElement) {
      message.error("Chart not found");
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // wait for render
      const canvas = await html2canvas(chartElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("scatter_chart.pdf");
    } catch (err) {
      console.error("PDF generation failed", err);
      message.error("Failed to generate PDF");
    }
  };

  const computeTicks = (data: DataPoint[], range?: [number, number]) => {
    const filtered = range ? data.filter((d) => d.x >= range[0] && d.x <= range[1]) : data;

    if (filtered.length === 0) return { tickvals: [], ticktext: [] };

    const ticksCount = 12;
    const step = Math.max(1, Math.floor(filtered.length / ticksCount));
    const selected = filtered.filter((_, i) => i % step === 0);

    const tickvals = selected.map((d) => d.x);
    const ticktext = selected.map((d) => {
      const date = new Date(d.date);
      return !isNaN(date.getTime()) ? date.toLocaleDateString("en-GB") : "";
    });

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
        rangemode: "tozero",
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
      margin: { t: 50, b: 50, l: 60, r: 50 },
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

  const memoizedLayout = useMemo(() => layoutState, [layoutState]);

  const makeTrace = (subset: DataPoint[], color: string): Partial<ScatterData> => ({
    type: "scatter",
    mode: "text+lines+markers",
    x: subset.map((d) => d.x),
    y: subset.map((d) => d.y),
    marker: {
      color,
      symbol: subset.map((d) => (d.hasComment ? (d.isSquare ? "square-open" : "circle-open") : d.isSquare ? "square" : "circle")),
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
    hovertext: subset.map((d) => `<b>${d.name}</b><br>Dosage: ${d.dosage} mg<br>Frequency: ${d.frequency}<br>ValueCheck: ${d.valueCheck}<br>Comment: ${d.comment || "(none)"}`),
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

  const handleRelayout = (event: Partial<PlotRelayoutEvent>) => {
    if (data.length === 0) return;
    if (event["xaxis.range[0]"] && event["xaxis.range[1]"]) {
      const minX = event["xaxis.range[0]"];
      const maxX = event["xaxis.range[1]"];
      const { tickvals, ticktext } = computeTicks(data, [minX, maxX]);
      if (tickvals.length > 0) {
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
    }
    if (Array.isArray(event["xaxis.range"])) {
      const [minX, maxX] = event["xaxis.range"] as [number, number];
      const { tickvals, ticktext } = computeTicks(data, [minX, maxX]);
      if (tickvals.length > 0) {
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
    }
    if (event["xaxis.autorange"] === true) {
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
      <Button type="primary" onClick={() => setAddLineModalOpen(true)} style={{ marginBottom: 16 }}>
        Add Vertical Line
      </Button>
      <Button type="default" onClick={handleDownloadPDF} style={{ marginBottom: 16, marginLeft: 8 }}>
        Download Chart as PDF
      </Button>
      <Title level={3} style={{ textAlign: "center" }}>
        Scatter Plot with Patient Data from Server
      </Title>
      <div onContextMenu={(e) => e.preventDefault()} ref={chartWrapperRef}>
        <Plot
          ref={plotRef}
          data={[makeTrace(redData, "red"), makeTrace(blackData, "black"), ...hoverPoints]}
          layout={memoizedLayout}
          config={{
            scrollZoom: false,
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
      <CellViabilityPlot />
      <Title level={3} style={{ textAlign: "center" }}>
        Other Charts
      </Title>
      <Divider />
      <FullChartDashboard />
      <Divider />

      {modalData && (
        <Modal open={true} onCancel={() => setModalData(null)} footer={null} title={`Details for ${modalData.name}`}>
          <Space direction="vertical" style={{ width: "100%" }}>
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
            <Divider />
            <b>Comment:</b>
            <TextArea rows={4} value={commentInput} onChange={(e) => setCommentInput(e.target.value)} />
            <Button type="primary" onClick={handleCommentSubmit} style={{ marginTop: 8 }}>
              Submit Comment
            </Button>
          </Space>
        </Modal>
      )}

      <Modal
        open={addLineModalOpen}
        onCancel={() => {
          setAddLineModalOpen(false);
          setLineText("");
          setLinePosition(null);
        }}
        onOk={() => {
          if (linePosition !== null && lineText.trim() && break1 !== null && break2 !== null) {
            const breaks = [break1, break2].sort((a, b) => a - b);
            const currentYRange = layoutState.yaxis?.range as [number, number];
            const yMax = currentYRange?.[1] ?? 100;
            const sectionLines: Partial<Plotly.Shape>[] = [];
            for (let i = 0; i < breaks.length; i++) {
              const x0 = i === 0 ? 0 : breaks[i - 1];
              const x1 = breaks[i];
              sectionLines.push(
                {
                  type: "line",
                  x0,
                  x1,
                  y0: 60,
                  y1: 60,
                  line: { color: "green", dash: "dash", width: 1 },
                },
                {
                  type: "line",
                  x0,
                  x1,
                  y0: -60,
                  y1: -60,
                  line: { color: "orange", dash: "dash", width: 1 },
                },
                {
                  type: "line",
                  x0,
                  x1,
                  y0: 0,
                  y1: 0,
                  line: { color: "blue", dash: "dot", width: 1 },
                },
                {
                  type: "line",
                  x0: x1,
                  x1: x1,
                  yref: "paper",
                  y0: 0,
                  y1: 1,
                  line: { color: "gray", width: 2, dash: "dot" },
                }
              );
            }
            const cleanedShapes = (layoutState.shapes || []).filter(
              (s) => typeof s !== "undefined" && !(s.line?.color === "green" || s.line?.color === "orange" || s.line?.color === "blue" || s.line?.color === "gray")
            );
            setLayoutState((prev) => ({
              ...prev,
              shapes: [
                ...cleanedShapes,
                {
                  type: "line",
                  x0: linePosition,
                  x1: linePosition,
                  yref: "paper",
                  y0: 0,
                  y1: 1,
                  line: { color: "purple", dash: "dot", width: 2 },
                },
                ...sectionLines,
              ],
              annotations: [
                ...(prev.annotations || []),
                {
                  x: linePosition,
                  y: 0.97,
                  xref: "x",
                  yref: "paper",
                  text: String(linePosition),
                  showarrow: true,
                  arrowhead: 2,
                  arrowsize: 1,
                  arrowcolor: "purple",
                  ax: 0,
                  ay: -20,
                  font: { color: "purple", size: 12 },
                },
              ],
            }));
            setHoverPoints((prev) => [
              ...prev,
              {
                x: [linePosition],
                y: [yMax],
                type: "scatter",
                mode: "markers",
                marker: {
                  color: "rgba(0, 0, 0, 0.01)",
                  size: 14,
                  symbol: "circle",
                },
                hovertext: lineText.trim(),
                hoverinfo: "text",
                showlegend: false,
              },
            ]);
            setAddLineModalOpen(false);
            setLineText("");
            setLinePosition(null);
          } else {
            message.warning("Please fill in all fields correctly.");
          }
        }}
        title="Add Vertical Line"
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input placeholder="Enter tooltip text" value={lineText} onChange={(e) => setLineText(e.target.value)} />
          <Input
            placeholder="Enter X position (numeric)"
            value={linePosition ?? ""}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setLinePosition(isNaN(val) ? null : val);
            }}
          />

          <Title level={5}>Breakpoints (numeric)</Title>
          <Input
            placeholder="Enter Breakpoint 1"
            value={break1 ?? ""}
            type="number"
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setBreak1(isNaN(val) ? null : val);
            }}
          />
          <Input
            placeholder="Enter Breakpoint 2"
            value={break2 ?? ""}
            type="number"
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setBreak2(isNaN(val) ? null : val);
            }}
          />
        </Space>
      </Modal>
    </>
  );
}
