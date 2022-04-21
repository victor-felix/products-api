class GetTagByPathError extends Error {
  constructor(error: Error) {
    super('Get tag by path error.');
    this.name = 'GetTagByPathError';
    this.stack = error.stack;
  }
}

export default GetTagByPathError;
