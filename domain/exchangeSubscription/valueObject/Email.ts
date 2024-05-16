export
class Email {
  public readonly value: string;

  public static create(props: string): Email {
    if (!props) {
      throw new Error('Email cannot be empty');
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(props)) {
      throw new Error('Invalid email');
    }
    return new Email(props);
  }

  constructor(value: string) {
    this.value = value;
  }


  toPrimitive() {
    return this.value;
  }
}
