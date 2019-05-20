export const comparableString = term => {
  let preparedString = term.toLowerCase();
  const before = 'áàãâäéèêëíìîïóòõôöúùûü-';
  const converted = 'aaaaaeeeeiiiiooooouuuu ';
  let finalString = '';
  for(let i=0; i < preparedString.length; i++) {
    if(before.includes(preparedString[i])){
      const index = before.indexOf(preparedString[i]);
      finalString += converted[index];
    } else {
      finalString += preparedString[i];
    }
  }
  return finalString;
}
