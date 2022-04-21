class ProductNotFoundError extends Error {
  constructor() {
    super('Product not found error.');
    this.name = 'ProductNotFoundError';
  }
}

export default ProductNotFoundError;
