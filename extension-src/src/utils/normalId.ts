export const normalId = (id: any) => {
  if (id && typeof id === "string") {
    const parts = id.split("/");
    return +(parts.pop() ?? id);
  }
  return id;
};

export const randomId = () => {
  const random = Math.random().toString(36).substring(2, 10);
  if (window) {
    window.TSUFFIXRandomizer = random;
  }
  return random;
};
