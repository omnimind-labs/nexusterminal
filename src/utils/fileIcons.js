import {
  Folder, FolderOpen, FileText, FileCode, FileImage, File, Archive,
} from 'lucide-react';

const CODE_EXTS = new Set([
  'js', 'jsx', 'ts', 'tsx', 'py', 'go', 'lua', 'sh',
  'json', 'toml', 'yml', 'yaml', 'css', 'html', 'md', 'mod', 'csv',
]);

const IMAGE_EXTS = new Set(['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp']);

const ARCHIVE_EXTS = new Set(['gz', 'tar', 'zip', 'dmg', 'AppImage']);

/**
 * Returns the appropriate Lucide icon component for a file-tree item.
 * @param {{ type: string, ext?: string }} item
 * @param {boolean} [isOpen=false] - Whether a directory is expanded.
 * @returns {import('lucide-react').LucideIcon}
 */
export function getFileIcon(item, isOpen = false) {
  if (item.type === 'dir') return isOpen ? FolderOpen : Folder;
  if (IMAGE_EXTS.has(item.ext)) return FileImage;
  if (CODE_EXTS.has(item.ext)) return FileCode;
  if (ARCHIVE_EXTS.has(item.ext)) return Archive;
  if (['pdf', 'md', 'txt', 'xlsx'].includes(item.ext)) return FileText;
  return File;
}

/**
 * Returns a Tailwind text color class for a file-tree item.
 * @param {{ type: string, ext?: string }} item
 * @returns {string}
 */
export function getFileIconColor(item) {
  if (item.type === 'dir') return 'text-chart-4';
  if (IMAGE_EXTS.has(item.ext)) return 'text-accent';
  if (CODE_EXTS.has(item.ext)) return 'text-primary';
  if (ARCHIVE_EXTS.has(item.ext)) return 'text-chart-5';
  return 'text-muted-foreground';
}

export { CODE_EXTS, IMAGE_EXTS, ARCHIVE_EXTS };
