class DeleteTagError extends Error {
  constructor(error: Error) {
    super('Delete tag error.');
    this.name = 'DeleteTagError';
    this.stack = error.stack;
  }
}

export default DeleteTagError;
