import Chart from 'react-apexcharts';

const ApexChart = (datas) => {
  const options = {
    colors: ['#4896FF', '#FFBC01', '#FD71AF', '#00B783', '#FB5115'],
    chart: {
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: datas?.datas?.categories,
    },
  };
  const series = [
    {
      name: 'Opened',
      data: datas?.datas?.opens,
    },
    {
      name: 'Replied',
      data: datas?.datas?.replies,
    },
    {
      name: 'Unsubscribed',
      data: datas?.datas?.unsubscribes,
    },
    {
      name: 'Contacted',
      data: datas?.datas?.contacts,
    },

    {
      name: 'Clicked',
      data: datas?.datas?.clicks,
    },
  ];

  return datas?.datas ? (
    <Chart options={options} series={series} type="area" width="100%" height="100%" />
  ) : (
    'Loading...'
  );
};
export default ApexChart;
