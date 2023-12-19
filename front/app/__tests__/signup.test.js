import Signup from '@/pages/signup'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { useRouter } from 'next/router'

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { message: ['initialMessage'], status: 'initialStatus' },
  }),
}))

const handlers = [
  rest.post(process.env.NEXT_PUBLIC_API_ENDPOINT_USERS, (req, res, ctx) => {
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

describe('Signup', () => {
  test('ユーザー新規登録が成功する', async () => {
    render(<Signup />)

    // テスト中に入力する値
    const nameValue = 'test'
    const emailValue = 'test@example.com'
    const jobValue = 'IT系'
    const passwordValue = 'password'
    // ダミーの画像ファイルを作成
    const dummyImageData = new Uint8Array([0x89, 0x50, 0x4e, 0x47])
    const dummyImageFile = new File([dummyImageData], 'dummy-image.png', { type: 'image/png' })

    // input要素を取得
    const nameInputElement = screen.getByLabelText('ユーザー名')
    const emailInputElement = screen.getByLabelText('メールアドレス')
    const jobInputElement = screen.getByLabelText('職業')
    const imageInputElement = screen.getByLabelText('ユーザー画像')
    const passwordInputElement = screen.getByLabelText('パスワード')
    const passwordConfirmationInputElement = screen.getByLabelText('パスワード（確認）')

    // ユーザーの入力
    await userEvent.type(nameInputElement, nameValue)
    await userEvent.type(emailInputElement, emailValue)
    await userEvent.selectOptions(jobInputElement, [jobValue])
    await userEvent.upload(imageInputElement, dummyImageFile)
    await userEvent.type(passwordInputElement, passwordValue)
    await userEvent.type(passwordConfirmationInputElement, passwordValue)

    // 値が追加されているか確認
    const displayedValue1 = await screen.findByDisplayValue(nameValue)
    expect(displayedValue1).toBeInTheDocument()
    const displayedValue2 = await screen.findByDisplayValue(emailValue)
    expect(displayedValue2).toBeInTheDocument()
    const displayedValue3 = await screen.findByDisplayValue(jobValue)
    expect(displayedValue3).toBeInTheDocument()
    expect(imageInputElement.files[0]).toBe(dummyImageFile)
    const displayedValue4 = await screen.getAllByDisplayValue(passwordValue)
    displayedValue4.forEach((element) => {
      expect(element).toBeInTheDocument()
    })

    // フォームの登録のボタンを押下する動作
    await userEvent.click(screen.getByText('登録する'))

    // ボタン押下時の router.push が動作しているかテスト
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalled()
      expect(useRouter().push).toHaveBeenCalledWith(
        { pathname: '/', query: { message: ['successMessage'], status: 'success' } },
        '/',
      )
    })
  })

  test('ゲストログインボタンが適切なタグで表示されている', () => {
    render(<Signup />)

    const button1 = screen.getByRole('button', { name: 'ゲストログイン' })
    expect(button1).toBeInTheDocument()
  })
})
