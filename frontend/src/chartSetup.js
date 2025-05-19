import {
    Chart as ChartJS,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    BarElement,
    Title,
    CategoryScale,
    Tooltip,
    Legend,
  } from 'chart.js';
  
  ChartJS.register(
    LineController,
    LineElement,
    PointElement,
    BarElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend
  );
  