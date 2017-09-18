// Months in pt-BR
const MONTHS = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro'
  ];

/**
 * Returns the name of the given month number
 */
export const getNameOfMonth = (month, abbr = false) => {
  let result = MONTHS[month];
  if (!result) {
    return '';
  }

  if (abbr) {
    result = result.substring(0, 3);
  }

  return result;
}

/**
 * Parses a Date format to text day month year
 * @param date Date to parse
 */
export const parseDate = (date, abbr = false) => {
    if (!date) return 'Data não disponível';
  
    const d = date.getUTCDate();
    const m = date.getUTCMonth();
    const y = date.getUTCFullYear();
  
    let mText = MONTHS[m];
    if (abbr) {
      mText = mText.substring(0, 3);
      return `${d} ${mText} ${y}`;
    }
  
    return `${d} de ${mText} de ${y}`;
  }