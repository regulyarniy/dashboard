/**
 * Проверяет, есть ли текст в разметке
 * @param string
 * @returns {boolean}
 */
export const hasTextContent = string => {
  if (typeof string !== `string`) {
    return false;
  }

  const elem = document.createElement(`div`);
  elem.innerHTML = string;
  return Boolean(elem.textContent);
};
