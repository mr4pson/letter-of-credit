export const toBase64 = (file): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    const rawBase64Parts = (reader.result as string).split('base64,');
    const pureBase64 = rawBase64Parts[1];
    resolve(pureBase64);
  }
  reader.onerror = error => reject(error);
});