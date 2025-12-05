import type { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

type jwtPayload = {
    sub: string,
    role: 'student' | 'manager'
}

export async function checkRequestJwt(request: FastifyRequest, reply: FastifyReply) {
    const token = request.headers.authorization

    if (!token) {
        return reply.status(401).send()
    }

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET must be set.')
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET) as jwtPayload

        request.user = payload
    } catch {
        return reply.status(401).send()
    }

}