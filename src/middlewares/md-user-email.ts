import express from "express";

function validarEmail(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const { email }: { email: string } = req.body;

  if (!email) {
    return res.status(400).json({
      msg: "Email deve ser informado",
    });
  }

  next();
}

export default validarEmail;