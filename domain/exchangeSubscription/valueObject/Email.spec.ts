import {Email} from "./Email";

describe('Email', () => {
  test('should be defined', () => {
    expect(() => Email.create(<any>null)).toThrow('Email cannot be empty');
    expect(() => Email.create(<any>undefined)).toThrow('Email cannot be empty');
  });
  test('should be valid', () => {
    expect(Email.create('test@test.com').toPrimitive()).toEqual('test@test.com');
    expect(() => Email.create('test.com')).toThrow('Invalid email');
  });
});
