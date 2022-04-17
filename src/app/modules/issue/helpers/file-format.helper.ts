const K_BYTE_SIZE = 1024;
const M_BYTE_SIZE = 1048576;
const MAX_SIZE = 10485760;

export const getFileSizeFormatted = (size: number): string => {
  if (size < K_BYTE_SIZE) {
    return `${size}б`;
  }

  if (size < M_BYTE_SIZE) {
    return `${Math.ceil((size / K_BYTE_SIZE))}Кб`;
  }

  if (size < MAX_SIZE) {
    return  `${(Math.ceil(size * 10 / M_BYTE_SIZE) / 10)}Мб`;
  }

  return `${Math.ceil(size / M_BYTE_SIZE)}Мб`;
};
