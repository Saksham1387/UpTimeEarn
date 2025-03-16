import bs58 from "bs58";

const privateKeyString = "5qJ67vkeDwcCnJwdbPao7vaKf4xhmsgBim9RycE4pBCmZng54QAHYpFhQnbecK9VJpHGfspyvSE9ELZkZVNBoNf9"; // Example: "3jvL6WhZ..."
const privateKeyBytes = bs58.decode(privateKeyString);

console.log(privateKeyBytes); // Uint8Array of bytes