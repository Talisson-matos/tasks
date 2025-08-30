import { Column } from '../types';

const STORAGE_KEY = 'kanban_board_tasks_v1_unique_key';

export const loadFromStorage = (): Record<string, Column> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Converter strings de data de volta para objetos Date
      Object.keys(parsed).forEach(columnId => {
        parsed[columnId].tasks.forEach((task: any) => {
          task.createdAt = new Date(task.createdAt);
        });
      });
      return parsed;
    }
  } catch (error) {
    console.error('Erro ao carregar do localStorage:', error);
  }
  
  // Retorna estrutura padrão se não houver dados ou erro
  return {
    'todo': {
      id: 'todo',
      title: 'A Fazer',
      tasks: []
    },
    'doing': {
      id: 'doing',
      title: 'Fazendo',
      tasks: []
    },
    'done': {
      id: 'done',
      title: 'Feito',
      tasks: []
    }
  };
};

export const saveToStorage = (data: Record<string, Column>): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error);
  }
};