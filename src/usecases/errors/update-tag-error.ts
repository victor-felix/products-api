class UpdateTagError extends Error {
  constructor(error: Error) {
    super('Update tag error.');
    this.name = 'UpdateTagError';
    this.stack = error.stack;
  }
}

export default UpdateTagError;
