import { Request, Response, Router } from "express";
import { DI } from "../server";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  return res.json({ message: "sample from auth" });
});

// TODO: create actual register endpoint

// router.post("/register", async (req: Request, res: Response) => {
//   if (!req.body.username || !req.body.email || !req.body.password) {
//     res.status(400);
//     return res.json({ message: "One of `name, email, password` is missing" });
//   }

//   try {
//     const user = DI.userRepository.create(req.body);
//     await DI.userRepository.persist(user).flush();

//     res.json(user);
//   } catch (e: any) {
//     return res.status(400).json({ message: e.message });
//   }
// });

export const AuthController = router;
