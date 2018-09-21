export default (name, mock) => {
  const actual = Zepto.fn[name];
  Zepto.fn[name] = mock;

  return () => {
    Zepto.fn[name] = actual;
  };
};
