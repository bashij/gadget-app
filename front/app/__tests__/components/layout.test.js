import Layout from '@/components/common/layout'
import '@testing-library/jest-dom'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { enableFetchMocks } from 'jest-fetch-mock'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { useRouter } from 'next/router'

// ログインユーザー情報
const props = {
  user: {
    id: 1,
    name: 'user_name_test1',
    email: 'email_test1@gmail.com',
    image: { url: 'default.jpg' },
  },
}

window.confirm = jest.fn(() => true)

enableFetchMocks()

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { message: ['initialMessage'], status: 'initialStatus' },
  }),
}))

const handlers = [
  rest.delete(process.env.NEXT_PUBLIC_API_ENDPOINT_LOGOUT, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 'justLoggedOut',
        message: ['successMessage'],
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
  cleanup()
})
afterAll(() => {
  server.close()
})

describe('Layout', () => {
  test('サイドメニューが正常に表示される（非ログイン時）', async () => {
    render(
      <Layout>
        <div>
          <p>ページコンポーネント</p>
        </div>
      </Layout>,
    )

    // サイドメニュー
    expect(screen.getByRole('link', { name: 'GadgetLink' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'HOME' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'GADGET' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'TWEET' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'COMMUNITY' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'USERS' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'LOGIN' })).toBeInTheDocument()

    // ページコンポーネント
    expect(screen.getByText('ページコンポーネント')).toBeInTheDocument()
  })

  test('サイドメニューが正常に表示される（ログイン時）', async () => {
    render(
      <Layout {...props}>
        <div>
          <p>ページコンポーネント</p>
        </div>
      </Layout>,
    )

    // サイドメニュー
    expect(screen.getByRole('link', { name: 'GadgetLink' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'HOME' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'GADGET' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'TWEET' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'COMMUNITY' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'USERS' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'LOGIN' })).not.toBeInTheDocument() //非表示を確認

    // ログインユーザー情報
    expect(screen.getByRole('link', { name: 'user_name_test1' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'MYPAGE' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'SETTING' })).toBeInTheDocument()
    expect(screen.getByText('LOGOUT')).toBeInTheDocument()

    // ページコンポーネント
    expect(screen.getByText('ページコンポーネント')).toBeInTheDocument()
  })

  test('ログアウトする', async () => {
    render(
      <Layout {...props}>
        <div>
          <p>ページコンポーネント</p>
        </div>
      </Layout>,
    )

    // ログアウトをクリック
    await userEvent.click(screen.getByText('LOGOUT'))

    // ボタン押下時の router.push が動作しているかテスト
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalled()
      expect(useRouter().push).toHaveBeenCalledWith(
        {
          pathname: '/',
          query: { message: ['successMessage'], status: 'justLoggedOut' },
        },
        '/',
      )
    })
  })
})
