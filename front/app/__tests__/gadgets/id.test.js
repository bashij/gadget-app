import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { ja } from 'date-fns/locale'
import { enableFetchMocks } from 'jest-fetch-mock'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { useRouter } from 'next/router'
import Gadget from '../../pages/gadgets/[id]'
import { DUMMY_DATA_COMMENTS, DUMMY_DATA_COMPONENT } from '../gadgets/dummyData'

const props = DUMMY_DATA_COMPONENT

// 削除関連
// 削除する対象のコメントID
const firstCommentId = DUMMY_DATA_COMMENTS.comments[0].id
// 削除する対象のリプライID
const firstReplyId = DUMMY_DATA_COMMENTS.replies[0].id
// 削除アイコンクリック時に表示されるダイアログをOKとする
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
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_GADGETS}/${props.gadget.id}/comments`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(DUMMY_DATA_COMMENTS))
    },
  ),
  rest.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_GADGETS}/${props.gadget.id}/comments`,
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
  rest.delete(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_GADGETS}/${props.gadget.id}/comments/${firstCommentId}`,
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
  rest.delete(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_GADGETS}/${props.gadget.id}/comments/${firstReplyId}`,
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
  rest.delete(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_GADGETS}/${props.gadget.id}`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          status: 'success',
          message: ['successMessage'],
          isPageDeleted: true,
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

describe('Gadget', () => {
  test('ガジェット詳細が正常に表示される', async () => {
    // ガジェットのレビューが存在する状態とする
    const updatedProps = {
      ...props,
      gadget: {
        ...props.gadget,
        review: {
          body: 'gadget_review_test1',
        },
      },
    }
    render(<Gadget {...updatedProps} />)

    // propsとして渡した値が表示されていることを確認
    // ヘッダー
    expect(screen.getByText('ガジェット名')).toBeInTheDocument()
    expect(screen.getByText('カテゴリ')).toBeInTheDocument()
    expect(screen.getByText('型番')).toBeInTheDocument()
    expect(screen.getByText('メーカー')).toBeInTheDocument()
    expect(screen.getByText('価格')).toBeInTheDocument()
    expect(screen.getByText('その他情報')).toBeInTheDocument()
    expect(screen.getByText('投稿者')).toBeInTheDocument()
    expect(screen.getByText('最終更新')).toBeInTheDocument()
    // コンテンツ
    expect(screen.getByText('gadget_name_test1')).toBeInTheDocument()
    expect(screen.getByText('オーディオ')).toBeInTheDocument()
    expect(screen.getByText('model_number_test1')).toBeInTheDocument()
    expect(screen.getByText('manufacturer_test1')).toBeInTheDocument()
    expect(screen.getByText('¥11,111')).toBeInTheDocument()
    expect(screen.getByText('other_info_test1')).toBeInTheDocument()
    expect(screen.getByText('user_name_test1')).toBeInTheDocument()
    expect(screen.getByText('2023/01/31 16:00')).toBeInTheDocument()

    // 各アイコンの数値を確認
    expect(screen.getByTestId(`gadget_like_count_${props.gadget.id}`).textContent).toBe('1')
    expect(screen.getByTestId(`gadget_bookmark_count_${props.gadget.id}`).textContent).toBe('2')
    expect(screen.getByTestId(`review_request_count_${props.gadget.id}`).textContent).toBe('3')

    await waitFor(() => {
      // レビュー
      expect(screen.getByText('レビュー')).toBeInTheDocument()
      expect(screen.getByText('gadget_review_test1')).toBeInTheDocument()

      // コメント
      expect(screen.getByText('コメント')).toBeInTheDocument()

      // コメント入力欄が表示されていることを確認
      const textBox = screen.getByPlaceholderText('新しいコメント')
      expect(textBox).toBeInTheDocument()

      // リプライ入力欄が表示されていることを確認
      const textBoxes = screen.getAllByPlaceholderText('返信内容を入力')
      expect(textBoxes).toHaveLength(5)

      // 投稿するボタンが表示されていることを確認
      const inputs = screen.getAllByRole('button', { name: '投稿する' })
      expect(inputs).toHaveLength(6)

      // コメント一覧が正常に表示されていることを確認
      // 1件目
      const userName1 = screen.getByRole('link', { name: 'user_name_test2' })
      const commentContent1 = screen.getByText('comment_content_test2')
      const commentDate1 = screen.getByText(
        formatDistanceToNow(new Date('2022/12/31 16:00'), {
          addSuffix: true,
          locale: ja,
        }),
      )
      const commentReply1 = screen.getByText('1件のリプライ')
      expect(userName1).toBeInTheDocument()
      expect(commentContent1).toBeInTheDocument()
      expect(commentDate1).toBeInTheDocument()
      expect(commentReply1).toBeInTheDocument()
      // 1件目のリプライ
      const userName6 = screen.getByRole('link', { name: 'user_name_test8' })
      const commentContent6 = screen.getByText('comment_content_test6_reply')
      const commentDate6 = screen.getByText(
        formatDistanceToNow(new Date('2023/05/31 16:00'), {
          addSuffix: true,
          locale: ja,
        }),
      )
      expect(userName6).toBeInTheDocument()
      expect(commentContent6).toBeInTheDocument()
      expect(commentDate6).toBeInTheDocument()

      // 2件目
      const userName2 = screen.getByRole('link', { name: 'user_name_test3' })
      const commentContent2 = screen.getByText('comment_content_test3')
      const commentDate2 = screen.getByText(
        formatDistanceToNow(new Date('2023/1/31 16:00'), {
          addSuffix: true,
          locale: ja,
        }),
      )
      const commentReply2 = screen.getByText('2件のリプライ')
      expect(userName2).toBeInTheDocument()
      expect(commentContent2).toBeInTheDocument()
      expect(commentDate2).toBeInTheDocument()
      expect(commentReply2).toBeInTheDocument()

      // 3件目
      const userName3 = screen.getByRole('link', { name: 'user_name_test4' })
      const commentContent3 = screen.getByText('comment_content_test3')
      const commentDate3 = screen.getByText(
        formatDistanceToNow(new Date('2023/02/28 16:00'), {
          addSuffix: true,
          locale: ja,
        }),
      )
      const commentReply3 = screen.getByText('3件のリプライ')
      expect(userName3).toBeInTheDocument()
      expect(commentContent3).toBeInTheDocument()
      expect(commentDate3).toBeInTheDocument()
      expect(commentReply3).toBeInTheDocument()

      // 4件目
      const userName4 = screen.getByRole('link', { name: 'user_name_test6' })
      const commentContent4 = screen.getByText('comment_content_test4')
      const commentDate4 = screen.getByText(
        formatDistanceToNow(new Date('2023/03/31 16:00'), {
          addSuffix: true,
          locale: ja,
        }),
      )
      const commentReply4 = screen.getByText('4件のリプライ')
      expect(userName4).toBeInTheDocument()
      expect(commentContent4).toBeInTheDocument()
      expect(commentDate4).toBeInTheDocument()
      expect(commentReply4).toBeInTheDocument()

      // 5件目
      const userName5 = screen.getByRole('link', { name: 'user_name_test7' })
      const commentContent5 = screen.getByText('comment_content_test5')
      const commentDate5 = screen.getByText(
        formatDistanceToNow(new Date('2023/04/30 16:00'), {
          addSuffix: true,
          locale: ja,
        }),
      )
      const commentReply5 = screen.getByText('5件のリプライ')
      expect(userName5).toBeInTheDocument()
      expect(commentContent5).toBeInTheDocument()
      expect(commentDate5).toBeInTheDocument()
      expect(commentReply5).toBeInTheDocument()
    })
  })

  test('コメントを投稿する', async () => {
    render(<Gadget {...props} />)

    // コメントを入力
    const textBox = screen.getByPlaceholderText('新しいコメント')
    await userEvent.type(textBox, 'コメント投稿テスト')

    // 投稿ボタンをクリック
    await userEvent.click(screen.getAllByRole('button', { name: '投稿する' })[0])

    // ボタン押下時の成功メッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('successMessage')).toBeInTheDocument()
    })
  })

  test('リプライを投稿する', async () => {
    render(<Gadget {...props} />)

    // リプライを入力
    const textBox = screen.getAllByPlaceholderText('返信内容を入力')[0]
    await userEvent.type(textBox, 'リプライ投稿テスト')

    // 投稿ボタンをクリック
    await userEvent.click(screen.getAllByRole('button', { name: '投稿する' })[1])

    // ボタン押下時の成功メッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('successMessage')).toBeInTheDocument()
    })
  })

  test('コメントを削除する', async () => {
    // 1件目のコメントを投稿したユーザーとしてログイン
    const updatedProps = {
      ...props,
      user: {
        ...props.user,
        id: 2,
      },
    }
    render(<Gadget {...updatedProps} />)

    // 削除アイコンをクリック
    await userEvent.click(screen.getByTestId(`comment_delete_icon_${firstCommentId}`))

    // ボタン押下時の成功メッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('successMessage')).toBeInTheDocument()
    })
  })

  test('リプライを削除する', async () => {
    // 1件目のリプライを投稿したユーザーとしてログイン
    const updatedProps = {
      ...props,
      user: {
        ...props.user,
        id: 8,
      },
    }
    render(<Gadget {...updatedProps} />)

    // 削除アイコンをクリック
    await userEvent.click(screen.getByTestId(`comment_delete_icon_${firstReplyId}`))

    // ボタン押下時の成功メッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('successMessage')).toBeInTheDocument()
    })
  })

  test('ガジェットとレビューを削除する', async () => {
    // 対象ガジェットを作成したユーザーとしてログイン
    const updatedProps = {
      ...props,
      user: {
        ...props.user,
        id: 1,
      },
    }
    render(<Gadget {...updatedProps} />)

    // 削除ボタンをクリック
    await userEvent.click(screen.getByText('ガジェットとレビューを削除'))

    // ボタン押下時の router.push が動作しているかテスト
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalled()
      expect(useRouter().push).toHaveBeenCalledWith(
        {
          pathname: '/gadgets',
          query: { message: ['successMessage'], status: 'success' },
        },
        '/gadgets/',
      )
    })
  })
})
