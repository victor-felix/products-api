class RelationshipError extends Error {
  constructor() {
    super('Relationship error.');
    this.name = 'RelationshipError';
  }
}

export default RelationshipError;
