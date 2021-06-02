import { v4 as uuidv4 } from 'uuid';

class User {
    public id: string;
    public name: string;
    public cpf: string;
    public email: string;
    public age: number;
    public transactions: any = [];

    constructor(name: string, cpf: string, email: string, age: number ) {
      this.id = uuidv4();
      this.name= name;
      this.cpf = cpf;
      this.email = email;
      this.age = age; 
    }
};

export default User;