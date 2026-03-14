// src/store/utils/createAsyncAction.js - Helper for async operations
export const createAsyncAction = (set, actionName) => async (asyncFn, ...args) => {
  const loadingKey = `isLoading${actionName}`;
  const errorKey = `error${actionName}`;

  set({ [loadingKey]: true, [errorKey]: null });

  try {
    const result = await asyncFn(...args);
    set({ [loadingKey]: false });
    return result;
  } catch (error) {
    set({ [loadingKey]: false, [errorKey]: error });
    throw error;
  }
};