import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { enableFetchMocks } from 'jest-fetch-mock'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import Gadget from '../../components/gadget'
import { DUMMY_DATA_COMPONENT } from '../gadgets/dummyData'

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
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_GADGETS}/${props.gadget.id}/gadget_likes`,
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
  rest.delete(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_GADGETS}/${props.gadget.id}/gadget_likes`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          status: 'success',
          count: 0,
          liked: false,
        }),
      )
    },
  ),
  rest.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_GADGETS}/${props.gadget.id}/gadget_bookmarks`,
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
  rest.delete(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_GADGETS}/${props.gadget.id}/gadget_bookmarks`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          status: 'success',
          count: 1,
          bookmarked: false,
        }),
      )
    },
  ),
  rest.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_GADGETS}/${props.gadget.id}/review_requests`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          status: 'success',
          count: 4,
          requested: true,
        }),
      )
    },
  ),
  rest.delete(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_GADGETS}/${props.gadget.id}/review_requests`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          status: 'success',
          count: 2,
          requested: false,
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
  test('ガジェットコンポーネントが正常に表示される', async () => {
    render(<Gadget {...props} />)

    // propsとして渡した値がガジェットコンポーネントとして表示されていることを確認
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
  })

  test('いいねアイコンをクリックすると数値が1増加する', async () => {
    render(<Gadget {...props} />)

    // 初期数値を確認
    expect(screen.getByTestId(`gadget_like_count_${props.gadget.id}`).textContent).toBe('1')

    // アイコンをクリック
    await userEvent.click(screen.getByTestId(`gadget_like_icon_${props.gadget.id}`))

    await waitFor(() => {
      // 増加後の数値を確認
      expect(screen.getByTestId(`gadget_like_count_${props.gadget.id}`).textContent).toBe('2')
    })
  })

  test('いいねアイコンをクリックすると数値が1減少する', async () => {
    // いいね済みのユーザーとしてログイン
    const updatedProps = {
      ...props,
      user: {
        ...props.user,
        id: 2,
      },
    }
    render(<Gadget {...updatedProps} />)

    // 初期数値を確認
    expect(screen.getByTestId(`gadget_like_count_${props.gadget.id}`).textContent).toBe('1')

    // アイコンをクリック
    await userEvent.click(screen.getByTestId(`gadget_like_icon_${props.gadget.id}`))

    await waitFor(() => {
      // 減少後の数値を確認
      expect(screen.getByTestId(`gadget_like_count_${props.gadget.id}`).textContent).toBe('0')
    })
  })

  test('ブックマークアイコンをクリックすると数値が1増加する', async () => {
    render(<Gadget {...props} />)

    // 初期数値を確認
    expect(screen.getByTestId(`gadget_bookmark_count_${props.gadget.id}`).textContent).toBe('2')

    // アイコンをクリック
    await userEvent.click(screen.getByTestId(`gadget_bookmark_icon_${props.gadget.id}`))

    await waitFor(() => {
      // 増加後の数値を確認
      expect(screen.getByTestId(`gadget_bookmark_count_${props.gadget.id}`).textContent).toBe('3')
    })
  })

  test('ブックマークアイコンをクリックすると数値が1減少する', async () => {
    // ブックマーク済みのユーザーとしてログイン
    const updatedProps = {
      ...props,
      user: {
        ...props.user,
        id: 2,
      },
    }
    render(<Gadget {...updatedProps} />)

    // 初期数値を確認
    expect(screen.getByTestId(`gadget_bookmark_count_${props.gadget.id}`).textContent).toBe('2')

    // アイコンをクリック
    await userEvent.click(screen.getByTestId(`gadget_bookmark_icon_${props.gadget.id}`))

    await waitFor(() => {
      // 減少後の数値を確認
      expect(screen.getByTestId(`gadget_bookmark_count_${props.gadget.id}`).textContent).toBe('1')
    })
  })

  test('レビューリクエストをクリックすると数値が1増加する', async () => {
    render(<Gadget {...props} />)

    // 初期数値を確認
    expect(screen.getByTestId(`review_request_count_${props.gadget.id}`).textContent).toBe('3')

    // アイコンをクリック
    await userEvent.click(screen.getByTestId(`review_request_icon_${props.gadget.id}`))

    await waitFor(() => {
      // 増加後の数値を確認
      expect(screen.getByTestId(`review_request_count_${props.gadget.id}`).textContent).toBe('4')
    })
  })

  test('レビューリクエストをクリックすると数値が1減少する', async () => {
    // レビューリクエスト済みのユーザーとしてログイン
    const updatedProps = {
      ...props,
      user: {
        ...props.user,
        id: 2,
      },
    }
    render(<Gadget {...updatedProps} />)

    // 初期数値を確認
    expect(screen.getByTestId(`review_request_count_${props.gadget.id}`).textContent).toBe('3')

    // アイコンをクリック
    await userEvent.click(screen.getByTestId(`review_request_icon_${props.gadget.id}`))

    await waitFor(() => {
      // 減少後の数値を確認
      expect(screen.getByTestId(`review_request_count_${props.gadget.id}`).textContent).toBe('2')
    })
  })
})
