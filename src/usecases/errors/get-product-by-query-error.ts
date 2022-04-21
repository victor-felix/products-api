class GetProductByQueryError extends Error {
  constructor(error: Error) {
    super('Get product by query error.');
    this.name = 'GetProductByQueryError';
    this.stack = error.stack;
  }
}

export default GetProductByQueryError;
