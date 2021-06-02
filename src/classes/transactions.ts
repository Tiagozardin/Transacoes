import { v4 as uuidv4 } from 'uuid';

class Transaction {
    public id: string;
    public title: string;
    public value: number;
    public type: string;

    constructor(title: string, value: number, type: string){
      this.id = uuidv4();
      this.title = title;
      this.value = value;
      this.type = type;
    }
  
}

export default Transaction