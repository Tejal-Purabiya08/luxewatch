import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import DashboardCards from "./component/DashboardCards";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="admin-data-card p-2 shadow-sm">
        <p className="text-muted fw-700 mb-1">{label}</p>
        <p className="text-indigo fw-900 mb-0">
          ₹{Number(payload[0].value).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const [productRes, userRes, orderRes] = await Promise.all([
        axios.get("http://localhost:5000/api/products"),
        axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/orders/admin/all"),
      ]);

      const productsData = productRes.data;
      const usersData = userRes.data;
      const orders = orderRes.data;

      setProducts(productsData);
      setProductCount(productsData.length);
      setUserCount(usersData.length);
      setOrderCount(orders.length);

      const revenue = orders.reduce(
        (sum, o) => sum + (o.totalAmount || 0),
        0
      );
      setTotalRevenue(revenue);

      const monthly = {};

      orders.forEach((order) => {
        const month = new Date(order.createdAt).toLocaleString("default", {
          month: "short",
        });

        monthly[month] = (monthly[month] || 0) + (order.totalAmount || 0);
      });

      const chartData = Object.keys(monthly).map((key) => ({
        month: key,
        revenue: monthly[key],
      }));

      setRevenueData(chartData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-main-wrapper dashboard-page">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="stats-glass-card mb-4"
      >
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h2 className="fw-900 mb-1">Control Center</h2>
            <p className="text-muted mb-0">
              System analytics & performance overview
            </p>
          </div>

          <div className="d-flex gap-3 align-items-center">
            <div className="status-pill status-active">
               NODE ACTIVE
            </div>

            <div className="status-pill status-inactive">
              📅 {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </motion.div>

      {/* STATS CARDS */}
      <div className="mb-4">
        <DashboardCards
          userCount={userCount}
          productCount={productCount}
          orderCount={orderCount}
          totalRevenue={totalRevenue}
          loading={loading}
        />
      </div>

      {/* CHART + PRODUCTS */}
      <div className="row g-4">

        {/* CHART */}
        <div className="col-xl-8">
          <div className="admin-data-card p-4">
            <div className="mb-3">
              <h5 className="fw-800 mb-0">Revenue Analytics</h5>
              <p className="text-muted x-small mb-0">
                Monthly performance breakdown
              </p>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />

                <Tooltip content={<CustomTooltip />} />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4f46e5"
                  fill="url(#rev)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="col-xl-4">
          <div className="admin-data-card p-4 sticky-sidebar">

            <h5 className="fw-800 mb-3">Recent Products</h5>

            {loading ? (
              <p className="text-muted">Loading...</p>
            ) : (
              products.slice(-5).reverse().map((item, i) => (
                <div key={i} className="admin-table-row d-flex justify-content-between align-items-center p-2">
                  
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={item.image}
                      alt=""
                      style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 8 }}
                    />
                    <div>
                      <div className="fw-700">{item.name}</div>
                      <div className="text-muted x-small">{item.brand}</div>
                    </div>
                  </div>

                  <div className="fw-800 text-indigo">
                    ₹{item.price}
                  </div>

                </div>
              ))
            )}

          </div>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;