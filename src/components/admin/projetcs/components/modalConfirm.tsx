import { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { Modal } from './modal';

type ConfirmOptions = {
  title?: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const confirm = async (options: ConfirmOptions) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  return new Promise<boolean>((resolve) => {
    const handleClose = (result: boolean) => {
      root.unmount();
      container.remove();
      resolve(result);
    };

    root.render(
      <Modal
        open={true}
        onClose={() => handleClose(false)}
        clickOutside
        title={options.title || 'Are you sure?'}
        actions={<>
          <button onClick={() => handleClose(true)} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            {options.confirmText || 'OK'}
          </button>
          <button onClick={() => handleClose(false)} type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
            {options.cancelText || 'Cancel'}
          </button>
        </>}
      >
        <p className="text-sm text-gray-500">{options.message}</p>
      </Modal>
    );
  });
};

// Usage:
// const result = await confirm({ message: 'Are you sure?' });