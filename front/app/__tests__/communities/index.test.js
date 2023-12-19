import Communities from '@/pages/communities/index'
import '@testing-library/jest-dom'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { enableFetchMocks } from 'jest-fetch-mock'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { SWRConfig } from 'swr'
import { DUMMY_DATA_INDEX } from './dummyData'

enableFetchMocks()

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { message: ['initialMessage'], status: 'initialStatus' },
  }),
}))

const handlers = [
  rest.get(process.env.NEXT_PUBLIC_API_ENDPOINT_COMMUNITIES, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(DUMMY_DATA_INDEX))
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

describe('Communities', () => {
  test('コミュニティ一覧が正常に表示される', async () => {
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <Communities />
      </SWRConfig>,
    )

    await waitFor(() => {
      // 参加ボタンが表示されていることを確認
      const buttons = screen.getAllByText('参加')
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
    })
  })
})
