import express from "express";

function validarCpf(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const { cpf }: { cpf: string } = req.body;

  if (!cpf) {
    return res.status(400).json({
      msg: "CPF deve ser informado",
    });
  }

  if (cpf.trim().length !== 11) {
    return res.status(400).json({
      msg: "CPF inválido",
    });
  }

  next();
}

export default validarCpf;