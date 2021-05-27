"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var uuid_1 = require("uuid");
var cors_1 = __importDefault(require("cors"));
var app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cors_1.default());
app.get('/', function (request, response) {
    return response.send('OK');
});
var users = [];
var User = /** @class */ (function () {
    function User(name, cpf, email, age) {
        this.transactions = [];
        this.id = uuid_1.v4();
        this.name = name;
        this.cpf = cpf;
        this.email = email;
        this.age = age;
    }
    return User;
}());
var Transaction = /** @class */ (function () {
    function Transaction(title, value, type) {
        this.id = uuid_1.v4();
        this.title = title;
        this.value = value;
        this.type = type;
    }
    return Transaction;
}());
// POST para criar um usuario
app.post("/users", function (request, response) {
    var _a = request.body, name = _a.name, cpf = _a.cpf, email = _a.email, age = _a.age;
    var user = new User(name, cpf, email, age);
    var problems = [];
    // Validar se veio o nome no Corpo
    if (!name.trim()) {
        problems.push("Nome deve ser preenchido");
    }
    // Validar se veio o nome maioe de 3 caracteres
    if (name.trim().length < 3) {
        problems.push("Nome deve conter ao menos 3 caracteres");
    }
    // Validar se veio o CPF no Corpo
    if (!cpf) {
        problems.push("CPF deve ser preenchido");
    }
    // Validar se CPF existente
    var exist = users.find(function (f) {
        return f.cpf === cpf;
    });
    if (exist) {
        problems.push("CPF " + cpf + " j\u00E1 cadastrado");
    }
    if (problems.length > 0) {
        return response.status(400).json({ msg: problems });
    }
    users.push(user);
    return response.status(200).json(user);
});
// GET para retornar um usuario por id
app.get("/users/:id", function (request, response) {
    var id = request.params.id;
    var ids = users.find(function (f) {
        return f.id === id;
    });
    if (!ids) {
        return response.status(404).json({
            msg: "Usuário não encontrado"
        });
    }
    return response.status(200).json(ids);
});
// GET para retornar lista de usuarios
app.get("/users", function (request, response) {
    //buscar e devolver os growdevers cadastrados
    return response.status(200).json(users);
});
// Atualizar um usuario por id
app.put("/users/:id", function (request, response) {
    var id = request.params.id;
    var _a = request.body, name = _a.name, cpf = _a.cpf, email = _a.email, age = _a.age;
    // encontrar o registro que queremos alterar
    var user = users.find(function (f) {
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
app.delete("/users/:id", function (request, response) {
    var id = request.params.id;
    var index = users.findIndex(function (f) {
        return f.id === id;
    });
    if (index === -1) {
        return response.status(404).json({
            msg: "Usuário não encontrado",
        });
    }
    var user = users.splice(index, 1);
    return response.status(200).json(user);
});
// POST para criar uma transação
app.post("/user/:userId/transactions", function (request, response) {
    var userId = request.params.userId;
    var _a = request.body, title = _a.title, value = _a.value, type = _a.type;
    var transaction = new Transaction(title, value, type);
    // encontrar o registro por id
    var user = users.find(function (f) {
        return f.id === userId;
    });
    if (!user) {
        return response.status(404).json({
            msg: "Usuário não encontrado",
        });
    }
    var problems = [];
    // Validar se veio o título no Corpo
    if (!title.trim()) {
        problems.push("título deve ser preenchido");
    }
    // Validar se veio o título maior de 3 caracteres
    if (title.trim().length < 3) {
        problems.push("título deve conter ao menos 3 caracteres");
    }
    // Validar se veio o título no Corpo
    if (!value) {
        problems.push("valor deve ser preenchido");
    }
    if (type !== "income") {
        if (type !== "outcome") {
            problems.push("Pode apenas dois tipos Income and Outcome");
        }
    }
    if (problems.length > 0) {
        return response.status(400).json({ msg: problems });
    }
    user.transactions.push(transaction);
    return response.status(200).json(transaction);
});
// GET para retornar uma transação por id do usuario e da transação
app.get("/user/:userId/transactions/:id", function (request, response) {
    var _a = request.params, userId = _a.userId, id = _a.id;
    var user = users.find(function (f) {
        return f.id === userId;
    });
    if (!user) {
        return response.status(404).json({
            msg: "Usuário não encontrado"
        });
    }
    var ids = user.transactions.find(function (fi) {
        return fi.id === id;
    });
    if (!ids) {
        return response.status(404).json({
            msg: "Transação não encontrada"
        });
    }
    return response.status(200).json(ids);
});
// GET para retornar as transação de um id de usuario
app.get("/user/:userId/transactions", function (request, response) {
    var userId = request.params.userId;
    var user = users.find(function (f) {
        return f.id === userId;
    });
    if (!user) {
        return response.status(404).json({
            msg: "Usuário não encontrado"
        });
    }
    var total = 0;
    var totalIncome = 0;
    var totalOutcome = 0;
    user.transactions.forEach(function (_a) {
        var value = _a.value, type = _a.type;
        switch (type) {
            case 'income':
                totalIncome += value;
                break;
            case 'outcome':
                totalOutcome += value;
                break;
        }
        total = totalIncome - totalOutcome;
    });
    return response.status(200).json({
        user: user,
        balance: {
            income: totalIncome,
            outcome: totalOutcome,
            total: total,
        }
    });
});
// Atualizar um transação por id
app.put("/users/:userId/transactions/:id", function (request, response) {
    var _a = request.params, userId = _a.userId, id = _a.id;
    var _b = request.body, title = _b.title, value = _b.value, type = _b.type;
    var user = users.find(function (f) {
        return f.id === userId;
    });
    if (!user) {
        return response.status(404).json({
            msg: "Usuário não encontrado"
        });
    }
    var ids = user.transactions.find(function (fi) {
        return fi.id === id;
    });
    if (type !== "income") {
        if (type !== "outcome") {
            return response.status(404).json({
                msg: "Pode apenas dois tipos Income and Outcome",
            });
        }
    }
    if (!ids) {
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
app.delete("/users/:userId/transactions/:id", function (request, response) {
    var _a = request.params, userId = _a.userId, id = _a.id;
    var user = users.find(function (f) {
        return f.id === userId;
    });
    if (!user) {
        return response.status(404).json({
            msg: "Usuário não encontrado"
        });
    }
    var index = user.transactions.find(function (fi) {
        return fi.id === id;
    });
    if (index === -1) {
        return response.status(404).json({
            msg: "Usuário não encontrado",
        });
    }
    var user1 = user.transactions.splice(index, 1);
    return response.status(200).json(user1);
});
app.listen(8080, function () { return console.log("Servidor iniciado"); });
