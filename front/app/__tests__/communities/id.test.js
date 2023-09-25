import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { enableFetchMocks } from 'jest-fetch-mock'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { useRouter } from 'next/router'
import Community from '../../pages/communities/[id]'
import { DUMMY_DATA_COMPONENT, DUMMY_DATA_MEMBERSHIPS } from '../communities/dummyData'

const props = DUMMY_DATA_COMPONENT

window.confirm = jest.fn(() => true)

enableFetchMocks()

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { message: ['initialMessage'], status: 'initialStatus' },
  }),
}))

const handlers = [
  rest.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_COMMUNITIES}/${props.community?.id}/memberships`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(DUMMY_DATA_MEMBERSHIPS))
    },
  ),
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
  rest.delete(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_COMMUNITIES}/${props.community.id}`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          status: 'success',
          message: ['successMessage'],
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
  test('コミュニティ詳細が正常に表示される', async () => {
    render(<Community {...props} />)

    // propsとして渡した値が表示されていることを確認
    // ヘッダー
    expect(screen.getByText('コミュニティ名')).toBeInTheDocument()
    expect(screen.getByText('参加人数')).toBeInTheDocument()
    expect(screen.getByText('作成者')).toBeInTheDocument()
    expect(screen.getByText('作成日時')).toBeInTheDocument()
    // コンテンツ
    expect(screen.getByText('community_name_test1')).toBeInTheDocument()
    expect(screen.getByText('3 人')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'user_name_test1' })).toBeInTheDocument()
    expect(screen.getByText('2022/12/31 16:00')).toBeInTheDocument()

    await waitFor(() => {
      // 参加中のユーザー
      expect(screen.getByText('参加中のユーザー')).toBeInTheDocument()
      expect(screen.getAllByRole('link', { name: 'user_name_test1' })[1]).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'user_name_test2' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'user_name_test3' })).toBeInTheDocument()
    })
  })

  test('参加ボタンをクリックすると人数が1増加する', async () => {
    render(<Community {...props} />)

    // 初期数値を確認
    expect(screen.getByText('3 人')).toBeInTheDocument()

    // 参加ボタンをクリック
    await userEvent.click(screen.getByText('参加'))

    await waitFor(() => {
      // 増加後の人数を確認
      expect(screen.getByText('4 人')).toBeInTheDocument()
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
    expect(screen.getByText('3 人')).toBeInTheDocument()

    // 脱退ボタンをクリック
    await userEvent.click(screen.getByText('脱退'))

    await waitFor(() => {
      // 減少後の人数を確認
      expect(screen.getByText('2 人')).toBeInTheDocument()
    })
  })

  test('コミュニティを削除する', async () => {
    // 対象コミュニティを作成したユーザーとしてログイン
    const updatedProps = {
      ...props,
      user: {
        ...props.user,
        id: 1,
      },
    }
    render(<Community {...updatedProps} />)

    // 削除ボタンをクリック
    await userEvent.click(screen.getByText('コミュニティを削除'))

    // ボタン押下時の router.push が動作しているかテスト
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalled()
      expect(useRouter().push).toHaveBeenCalledWith(
        {
          pathname: '/communities',
          query: { message: ['successMessage'], status: 'success' },
        },
        '/communities/',
      )
    })
  })
})
