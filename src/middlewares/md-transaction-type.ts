import express from "express";

function validarType(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const { type }: { type: string } = req.body;

  if (type !== "income") {
    if (type !== "outcome") {
        return res.status(400).json({
            msg: "Tipo deve ser Income ou Outcome"
        });
    }
  };

  next();
};

export default validarType;