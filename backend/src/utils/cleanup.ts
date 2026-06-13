import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');
const MAX_AGE_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Clean up old uploaded files that are past the max age
 */
export function cleanupOldFiles(): void {
  if (!fs.existsSync(UPLOADS_DIR)) {
    return;
  }

  const now = Date.now();
  let deletedCount = 0;

  try {
    const files = fs.readdirSync(UPLOADS_DIR);
    
    for (const file of files) {
      const filePath = path.join(UPLOADS_DIR, file);
      
      try {
        const stat = fs.statSync(filePath);
        
        // Skip directories
        if (stat.isDirectory()) continue;
        
        const age = now - stat.mtimeMs;
        
        if (age > MAX_AGE_MS) {
          fs.unlinkSync(filePath);
          deletedCount++;
        }
      } catch {
        // Skip files that can't be accessed
        continue;
      }
    }

    if (deletedCount > 0) {
      console.log(`[Cleanup] Deleted ${deletedCount} old file(s)`);
    }
  } catch (err) {
    console.error('[Cleanup] Error during cleanup:', (err as Error).message);
  }
}
