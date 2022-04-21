class ProductAlreadyExistsError extends Error {
  constructor(error: Error) {
    super('Product already exists error.');
    this.name = 'ProductAlreadyExistsError';
    this.stack = error.stack;
  }
}

export default ProductAlreadyExistsError;
