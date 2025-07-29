import { toast } from 'react-toastify';

export function handleThunkToast(result, messages = {}) {
  const { success, error } = messages;

  if (result.meta?.requestStatus === 'fulfilled') {
    if (success) toast.success(success);
  } else if (result.meta?.requestStatus === 'rejected') {
    const payloadMsg = result?.payload?.data || result?.error?.message;
    toast.error(error || payloadMsg || 'Something went wrong.');
  }
}
