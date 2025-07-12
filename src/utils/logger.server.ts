'use server';

import fs from 'fs';
import path from 'path';
import { date2string } from '@/lib/date';
import { LogLevel } from './logger';

const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, `${date2string(new Date(), false)}.log`);

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

export async function sendLog(level: LogLevel, message: string, meta?: any) {
  const timestamp = date2string(new Date(), true);
  const logEntry = `${timestamp} [${level}] ${message}${
    meta ? ` - ${JSON.stringify(meta)}` : ''
  }\n`;

  // Write to file
  fs.appendFileSync(LOG_FILE, logEntry);
}