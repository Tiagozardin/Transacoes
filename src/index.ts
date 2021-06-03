import express, {json, Request, Response} from 'express';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import UserInterface from './interfaces/userInterface';
import User from './classes/user';
import validarNome from './middlewares/md-user-name';
import validarCpf from './middlewares/md-user-cpf';
import users from "./data"
import validarExiste from './middlewares/md-user-exist';
import validarEmail from './middlewares/md-user-email';
import Transaction from './classes/transactions';
import validarAge from './middlewares/md-user-age';
import transactionInterface from './interfaces/transactionInterface';
import validarTitle from './middlewares/md-transaction-title';
import validarValue from './middlewares/md-transaction-value';
import validarType from './middlewares/md-transaction-type';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

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
app.post("/users", validarNome, validarCpf, validarExiste, validarEmail, validarAge, (request: Request, response: Response) => {
  const { name, cpf, email, age }: UserInterface = request.body;

  const user = new User (name, cpf, email, age,);
 
  users.push(user);

  return response.status(201).json({
    success: true,
    data: user,
  });
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
 
  return response.status(200).json({
    success: true,
    data: ids});
});

// GET para retornar lista de usuarios
app.get("/users", (request: Request, response: Response) => {

  //buscar e devolver os growdevers cadastrados
  return response.status(200).json({
    success: true,
    data: users});
});

// Atualizar um usuario por id
app.put("/users/:id", validarNome, validarCpf, validarEmail, validarAge, (request: Request, response: Response) => {
  const { id }: { id?: string } = request.params;
  const { name, cpf, email, age } : UserInterface = request.body;

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

  return response.status(200).json({
    success: true,
    data: user,});
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

  return response.status(200).json({
    success: true});
});



// POST para criar uma transação
app.post("/user/:userId/transactions", validarTitle, validarValue, validarType, (request: Request, response: Response) => {
  const { userId }: { userId?: string } = request.params;
  const { title, value, type }: transactionInterface = request.body;

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




app.listen(process.env.PORT ||8080);