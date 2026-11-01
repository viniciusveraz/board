import { createEmptyTask, sanitizeTask, COMPLETED_COLUMN_ID, DEFAULT_COLUMN_ID } from '../domain/boardDomain';

export const addTaskToColumn = (columns, columnId) => {
  return columns.map((column) => 
    column.id === columnId 
      ? { ...column, tasks: [...column.tasks, createEmptyTask()] } 
      : column
  );
};

export const updateTaskTitleInColumns = (columns, columnId, taskId, newTitle) => {
  return columns.map((column) => {
    if (column.id !== columnId) return column;
    return {
      ...column,
      tasks: column.tasks.map((task) => 
        task.id === taskId ? sanitizeTask({ ...task, title: newTitle }) : task
      ),
    };
  });
};

export const updateTaskDescriptionInColumns = (columns, columnId, taskId, newDescription) => {
  return columns.map((column) => {
    if (column.id !== columnId) return column;
    return {
      ...column,
      tasks: column.tasks.map((task) => 
        task.id === taskId ? sanitizeTask({ ...task, description: newDescription }) : task
      ),
    };
  });
};

export const moveTaskBetweenColumns = (columns, fromColumnId, toColumnId, taskToMove) => {
  return columns.map((column) => {
    if (column.id === fromColumnId) {
      return { ...column, tasks: column.tasks.filter((t) => t.id !== taskToMove.id) };
    }
    if (column.id === toColumnId) {
      return { ...column, tasks: [...column.tasks, taskToMove] };
    }
    return column;
  });
};

export const toggleTaskCompletionState = (columns, columnId, task) => {
  const targetColumnId = columnId === COMPLETED_COLUMN_ID ? DEFAULT_COLUMN_ID : COMPLETED_COLUMN_ID;
  return moveTaskBetweenColumns(columns, columnId, targetColumnId, task);
};

export const deleteTaskFromColumns = (columns, columnId, taskId) => {
  return columns.map((column) => {
    if (column.id !== columnId) return column;
    return {
      ...column,
      tasks: column.tasks.filter((task) => task.id !== taskId),
    };
  });
};