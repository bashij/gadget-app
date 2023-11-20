import '@testing-library/jest-dom'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { enableFetchMocks } from 'jest-fetch-mock'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { SWRConfig } from 'swr'
import Followers from '../../pages/users/[id]/followers'
import { DUMMY_DATA_RELATIONSHIPS, DUMMY_DATA_USER_DETAIL } from './dummyData'

const props = DUMMY_DATA_USER_DETAIL

enableFetchMocks()

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { message: ['initialMessage'], status: 'initialStatus' },
  }),
}))

const handlers = [
  rest.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_USERS}/${props.pageUser.id}/followers`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(DUMMY_DATA_RELATIONSHIPS))
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

describe('Followers', () => {
  test('フォローされているユーザー一覧が正常に表示される', async () => {
    // ユーザーID1のフォロワー一覧を表示
    const updatedProps = {
      ...props,
      pageUserId: 1,
    }
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <Followers {...updatedProps} />
      </SWRConfig>,
    )

    expect(screen.getByText('フォロワー')).toBeInTheDocument()

    await waitFor(() => {
      // ユーザー覧が正常に表示されていることを確認
      // 1件目〜5件目
      expect(screen.getByRole('link', { name: 'user_name_test2' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'user_name_test3' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'user_name_test4' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'user_name_test5' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'user_name_test6' })).toBeInTheDocument()
    })
  })

  test('検索関連情報が正常に表示される', async () => {
    // ユーザーID1のフォロワー一覧を表示
    const updatedProps = {
      ...props,
      pageUserId: 1,
    }
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <Followers {...updatedProps} />
      </SWRConfig>,
    )

    await waitFor(() => {
      // 検索アイコンの表示を確認
      expect(screen.getByText('ユーザー検索')).toBeInTheDocument()
      expect(screen.getByText('検索条件をクリア')).toBeInTheDocument()
      // 検索結果の件数が正常に表示されていることを確認
      expect(screen.getByText('該当件数 5件')).toBeInTheDocument()
    })
  })
})
