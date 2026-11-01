import { sanitizeText } from '../security/sanitizer';

export const COMPLETED_COLUMN_ID = '3';
export const DEFAULT_COLUMN_ID = '1';

const generateSecureUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const createEmptyTask = () => ({
  id: generateSecureUUID(),
  title: '',
  description: '',
});

export const sanitizeTask = (task) => ({
  ...task,
  title: sanitizeText(task.title),
  description: sanitizeText(task.description),
});