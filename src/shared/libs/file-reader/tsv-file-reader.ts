import EventEmitter from 'node:events';
import { FileReader } from './file-reader.interface.js';
import { createReadStream } from 'node:fs';

const CHUNK_SIZE = 16384; // 16KB
const LINE_SEPARATOR = '\n';

export class TSVFileReader extends EventEmitter implements FileReader {
  constructor(private readonly filename: string) {
    super();
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      encoding: 'utf-8',
      highWaterMark: CHUNK_SIZE,
    });

    let remainingData = '';
    let nextLinePointer = -1;
    let importedRowsCounter = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();
      nextLinePointer = remainingData.indexOf(LINE_SEPARATOR);

      while ((nextLinePointer = remainingData.indexOf(LINE_SEPARATOR)) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePointer++);
        remainingData = remainingData.slice(nextLinePointer);

        importedRowsCounter++;
        this.emit('completeRow', completeRow);
      }
    }

    this.emit('readingFinished', importedRowsCounter);
  }
}
