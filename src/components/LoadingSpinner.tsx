const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative w-10 h-10">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full animate-spin border-t-primary"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;