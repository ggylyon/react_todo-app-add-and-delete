/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import React, { useState } from 'react';

type Props = {
  todo: Todo;
  isTemp?: boolean;
  onDelete?: (todoId: number) => Promise<unknown> | undefined;
  deleteQueue?: number[];
};

export const TodoComponent = ({
  todo,
  isTemp = false,
  onDelete = () => {},
  deleteQueue = [],
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          setIsLoading(true);

          onDelete(todo.id)?.then(() => {
            setIsLoading(false);
          });
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isTemp || isLoading || deleteQueue.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
