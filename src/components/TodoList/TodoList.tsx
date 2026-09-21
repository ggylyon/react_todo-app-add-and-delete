import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoComponent } from '../Todo/TodoComponent';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (todoId: number) => Promise<unknown>;
  deleteQueue: number[];
};

export const TodoList = ({ todos, tempTodo, onDelete, deleteQueue }: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoComponent
            todo={todo}
            onDelete={onDelete}
            deleteQueue={deleteQueue}
            key={todo.id}
          />
        );
      })}

      {tempTodo !== null && <TodoComponent todo={tempTodo} isTemp={true} />}
    </section>
  );
};
