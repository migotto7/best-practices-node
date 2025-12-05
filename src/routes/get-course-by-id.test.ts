import { test, expect } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { makeCourse } from '../tests/factories/make-course.ts'
import { makeAuthenticatedUser } from '../tests/factories/make-user.ts'

test('get course by id', async () => {
    await server.ready()

    const { token } = await makeAuthenticatedUser('student')
    const course = await makeCourse()

    const response = await request(server.server)
        .get(`/courses/${course.id}`)
        .set('Authorization', token)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
        course: {
            id: expect.any(String),
            title: expect.any(String),
            description: null,
        }
    })
})

test('return 404 for non existing courses', async () => {
    await server.ready()

    const { token } = await makeAuthenticatedUser('student')

    const response = await request(server.server)
        .get(`/courses/0fb4af0a-7aaf-4cf2-a4ae-75af1401e5ea`)
        .set('Authorization', token)

    expect(response.status).toEqual(404)
})