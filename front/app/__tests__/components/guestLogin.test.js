import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { useRouter } from 'next/router'
import GuestLogin from '../../components/guestLogin'

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { message: ['initialMessage'], status: 'initialStatus' },
  }),
}))

const handlers = [
  rest.post(process.env.NEXT_PUBLIC_API_ENDPOINT_GUEST, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 'success',
        message: ['successMessage'],
      }),
    )
  }),
]

const server = setupServer(...handlers)
beforeAll(() => {
  server.listen()
})
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => {
  server.close()
})

describe('GuestLogin', () => {
  test('ゲストログインが成功する', async () => {
    render(<GuestLogin />)

    // フォームの登録のボタンを押下する動作
    await userEvent.click(screen.getByText('ゲストログイン'))

    // ボタン押下時の router.push が動作しているかテスト
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalled()
      expect(useRouter().push).toHaveBeenCalledWith(
        { pathname: '/', query: { message: ['successMessage'], status: 'success' } },
        '/',
      )
    })
  })
})
