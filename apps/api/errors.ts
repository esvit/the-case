export
class BadRequestError extends Error {
  constructor(message:string) {
    super(message); // 'Error' breaks prototype chain here
    this.name = 'BadRequestError';
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}

export
class NotFoundError extends Error {
  constructor(message:string) {
    super(message); // 'Error' breaks prototype chain here
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}
