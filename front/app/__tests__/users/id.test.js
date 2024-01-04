import User from '@/pages/users/[id]'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { ja } from 'date-fns/locale'
import { enableFetchMocks } from 'jest-fetch-mock'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import {
  DUMMY_DATA_USER_BOOKMARK_GADGETS,
  DUMMY_DATA_USER_BOOKMARK_TWEETS,
  DUMMY_DATA_USER_COMMUNITIES,
  DUMMY_DATA_USER_DETAIL,
  DUMMY_DATA_USER_GADGETS,
  DUMMY_DATA_USER_TWEETS,
} from '../users/dummyData'

const props = DUMMY_DATA_USER_DETAIL
const otherUserId = 5 // ログインユーザーとは別のユーザーのIDとして使用

enableFetchMocks()

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { message: ['initialMessage'], status: 'initialStatus' },
  }),
}))

const handlers = [
  // ユーザー詳細ページのユーザーがログインユーザーの場合に使用
  rest.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_USERS}/${props.pageUser.id}/user_gadgets`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(DUMMY_DATA_USER_GADGETS))
    },
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_USERS}/${props.pageUser.id}/user_communities`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(DUMMY_DATA_USER_COMMUNITIES))
    },
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_USERS}/${props.pageUser.id}/user_tweets`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(DUMMY_DATA_USER_TWEETS))
    },
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_USERS}/${props.pageUser.id}/user_bookmark_tweets`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(DUMMY_DATA_USER_BOOKMARK_TWEETS))
    },
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_USERS}/${props.pageUser.id}/user_bookmark_gadgets`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(DUMMY_DATA_USER_BOOKMARK_GADGETS))
    },
  ),
  // ユーザー詳細ページのユーザーがログインユーザー以外の場合に使用
  rest.post(process.env.NEXT_PUBLIC_API_ENDPOINT_RELATIONSHIPS, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 'success',
        message: ['successMessage'],
        count: 4,
        jointed: true,
      }),
    )
  }),
  rest.delete(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_RELATIONSHIPS}/${otherUserId}`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          status: 'success',
          message: ['successMessage'],
          count: 2,
          jointed: false,
        }),
      )
    },
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_USERS}/${otherUserId}/user_gadgets`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(DUMMY_DATA_USER_GADGETS))
    },
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_USERS}/${otherUserId}/user_communities`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(DUMMY_DATA_USER_COMMUNITIES))
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

describe('User', () => {
  test('ユーザー詳細が正常に表示される（初期表示）', async () => {
    render(<User {...props} />)

    // propsとして渡した値が表示されていることを確認
    expect(screen.getAllByText('user_name_test1')).toHaveLength(2)
    expect(screen.getByText('IT系')).toBeInTheDocument()
    expect(screen.getByText('introduction_test1')).toBeInTheDocument()
    expect(screen.getByText('2フォロー中')).toBeInTheDocument()
    expect(screen.getByText('3フォロワー')).toBeInTheDocument()

    await waitFor(() => {
      // 登録ガジェット
      expect(
        screen.getByText(`登録ガジェット(${props.pageUser.gadgets.length})`),
      ).toBeInTheDocument()

      // ガジェット一覧が正常に表示されていることを確認 ヘッダー
      expect(screen.getAllByText('ガジェット名')).toHaveLength(5)
      expect(screen.getAllByText('カテゴリ')).toHaveLength(5)
      expect(screen.getAllByText('型番')).toHaveLength(5)
      expect(screen.getAllByText('メーカー')).toHaveLength(5)
      expect(screen.getAllByText('価格')).toHaveLength(5)
      expect(screen.getAllByText('その他スペック')).toHaveLength(5)
      expect(screen.getAllByText('投稿者')).toHaveLength(5)
      expect(screen.getAllByText('最終更新')).toHaveLength(5)

      // ガジェット一覧が正常に表示されていることを確認 コンテンツ
      // 最初のガジェット
      expect(screen.getByText('gadget_name_test1')).toBeInTheDocument()
      expect(screen.getByText('オーディオ')).toBeInTheDocument()
      expect(screen.getByText('model_number_test1')).toBeInTheDocument()
      expect(screen.getByText('manufacturer_test1')).toBeInTheDocument()
      expect(screen.getByText('¥11,111')).toBeInTheDocument()
      expect(screen.getByText('other_info_test1')).toBeInTheDocument()
      expect(screen.getByText('2023/01/31 16:00')).toBeInTheDocument()
      //最後のガジェット
      expect(screen.getByText('gadget_name_test5')).toBeInTheDocument()
      expect(screen.getByText('モニター')).toBeInTheDocument()
      expect(screen.getByText('model_number_test5')).toBeInTheDocument()
      expect(screen.getByText('manufacturer_test5')).toBeInTheDocument()
      expect(screen.getByText('¥55,555')).toBeInTheDocument()
      expect(screen.getByText('other_info_test5')).toBeInTheDocument()
      expect(screen.getByText('2023/02/28 16:00')).toBeInTheDocument()

      // 投稿者（サイドメニュー,ページトップアイコン,登録ガジェット投稿者で合計7箇所）
      expect(screen.getAllByText('user_name_test1')).toHaveLength(7)

      // ガジェット新規登録ページへのリンクボタン
      expect(screen.getByRole('link', { name: '新しいガジェットを登録する' })).toBeInTheDocument()

      // 各タブと件数
      expect(screen.getByText(`コミュニティ(${props.userCount.community})`)).toBeInTheDocument()
      expect(screen.getByText(`ツイート(${props.userCount.tweet})`)).toBeInTheDocument()
      expect(screen.getByText(`ツイート(${props.userCount.bookmarkTweet})`)).toBeInTheDocument()
      expect(screen.getByText(`ガジェット(${props.userCount.bookmarkGadget})`)).toBeInTheDocument()

      // 参加中のコミュニティ一覧
      // 脱退ボタンが表示されていることを確認
      const buttons = screen.getAllByText('脱退')
      expect(buttons).toHaveLength(10)

      // コミュニティ一覧が正常に表示されていることを確認
      // 1件目〜10件目
      expect(screen.getByRole('link', { name: 'community_name_test1' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'community_name_test2' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'community_name_test3' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'community_name_test4' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'community_name_test5' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'community_name_test6' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'community_name_test7' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'community_name_test8' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'community_name_test9' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'community_name_test10' })).toBeInTheDocument()

      // コミュニティ新規登録ページへのリンクボタン
      expect(screen.getByRole('link', { name: '新しいコミュニティを登録する' })).toBeInTheDocument()
    })
  })

  test('ユーザー詳細が正常に表示される（ツイートタブ選択時）', async () => {
    render(<User {...props} />)

    await userEvent.click(screen.getByText(`ツイート(${props.userCount.tweet})`))

    await waitFor(() => {
      // リプライ入力欄が表示されていることを確認
      const textBoxes = screen.getAllByPlaceholderText('返信内容を入力')
      expect(textBoxes).toHaveLength(5)

      // 投稿するボタンが表示されていることを確認
      const inputs = screen.getAllByRole('button', { name: '投稿する' })
      expect(inputs).toHaveLength(5)

      // ツイート一覧が正常に表示されていることを確認
      // 1件目
      const tweetContent1 = screen.getByText('tweet_content_test1')
      const tweetDate1 = screen.getByText(
        formatDistanceToNow(new Date('2022/12/31 16:00'), {
          addSuffix: true,
          locale: ja,
        }),
      )
      const tweetReply1 = screen.getByText('1件のリプライ')
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
      const tweetContent2 = screen.getByText('tweet_content_test2')
      const tweetDate2 = screen.getByText(
        formatDistanceToNow(new Date('2023/1/31 16:00'), {
          addSuffix: true,
          locale: ja,
        }),
      )
      const tweetReply2 = screen.getByText('2件のリプライ')
      expect(tweetContent2).toBeInTheDocument()
      expect(tweetDate2).toBeInTheDocument()
      expect(tweetReply2).toBeInTheDocument()

      // 3件目
      const tweetContent3 = screen.getByText('tweet_content_test3')
      const tweetDate3 = screen.getByText(
        formatDistanceToNow(new Date('2023/02/28 16:00'), {
          addSuffix: true,
          locale: ja,
        }),
      )
      const tweetReply3 = screen.getByText('3件のリプライ')
      expect(tweetContent3).toBeInTheDocument()
      expect(tweetDate3).toBeInTheDocument()
      expect(tweetReply3).toBeInTheDocument()

      // 4件目
      const tweetContent4 = screen.getByText('tweet_content_test4')
      const tweetDate4 = screen.getByText(
        formatDistanceToNow(new Date('2023/03/31 16:00'), {
          addSuffix: true,
          locale: ja,
        }),
      )
      const tweetReply4 = screen.getByText('4件のリプライ')
      expect(tweetContent4).toBeInTheDocument()
      expect(tweetDate4).toBeInTheDocument()
      expect(tweetReply4).toBeInTheDocument()

      // 5件目
      const tweetContent5 = screen.getByText('tweet_content_test5')
      const tweetDate5 = screen.getByText(
        formatDistanceToNow(new Date('2023/04/30 16:00'), {
          addSuffix: true,
          locale: ja,
        }),
      )
      const tweetReply5 = screen.getByText('5件のリプライ')
      expect(tweetContent5).toBeInTheDocument()
      expect(tweetDate5).toBeInTheDocument()
      expect(tweetReply5).toBeInTheDocument()

      // 投稿者（サイドメニュー,ページトップアイコン,登録ガジェット投稿者,ツイート投稿者で合計12箇所）
      expect(screen.getAllByText('user_name_test1')).toHaveLength(12)
    })
  })

  test('ユーザー詳細が正常に表示される（ブックマークツイートタブ選択時）', async () => {
    render(<User {...props} />)

    await userEvent.click(screen.getByText(`ツイート(${props.userCount.bookmarkTweet})`))

    await waitFor(() => {
      // リプライ入力欄が表示されていることを確認
      const textBoxes = screen.getAllByPlaceholderText('返信内容を入力')
      expect(textBoxes).toHaveLength(5)

      // 投稿するボタンが表示されていることを確認
      const inputs = screen.getAllByRole('button', { name: '投稿する' })
      expect(inputs).toHaveLength(5)

      // ツイート一覧が正常に表示されていることを確認
      // 1件目
      const tweetContent1 = screen.getByText('tweet_content_test1')
      const tweetDate1 = screen.getByText(
        formatDistanceToNow(new Date('2022/12/31 16:00'), {
          addSuffix: true,
          locale: ja,
        }),
      )
      const tweetReply1 = screen.getByText('1件のリプライ')
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

      // 投稿者（サイドメニュー,ページトップアイコン,登録ガジェット投稿者,ブックマークツイート投稿者で合計8箇所）
      expect(screen.getAllByText('user_name_test1')).toHaveLength(8)
    })
  })

  test('ユーザー詳細が正常に表示される（ブックマークガジェットタブ選択時）', async () => {
    render(<User {...props} />)

    await userEvent.click(screen.getByText(`ガジェット(${props.userCount.bookmarkGadget})`))

    await waitFor(() => {
      // ガジェット一覧が正常に表示されていることを確認 ヘッダー（登録ガジェット,ブックマークガジェットで合計10箇所）
      expect(screen.getAllByText('ガジェット名')).toHaveLength(10)
      expect(screen.getAllByText('カテゴリ')).toHaveLength(10)
      expect(screen.getAllByText('型番')).toHaveLength(10)
      expect(screen.getAllByText('メーカー')).toHaveLength(10)
      expect(screen.getAllByText('価格')).toHaveLength(10)
      expect(screen.getAllByText('その他スペック')).toHaveLength(10)
      expect(screen.getAllByText('投稿者')).toHaveLength(10)
      expect(screen.getAllByText('最終更新')).toHaveLength(10)

      // ガジェット一覧が正常に表示されていることを確認 コンテンツ
      // 最初のガジェット
      expect(screen.getByText('gadget_name_test6')).toBeInTheDocument()
      expect(screen.getByText('マウス')).toBeInTheDocument()
      expect(screen.getByText('model_number_test6')).toBeInTheDocument()
      expect(screen.getByText('manufacturer_test6')).toBeInTheDocument()
      expect(screen.getByText('¥66,666')).toBeInTheDocument()
      expect(screen.getByText('other_info_test6')).toBeInTheDocument()
      expect(screen.getByText('user_name_test6')).toBeInTheDocument()
      expect(screen.getByText('2023/01/31 17:00')).toBeInTheDocument()

      //最後のガジェット
      expect(screen.getByText('gadget_name_test10')).toBeInTheDocument()
      expect(screen.getByText('キーボード')).toBeInTheDocument()
      expect(screen.getByText('model_number_test10')).toBeInTheDocument()
      expect(screen.getByText('manufacturer_test10')).toBeInTheDocument()
      expect(screen.getByText('¥100,000')).toBeInTheDocument()
      expect(screen.getByText('other_info_test10')).toBeInTheDocument()
      expect(screen.getByText('user_name_test10')).toBeInTheDocument()
      expect(screen.getByText('2023/02/28 17:00')).toBeInTheDocument()

      // 投稿者（サイドメニュー,ページトップアイコン,登録ガジェット投稿者,ブックマークガジェット投稿者で合計7箇所）
      expect(screen.getAllByText('user_name_test1')).toHaveLength(7)

      // ガジェット新規登録ページへのリンクボタン
      expect(screen.getAllByRole('link', { name: '新しいガジェットを登録する' })).toHaveLength(2)
    })
  })

  test('ユーザー詳細が正常に表示される（ブックマークガジェットタブ選択時）', async () => {
    render(<User {...props} />)

    await userEvent.click(screen.getByText(`ガジェット(${props.userCount.bookmarkGadget})`))

    await waitFor(() => {
      // ガジェット一覧が正常に表示されていることを確認 ヘッダー（登録ガジェット,ブックマークガジェットで合計10箇所）
      expect(screen.getAllByText('ガジェット名')).toHaveLength(10)
      expect(screen.getAllByText('カテゴリ')).toHaveLength(10)
      expect(screen.getAllByText('型番')).toHaveLength(10)
      expect(screen.getAllByText('メーカー')).toHaveLength(10)
      expect(screen.getAllByText('価格')).toHaveLength(10)
      expect(screen.getAllByText('その他スペック')).toHaveLength(10)
      expect(screen.getAllByText('投稿者')).toHaveLength(10)
      expect(screen.getAllByText('最終更新')).toHaveLength(10)

      // ガジェット一覧が正常に表示されていることを確認 コンテンツ
      // 最初のガジェット
      expect(screen.getByText('gadget_name_test6')).toBeInTheDocument()
      expect(screen.getByText('マウス')).toBeInTheDocument()
      expect(screen.getByText('model_number_test6')).toBeInTheDocument()
      expect(screen.getByText('manufacturer_test6')).toBeInTheDocument()
      expect(screen.getByText('¥66,666')).toBeInTheDocument()
      expect(screen.getByText('other_info_test6')).toBeInTheDocument()
      expect(screen.getByText('user_name_test6')).toBeInTheDocument()
      expect(screen.getByText('2023/01/31 17:00')).toBeInTheDocument()

      //最後のガジェット
      expect(screen.getByText('gadget_name_test10')).toBeInTheDocument()
      expect(screen.getByText('キーボード')).toBeInTheDocument()
      expect(screen.getByText('model_number_test10')).toBeInTheDocument()
      expect(screen.getByText('manufacturer_test10')).toBeInTheDocument()
      expect(screen.getByText('¥100,000')).toBeInTheDocument()
      expect(screen.getByText('other_info_test10')).toBeInTheDocument()
      expect(screen.getByText('user_name_test10')).toBeInTheDocument()
      expect(screen.getByText('2023/02/28 17:00')).toBeInTheDocument()

      // 投稿者（サイドメニュー,ページトップアイコン,登録ガジェット投稿者,ブックマークガジェット投稿者で合計7箇所）
      expect(screen.getAllByText('user_name_test1')).toHaveLength(7)

      // ガジェット新規登録ページへのリンクボタン
      expect(screen.getAllByRole('link', { name: '新しいガジェットを登録する' })).toHaveLength(2)
    })
  })

  test('フォローするボタンをクリックするとフォロワーが1増加する', async () => {
    // ログインユーザーとは別のユーザーの詳細ページをレンダリング
    const updatedProps = {
      ...props,
      pageUser: {
        ...props.pageUser,
        id: otherUserId,
        name: 'user_name_test5',
        email: 'email_test5@gmail.com',
        job: '非IT系',
      },
    }
    render(<User {...updatedProps} />)

    // propsとして渡した値が表示されていることを確認
    expect(screen.getByText('user_name_test5')).toBeInTheDocument()
    expect(screen.getByText('非IT系')).toBeInTheDocument()
    expect(screen.getByText('2フォロー中')).toBeInTheDocument()
    expect(screen.getByText('3フォロワー')).toBeInTheDocument()

    // ボタンをクリック
    expect(screen.getByText('フォローする')).toBeInTheDocument()
    await userEvent.click(screen.getByText('フォローする'))

    await waitFor(() => {
      // フォロワー数の増加を確認
      expect(screen.getByText('4フォロワー')).toBeInTheDocument()
    })
  })

  test('フォロー解除ボタンをクリックするとフォロワーが1減少する', async () => {
    // ログインユーザーとは別のユーザーの詳細ページをレンダリング
    const updatedProps = {
      ...props,
      pageUser: {
        ...props.pageUser,
        id: otherUserId,
        name: 'user_name_test5',
        email: 'email_test5@gmail.com',
        job: '非IT系',
      },
      // 別のユーザーをフォロー中のユーザーとしてログイン
      currentUser: {
        ...props.currentUser,
        id: 2,
      },
    }
    render(<User {...updatedProps} />)

    // propsとして渡した値が表示されていることを確認
    expect(screen.getByText('user_name_test5')).toBeInTheDocument()
    expect(screen.getByText('非IT系')).toBeInTheDocument()
    expect(screen.getByText('2フォロー中')).toBeInTheDocument()
    expect(screen.getByText('3フォロワー')).toBeInTheDocument()

    // ボタンをクリック
    expect(screen.getByText('フォロー解除')).toBeInTheDocument()
    await userEvent.click(screen.getByText('フォロー解除'))

    await waitFor(() => {
      // フォロワー数の減少を確認
      expect(screen.getByText('2フォロワー')).toBeInTheDocument()
    })
  })
})
