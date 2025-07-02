// import { Data as PlotlyData, Annotations as PlotlyAnnotations } from 'plotly.js';

// export const getAxisSettings = (
//   dataSets: Record<string, any>[],
//   spacePerCharts: number,
//   padding: number,
//   xMax: number,
//   yAxisTitle?: string,
//   isRunChart?: boolean,
// ) => {
//   return dataSets.reduce((acc: any, _, index: number) => {
//     const yStart = index * spacePerCharts + padding;
//     const yEnd = (index + 1) * spacePerCharts;

//     acc[`xaxis${index + 1}`] = {
//       domain: [0, 1],
//       rangeslider: {
//         visible: true,
//         thickness: 0.15,
//         bgcolor: 'rgba(200, 200, 200, 0.3)',
//         range: isRunChart ? [-1.5, xMax + 1.5] : [-0.4, xMax + 0.5],
//       },
//       range: isRunChart ? [-1.5, xMax + 1.5] : [-0.4, xMax + 0.5],
//       showline: true,
//       zeroline: false,
//       rangemode: 'tozero',
//       showgrid: true,
//       mirror: true,
//       autorange: false,
//       tickmode: 'auto' as const,
//       tickangle: -90,
//       tickpadding: 15,
//     };

//     acc[`yaxis${index + 1}`] = {
//       domain: [yStart, yEnd],
//       autorange: true,
//       fixedrange: false,
//       automargin: true,
//       showline: true,
//       zeroline: false,
//       title: { text: yAxisTitle, standoff: 10 },
//       showgrid: true,
//       mirror: true,
//     };

//     return acc;
//   }, {} as Partial<Plotly.Layout>);
// };

// export const getControlPlotData = (
//   dataSets: Record<string, any>[],
//   xMax: number,
//   xKey: string,
//   yKey: string,
//   xAxisTitle?: string,
//   isRunChart?: boolean,
// ) => {
//   return dataSets.flatMap((dataset: Record<string, any>, index: number) => {
//     const firstTimeStamp = isRunChart ? -1.5 : -0.4;
//     const lastTimestamp = isRunChart ? xMax + 1.5 : xMax + 0.5;

//     const xAxis = `x${index + 1}` as Plotly.Layout['annotations'][0]['xref'];
//     const yAxis = `y${index + 1}` as Plotly.Layout['annotations'][0]['yref'];

//     const specUpperTraces: Record<string, any>[] = [];
//     const specLowerTraces: Record<string, any>[] = [];
//     const specUpperAnnotations: Record<string, any>[] = [];
//     const specLowerAnnotations: Record<string, any>[] = [];
//     const mappedVerticalTraces: Record<string, any>[] = [];
//     const mappedVerticalAnnotations: Record<string, any>[] = [];

//     dataset?.specUpper?.forEach((spec: string) => {
//       specUpperTraces.push({
//         x: [firstTimeStamp, lastTimestamp],
//         y: Array(dataset?.[yKey].length).fill(spec),
//         type: 'scatter',
//         mode: 'lines',
//         line: { dash: 'dot', color: 'red' },
//         xaxis: xAxis,
//         yaxis: yAxis,
//         showlegend: true,
//         hoverinfo: 'none',
//       });

//       specUpperAnnotations.push({
//         x: lastTimestamp,
//         y: spec,
//         xref: xAxis,
//         yref: yAxis,
//         text: `<b>Upper Spec</b><br>${spec}`,
//         showarrow: true,
//         arrowhead: 1,
//         arrowsize: 1,
//         arrowcolor: 'red',
//         arrowside: 'end',
//         ay: 0,
//         ax: -50,
//         font: { color: 'red' },
//       });
//     });

//     dataset?.specLower?.forEach((spec: string) => {
//       specLowerTraces.push({
//         x: [firstTimeStamp, lastTimestamp],
//         y: Array(dataset?.[yKey].length).fill(spec),
//         type: 'scatter',
//         mode: 'lines',
//         line: { dash: 'dot', color: 'red' },
//         xaxis: xAxis,
//         yaxis: yAxis,
//         showlegend: true,
//         hoverinfo: 'none',
//       });

//       specLowerAnnotations.push({
//         x: lastTimestamp,
//         y: spec,
//         xref: xAxis,
//         yref: yAxis,
//         text: `<b>Lower Spec</b><br>${spec}`,
//         showarrow: true,
//         arrowhead: 1,
//         arrowsize: 1,
//         arrowcolor: 'red',
//         arrowside: 'end',
//         ay: 0,
//         ax: -50,
//         font: { color: 'red' },
//       });
//     });

//     dataset?.mappedVerticalLines?.forEach((verticalLine: Record<string, any>) => {
//       mappedVerticalTraces.push({
//         type: 'line',
//         x0: verticalLine?.[xKey],
//         x1: verticalLine?.[xKey],
//         y0: 0.14,
//         y1: 1,
//         xref: 'x',
//         yref: 'paper' as const,
//         line: { dash: 'dot', color: 'red' },
//       });

//       mappedVerticalAnnotations.push({
//         x: verticalLine?.[xKey],
//         y: 0.97,
//         xref: 'x',
//         yref: 'paper' as const,
//         text: verticalLine?.text,
//         showarrow: true,
//         arrowhead: 1,
//         arrowside: 'start',
//         arrowcolor: 'red',
//         ax: 0,
//         ay: -20,
//         font: { color: 'red' },
//       });
//     });

//     const traces: Partial<PlotlyData>[] = [
//       {
//         x: dataset?.[xKey],
//         y: dataset?.[yKey],
//         type: 'scatter',
//         mode: 'text+lines+markers',
//         text: dataset?.ruleText,
//         textposition: 'top center',
//         name: dataset?.name,
//         xaxis: xAxis,
//         yaxis: yAxis,
//         marker: {
//           color: dataset.marker.color,
//           size: dataset.marker.size,
//           symbol: dataset.marker.symbol,
//         },
//         customdata: dataset.customData,
//         hoverinfo: 'none',
//       },
//       {
//         x: [firstTimeStamp, lastTimestamp],
//         y: Array(dataset?.[yKey].length).fill(dataset.ucl),
//         type: 'scatter',
//         mode: 'lines',
//         line: { dash: 'dash', color: 'blue' },
//         xaxis: xAxis,
//         yaxis: yAxis,
//         showlegend: true,
//         hoverinfo: 'none',
//       },
//       {
//         x: [firstTimeStamp, lastTimestamp],
//         y: Array(dataset?.[yKey].length).fill(dataset.lcl),
//         type: 'scatter',
//         mode: 'lines',
//         line: { dash: 'dash', color: 'blue' },
//         xaxis: xAxis,
//         yaxis: yAxis,
//         showlegend: true,
//         hoverinfo: 'none',
//       },
//       {
//         x: [firstTimeStamp, lastTimestamp],
//         y: Array(dataset?.[yKey].length).fill(dataset.mean),
//         type: 'scatter',
//         mode: 'lines',
//         line: { dash: 'dot', color: 'blue' },
//         xaxis: xAxis,
//         yaxis: yAxis,
//         showlegend: true,
//         hoverinfo: 'none',
//       },
//       {
//         x: [firstTimeStamp, lastTimestamp],
//         y: Array(dataset?.[yKey].length).fill(dataset.ucLim),
//         type: 'scatter',
//         mode: 'lines',
//         line: { dash: 'dash', color: 'blue' },
//         xaxis: xAxis,
//         yaxis: yAxis,
//         showlegend: true,
//         hoverinfo: 'none',
//       },
//       {
//         x: [firstTimeStamp, lastTimestamp],
//         y: Array(dataset?.[yKey].length).fill(dataset.lcLim),
//         type: 'scatter',
//         mode: 'lines',
//         line: { dash: 'dash', color: 'blue' },
//         xaxis: xAxis,
//         yaxis: yAxis,
//         showlegend: true,
//         hoverinfo: 'none',
//       },
//       ...specUpperTraces,
//       ...specLowerTraces,
//     ];

//     const annotations: Partial<PlotlyAnnotations>[] = [
//       dataset?.ucl && {
//         x: lastTimestamp,
//         y: dataset.ucl,
//         xref: xAxis,
//         yref: yAxis,
//         text: `<b>upLim</b><br>${dataset.ucl}`,
//         showarrow: true,
//         arrowhead: 1,
//         arrowsize: 1,
//         arrowcolor: 'blue',
//         arrowside: 'end',
//         ay: 0,
//         ax: -40,
//       },
//       dataset?.lcl && {
//         x: lastTimestamp,
//         y: dataset.lcl,
//         xref: xAxis,
//         yref: yAxis,
//         text: `<b>lowLim</b><br>${dataset.lcl}`,
//         showarrow: true,
//         arrowhead: 1,
//         arrowsize: 1,
//         arrowcolor: 'blue',
//         arrowside: 'end',
//         ay: 0,
//         ax: -40,
//       },
//       dataset.mean && {
//         x: lastTimestamp,
//         y: dataset.mean,
//         xref: xAxis,
//         yref: yAxis,
//         text: `<b>mean</b><br>${dataset.mean}`,
//         showarrow: true,
//         arrowhead: 1,
//         arrowsize: 1,
//         arrowcolor: 'blue',
//         arrowside: 'end',
//         ay: 0,
//         ax: -40,
//       },
//       dataset.ucLim && {
//         x: lastTimestamp,
//         y: dataset.ucLim,
//         xref: xAxis,
//         yref: yAxis,
//         text: `<b>upperComp</b><br>${dataset.ucLim}`,
//         showarrow: true,
//         arrowhead: 1,
//         arrowsize: 1,
//         arrowcolor: 'blue',
//         arrowside: 'end',
//         ay: 0,
//         ax: -50,
//       },
//       dataset.lcLim && {
//         x: lastTimestamp,
//         y: dataset.lcLim,
//         xref: xAxis,
//         yref: yAxis,
//         text: `<b>lowerComp</b><br>${dataset.lcLim}`,
//         showarrow: true,
//         arrowhead: 1,
//         arrowsize: 1,
//         arrowcolor: 'blue',
//         arrowside: 'end',
//         ay: 0,
//         ax: -50,
//       },
//       ...specUpperAnnotations,
//       ...specLowerAnnotations,
//       ...mappedVerticalAnnotations,
//       xAxisTitle && {
//         xref: 'paper' as const,
//         yref: 'paper' as const,
//         x: 0.5,
//         y: 0,
//         text: xAxisTitle,
//         showarrow: false,
//         xanchor: 'center' as const,
//         yshift: 15,
//       },
//     ].filter(Boolean);

//     return { traces, annotations, mappedVerticalTraces };
//   });
// };
