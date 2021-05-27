import express, {json, Request, Response} from 'express';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())
app.get('/', (request: Request, response: Response) => {
return response.send('OK');
});

const users :any[] = [];

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
}

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

app.get("/", (req: express.Request, res: express.Response) => {
  res.send(`
  <body style='margin:0;padding:0'>
      <div style='display: flex;justify-content: center;align-items: center; align-content: center;width:99vw;height:99vh'>
        <h1 style='font-size:60px;font-weigth:600'>🚀 API - Transações</h1>
      </div>
  </body>
  `);
});

// POST para criar um usuario
app.post("/users", (request: Request, response: Response) => {
  const { name, cpf, email, age } = request.body;

  const user = new User (name, cpf, email, age,);

  const problems = [];

  // Validar se veio o nome no Corpo
  if (!name.trim()) {
    problems.push("Nome deve ser preenchido");
  }

  // Validar se veio o nome maioe de 3 caracteres
  if (name.trim().length <3){
    problems.push("Nome deve conter ao menos 3 caracteres")
  }

  // Validar se veio o CPF no Corpo
  if (!cpf) {
    problems.push("CPF deve ser preenchido");
  }

   // Validar se CPF existente
  const exist = users.find((f) => {
    return f.cpf === cpf;
  });

  if (exist) {
    problems.push(`CPF ${cpf} já cadastrado`);
  }

  if (problems.length > 0) {
    return response.status(400).json({ msg: problems });
  }
  users.push(user);

  return response.status(200).json(user);
});

// GET para retornar um usuario por id
app.get("/users/:id", (request: Request, response: Response) => {
  const { id }: { id?: string} = request.params;

  const ids = users.find((f) => {
    return f.id === id;
    });

  if(!ids){
      return response.status(404).json({
        msg: "Usuário não encontrado"
      });
  }
 
  return response.status(200).json(ids);
});

// GET para retornar lista de usuarios
app.get("/users", (request: Request, response: Response) => {

  //buscar e devolver os growdevers cadastrados
  return response.status(200).json(users);
});

// Atualizar um usuario por id
app.put("/users/:id", (request: Request, response: Response) => {
  const { id }: { id?: string } = request.params;
  const { name, cpf, email, age } = request.body;

  // encontrar o registro que queremos alterar
  const user = users.find((f) => {
    return f.id === id;
  });

  if (!user) {
    return response.status(404).json({
      msg: "Usuário não encontrado",
    });
  }

  user.name = name;
  user.cpf = cpf;
  user.email = email;
  user.age = age;

  return response.status(200).json(user);
});

// Excluir um usuario a partir de um ID
app.delete("/users/:id", (request: Request, response: Response) => {
  const { id }: { id?: string } = request.params;

  const index = users.findIndex((f) => {
    return f.id === id;
  });

  if (index === -1) {
    return response.status(404).json({
      msg: "Usuário não encontrado",
    });
  }

  const user = users.splice(index, 1);

  return response.status(200).json(user);
});



// POST para criar uma transação
app.post("/user/:userId/transactions", (request: Request, response: Response) => {
  const { userId }: { userId?: string } = request.params;
  const { title, value, type } = request.body;

  const transaction = new Transaction (title, value, type);

  // encontrar o registro por id
  const user = users.find((f) => {
    return f.id === userId;
  });

  if (!user) {
    return response.status(404).json({
      msg: "Usuário não encontrado",
    });
  }

  const problems = [];

  // Validar se veio o título no Corpo
  if (!title.trim()) {
    problems.push("título deve ser preenchido");
  }

  // Validar se veio o título maior de 3 caracteres
  if (title.trim().length <3){
    problems.push("título deve conter ao menos 3 caracteres")
  }

  // Validar se veio o título no Corpo
  if (!value) {
    problems.push("valor deve ser preenchido");
  }

  if (type !== "income") {
    if (type !== "outcome") {
          problems.push("Pode apenas dois tipos Income and Outcome")
    }
  }

  if (problems.length > 0) {
    return response.status(400).json({ msg: problems });
  }
  user.transactions.push(transaction);

  return response.status(200).json(transaction);
});

// GET para retornar uma transação por id do usuario e da transação
app.get("/user/:userId/transactions/:id", (request: Request, response: Response) => {
  const { userId, id  }: { userId?: string, id?: string} = request.params;

  const user = users.find((f) => {
    return f.id === userId;
  });

  if(!user){
      return response.status(404).json({
        msg: "Usuário não encontrado"
      });
  }
  const ids = user.transactions.find((fi: { id: string; }) => {
    return fi.id === id;
    });

  if(!ids){
      return response.status(404).json({
        msg: "Transação não encontrada"
      });
  }
 
  return response.status(200).json(ids);
});

// GET para retornar as transação de um id de usuario
app.get("/user/:userId/transactions", (request: Request, response: Response) => {
  const { userId }: { userId?: string} = request.params;

  const user = users.find((f) => {
    return f.id === userId;
  });

  if(!user){
      return response.status(404).json({
        msg: "Usuário não encontrado"
      });
  }

  let total: number = 0;
      let totalIncome: number = 0;
      let totalOutcome: number = 0;

      user.transactions.forEach(({value, type}: {value: number, type: string}) => {
        switch(type) {
          case 'income':
            totalIncome += value
          break;
          case 'outcome':
            totalOutcome += value
          break;
        }
        total = totalIncome - totalOutcome;
      });

  
 
  return response.status(200).json({
    user,
    balance:{
      income: totalIncome,
      outcome: totalOutcome,
      total: total,
    }
  });
});


// Atualizar um transação por id
app.put("/users/:userId/transactions/:id", (request: Request, response: Response) => {
  const { userId, id  }: { userId?: string, id?: string} = request.params;
  const { title, value, type}: {title: string, value: number, type: string} = request.body;

  const user = users.find((f) => {
    return f.id === userId;
  });

  if(!user){
      return response.status(404).json({
        msg: "Usuário não encontrado"
      });
  }
  const ids = user.transactions.find((fi: { id: string; }) => {
    return fi.id === id;
    });
  
  
    if (type !== "income") {
      if (type !== "outcome") {
        return response.status(404).json({
          msg: "Pode apenas dois tipos Income and Outcome",
        });
      }
    }

  if(!ids){
      return response.status(404).json({
        msg: "Transação não encontrada"
      });
  }

  ids.title = title;
  ids.value = value;
  ids.type = type;

  return response.status(200).json(user);
});

// Excluir uma transação a partir de um ID
app.delete("/users/:userId/transactions/:id", (request: Request, response: Response) => {
  const { userId, id  }: { userId?: string, id?: string} = request.params;

  const user = users.find((f) => {
    return f.id === userId;
  });

  if(!user){
      return response.status(404).json({
        msg: "Usuário não encontrado"
      });
  }
  const index = user.transactions.find((fi: { id: string; }) => {
    return fi.id === id;
    });

   

  if (index === -1) {
    return response.status(404).json({
      msg: "Usuário não encontrado",
    });
  }

  const user1 = user.transactions.splice(index, 1);

  return response.status(200).json(user1);
});




app.listen(process.env.POT ||8080);