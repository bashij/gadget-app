import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { useRouter } from 'next/router'
import New from '../../pages/gadgets/new'
import { DUMMY_DATA_USER } from '../gadgets/dummyData'

const props = DUMMY_DATA_USER

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { message: ['initialMessage'], status: 'initialStatus' },
  }),
}))

// MarkdownEditorコンポーネントをモック化
jest.mock('@/components/markdownEditor', () => {
  return function MockedMarkdownEditor(props) {
    return (
      <div>
        <label htmlFor='review'>レビュー</label>
        <input type='text' id='review' />
      </div>
    )
  }
})

const handlers = [
  rest.post(process.env.NEXT_PUBLIC_API_ENDPOINT_GADGETS, (req, res, ctx) => {
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
  test('ガジェット新規登録が成功する', async () => {
    render(<New {...props} />)

    // テスト中に入力する値
    const nameValue = 'gadget_name_test1'
    const categoryValue = 'PC本体'
    const modelNumberValue = 'model_number_test1'
    const manufacturerValue = 'manufacturer_test1'
    const priceValue = '11111'
    const otherInfoValue = 'other_info_test1'
    const reviewValue = 'gadget_review_test1'
    // ダミーの画像ファイルを作成
    const dummyImageData = new Uint8Array([0x89, 0x50, 0x4e, 0x47])
    const dummyImageFile = new File([dummyImageData], 'dummy-image.png', { type: 'image/png' })

    // input要素を取得
    const nameInputElement = screen.getByLabelText('ガジェット名')
    const categoryInputElement = screen.getByLabelText('カテゴリ')
    const modelNumberInputElement = screen.getByLabelText('型番')
    const manufacturerInputElement = screen.getByLabelText('メーカー')
    const priceInputElement = screen.getByLabelText('価格')
    const otherInfoInputElement = screen.getByLabelText('その他スペック')
    const imageInputElement = screen.getByLabelText('ガジェット画像')
    const reviewInputElement = screen.getByLabelText('レビュー')

    // // ユーザーの入力
    await userEvent.type(nameInputElement, nameValue)
    await userEvent.selectOptions(categoryInputElement, [categoryValue])
    await userEvent.type(modelNumberInputElement, modelNumberValue)
    await userEvent.type(manufacturerInputElement, manufacturerValue)
    await userEvent.type(priceInputElement, priceValue)
    await userEvent.type(otherInfoInputElement, otherInfoValue)
    await userEvent.upload(imageInputElement, dummyImageFile)
    await userEvent.type(reviewInputElement, reviewValue)

    // 値が追加されているか確認
    const displayedValue1 = await screen.findByDisplayValue(nameValue)
    expect(displayedValue1).toBeInTheDocument()
    const displayedValue2 = await screen.findByDisplayValue(categoryValue)
    expect(displayedValue2).toBeInTheDocument()
    const displayedValue3 = await screen.findByDisplayValue(modelNumberValue)
    expect(displayedValue3).toBeInTheDocument()
    const displayedValue4 = await screen.findByDisplayValue(manufacturerValue)
    expect(displayedValue4).toBeInTheDocument()
    const displayedValue5 = await screen.findByDisplayValue(priceValue)
    expect(displayedValue5).toBeInTheDocument()
    const displayedValue6 = await screen.findByDisplayValue(otherInfoValue)
    expect(displayedValue6).toBeInTheDocument()
    expect(imageInputElement.files[0]).toBe(dummyImageFile)
    const displayedValue7 = await screen.findByDisplayValue(reviewValue)
    expect(displayedValue7).toBeInTheDocument()

    // フォームの登録のボタンを押下する動作
    await userEvent.click(screen.getByText('登録する'))

    // ボタン押下時の router.push が動作しているかテスト
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalled()
      expect(useRouter().push).toHaveBeenCalledWith(
        { pathname: '/gadgets/1', query: { message: ['successMessage'], status: 'success' } },
        '/gadgets/1',
      )
    })
  })
})
