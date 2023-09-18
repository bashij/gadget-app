import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { enableFetchMocks } from 'jest-fetch-mock'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import Community from '../../components/community'
import { DUMMY_DATA_COMPONENT } from '../communities/dummyData'

const props = DUMMY_DATA_COMPONENT

enableFetchMocks()

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { message: ['initialMessage'], status: 'initialStatus' },
  }),
}))

const handlers = [
  rest.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_COMMUNITIES}/${props.community.id}/memberships`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          status: 'success',
          count: 4,
          jointed: true,
        }),
      )
    },
  ),
  rest.delete(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_COMMUNITIES}/${props.community.id}/memberships`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          status: 'success',
          count: 2,
          jointed: false,
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

describe('Community', () => {
  test('コミュニティコンポーネントが正常に表示される', async () => {
    render(<Community {...props} />)

    // propsとして渡した値がコミュニティコンポーネントとして表示されていることを確認
    const communityName = screen.getByRole('link', { name: 'community_name_test1' })
    const communityMembers = screen.getByText('( 3 人 )')
    expect(communityName).toBeInTheDocument()
    expect(communityMembers).toBeInTheDocument()
  })

  test('参加ボタンをクリックすると人数が1増加する', async () => {
    render(<Community {...props} />)

    // 初期数値を確認
    expect(screen.getByText('( 3 人 )')).toBeInTheDocument()

    // 参加ボタンをクリック
    await userEvent.click(screen.getByText('参加'))

    await waitFor(() => {
      // 増加後の人数を確認
      expect(screen.getByText('( 4 人 )')).toBeInTheDocument()
    })
  })

  test('脱退ボタンをクリックすると人数が1減少する', async () => {
    // 対象コミュニティに参加済みのユーザーとしてログイン
    const updatedProps = {
      ...props,
      user: {
        ...props.user,
        id: 1,
      },
    }
    render(<Community {...updatedProps} />)

    // 初期数値を確認
    expect(screen.getByText('( 3 人 )')).toBeInTheDocument()

    // 脱退ボタンをクリック
    await userEvent.click(screen.getByText('脱退'))

    await waitFor(() => {
      // 減少後の人数を確認
      expect(screen.getByText('( 2 人 )')).toBeInTheDocument()
    })
  })
})
