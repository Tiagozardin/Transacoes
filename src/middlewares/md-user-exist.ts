import express from "express";
import users from "../data";

function validarExiste(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const { cpf }: { cpf: string } = req.body;

  const existe = users.find((f) => f.cpf === cpf);
  if (existe) {
    return res.status(400).json({
      msg: "CPF já cadastrado.",
    });
  }

  next();
}

export default validarExiste;