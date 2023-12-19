import New from '@/pages/communities/new'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { useRouter } from 'next/router'
import { DUMMY_DATA_USER } from '../communities/dummyData'

const props = DUMMY_DATA_USER

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { message: ['initialMessage'], status: 'initialStatus' },
  }),
}))

const handlers = [
  rest.post(process.env.NEXT_PUBLIC_API_ENDPOINT_COMMUNITIES, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 'success',
        message: ['successMessage'],
        id: 1,
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

describe('New', () => {
  test('コミュニティ新規登録が成功する', async () => {
    render(<New {...props} />)

    // 登録するコミュニティ名
    const nameValue = 'community_name_test1'
    // 登録する画像（ダミーの画像ファイルを作成）
    const dummyImageData = new Uint8Array([0x89, 0x50, 0x4e, 0x47])
    const dummyImageFile = new File([dummyImageData], 'dummy-image.png', { type: 'image/png' })

    // input要素を取得
    const nameInputElement = screen.getByLabelText('コミュニティ名')
    const imageInputElement = screen.getByLabelText('コミュニティ画像')

    // それぞれの値を入力
    await userEvent.type(nameInputElement, nameValue)
    await userEvent.upload(imageInputElement, dummyImageFile)

    // 値が追加されているか確認
    const displayedValue = await screen.findByDisplayValue(nameValue)
    expect(displayedValue).toBeInTheDocument()
    expect(imageInputElement.files[0]).toBe(dummyImageFile)

    // フォームの登録のボタンを押下
    await userEvent.click(screen.getByText('登録する'))

    // ボタン押下時の router.push が動作しているかテスト
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalled()
      expect(useRouter().push).toHaveBeenCalledWith(
        { pathname: '/communities/1', query: { message: ['successMessage'], status: 'success' } },
        '/communities/1',
      )
    })
  })
})
