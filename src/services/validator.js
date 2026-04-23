/**
 * Validates Ecuadorian ID (Cédula)
 * @param {string} cedula 
 * @returns {boolean}
 */
export const validateCedula = (cedula) => {
  if (typeof cedula !== 'string' || cedula.length !== 10) return false;
  
  const province = parseInt(cedula.substring(0, 2), 10);
  if (province < 1 || province > 24) return false;

  const thirdDigit = parseInt(cedula.substring(2, 3), 10);
  if (thirdDigit > 5) return false;

  const digits = cedula.split('').map(Number);
  const checkDigit = digits.pop();
  
  const sum = digits.reduce((acc, curr, index) => {
    let val = (index % 2 === 0) ? curr * 2 : curr;
    if (val > 9) val -= 9;
    return acc + val;
  }, 0);

  const calculatedCheckDigit = (10 - (sum % 10)) % 10;
  return calculatedCheckDigit === checkDigit;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
