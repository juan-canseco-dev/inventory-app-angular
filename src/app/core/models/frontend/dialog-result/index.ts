export interface DialogResult<T> {
    status: 'success' | 'error' | 'close' | undefined;
    message : string | undefined;
    result: T | undefined;
};