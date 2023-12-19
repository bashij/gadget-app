import Home from '@/pages/index'
import '@testing-library/jest-dom'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { enableFetchMocks } from 'jest-fetch-mock'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { DUMMY_DATA_INDEX as GADGETS_DUMMY_DATA_INDEX } from './gadgets/dummyData'
import { DUMMY_DATA_INDEX_RECOMMEND as USERS_DUMMY_DATA_INDEX } from './users/dummyData'

// ログインユーザー情報
const props = {
  user: {
    id: 2,
    name: 'user_name_test2',
    email: 'email_test2@gmail.com',
    image: { url: 'default.jpg' },
  },
}

enableFetchMocks()

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { message: ['initialMessage'], status: 'initialStatus' },
  }),
}))

const handlers = [
  rest.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_USERS}/${props.user.id}/recommended_gadgets`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(GADGETS_DUMMY_DATA_INDEX))
    },
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_USERS}/${props.user.id}/recommended_users`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(USERS_DUMMY_DATA_INDEX))
    },
  ),
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

describe('Home', () => {
  test('ヘッダーが表示されている', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', { name: 'GadgetLink' })

    expect(heading).toBeInTheDocument()
  })

  test('各ボタンが適切なタグで表示されている', () => {
    render(<Home />)

    const link1 = screen.getByRole('link', { name: 'ログイン' })
    const link2 = screen.getByRole('link', { name: '新規登録' })
    expect(link1).toBeInTheDocument()
    expect(link2).toBeInTheDocument()

    const button1 = screen.getByRole('button', { name: 'ゲストログイン' })
    expect(button1).toBeInTheDocument()
  })

  test('おすすめガジェットとおすすめユーザーの一覧が正常に表示される（ログイン時）', async () => {
    render(<Home {...props} />)

    // ヘッダーとリンクの表示を確認
    expect(screen.getByText('あなたにおすすめのガジェット')).toBeInTheDocument()
    expect(screen.getByText('あなたにおすすめのユーザー')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'すべてのガジェットを見る' })).toHaveLength(2)

    // 検索アイコンの表示を確認
    expect(screen.getByText('ガジェット検索')).toBeInTheDocument()
    expect(screen.getByText('ユーザー検索')).toBeInTheDocument()
    expect(screen.getAllByText('検索条件をクリア')).toHaveLength(2)

    await waitFor(() => {
      // 検索結果の件数が正常に表示されていることを確認
      expect(screen.getAllByText('該当件数 5件')).toHaveLength(2)

      // ガジェット一覧が正常に表示されていることを確認 ヘッダー
      expect(screen.getAllByText('ガジェット名')).toHaveLength(6)
      expect(screen.getAllByText('カテゴリ')).toHaveLength(6)
      expect(screen.getAllByText('型番')).toHaveLength(6)
      expect(screen.getAllByText('メーカー')).toHaveLength(6)
      expect(screen.getAllByText('価格')).toHaveLength(6)
      expect(screen.getAllByText('その他スペック')).toHaveLength(6)
      expect(screen.getAllByText('投稿者')).toHaveLength(5)
      expect(screen.getAllByText('最終更新')).toHaveLength(5)

      // ガジェット一覧が正常に表示されていることを確認 コンテンツ
      // 最初のガジェット
      expect(screen.getByText('gadget_name_test1')).toBeInTheDocument()
      expect(screen.getAllByText('オーディオ')).toHaveLength(2) // 検索フォームの選択肢を含めて2箇所
      expect(screen.getByText('model_number_test1')).toBeInTheDocument()
      expect(screen.getByText('manufacturer_test1')).toBeInTheDocument()
      expect(screen.getByText('¥11,111')).toBeInTheDocument()
      expect(screen.getByText('other_info_test1')).toBeInTheDocument()
      expect(screen.getByText('user_name_test1')).toBeInTheDocument()
      expect(screen.getByText('2023/01/31 16:00')).toBeInTheDocument()
      //最後のガジェット
      expect(screen.getByText('gadget_name_test5')).toBeInTheDocument()
      expect(screen.getAllByText('モニター')).toHaveLength(2) // 検索フォームの選択肢を含めて2箇所
      expect(screen.getByText('model_number_test5')).toBeInTheDocument()
      expect(screen.getByText('manufacturer_test5')).toBeInTheDocument()
      expect(screen.getByText('¥55,555')).toBeInTheDocument()
      expect(screen.getByText('other_info_test5')).toBeInTheDocument()
      expect(screen.getByText('user_name_test4')).toBeInTheDocument()
      expect(screen.getByText('2023/02/28 16:00')).toBeInTheDocument()

      // ユーザー一覧が正常に表示されていることを確認
      expect(screen.getByText('recommended_user_name_test1')).toBeInTheDocument()
      expect(screen.getByText('recommended_user_name_test2')).toBeInTheDocument()
      expect(screen.getByText('recommended_user_name_test3')).toBeInTheDocument()
      expect(screen.getByText('recommended_user_name_test4')).toBeInTheDocument()
      expect(screen.getByText('recommended_user_name_test5')).toBeInTheDocument()
    })
  })
})
