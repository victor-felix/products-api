class CreateProductError extends Error {
  constructor(error: Error) {
    super('Create product error.');
    this.name = 'CreateProductError';
    this.stack = error.stack;
  }
}

export default CreateProductError;
