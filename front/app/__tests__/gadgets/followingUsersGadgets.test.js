import '@testing-library/jest-dom'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { enableFetchMocks } from 'jest-fetch-mock'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { SWRConfig } from 'swr'
import FollowingUsersGadgets from '../../pages/gadgets/followingUsersGadgets'
import { DUMMY_DATA_INDEX, DUMMY_DATA_USER } from './dummyData'

const props = DUMMY_DATA_USER

enableFetchMocks()

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { message: ['initialMessage'], status: 'initialStatus' },
  }),
}))

const handlers = [
  rest.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_USERS}/${props.user.id}/following_users_gadgets`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(DUMMY_DATA_INDEX))
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

describe('FollowingUsersGadgets', () => {
  test('ガジェット一覧が正常に表示される', async () => {
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <FollowingUsersGadgets {...props} />
      </SWRConfig>,
    )

    await waitFor(() => {
      // タブの表示を確認
      const link1 = screen.getByRole('link', { name: '全てのユーザーを表示' })
      const link2 = screen.getByRole('link', { name: 'フォロー中のみ表示' })
      expect(link1).toBeInTheDocument()
      expect(link2).toBeInTheDocument()

      // ガジェット一覧が正常に表示されていることを確認 ヘッダー
      const contentHeader1 = screen.getAllByText('ガジェット名')
      const contentHeader2 = screen.getAllByText('カテゴリ')
      const contentHeader3 = screen.getAllByText('型番')
      const contentHeader4 = screen.getAllByText('メーカー')
      const contentHeader5 = screen.getAllByText('価格')
      const contentHeader6 = screen.getAllByText('その他情報')
      const contentHeader7 = screen.getAllByText('投稿者')
      const contentHeader8 = screen.getAllByText('最終更新')
      expect(contentHeader1).toHaveLength(5)
      expect(contentHeader2).toHaveLength(5)
      expect(contentHeader3).toHaveLength(5)
      expect(contentHeader4).toHaveLength(5)
      expect(contentHeader5).toHaveLength(5)
      expect(contentHeader6).toHaveLength(5)
      expect(contentHeader7).toHaveLength(5)
      expect(contentHeader8).toHaveLength(5)
    })

    // ガジェット一覧が正常に表示されていることを確認 コンテンツ
    // 最初のガジェット
    expect(screen.getByText('gadget_name_test1')).toBeInTheDocument()
    expect(screen.getByText('オーディオ')).toBeInTheDocument()
    expect(screen.getByText('model_number_test1')).toBeInTheDocument()
    expect(screen.getByText('manufacturer_test1')).toBeInTheDocument()
    expect(screen.getByText('¥11,111')).toBeInTheDocument()
    expect(screen.getByText('other_info_test1')).toBeInTheDocument()
    expect(screen.getByText('user_name_test1')).toBeInTheDocument()
    expect(screen.getByText('2023/01/31 16:00')).toBeInTheDocument()

    //最後のガジェット
    expect(screen.getByText('gadget_name_test5')).toBeInTheDocument()
    expect(screen.getByText('モニター')).toBeInTheDocument()
    expect(screen.getByText('model_number_test5')).toBeInTheDocument()
    expect(screen.getByText('manufacturer_test5')).toBeInTheDocument()
    expect(screen.getByText('¥55,555')).toBeInTheDocument()
    expect(screen.getByText('other_info_test5')).toBeInTheDocument()
    expect(screen.getByText('user_name_test4')).toBeInTheDocument()
    expect(screen.getByText('2023/02/28 16:00')).toBeInTheDocument()
  })
})
