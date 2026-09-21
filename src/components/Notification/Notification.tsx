import classNames from 'classnames';

type Props = {
  notificationText: string;
  isNotificationVisible: boolean;
  onClose: () => void;
};

export const Notification = ({
  notificationText,
  isNotificationVisible,
  onClose,
}: Props) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        isNotificationVisible ? '' : 'hidden',
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {notificationText}
    </div>
  );
};

// {/* show only one message at a time */}
// Unable to load todos
// <br />
// Title should not be empty
// <br />
// Unable to add a todo
// <br />
// Unable to delete a todo
// <br />
// Unable to update a todo
