import CircleLoader from "react-spinners/CircleLoader";

const Loading = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircleLoader size={480} color="#1515ff" />
    </div>
  );
};

export default Loading;
