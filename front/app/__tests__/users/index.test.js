import '@testing-library/jest-dom'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { enableFetchMocks } from 'jest-fetch-mock'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { SWRConfig } from 'swr'
import Users from '../../pages/users/index'
import { DUMMY_DATA_INDEX } from './dummyData'

enableFetchMocks()

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { message: ['initialMessage'], status: 'initialStatus' },
  }),
}))

const handlers = [
  rest.get(process.env.NEXT_PUBLIC_API_ENDPOINT_USERS, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(DUMMY_DATA_INDEX))
  }),
]

const server = setupServer(...handlers)
beforeAll(() => {
  server.listen()
})
afterEach(() => {
  server.resetHandlers()
  cleanup()
})
afterAll(() => {
  server.close()
})

describe('Users', () => {
  test('ユーザー一覧が正常に表示される', async () => {
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <Users />
      </SWRConfig>,
    )

    await waitFor(() => {
      // ユーザー覧が正常に表示されていることを確認
      // 1件目〜5件目
      expect(screen.getByRole('link', { name: 'user_name_test1' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'user_name_test2' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'user_name_test3' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'user_name_test4' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'user_name_test5' })).toBeInTheDocument()
    })
  })
})
