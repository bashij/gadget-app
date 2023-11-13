import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '../pages/index'

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { message: ['initialMessage'], status: 'initialStatus' },
  }),
}))

describe('Home', () => {
  test('ヘッダーが表示されている', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', { name: 'GadgetLink' })

    expect(heading).toBeInTheDocument()
  })

  test('各ボタンが適切なタグで表示されている', () => {
    render(<Home />)

    const link1 = screen.getByRole('link', { name: 'ログイン' })
    const link2 = screen.getByRole('link', { name: '新規登録' })
    expect(link1).toBeInTheDocument()
    expect(link2).toBeInTheDocument()

    const button1 = screen.getByRole('button', { name: 'ゲストログイン' })
    expect(button1).toBeInTheDocument()
  })
})
