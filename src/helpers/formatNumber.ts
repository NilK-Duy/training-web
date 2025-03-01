export const formatCurrency = (number :number) => {
  try {
    const currency = new Intl.NumberFormat('de-DE', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0  
    }).format(number)
    return currency;
  } catch (error) {
    throw new Error('Parameter is not a number!');
  }
}