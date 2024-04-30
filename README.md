# 개요

전역 universe 인증 서버

패턴 : CQRS 패턴 이용.

인증 방식 : JWT, RSA256, OpenSSL 비대칭 키, OAuth2

주요 api : 로그인, 소셜 로그인


# PUBLIC_KEY
```bash
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqYyk2zTmKafngo9o5mUF
7wvmw6njNdo1tu0oSfC+MdSvgCv5bk8n+zjlBSQ7QAGskMWVTYpcvyrTJ98nxnWi
R9AzAX5wwapx6nHM13BSnBsu1SRLozkEyQfx2tuj1D2MX0WdJYcGWBtSZBIYmPnY
kpc1B+Le7NSPwh2kKBThC1vBlpUM3/zh0b/wYRW0P0wIKp3FCr0FsVfbHUgib2DR
vZjh8teHZne2FZfGKjqWGJXYhAH6kHCbkyuk+l3o5z73qODxXGppHoht1rNYCctc
nkIBtX2zGihl20qzEfNedQiyR2Unj2MTeCRN5xuB4kZNyCCVuPDZjbwg1ZcmNLkc
zQIDAQAB
-----END PUBLIC KEY-----
```

## Installation

```bash
$ yarn install
$ yarn
```

## Running the app

```bash
$ yarn start
```

## Database Setting

- 데이터베이스 : MariaDB
- 환경 : 로컬

## Database Init

```bash
$ yarn prisma db push
$ yarn prisma db seed (초기 데이터 삽입)
```

## API Docs

공용 response

```jsonc
{
  "code": "정의한 코드 - number",
  "result": "결과값 - 에러타입 혹은 반환값의 타입"
}
```

### 응답 코드

| Http-Status | Code | Description                     |
| ----------- | ---- | ------------------------------- |
| 200         | 1000 | 요청 성공                       |
| 200         | 1001 | 요청은 성공했지만 데이터가 없음 |

### 에러 코드

| Http-Status | Code | Description                       |
| ----------- | ---- | --------------------------------- |
| 400         | 2000 | 요청값 오류 - Bad Request         |
| 500         | 2001 | 서버 에러 - Internal Server Error |
| 401         | 3001 | 유효하지 않은 유저 정보           |
| 401         | 3002 | 비밀번호 미일치                   |
| 401         | 5000 | 토큰이 없는 경우                  |
| 401         | 5001 | 유효하지 않은 토큰                |
| 401         | 5002 | Jwt Access 토큰 만료              |
| -           | 9000 | 정의되자 않은 에러 코드           |
