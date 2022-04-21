class TagNotFoundError extends Error {
  constructor() {
    super('Tag not found error.');
    this.name = 'TagNotFoundError';
  }
}

export default TagNotFoundError;
