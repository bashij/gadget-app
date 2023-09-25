import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { useRouter } from 'next/router'
import Login from '../pages/login'

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { message: ['initialMessage'], status: 'initialStatus' },
  }),
}))

const handlers = [
  rest.post(process.env.NEXT_PUBLIC_API_ENDPOINT_LOGIN, (req, res, ctx) => {
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

describe('Login', () => {
  test('ログインが成功する', async () => {
    render(<Login />)

    // テスト中に入力する値
    const emailValue = 'test@example.com'
    const passwordValue = 'password'

    // input要素を取得
    const emailInputElement = screen.getByLabelText('メールアドレス')
    const passwordInputElement = screen.getByLabelText('パスワード')

    // ユーザーの入力
    await userEvent.type(emailInputElement, emailValue)
    await userEvent.type(passwordInputElement, passwordValue)

    // 値が追加されているか確認
    const displayedValue1 = await screen.findByDisplayValue(emailValue)
    expect(displayedValue1).toBeInTheDocument()
    const displayedValue2 = await screen.findByDisplayValue(passwordValue)
    expect(displayedValue2).toBeInTheDocument()

    // フォームの登録のボタンを押下する動作
    await userEvent.click(screen.getByText('ログイン'))

    // ボタン押下時の router.push が動作しているかテスト
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalled()
      expect(useRouter().push).toHaveBeenCalledWith(
        { pathname: '/gadgets', query: { message: ['successMessage'], status: 'success' } },
        '/gadgets',
      )
    })
  })
})
