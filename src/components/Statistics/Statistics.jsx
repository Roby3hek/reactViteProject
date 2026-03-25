import React, { useContext, useMemo, useState } from 'react';
import { ReceiptContext } from '../../context/ReceiptContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const Statistics = () => {
  const { receipts } = useContext(ReceiptContext);

  // Фильтрация чеков по году
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Получаем уникальные года из чеков
  const years = useMemo(() => {
    const ys = receipts.map(r => new Date(r.date).getFullYear());
    return Array.from(new Set(ys)).sort((a, b) => b - a);
  }, [receipts]);

  // Фильтруем чеки по выбранному году
  const filteredReceipts = useMemo(() => {
    return receipts.filter(r => new Date(r.date).getFullYear() === selectedYear);
  }, [receipts, selectedYear]);

  // Группировка по месяцам (для столбчатой диаграммы)
  const monthlyExpenses = useMemo(() => {
    const months = Array(12).fill(0);
    filteredReceipts.forEach(r => {
      const month = new Date(r.date).getMonth();
      months[month] += r.amount;
    });
    return months;
  }, [filteredReceipts]);

  // Группировка по категориям (для круговой диаграммы)
  const categoryExpenses = useMemo(() => {
    const catMap = {};
    filteredReceipts.forEach(r => {
      catMap[r.category] = (catMap[r.category] || 0) + r.amount;
    });
    return catMap;
  }, [filteredReceipts]);

  // Данные для столбчатой диаграммы (расходы по месяцам)
  const barData = {
    labels: [
      'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
      'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
    ],
    datasets: [
      {
        label: `Расходы за ${selectedYear}`,
        data: monthlyExpenses,
        backgroundColor: 'rgba(59, 130, 246, 0.7)', // синий
      },
    ],
  };

  // Данные для круговой диаграммы (по категориям)
  const pieData = {
    labels: Object.keys(categoryExpenses),
    datasets: [
      {
        label: 'Расходы по категориям',
        data: Object.values(categoryExpenses),
        backgroundColor: [
          '#3b82f6',
          '#ef4444',
          '#f59e0b',
          '#10b981',
          '#8b5cf6',
          '#ec4899',
        ],
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-4xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">Статистика расходов</h2>

      <div className="mb-4">
        <label htmlFor="year" className="font-semibold mr-2">Выберите год:</label>
        <select
          id="year"
          value={selectedYear}
          onChange={e => setSelectedYear(Number(e.target.value))}
          className="border px-2 py-1 rounded"
        >
          {years.length === 0 && <option>Нет данных</option>}
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Bar data={barData} options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: `Расходы по месяцам за ${selectedYear}` },
            },
          }} />
        </div>

        <div>
          <Pie data={pieData} options={{
            responsive: true,
            plugins: {
              legend: { position: 'right' },
              title: { display: true, text: `Расходы по категориям за ${selectedYear}` },
            },
          }} />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
