import { useState } from 'react';
import * as UseCases from '../useCases/boardUseCases';

const INITIAL_BOARD_STATE = [
  { id: '1', title: 'A Fazer', tasks: [{ id: '101', title: 'Estudar React', description: 'Revisar hooks e componentes.' }] },
  { id: '2', title: 'Em Andamento', tasks: [{ id: '102', title: 'Projeto Final', description: 'Criar MVP do Kanban.' }] },
  { id: '3', title: 'Concluído', tasks: [{ id: '103', title: 'Configurar Ambiente', description: 'Instalar dependências.' }] },
];

export const useBoardController = () => {
  const [columns, setColumns] = useState(INITIAL_BOARD_STATE);

  const addTask = (columnId) => {
    setColumns((prev) => UseCases.addTaskToColumn(prev, columnId));
  };

  const updateTitle = (columnId, taskId, newTitle) => {
    setColumns((prev) => UseCases.updateTaskTitleInColumns(prev, columnId, taskId, newTitle));
  };

  const updateDescription = (columnId, taskId, newDescription) => {
    setColumns((prev) => UseCases.updateTaskDescriptionInColumns(prev, columnId, taskId, newDescription));
  };

  const moveTask = (fromColumnId, toColumnId, taskToMove) => {
    setColumns((prev) => UseCases.moveTaskBetweenColumns(prev, fromColumnId, toColumnId, taskToMove));
  };

  const toggleComplete = (columnId, task) => {
    setColumns((prev) => UseCases.toggleTaskCompletionState(prev, columnId, task));
  };

  const deleteTask = (columnId, taskId) => {
    setColumns((prev) => UseCases.deleteTaskFromColumns(prev, columnId, taskId));
  };

  return {
    columns,
    addTask,
    updateTitle,
    updateDescription,
    moveTask,
    toggleComplete,
    deleteTask,
  };
};