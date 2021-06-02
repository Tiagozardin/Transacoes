import express from "express";

function validarNome(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const { name }: { name: string } = req.body;

  if (!name) {
    return res.status(400).json({
      msg: "Nome deve ser informado",
    });
  }

  if (name.trim().length < 3) {
    return res.status(400).json({
      msg: "O nome deve conter ao menos 3 caracteres",
    });
  }

  next();
}

export default validarNome;