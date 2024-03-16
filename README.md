# GadgetLink - あなたにマッチしたガジェットと出会える口コミ系 SNS サービス

[GadgetLink](https://www.gadgetlink-app.com/) （ゲストログインですぐにお試しいただけます）

# サービス概要

GadgetLink は、ガジェット好きが集まる新たなプラットフォームとして、豊かな交流と価値ある情報の双方を提供します。

ユーザーは、気に入ったアイテムやレビューを手軽に投稿し、他のユーザーとツイートやコメントを通じて気軽に交流を楽しむことができます。さらに、ガジェット好きなユーザー同士が繰り広げる活発な交流により、有益な口コミ情報が蓄積され、情報収集を目的とするユーザーにとっても、有益な情報が得られる場として役立ちます。

# 制作背景

システムエンジニアとして、業務の効率的な遂行を日々心がけており、その一環としてガジェットの活用を積極的に行っています。
ガジェット導入検討のための情報収集を行う中で気付いたのは、インターネット上には情報が溢れており、自分に合った情報の取捨選択をすることが非常に難しいということでした。

この課題に対して、

- SNS 機能：どのような立場や嗜好の人の意見なのか？を可視化し、自分に合うかどうかを判別しやすくする
- レコメンド機能：SNS 機能により蓄積された情報をもとに、取捨選択をサポートする

といった機能を提供することで解決することができると考え、GadgetLink を開発しました。

# 機能

## 概要

### ガジェットレコメンド/ユーザーレコメンド

- 気になるガジェットへのアクション（いいね/ブックマーク/コメント/レビューリクエスト）に応じて、あなたにマッチするガジェットとユーザーをレコメンドします。

![README_gadget_2](https://github.com/jibirian999/gadget-app/assets/89582121/7001dac3-353f-43e3-9962-109a964ee1dc)

### ガジェットレビュー

- 気になるガジェットはレビューをチェック。投稿者や同じ趣味のユーザーと、コメント機能で交流も。

![README_gadget_1](https://github.com/jibirian999/gadget-app/assets/89582121/5f77b52e-a713-4ea0-909c-f017087085a9)

- お気に入りのガジェットは手軽にシェア。こだわりのレビューはマークダウンで投稿。

![README_gadget_3](https://github.com/jibirian999/gadget-app/assets/89582121/abf1c1ca-c8f4-49ad-a39e-7d777dc7dd27)

### ツイート

- レビュー以外の気軽な発信はこちら。リプライ機能で他のユーザーと自由に交流。

![README_tweet_1](https://github.com/jibirian999/gadget-app/assets/89582121/57d445cf-953e-489f-9a94-1c50247d10c6)

### コミュニティ

- コミュニティへの参加で、自分の好きをアピール・同じ趣味の仲間を発見。

![README_community_1](https://github.com/jibirian999/gadget-app/assets/89582121/cbdfa689-9a03-476f-b7ca-cc3dacf832d2)

### マイページ

- 気になるユーザーは詳細ページにて、登録ガジェットから参加しているコミュニティ、ブックマークしているガジェットまでチェック。

![README_mypage_1](https://github.com/jibirian999/gadget-app/assets/89582121/918c5314-2ce7-47da-bd0e-d4fd8f4456c1)

## 一覧

### ユーザー

- ログイン/ログアウト
- ゲストログイン
- ユーザー登録/編集/削除
- マイページ（ユーザー詳細）
  - ユーザー詳細情報の表示
  - 各種一覧データ表示
    - フォロー/フォロワー
    - 登録ガジェット
    - 参加中のコミュニティ
    - ツイート
    - ブックマークしているツイート
    - ブックマークしているガジェット
- ユーザー一覧表示
- ユーザー検索/並び替え
- ユーザーレコメンド（おすすめユーザー一覧表示）
- フォロー/フォロー解除

### ガジェット

- ガジェット登録/編集/削除
- ガジェット毎のレビュー投稿
- ガジェット詳細
  - ガジェット詳細情報の表示
  - レビューの表示
  - ガジェットおよびレビューへのコメント/コメントへのリプライ
  - レビューリクエストしているユーザー一覧表示
- ガジェット一覧表示/フォロー中ユーザーのガジェットのみ表示切替
- ガジェット検索/並び替え
- ガジェットへのいいね
- ガジェットへのブックマーク
- ガジェットへのレビューリクエスト
- ガジェットレコメンド（おすすめガジェット一覧表示）

### ツイート

- ツイート投稿/削除
- ツイートへのリプライ投稿
- ツイートへのいいね
- ツイートへのブックマーク
- ツイート一覧表示/フォロー中ユーザーのツイートのみ表示切替

### コミュニティ

- コミュニティ登録/編集/削除
- コミュニティ詳細
  - コミュニティ詳細情報の表示
  - 参加中ユーザー一覧表示
- コミュニティへの参加/脱退
- コミュニティ一覧表示

# 使用技術

## フロントエンド

- HTML/CSS
- JavaScript
- React 18.2.0
- Next.js 13.1.6
- Jest 29.7.0
- React Testing Library 14.1.2
- ESLint 8.56.0
- Prettier 3.1.1

## バックエンド

- Ruby 3.0.2
- Ruby on Rails 6.1.4
- RSpec 3.11.0
- Rubocop 1.35.1
- MySQL 8.0.26

## インフラ

- Docker, Docker-Compose
- AWS(VPC, Route53 ,ALB ,ACM ,IAM ,KMS, S3, CloudFront, ECS, ECR, Fargate, RDS, CloudWatch, Systems Manager, CodeDeploy)
- Terraform
- GitHub Actions(CI/CD)

# 設計資料

## インフラ構成図

![README_インフラ構成図](https://github.com/jibirian999/gadget-app/assets/89582121/2b35e95a-8c47-45ab-8b61-30a4bb49f6a0)

## ネットワーク設計図

[Google スプレッドシート](https://docs.google.com/spreadsheets/d/1y96oFIz4EQbUeZX9CRFvJbG6yzi0EjMhevj2q_trkBI/edit?usp=sharing)に掲載

## ER 図

![README_ER図 drawio](https://github.com/jibirian999/gadget-app/assets/89582121/b8f69366-3dc9-4e95-8acb-82e3b4a85786)

## テーブル定義書

[Google スプレッドシート](https://docs.google.com/spreadsheets/d/1MmyZWSStDq4Oe3V9X8PYSuWJ4WwCRz3joWCoSA7_kHU/edit?usp=sharing)に掲載

# 工夫した点

## フロントエンド

- Next.js による完全 SPA 化
- レスポンシブ対応
- シンプルでわかりやすい UI
- マークダウン形式のガジェットレビュー投稿機能
- 常時表示のサイドメニューにより回遊性を向上
- Prettier、ESLint によりコードの一貫性と品質を維持

## バックエンド

- Rails API モード導入によるフロントエンドとの完全分離
- 協調フィルタリングによるレコメンド機能（実装に関してまとめた記事は[こちら](https://qiita.com/jibirian999/items/3485fa2a4b972955ea07) ）
- Skinny Controllers、Fat Models を意識し、ビジネスロジックはモデルに集約
- ロケールファイルを利用して、表示文言を一元管理
- チーム開発に対応できるよう設計資料を整備
- Rubocop によりコードの一貫性と品質を維持

## インフラ

- Terraform によるインフラのコード化
- Fargate によるオートスケーリング
- Github Actions を用いて CI/CD パイプラインを構築
- チーム開発に対応できるよう設計資料を整備
