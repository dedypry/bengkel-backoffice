const debounce = (function () {
  let time: ReturnType<typeof setTimeout> | undefined;

  return function (callback: (...args: any[]) => void, delay: number) {
    return (...args: any[]) => {
      if (time) {
        clearTimeout(time);
      }
      time = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  };
})();

export default debounce;
