import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { useRouter } from 'next/router'
import Edit from '../../pages/communities/[id]/edit'
import { DUMMY_DATA_COMPONENT } from '../communities/dummyData'

const props = DUMMY_DATA_COMPONENT

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { message: ['initialMessage'], status: 'initialStatus' },
  }),
}))

const handlers = [
  rest.patch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_COMMUNITIES}/${props.community.id}`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          status: 'success',
          message: ['successMessage'],
          id: props.community.id,
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
  test('コミュニティ更新が成功する', async () => {
    render(<Edit {...props} />)

    // 更新前のコミュニティ名が表示されていることを確認
    const displayedValueBefore = await screen.findByDisplayValue(props.community.name)
    expect(displayedValueBefore).toBeInTheDocument()

    // 更新後のコミュニティ名
    const nameValue = `${props.community.name}_updated`
    // 登録する画像（ダミーの画像ファイルを作成）
    const dummyImageData = new Uint8Array([0x89, 0x50, 0x4e, 0x47])
    const dummyImageFile = new File([dummyImageData], 'dummy-image.png', { type: 'image/png' })

    // input要素を取得
    const nameInputElement = screen.getByLabelText('コミュニティ名')
    const imageInputElement = screen.getByLabelText('コミュニティ画像')

    // それぞれの値を入力
    await userEvent.clear(nameInputElement) // 初期値をクリア
    await userEvent.type(nameInputElement, nameValue)
    await userEvent.upload(imageInputElement, dummyImageFile)

    // 値が追加されているか確認
    const displayedValueAfter = await screen.findByDisplayValue(nameValue)
    expect(displayedValueAfter).toBeInTheDocument()
    expect(imageInputElement.files[0]).toBe(dummyImageFile)

    // フォームの変更を保存するボタンを押下
    await userEvent.click(screen.getByText('変更を保存する'))

    // ボタン押下時の router.push が動作しているかテスト
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalled()
      expect(useRouter().push).toHaveBeenCalledWith(
        {
          pathname: `/communities/${props.community.id}`,
          query: { message: ['successMessage'], status: 'success' },
        },
        `/communities/${props.community.id}`,
      )
    })
  })
})
