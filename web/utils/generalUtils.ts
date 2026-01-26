export function onlyUnique<T>(value: T, index: number, self: T[]): boolean {
  return self.indexOf(value) === index;
}

export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  // Initialize the output array
  const chunks: T[][] = [];

  // Loop through the array and split it into chunks
  for (let i = 0; i < array.length; i += chunkSize) {
    // Get a slice of the array with the desired chunk size
    const chunk = array.slice(i, i + chunkSize);
    // Add the chunk to the output array
    chunks.push(chunk);
  }

  // Return the output array
  return chunks;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
