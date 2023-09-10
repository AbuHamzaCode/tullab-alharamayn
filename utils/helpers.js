const fs = require('fs/promises');

async function assembleFile(chunks, originalFilePath) {
  try {
    // Sort chunks by chunk number
    chunks.sort((a, b) => a.chunkNumber - b.chunkNumber);

    // Concatenate the chunks
    const concatenatedBuffer = Buffer.concat(chunks.map(chunk => Buffer.from(chunk.chunk, 'base64')));

    // Write the concatenated buffer to the original file
    await fs.writeFile(originalFilePath, concatenatedBuffer);

    console.log('File assembled successfully');
  } catch (error) {
    console.error('Error assembling file:', error);
  }
}

module.exports = {
    assembleFile,
};
