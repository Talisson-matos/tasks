import React, { useState, useEffect } from 'react';

import TaskCard from '../TaskCard/TaskCard';
import TaskModal from '../TaskModal/TaskModal';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import { Task, Column } from '../../../types';
import { loadFromStorage, saveToStorage } from '../../../utils/localStorage';
import './KanbanBoard.css';

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<Record<string, Column>>(loadFromStorage);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingColumn, setEditingColumn] = useState<string>('todo');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedFrom, setDraggedFrom] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    show: boolean;
    task: Task | null;
  }>({ show: false, task: null });

  useEffect(() => {
    saveToStorage(columns);
  }, [columns]);

  const openModal = (columnId: string, task?: Task) => {
    setEditingColumn(columnId);
    if (task) {
      setEditingTask(task);
    } else {
      setEditingTask(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const saveTask = (title: string, description: string) => {
    if (!title.trim()) return;

    const newColumns = { ...columns };

    if (editingTask) {
      // Atualizar tarefa existente
      Object.keys(newColumns).forEach(columnId => {
        const taskIndex = newColumns[columnId].tasks.findIndex(t => t.id === editingTask.id);
        if (taskIndex !== -1) {
          newColumns[columnId].tasks[taskIndex] = {
            ...editingTask,
            title: title,
            description: description
          };
        }
      });
    } else {
      // Criar nova tarefa
      const newTask: Task = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title: title,
        description: description,
        createdAt: new Date(),
        isUrgent: false
      };
      newColumns[editingColumn].tasks.push(newTask);
    }

    setColumns(newColumns);
    closeModal();
  };

  const showDeleteConfirm = (task: Task) => {
    setConfirmDelete({ show: true, task });
  };

  const hideDeleteConfirm = () => {
    setConfirmDelete({ show: false, task: null });
  };

  const confirmDeleteTask = () => {
    if (confirmDelete.task) {
      const newColumns = { ...columns };
      Object.keys(newColumns).forEach(columnId => {
        newColumns[columnId].tasks = newColumns[columnId].tasks.filter(
          t => t.id !== confirmDelete.task!.id
        );
      });
      setColumns(newColumns);
    }
    hideDeleteConfirm();
  };

  const toggleUrgent = (taskId: string) => {
    const newColumns = { ...columns };
    Object.keys(newColumns).forEach(columnId => {
      const taskIndex = newColumns[columnId].tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        newColumns[columnId].tasks[taskIndex].isUrgent = !newColumns[columnId].tasks[taskIndex].isUrgent;
      }
    });
    setColumns(newColumns);
  };

  // Drag and Drop handlers
  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
    Object.keys(columns).forEach(columnId => {
      if (columns[columnId].tasks.some(t => t.id === task.id)) {
        setDraggedFrom(columnId);
      }
    });
  };

  const handleDragEnter = (columnId: string) => {
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (targetColumnId: string) => {
    if (!draggedTask || !draggedFrom) return;

    if (draggedFrom === targetColumnId) {
      setDraggedTask(null);
      setDraggedFrom(null);
      setDragOverColumn(null);
      return;
    }

    const newColumns = { ...columns };
    
    // Remove da coluna origem
    newColumns[draggedFrom].tasks = newColumns[draggedFrom].tasks.filter(
      task => task.id !== draggedTask.id
    );
    
    // Adiciona na coluna destino
    newColumns[targetColumnId].tasks.push(draggedTask);
    
    setColumns(newColumns);
    setDraggedTask(null);
    setDraggedFrom(null);
    setDragOverColumn(null);
  };

  return (
    <div className="kanban-container">
      <div className="kanban-wrapper">
        <h1 className="kanban-title">Sistema Kanban</h1>
        
        <div className="columns-container">
          {Object.values(columns).map((column) => (
            <div 
              key={column.id} 
              className={`column ${dragOverColumn === column.id ? 'drag-over' : ''}`}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={() => handleDragEnter(column.id)}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(column.id)}
            >
              <div className="column-header">
                <h2 className="column-title">
                  {column.title} ({column.tasks.length})
                </h2>
                <button
                  onClick={() => openModal(column.id)}
                  className="add-task-btn"
                  title="Adicionar nova tarefa"
                >  <span className='sum'>+</span>
                </button>
              </div>

              <div className="tasks-container">
                {column.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isDragged={draggedTask?.id === task.id}
                    onDragStart={() => handleDragStart(task)}
                    onEdit={() => openModal(column.id, task)}
                    onDelete={() => showDeleteConfirm(task)}
                    onToggleUrgent={() => toggleUrgent(task.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <TaskModal
          isOpen={showModal}
          task={editingTask}
          onClose={closeModal}
          onSave={saveTask}
        />
      )}

      {confirmDelete.show && (
        <ConfirmDialog
          isOpen={confirmDelete.show}
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja excluir a tarefa "${confirmDelete.task?.title}"?`}
          onConfirm={confirmDeleteTask}
          onCancel={hideDeleteConfirm}
        />
      )}
    </div>
  );
};

export default KanbanBoard;