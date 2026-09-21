import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  onSubmit: (query: string) => Promise<boolean> | undefined;
  isDisabled: boolean;
  todos: Todo[];
};

export const Header = ({ onSubmit, isDisabled, todos }: Props) => {
  const [query, setQuery] = useState('');

  const inputReference = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputReference.current?.focus();
  }, [query, isDisabled, todos]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form
        onSubmit={event => {
          event.preventDefault();

          const result = onSubmit(query);

          result?.then(response => {
            if (response) {
              setQuery('');
            }
          });
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.target.value)}
          disabled={isDisabled}
          ref={inputReference}
        />
      </form>
    </header>
  );
};
