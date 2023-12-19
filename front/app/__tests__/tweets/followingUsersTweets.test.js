import FollowingUsersTweets from '@/pages/tweets/followingUsersTweets'
import '@testing-library/jest-dom'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { ja } from 'date-fns/locale'
import { enableFetchMocks } from 'jest-fetch-mock'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { SWRConfig } from 'swr'
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
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_USERS}/${props.user.id}/following_users_tweets`,
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

describe('FollowingUsersTweets', () => {
  test('ツイート一覧が正常に表示される', async () => {
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <FollowingUsersTweets {...props} />
      </SWRConfig>,
    )

    await waitFor(() => {
      // タブの表示を確認
      const link1 = screen.getByRole('link', { name: '全てのユーザーを表示' })
      const link2 = screen.getByRole('link', { name: 'フォロー中のみ表示' })
      expect(link1).toBeInTheDocument()
      expect(link2).toBeInTheDocument()

      // ツイート入力欄が表示されていることを確認
      const textBox = screen.getByPlaceholderText('新しいツイート')
      expect(textBox).toBeInTheDocument()

      // リプライ入力欄が表示されていることを確認
      const textBoxes = screen.getAllByPlaceholderText('返信内容を入力')
      expect(textBoxes).toHaveLength(5)

      // 投稿するボタンが表示されていることを確認
      const inputs = screen.getAllByRole('button', { name: '投稿する' })
      expect(inputs).toHaveLength(6)

      // ツイート一覧が正常に表示されていることを確認
      // 1件目
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
      // 1件目のリプライ
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

      // 2件目
      const userName2 = screen.getByRole('link', { name: 'user_name_test2' })
      const tweetContent2 = screen.getByText('tweet_content_test2')
      const tweetDate2 = screen.getByText(
        formatDistanceToNow(new Date('2023/1/31 16:00'), {
          addSuffix: true,
          locale: ja,
        }),
      )
      const tweetReply2 = screen.getByText('2件のリプライ')
      expect(userName2).toBeInTheDocument()
      expect(tweetContent2).toBeInTheDocument()
      expect(tweetDate2).toBeInTheDocument()
      expect(tweetReply2).toBeInTheDocument()

      // 3件目
      const userName3 = screen.getByRole('link', { name: 'user_name_test3' })
      const tweetContent3 = screen.getByText('tweet_content_test3')
      const tweetDate3 = screen.getByText(
        formatDistanceToNow(new Date('2023/02/28 16:00'), {
          addSuffix: true,
          locale: ja,
        }),
      )
      const tweetReply3 = screen.getByText('3件のリプライ')
      expect(userName3).toBeInTheDocument()
      expect(tweetContent3).toBeInTheDocument()
      expect(tweetDate3).toBeInTheDocument()
      expect(tweetReply3).toBeInTheDocument()

      // 4件目
      const userName4 = screen.getByRole('link', { name: 'user_name_test4' })
      const tweetContent4 = screen.getByText('tweet_content_test4')
      const tweetDate4 = screen.getByText(
        formatDistanceToNow(new Date('2023/03/31 16:00'), {
          addSuffix: true,
          locale: ja,
        }),
      )
      const tweetReply4 = screen.getByText('4件のリプライ')
      expect(userName4).toBeInTheDocument()
      expect(tweetContent4).toBeInTheDocument()
      expect(tweetDate4).toBeInTheDocument()
      expect(tweetReply4).toBeInTheDocument()

      // 5件目
      const userName5 = screen.getByRole('link', { name: 'user_name_test5' })
      const tweetContent5 = screen.getByText('tweet_content_test5')
      const tweetDate5 = screen.getByText(
        formatDistanceToNow(new Date('2023/04/30 16:00'), {
          addSuffix: true,
          locale: ja,
        }),
      )
      const tweetReply5 = screen.getByText('5件のリプライ')
      expect(userName5).toBeInTheDocument()
      expect(tweetContent5).toBeInTheDocument()
      expect(tweetDate5).toBeInTheDocument()
      expect(tweetReply5).toBeInTheDocument()
    })
  })
})
