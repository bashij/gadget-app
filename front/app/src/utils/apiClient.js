import axios from 'axios'

const apiClient = axios.create({})

// 共通のエラーハンドリングを設定
apiClient.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    if (error.response) {
      let errorMessage = ''
      switch (error.response.status) {
        case 400:
          errorMessage = 'リクエストが無効です。'
          break
        case 401:
          errorMessage = '認証に失敗しました。'
          break
        case 403:
          errorMessage = 'アクセスが拒否されました。'
          break
        case 404:
          errorMessage = 'リソースが見つかりません。'
          break
        case 500:
          errorMessage = 'サーバーエラーが発生しました。時間をおいて再度お試しください。'
          break
        default:
          errorMessage = 'エラーが発生しました。時間をおいて再度お試しください。'
          break
      }
      // レスポンスがある場合、ステータスコードに応じたエラーメッセージを設定
      error.response.errorMessage = errorMessage
    } else if (error.request) {
      // リクエストが送信されなかった場合のエラーメッセージを設定
      error.request.errorMessage =
        'サーバーに接続できませんでした。ネットワークを確認してください。'
    } else {
      // その他のエラーの場合のエラーメッセージを設定
      error.errorMessage = 'エラーが発生しました。時間をおいて再度お試しください。'
    }
    return Promise.reject(error)
  },
)

export default apiClient
