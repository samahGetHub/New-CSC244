import Axios from "axios";
import PropTypes from 'prop-types';
import { useState,useEffect } from 'react';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { styled, useTheme } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 400;

const LEGEND_HEIGHT = 72;

const StyledChart = styled(Chart)(({ theme }) => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    borderTop: `dashed 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

export default function AppCurrentVisits({ title, subheader, chart, ...other }) {
  const [data, setData] = useState([]);
   const fetchData = async () => {
     try {
       const response = await Axios.get("http://localhost:8000/orders");
      setData(response.data.Items);
    } catch (error) {
      console.log(error);
    }
   };
  
  useEffect(() => {
    fetchData();
  }, []);
  //
  const theme = useTheme();

  // const { colors, series, options } = chart;
  const { colors, options } = chart;
  
  // const chartSeries = series.map((i) => i.value);
  const chartSeries = data.map((item) => item.value);

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    colors,
   // labels: series.map((i) => i.label),
    labels: data.map((item) => item.label),
    stroke: {
      colors: [theme.palette.background.paper],
    },
    legend: {
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 5 }} />

      <StyledChart
        dir="ltr"
        type="pie"
        series={chartSeries}
        options={chartOptions}
        width="100%"
        height={280}
      />
    </Card>
  );
}
 // <AppCurrentVisits chart={{ series: data}} title="Chart Title" subheader="Chart Subheader" /> 

AppCurrentVisits.propTypes = {
  chart: PropTypes.object,
 // chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
