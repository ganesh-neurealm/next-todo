// 'use client';

// import { Annotations as PlotlyAnnotations, PlotlyHTMLElement } from 'plotly.js';
// import { PlotWithPlotly, Plotly } from './PlotsNoSSR';
// import { memo, useEffect, useMemo, useRef, useState } from 'react';
// import { ControlChartInterface, ToolTipInfo } from '@/utils/types/charts';
// import CustomTooltip from './CustomTooltip';
// import { message } from 'antd';
// import { getAxisSettings, getControlPlotData } from './helpers/controlPlot';

// const StackedControl: React.FC<ControlChartInterface> = ({
//   dataSets,
//   title,
//   xKey,
//   yKey,
//   isSidePanelCollapsed,
//   yAxisTitle,
//   generateTooltipHtml,
//   handleClick,
//   onChartRender,
//   xAxisTitle,
//   isRunChart,
// }) => {
//   const [messageApi, contextHolder] = message.useMessage();
//   const dataSetAsKey = JSON.stringify(dataSets);
//   const plotRef = useRef<PlotlyHTMLElement | null>(null);
//   const [tooltip, setTooltip] = useState<Partial<ToolTipInfo>>({});

//   const xMax = Math.max(...dataSets.flatMap((dataset) => dataset?.[xKey]));
//   const totalCharts = dataSets.length;
//   const spacePerCharts = 1 / totalCharts;
//   const padding = 0.14;

//   const tracesAndAnnotations = getControlPlotData(
//     dataSets,
//     xMax,
//     xKey,
//     yKey,
//     xAxisTitle,
//     isRunChart
//   );

//   const axisSettings = getAxisSettings(
//     dataSets,
//     spacePerCharts,
//     padding,
//     xMax,
//     yAxisTitle,
//     isRunChart
//   );

//   const handleToolTipHover = (event: Plotly.PlotMouseEvent) => {
//     const point = event.points[0];
//     const { customdata } = point.data as Record<string, any>;
//     const { marker } = (point as Record<string, any>).fullData;

//     const x = event.event.clientX;
//     const y = event.event.clientY;

//     const toolTipText = generateTooltipHtml
//       ? generateTooltipHtml(customdata?.[point.pointIndex], point.x as number)
//       : '';

//     setTooltip({
//       visible: !!toolTipText,
//       x,
//       y,
//       text: toolTipText,
//       color: customdata?.[point.pointIndex]?.color ?? marker?.color,
//       xVal: x,
//       yVal: y,
//     });
//   };

//   const handleUnhover = () => {
//     setTooltip({ visible: false });
//   };

//   const handleReLayout = (event: Readonly<Plotly.PlotRelayoutEvent>) => {
//     if (event['xaxis.range[1]']) {
//       updateAnnotation(
//         tracesAndAnnotations.flatMap((d) => d.annotations),
//         event['xaxis.range[1]']
//       );
//     }
//     if (event['xaxis.range']) {
//       updateAnnotation(
//         tracesAndAnnotations.flatMap((d) => d.annotations),
//         Number(event['xaxis.range'][1])
//       );
//     }
//   };

//   const updateAnnotation = async (
//     annotations: Partial<PlotlyAnnotations>[],
//     xMaxVisible: number
//   ) => {
//     try {
//       if (Plotly && plotRef.current) {
//         await Plotly.relayout(plotRef.current, { annotations: [] });

//         await Plotly.relayout(plotRef.current, {
//           annotations: annotations.map((annotation) =>
//             !!annotation
//               ? {
//                   ...annotation,
//                   x: String(isRunChart ? xMaxVisible : xMaxVisible),
//                 }
//               : annotation
//           ) as any,
//         });

//         plotRef.current.removeAllListeners('plotly_relayout');
//         plotRef.current.removeAllListeners('plotly_hover');
//         plotRef.current.removeAllListeners('plotly_unhover');

//         plotRef.current.on('plotly_relayout', handleReLayout);
//         plotRef.current.on('plotly_hover', handleToolTipHover);
//         plotRef.current.on('plotly_unhover', handleUnhover);
//       }
//     } catch (error: any) {
//       messageApi.error(error.message ?? 'Error in update annotation');
//     }
//   };

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       if (plotRef.current && Plotly?.Plots?.resize) {
//         Plotly.Plots.resize(plotRef.current);
//       }
//     }, 300); // delay to allow layout to settle

//     return () => clearTimeout(timeout);
//   }, [isSidePanelCollapsed]);

//   useEffect(() => {
//     return () => {
//       if (onChartRender) onChartRender(false); // Reset when unmounted
//     };
//   }, []);

//   const chartLayout = useMemo(
//     () => ({
//       hovermode: 'closest' as const,
//       hoverlabel: {
//         bgcolor: 'white',
//         bordercolor: 'white',
//         font: { color: 'white' },
//       },
//       title: {
//         text: title,
//         font: { size: 12, weight: 700 },
//         x: 0,
//         xanchor: 'left' as const,
//       },
//       grid: {
//         rows: dataSets.length,
//         columns: 1,
//         pattern: 'independent',
//       },
//       height: 550 * totalCharts,
//       showlegend: false,
//       legend: { orientation: 'h' as const },
//       modebar: { orientation: 'v' as const },
//       annotations: tracesAndAnnotations.flatMap((d) => d.annotations),
//       shapes: tracesAndAnnotations.flatMap((d) => d.mappedVerticalTraces),
//       ...axisSettings,
//       autosize: true,
//       dragmode: 'zoom' as const,
//     }),
//     [dataSetAsKey]
//   );

//   return (
//     <>
//       {contextHolder}
//       <PlotWithPlotly
//         key={dataSetAsKey}
//         data={tracesAndAnnotations.flatMap((d) => d.traces)}
//         layout={chartLayout}
//         config={{
//           staticPlot: false,
//           responsive: true,
//           displayModeBar: true,
//           modeBarButtonsToRemove: [
//             'zoom2d',
//             'pan2d',
//             'select2d',
//             'lasso2d',
//             'autoScale2d',
//             'sendDataToCloud',
//             'hoverClosestCartesian',
//             'toggleSpikelines',
//           ],
//           modeBarButtonsToAdd: ['zoomIn2d', 'zoomOut2d', 'resetScale2d', 'toImage'],
//           displaylogo: false,
//           doubleClick: 'reset',
//         }}
//         onRelayout={handleReLayout}
//         useResizeHandler={true}
//         onInitialized={(_, graphDiv) => {
//           plotRef.current = graphDiv as PlotlyHTMLElement;
//           if (onChartRender) onChartRender(true);
//         }}
//         onUpdate={(_, graphDiv) => {
//           plotRef.current = graphDiv as PlotlyHTMLElement;
//         }}
//         onHover={handleToolTipHover}
//         onUnhover={handleUnhover}
//         onError={() => {
//           if (onChartRender) onChartRender(false);
//         }}
//         onClick={(...props) => {
//           handleClick?.(...props);
//         }}
//         style={{ width: '100%', height: '550px' }}
//       />
//       {tooltip?.visible && <CustomTooltip tooltip={tooltip} />}
//     </>
//   );
// };

// export default memo(StackedControl);
