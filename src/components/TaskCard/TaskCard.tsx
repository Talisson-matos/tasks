import React from 'react';
import { X, AlertCircle, Clock, Edit3 } from 'lucide-react';
import { Task } from '../../../types';
import { formatTimeAgo, formatDateTime } from '../../../utils/deleUtils';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  isDragged: boolean;
  onDragStart: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleUrgent: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isDragged,
  onDragStart,
  onEdit,
  onDelete,
  onToggleUrgent
}) => {
  const getUrgencyClass = (): string => {
    const now = new Date();
    const diff = now.getTime() - task.createdAt.getTime();
    const hours = diff / (1000 * 60 * 60);
    
    if (task.isUrgent) return 'urgent';
    if (hours > 48) return 'overdue';
    if (hours > 24) return 'warning';
    return 'normal';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={`task-card ${getUrgencyClass()} ${isDragged ? 'dragging' : ''}`}
    >
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="task-actions">
          <button
            onClick={onEdit}
            className="action-btn edit-btn"
            title="Editar tarefa"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={onDelete}
            className="action-btn delete-btn"
            title="Excluir tarefa"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      <div className="task-footer">
        <div className="task-time">
          <Clock size={12} />
          <span>{formatTimeAgo(task.createdAt)}</span>
        </div>
        <button
          onClick={onToggleUrgent}
          className={`urgent-btn ${task.isUrgent ? 'active' : ''}`}
          title={task.isUrgent ? 'Marcar como normal' : 'Marcar como urgente'}
        >
          <AlertCircle size={14} />
        </button>
      </div>
      
      <div className="task-created">
        Criado: {formatDateTime(task.createdAt)}
      </div>
    </div>
  );
};

export default TaskCard;