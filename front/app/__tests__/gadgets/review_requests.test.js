import RequestUsers from '@/pages/gadgets/[id]/review_requests'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { DUMMY_DATA_REQUEST_USERS } from '../gadgets/dummyData'

const props = DUMMY_DATA_REQUEST_USERS

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { message: ['initialMessage'], status: 'initialStatus' },
  }),
}))

describe('RequestUsers', () => {
  test('レビューリクエストしているユーザー一覧が正常に表示される', async () => {
    render(<RequestUsers {...props} />)

    // ユーザー覧が正常に表示されていることを確認
    expect(screen.getByText('レビューリクエストしているユーザー')).toBeInTheDocument()
    // 1件目〜10件目
    expect(screen.getByRole('link', { name: 'user_name_test1' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'user_name_test2' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'user_name_test3' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'user_name_test4' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'user_name_test5' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'user_name_test6' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'user_name_test7' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'user_name_test8' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'user_name_test9' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'user_name_test10' })).toBeInTheDocument()
  })
})
