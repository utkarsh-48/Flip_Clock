function BackgroundLayer({ background, backgroundBlur, backgroundOverlay }) {
  return (
    <>
      <div
        className="background-layer"
        style={{
          "--background-blur": `${backgroundBlur}px`,
          ...(background ? { backgroundImage: `url("${background}")` } : {}),
        }}
      />
      <div
        className="background-overlay"
        style={{ "--background-overlay": backgroundOverlay / 100 }}
      />
    </>
  );
}

export default BackgroundLayer;
