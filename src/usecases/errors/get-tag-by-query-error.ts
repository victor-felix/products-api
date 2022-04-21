class GetTagByQueryError extends Error {
  constructor(error: Error) {
    super('Get tag by query error.');
    this.name = 'GetTagByQueryError';
    this.stack = error.stack;
  }
}

export default GetTagByQueryError;
