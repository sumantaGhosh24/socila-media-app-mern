const LoadMoreBtn = ({result, handleLoadMore}) => {
  return (
    <>
      {result && (
        <button
          onClick={handleLoadMore}
          className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none"
        >
          Load more
        </button>
      )}
    </>
  );
};

export default LoadMoreBtn;
