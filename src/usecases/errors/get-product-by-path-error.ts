class GetProductByPathError extends Error {
  constructor(error: Error) {
    super('Get product by path error.');
    this.name = 'GetProductByPathError';
    this.stack = error.stack;
  }
}

export default GetProductByPathError;
