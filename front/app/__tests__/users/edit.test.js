import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { useRouter } from 'next/router'
import Edit from '../../pages/users/[id]/edit'
import { DUMMY_DATA_USER_DETAIL } from '../users/dummyData'

const props = DUMMY_DATA_USER_DETAIL

window.confirm = jest.fn(() => true)

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { message: ['initialMessage'], status: 'initialStatus' },
  }),
}))

const handlers = [
  rest.patch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_USERS}/${props.pageUser.id}`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          status: 'success',
          message: ['successMessage'],
          id: props.pageUser.id,
        }),
      )
    },
  ),
  rest.delete(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_USERS}/${props.pageUser.id}`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          status: 'success',
          message: ['successMessage'],
          isPageDeleted: true,
        }),
      )
    },
  ),
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

describe('Edit', () => {
  test('ユーザー更新が成功する', async () => {
    render(<Edit {...props} />)

    // 更新前の情報が表示されていることを確認
    const displayedValue1 = await screen.findByDisplayValue(props.pageUser.name)
    expect(displayedValue1).toBeInTheDocument()
    const displayedValue2 = await screen.findByDisplayValue(props.pageUser.email)
    expect(displayedValue2).toBeInTheDocument()
    const displayedValue3 = await screen.findByDisplayValue(props.pageUser.job)
    expect(displayedValue3).toBeInTheDocument()

    // 更新後の情報
    const nameValue = `${props.pageUser.name}_updated`
    const emailValue = `${props.pageUser.email}updated`
    const jobValue = '学生'
    const passwordValue = 'password_updated'
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

    // 初期値をクリア
    await userEvent.clear(nameInputElement)
    await userEvent.clear(emailInputElement)

    // それぞれの値を入力
    await userEvent.type(nameInputElement, nameValue)
    await userEvent.type(emailInputElement, emailValue)
    await userEvent.selectOptions(jobInputElement, [jobValue])
    await userEvent.upload(imageInputElement, dummyImageFile)
    await userEvent.type(passwordInputElement, passwordValue)
    await userEvent.type(passwordConfirmationInputElement, passwordValue)

    // フォームの登録のボタンを押下する動作
    await userEvent.click(screen.getByText('変更を保存する'))

    // ボタン押下時の router.push が動作しているかテスト
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalled()
      expect(useRouter().push).toHaveBeenCalledWith(
        {
          pathname: `/users/${props.pageUser.id}`,
          query: { message: ['successMessage'], status: 'success' },
        },
        `/users/${props.pageUser.id}`,
      )
    })
  })

  test('ユーザーを削除する', async () => {
    render(<Edit {...props} />)

    // 退会するボタンをクリック
    await userEvent.click(screen.getByText('退会する'))

    // ボタン押下時の router.push が動作しているかテスト
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalled()
      expect(useRouter().push).toHaveBeenCalledWith(
        {
          pathname: '/',
          query: { message: ['successMessage'], status: 'success' },
        },
        '/',
      )
    })
  })
})
