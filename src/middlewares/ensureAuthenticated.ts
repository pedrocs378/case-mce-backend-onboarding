import { NextFunction, Request, Response } from "express";
import { verify } from 'jsonwebtoken'

import authConfig from "../config/auth";

interface ITokenPayload {
	sub: string
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction): void | Response {
	const authHeader = req.headers.authorization

	if (!authHeader) {
		return res.status(401).json({ message: 'Token está faltando' })
	}

	const [_, token] = authHeader.split(' ')

	try {
		const decoded = verify(token, authConfig.jwt.secret)

		const { sub } = decoded as ITokenPayload

		req.user = {
			id: sub
		}

		return next()
	} catch {
		return res.status(401).json({ message: 'Token inválido' })
	}
}