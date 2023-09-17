import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { ja } from 'date-fns/locale'
import { enableFetchMocks } from 'jest-fetch-mock'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import Tweet from '../../components/tweet'
import { DUMMY_DATA_COMPONENT } from '../tweets/dummyData'

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
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_TWEETS}/${props.tweet.id}/tweet_likes`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          status: 'success',
          count: 2,
          liked: true,
        }),
      )
    },
  ),
  rest.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_TWEETS}/${props.tweet.id}/tweet_bookmarks`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          status: 'success',
          count: 3,
          bookmarked: true,
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

describe('Tweet', () => {
  test('ツイートコンポーネントが正常に表示される', async () => {
    render(<Tweet {...props} />)

    // propsとして渡した値がツイートコンポーネントとして表示されていることを確認
    // ツイート
    const userName1 = screen.getByRole('link', { name: 'user_name_test1' })
    const tweetContent1 = screen.getByText('tweet_content_test1')
    const tweetDate1 = screen.getByText(
      formatDistanceToNow(new Date('2022/12/31 16:00'), {
        addSuffix: true,
        locale: ja,
      }),
    )
    const tweetReply1 = screen.getByText('1件のリプライ')
    expect(userName1).toBeInTheDocument()
    expect(tweetContent1).toBeInTheDocument()
    expect(tweetDate1).toBeInTheDocument()
    expect(tweetReply1).toBeInTheDocument()
    // リプライ
    const userName6 = screen.getByRole('link', { name: 'user_name_test6' })
    const tweetContent6 = screen.getByText('tweet_content_test6_reply')
    const tweetDate6 = screen.getByText(
      formatDistanceToNow(new Date('2023/05/31 16:00'), {
        addSuffix: true,
        locale: ja,
      }),
    )
    expect(userName6).toBeInTheDocument()
    expect(tweetContent6).toBeInTheDocument()
    expect(tweetDate6).toBeInTheDocument()

    // 各アイコンの数値を確認
    expect(screen.getByTestId(`tweet_like_count_${props.tweet.id}`).textContent).toBe('1')
    expect(screen.getByTestId(`tweet_bookmark_count_${props.tweet.id}`).textContent).toBe('2')
  })

  test('いいねアイコンをクリックすると数値が1増加する', async () => {
    render(<Tweet {...props} />)

    // 初期数値を確認
    expect(screen.getByTestId(`tweet_like_count_${props.tweet.id}`).textContent).toBe('1')

    // アイコンをクリック
    userEvent.click(screen.getByTestId(`tweet_like_icon_${props.tweet.id}`))

    await waitFor(() => {
      // 増加後の数値を確認
      expect(screen.getByTestId(`tweet_like_count_${props.tweet.id}`).textContent).toBe('2')
    })
  })

  test('ブックマークアイコンをクリックすると数値が1増加する', async () => {
    render(<Tweet {...props} />)

    // 初期数値を確認
    expect(screen.getByTestId(`tweet_bookmark_count_${props.tweet.id}`).textContent).toBe('2')

    // アイコンをクリック
    userEvent.click(screen.getByTestId(`tweet_bookmark_icon_${props.tweet.id}`))

    await waitFor(() => {
      // 増加後の数値を確認
      expect(screen.getByTestId(`tweet_bookmark_count_${props.tweet.id}`).textContent).toBe('3')
    })
  })
})
