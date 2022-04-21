class DeleteProductError extends Error {
  constructor(error: Error) {
    super('Delete product error.');
    this.name = 'DeleteProductError';
    this.stack = error.stack;
  }
}

export default DeleteProductError;
