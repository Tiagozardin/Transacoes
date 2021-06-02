import express from "express";

function validarTitle(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const { title }: { title: string } = req.body;

  if (!title) {
    return res.status(400).json({
      msg: "Titulo deve ser informada",
    });
  }
  if (title.trim().length <3){
    return res.status(400).json({
        msg: "O titulo deve conter ao menos 3 caracteres",
      });
  }
  next();
};

export default validarTitle;