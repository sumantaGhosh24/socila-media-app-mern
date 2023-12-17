import propTypes from "prop-types";

const LoadMoreBtn = ({result, handleLoadMore}) => {
  return <>{result && <button onClick={handleLoadMore}>Load more</button>}</>;
};

LoadMoreBtn.propTypes = {
  result: propTypes.bool,
  handleLoadMore: propTypes.any,
};

export default LoadMoreBtn;
