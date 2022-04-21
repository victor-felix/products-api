class UpdateProductError extends Error {
  constructor(error: Error) {
    super('Update product error.');
    this.name = 'UpdateProductError';
    this.stack = error.stack;
  }
}

export default UpdateProductError;
