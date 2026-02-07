const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function convertHundreds(n: number): string {
  if (n === 0) return '';
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
  return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' And ' + convertHundreds(n % 100) : '');
}

export function numberToWords(num: number, currency = 'Dirhams', subCurrency = 'Fils'): string {
  if (num === 0) return `Zero ${currency}`;
  const intPart = Math.floor(num);
  const decPart = Math.round((num - intPart) * 100);

  const scales = ['', 'Thousand', 'Million', 'Billion'];
  let result = '';
  let scaleIndex = 0;
  let n = intPart;

  while (n > 0) {
    const chunk = n % 1000;
    if (chunk > 0) {
      const chunkWords = convertHundreds(chunk);
      result = chunkWords + (scales[scaleIndex] ? ' ' + scales[scaleIndex] : '') + (result ? ' ' : '') + result;
    }
    n = Math.floor(n / 1000);
    scaleIndex++;
  }

  result = result.trim() + ' ' + currency;
  if (decPart > 0) {
    result += ' And ' + convertHundreds(decPart) + ' ' + subCurrency;
  }
  return result;
}
