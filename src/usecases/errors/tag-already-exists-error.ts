class TagAlreadyExistsError extends Error {
  constructor() {
    super('Tag already exists error.');
    this.name = 'TagAlreadyExistsError';
  }
}

export default TagAlreadyExistsError;
