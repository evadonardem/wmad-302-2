import { useEffect, useState } from "react";
import { FiBox, FiTag, FiUsers } from "react-icons/fi";

const Dashboard = () => {
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    users: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("https://opentdb.com/api.php?");
        if (!res.ok) throw new Error();

        const data = await res.json();
        setStats(data);
      } catch {
        setStats({
          categories: 7,
          products: 128,
          users: 42
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

if (loading) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-gray-300 rounded-full animate-bounce [animation-delay:0.15s]"></div>
        <div className="w-3 h-3 bg-gray-200 rounded-full animate-bounce [animation-delay:0.3s]"></div>
      </div>
      <p className="text-gray-500 text-sm mt-4">Loading…</p>
    </div>
  );
}



  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      <h1 className="text-5xl font-extrabold mb-12 text-white drop-shadow-lg tracking-wide">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Categories */}
        <div className="backdrop-blur-lg bg-white/10 p-10 rounded-3xl shadow-2xl border border-white/20 
                        hover:scale-[1.04] hover:bg-white/20 transition-all duration-300 ease-out">
          <FiTag className="text-5xl text-blue-300" />

          <h2 className="text-2xl font-semibold text-white mt-4 opacity-95">
            Categories
          </h2>

          <p className="text-7xl font-extrabold text-white mt-4 drop-shadow-md">
            {stats.categories}
          </p>

          <p className="text-sm text-white/80 mt-4">Total categories available</p>
        </div>

        {/* Products */}
        <div className="backdrop-blur-lg bg-white/10 p-10 rounded-3xl shadow-2xl border border-white/20 
                        hover:scale-[1.04] hover:bg-white/20 transition-all duration-300 ease-out">
          <FiBox className="text-5xl text-green-300" />

          <h2 className="text-2xl font-semibold text-white mt-4 opacity-95">
            Products
          </h2>

          <p className="text-7xl font-extrabold text-white mt-4 drop-shadow-md">
            {stats.products}
          </p>

          <p className="text-sm text-white/80 mt-4">Total products listed</p>
        </div>

        {/* Users */}
        <div className="backdrop-blur-lg bg-white/10 p-10 rounded-3xl shadow-2xl border border-white/20 
                        hover:scale-[1.04] hover:bg-white/20 transition-all duration-300 ease-out">
          <FiUsers className="text-5xl text-purple-300" />

          <h2 className="text-2xl font-semibold text-white mt-4 opacity-95">
            Users
          </h2>

          <p className="text-7xl font-extrabold text-white mt-4 drop-shadow-md">
            {stats.users}
          </p>

          <p className="text-sm text-white/80 mt-4">Registered users</p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
