import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { useRouter } from 'next/router'
import Edit from '../../pages/gadgets/[id]/edit'
import { DUMMY_DATA_COMPONENT } from '../gadgets/dummyData'

const props = DUMMY_DATA_COMPONENT

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
        <input type='text' id='review' defaultValue='initialValue' />
      </div>
    )
  }
})

const handlers = [
  rest.patch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_GADGETS}/${props.gadget.id}`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          status: 'success',
          message: ['successMessage'],
          id: props.gadget.id,
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
  test('ガジェット更新が成功する', async () => {
    render(<Edit {...props} />)

    // 更新前の情報が表示されていることを確認
    const displayedValue1 = await screen.findByDisplayValue(props.gadget.name)
    expect(displayedValue1).toBeInTheDocument()
    const displayedValue2 = await screen.findByDisplayValue(props.gadget.category)
    expect(displayedValue2).toBeInTheDocument()
    const displayedValue3 = await screen.findByDisplayValue(props.gadget.model_number)
    expect(displayedValue3).toBeInTheDocument()
    const displayedValue4 = await screen.findByDisplayValue(props.gadget.manufacturer)
    expect(displayedValue4).toBeInTheDocument()
    const displayedValue5 = await screen.findByDisplayValue(props.gadget.price)
    expect(displayedValue5).toBeInTheDocument()
    const displayedValue6 = await screen.findByDisplayValue(props.gadget.other_info)
    expect(displayedValue6).toBeInTheDocument()
    const displayedValue7 = await screen.findByDisplayValue('initialValue')
    expect(displayedValue7).toBeInTheDocument()

    // 更新後の情報
    const nameValue = `${props.gadget.name}_updated`
    const categoryValue = 'PC本体'
    const modelNumberValue = `${props.gadget.model_number}_updated`
    const manufacturerValue = `${props.gadget.manufacturer}_updated`
    const priceValue = '22222'
    const otherInfoValue = `${props.gadget.other_info}_updated`
    const reviewValue = 'initialValue_updated'
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

    // 初期値をクリア
    nameInputElement.value = ''
    modelNumberInputElement.value = ''
    manufacturerInputElement.value = ''
    priceInputElement.value = ''
    otherInfoInputElement.value = ''
    reviewInputElement.value = ''

    // それぞれの値を入力
    await userEvent.type(nameInputElement, nameValue)
    await userEvent.selectOptions(categoryInputElement, [categoryValue])
    await userEvent.type(modelNumberInputElement, modelNumberValue)
    await userEvent.type(manufacturerInputElement, manufacturerValue)
    await userEvent.type(priceInputElement, priceValue)
    await userEvent.type(otherInfoInputElement, otherInfoValue)
    await userEvent.upload(imageInputElement, dummyImageFile)
    await userEvent.type(reviewInputElement, reviewValue)

    // フォームの更新するボタンを押下
    await userEvent.click(screen.getByText('更新する'))

    // ボタン押下時の router.push が動作しているかテスト
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalled()
      expect(useRouter().push).toHaveBeenCalledWith(
        {
          pathname: `/gadgets/${props.gadget.id}`,
          query: { message: ['successMessage'], status: 'success' },
        },
        `/gadgets/${props.gadget.id}`,
      )
    })
  })
})
