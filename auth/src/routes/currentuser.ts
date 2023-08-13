import express from "express";
import jwt from "jsonwebtoken";
import { currentUser, requireAuth } from "@akorg/common";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
	res.send({ currentUser: req.currentUser ?? false  });
});

export { router as currentUserRouter };