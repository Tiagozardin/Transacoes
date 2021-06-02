import express from "express";

function validarAge(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const { age }: { age: string } = req.body;

  if (!age) {
    return res.status(400).json({
      msg: "Idade deve ser informada",
    });
  }

  next();
}

export default validarAge;