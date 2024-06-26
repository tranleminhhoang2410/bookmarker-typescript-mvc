import closeIcon from '../../assets/icons/close.svg';

// Types
import { ToastDescription, ToastMessage, ToastOptions } from '@/types';

// Constants
import { TOAST } from '../constants';

const defaultToastOptions: ToastOptions = {
  type: TOAST.TYPE.SUCCESS,
  closeButtonId: TOAST.CLOSE_BUTTON_ID,
};

 
export const toastTemplate = (
  message: ToastMessage,
  description: ToastDescription,
  options: ToastOptions = defaultToastOptions,
) => {
  const { type, closeButtonId } = options;

  return `
    <div class="toast-container ${type}">
      <h2 class="text-heading toast-message">${message}</h2>
      <p class="text-description toast-description">${description}</p>
      <button id=${closeButtonId} class="btn btn-close">
        <img width="16px" height="16px" src=${closeIcon} alt="close">
      </button>
    </div>
  `;
};
