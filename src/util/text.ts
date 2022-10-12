/* eslint-disable prettier/prettier */
import sha3 from 'sha3';
//password + user.salt
export const hash = (text: string) => {
  const hasher = new sha3(256);
  hasher.update(text);
  return hasher.digest('hex');
};

export const getRandom = (type_: string, length: number) => {
  // ranStr
  let result = '';
  const type = type_.toLowerCase();
  length = length ? length : 32;
  let characters = '0123456789';
  if (type === 'number' || type === 'numbers') {
    characters = '0123456789';
    for (let i = 0; i < length; i++) {
      result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
  } else if (type === 'alphabet' || type === 'alphabets') {
    characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < length; i++) {
      result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
  } else if (type === 'alphanumeric' || type === 'all') {
    characters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < length; i++) {
      result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
  } else {
    characters = type;
    for (let i = 0; i < length; i++) {
      result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
  }
};
