// Constants
import { HTTP_REQUEST } from '@/constants';

//Types
import { RequestOptions } from '@/types';

export const httpRequest = async <T, U>(url: string, method: string, data?: T): Promise<U> => {
  const options: RequestOptions = {
    method: method,
    headers: {},
    body: null,
  };

  if (method !== HTTP_REQUEST.METHODS.GET && method !== HTTP_REQUEST.METHODS.DELETE) {
    if (data instanceof FormData) {
      options.body = data;
    } else {
      options.body = JSON.stringify(data);
      options.headers['Content-Type'] = HTTP_REQUEST.CONTENT_TYPE.APPLICATION_JSON;
    }
  }

  const response = await fetch(url, options);

  if (response.ok) {
    const responseData = await response.json();
    return responseData as U;
  } else {
    const errorMessage = HTTP_REQUEST.ERROR_MESSAGES[response.status] || 'An unexpected error occurred';
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
};
