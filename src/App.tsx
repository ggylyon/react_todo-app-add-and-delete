import React, { useEffect, useRef, useState } from 'react';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Notification } from './components/Notification/Notification';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { deleteTodo, getTodos, postTodo, USER_ID } from './api/todos';
import { Filters } from './types/Filters';

function filterBy(todos: Todo[], filterCriteria = Filters.ALL) {
  switch (filterCriteria) {
    case Filters.ACTIVE:
      return todos.filter(todo => !todo.completed);
    case Filters.COMPLETED:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterCriteria, setFilterCriteria] = useState<Filters>(Filters.ALL);
  const filteredTodos = filterBy(todos, filterCriteria);
  const uncompletedTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const [notificationText, setNotificationText] = useState('');
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  let notificationID = setTimeout(() => {});

  const handleNotification = useRef(() => {
    clearInterval(notificationID);
    setIsNotificationVisible(true);
    notificationID = setTimeout(() => setIsNotificationVisible(false), 3000);
  });

  useEffect(() => {
    getTodos()
      .then(response => {
        const formattedResponse = response.map(todo => {
          const formattedTodo = {
            title: todo.title,
            id: todo.id,
            userId: todo.userId,
            completed: todo.completed,
          };

          return formattedTodo;
        });

        setTodos(formattedResponse);
      })
      .catch(() => {
        setNotificationText('Unable to load todos');
        handleNotification.current();
      });
  }, []);

  const [isDisabled, setIsDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  function handleSubmit(inputQuery: string) {
    if (!inputQuery.trim()) {
      setNotificationText('Title should not be empty');
      handleNotification.current();

      return;
    }

    const requestedTodo = {
      id: 0,
      title: inputQuery.trim(),
      userId: USER_ID,
      completed: false,
    };

    setIsDisabled(true);

    setTempTodo(requestedTodo);

    return postTodo(requestedTodo)
      .then(response => {
        setTodos([...todos, response]);

        return true;
      })
      .catch(() => {
        setNotificationText('Unable to add a todo');
        handleNotification.current();

        return false;
      })
      .finally(() => {
        setTempTodo(null);
        setIsDisabled(false);
      });
  }

  const [deleteQueue, setDeleteQueue] = useState<number[]>([]);

  const handleDelete = (todoId: number) => {
    return deleteTodo(todoId)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setNotificationText('Unable to delete a todo');
        handleNotification.current();
      })
      .finally(() => {
        setDeleteQueue(
          deleteQueue.filter(todoQueueId => todoQueueId !== todoId),
        );
      });
  };

  if (deleteQueue.length) {
    deleteQueue.forEach(todoId => {
      handleDelete(todoId);
    });
  }

  const handleClear = () => {
    setDeleteQueue(completedTodos.map(todo => todo.id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header onSubmit={handleSubmit} isDisabled={isDisabled} todos={todos} />
        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            onDelete={handleDelete}
            deleteQueue={deleteQueue}
          />
        )}
        {todos.length > 0 && (
          <Footer
            uncompletedTodos={uncompletedTodos}
            completedTodos={completedTodos}
            filterBy={setFilterCriteria}
            onClear={handleClear}
          />
        )}
      </div>

      <Notification
        notificationText={notificationText}
        isNotificationVisible={isNotificationVisible}
        onClose={() => setIsNotificationVisible(false)}
      />
    </div>
  );
};
