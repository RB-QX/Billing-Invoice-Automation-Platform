import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import UsageCard from '../components/UsageCard';
import BillingCard from '../components/BillingCard';
import InvoiceButton from '../components/InvoiceButton';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [billing, setBilling] = useState<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initial fetch
    const fetchAll = async () => {
      try {
        const [uRes, biRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE}/auth/current_user`, {
            credentials: 'include', cache: 'no-store'
          }),
          fetch(`${import.meta.env.VITE_API_BASE}/api/billing`, {
            credentials: 'include', cache: 'no-store'
          })
        ]);
        if (uRes.ok) setUser(await uRes.json());
        if (biRes.ok) setBilling(await biRes.json());
      } catch (e) {
        console.error(e);
      }
    };
    fetchAll();

    // Setup Socket.IO
    const socketIo = io(import.meta.env.VITE_API_BASE!, {
      withCredentials: true
    });
    setSocket(socketIo);

    socketIo.on("usageUpdate", ({ email, usage }) => {
      // only update if this update is for the logged-in user
      if (email === user?.emails?.[0]?.value) {
        setUsage(usage);
      }
    });

    // cleanup
    return () => {
      socketIo.disconnect();
    };
  }, [user]);

  // logout via redirect
  const handleLogout = () => {
    window.location.assign(`${import.meta.env.VITE_API_BASE}/auth/logout`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 to-white py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
        {user && (
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              <img src={user.photos[0].value} alt="Profile"
                   className="w-16 h-16 rounded-full border-4 border-blue-400" />
              <div>
                <h2 className="text-2xl font-semibold">{user.displayName}</h2>
                <p className="text-gray-500">{user.emails[0].value}</p>
              </div>
            </div>
            <button onClick={handleLogout}
                    className="mt-4 sm:mt-0 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-xl shadow">
              Logout
            </button>
          </div>
        )}

        <h1 className="text-4xl font-bold text-blue-700 text-center mb-12">
          🚀 Your Billing Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {usage && <UsageCard usage={usage} />}
          {billing && <BillingCard billing={billing} />}
        </div>

        <div className="p-6 bg-gray-50 rounded-xl border">
          <h3 className="text-lg font-medium mb-4">🧾 Generate Invoice</h3>
          <InvoiceButton />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
