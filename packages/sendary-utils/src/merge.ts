const merge = (target, source) => {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && !Array.isArray(source[key])) {
      Object.assign(source[key], merge(target[key], source[key]));
    }
  }

  Object.assign(target || {}, source);
  return target;
};

export { merge };
