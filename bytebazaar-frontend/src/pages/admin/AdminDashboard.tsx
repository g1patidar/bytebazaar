import { useState, useEffect } from 'react';
import { LineChart, BarChart, XAxis, YAxis, Tooltip, Legend, Line, Bar, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Users, Package, DollarSign, TrendingUp, BarChart2, Clock, ShoppingCart } from 'lucide-react';
// Fixed import - importing PieChart icon properly
import { PieChart as PieChartIcon } from 'lucide-react';
import { projectsApi, usersApi, ordersApi } from '@/lib/api';
import { timeframeOptions, Stats } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface StatsData {
  projects: Stats;
  users: Stats;
  orders: Stats;
  revenue: Stats;
}

// Dummy data generator
export const generateDummyData = (timeframe) => {
  const periods = {
    day: 24,
    week: 7,
    month: 30,
    quarter: 3,
    halfyear: 6,
    year: 12,
    all: 24
  };
  
  const period = periods[timeframe];
  const data = [];
  
  for (let i = 0; i < period; i++) {
    const users = Math.floor(Math.random() * 50) + 10;
    const projects = Math.floor(Math.random() * 30) + 5;
    const orders = Math.floor(Math.random() * 40) + 15;
    const revenue = Math.floor(Math.random() * 5000) + 1000;
    
    // Label based on timeframe
    let label;
    switch(timeframe) {
      case 'day':
        label = `${i}:00`;
        break;
      case 'week':
        label = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i];
        break;
      case 'month':
        label = `Day ${i+1}`;
        break;
      case 'quarter':
        label = `Month ${i+1}`;
        break;
      case 'halfyear':
        label = `Month ${i+1}`;
        break;
      case 'year':
        label = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i];
        break;
      default:
        label = `Period ${i+1}`;
    }
    
    data.push({
      name: label,
      users,
      projects,
      orders,
      revenue
    });
  }
  
  return data;
};

// Simulate API call with delay
export const fetchData = async (timeframe) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateDummyData(timeframe));
    }, 500);
  });
};

// Dashboard component
export default function AdminDashboard() {
  const [timeframe, setTimeframe] = useState('week');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [projectStats, userStats, orderStats] = await Promise.all([
          projectsApi.getStats(timeframe),
          usersApi.getStats(timeframe),
          ordersApi.getStats(timeframe),
        ]);

        setStats({
          projects: projectStats.data,
          users: userStats.data,
          orders: orderStats.data,
          revenue: {
            total: orderStats.data.total,
            data: orderStats.data.data.map(item => ({
              ...item,
              value: item.value * 100 // Assuming average order value of $100
            }))
          }
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeframe]);

  const StatCard = ({ title, value, icon: Icon, loading }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="bg-blue-100 p-3 rounded-full">
          <Icon size={24} className="text-blue-600" />
        </div>
        <div className="ml-4">
          <h3 className="text-gray-500 text-sm">{title}</h3>
          {loading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <p className="text-2xl font-bold">{value}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Time Period Selector */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-gray-700">Time Period:</span>
          {timeframeOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setTimeframe(option.value)}
              className={`px-3 py-1 rounded ${
                timeframe === option.value 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Projects"
          value={stats?.projects.total || 0}
          icon={Package}
          loading={loading}
        />
        <StatCard
          title="Total Users"
          value={stats?.users.total || 0}
          icon={Users}
          loading={loading}
        />
        <StatCard
          title="Total Orders"
          value={stats?.orders.total || 0}
          icon={ShoppingCart}
          loading={loading}
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats?.revenue.total.toLocaleString() || 0}`}
          icon={DollarSign}
          loading={loading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - Users & Projects */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Growth Overview</h3>
          {loading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.users.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Users"
                  stroke="#8884d8"
                />
                <Line
                  type="monotone"
                  data={stats?.projects.data}
                  dataKey="value"
                  name="Projects"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar Chart - Revenue */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Analytics</h3>
          {loading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.revenue.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Legend />
                <Bar dataKey="value" name="Revenue ($)" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}