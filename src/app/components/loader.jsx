const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/25 backdrop-blur-sm z-50">
      <div className="relative flex justify-center items-center p-6 bg-white/30 backdrop-blur-md rounded-lg shadow-lg">
        <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div>
        <img
          src="https://www.svgrepo.com/show/509001/avatar-thinking-9.svg"
          className="rounded-full h-28 w-28"
        />
      </div>
    </div>
  );
};

export default Loader;
