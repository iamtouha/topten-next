const LoadingScreen = () => {
  return (
    <div
      aria-label="progressbar"
      role="progressbar"
      className="z-50 grid h-screen place-items-center bg-black bg-opacity-20"
    >
      <div>
        <div className="h-20 w-20 animate-spin rounded-full border-t-[3px] border-b-[3px] border-black"></div>
      </div>
    </div>
  );
};
export default LoadingScreen;
