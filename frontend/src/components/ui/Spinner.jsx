const Spinner = ({ size = 36, center = false }) => {
  const el = <div className="spinner" style={{ width: size, height: size, borderWidth: size > 30 ? 3 : 2 }} />;
  if (center) return <div className="page-loader">{el}</div>;
  return el;
};

export default Spinner;
