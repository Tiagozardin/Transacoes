import express from "express";

function validarValue(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const { value }: { value: string } = req.body;

  if (!value) {
    return res.status(400).json({
      msg: "Valor deve ser informado",
    });
 
  }
  next();
};

export default validarValue;