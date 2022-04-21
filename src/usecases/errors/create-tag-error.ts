class CreateTagError extends Error {
  constructor(error: Error) {
    super('Create tag error.');
    this.name = 'CreateTagError';
    this.stack = error.stack;
  }
}

export default CreateTagError;
