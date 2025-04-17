const GoogleLoginButton = () => {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE}/auth/google`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-white">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center space-y-4">
        <h1 className="text-3xl font-bold text-blue-700">Sign in to Dashboard</h1>
        <button
          onClick={handleLogin}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow transition"
        >
         Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default GoogleLoginButton;
