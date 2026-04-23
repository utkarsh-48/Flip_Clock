function IconAsset({ icon, alt }) {
  if (typeof icon === "string" && /\.(png|jpe?g|webp|gif|svg)$/i.test(icon)) {
    return (
      <img className="ui-icon-image" src={icon} alt={alt} draggable="false" />
    );
  }
  return <span className="ui-icon-text">{icon}</span>;
}

export default IconAsset;
