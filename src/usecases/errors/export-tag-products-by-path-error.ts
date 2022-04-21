class ExportTagProductsByPathError extends Error {
  constructor(error: Error) {
    super('Export tag products by path error');
    this.name = 'ExportTagProductsByPathError';
    this.stack = error.stack;
  }
}

export default ExportTagProductsByPathError;
