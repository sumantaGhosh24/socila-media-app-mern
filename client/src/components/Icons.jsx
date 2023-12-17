import propTypes from "prop-types";

const Icons = ({setContent, content}) => {
  const reactions = [
    "❤️",
    "😆",
    "😯",
    "😢",
    "😡",
    "👍",
    "👎",
    "😄",
    "😂",
    "😍",
    "😘",
    "😗",
    "😚",
    "😳",
    "😭",
    "😓",
    "😤",
    "🤤",
    "👻",
    "💀",
    "🤐",
    "😴",
    "😷",
    "😵",
  ];

  return (
    <div>
      <span id="navbarDropdown" role="button">
        <span>😄</span>
      </span>
      <div>
        <div>
          {reactions.map((icon) => (
            <span key={icon} onClick={() => setContent(content + icon)}>
              {icon}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

Icons.propTypes = {
  setContent: propTypes.any,
  content: propTypes.any,
};

export default Icons;
