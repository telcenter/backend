# telcenter backend

- [telcenter backend](#telcenter-backend)
  - [Setup](#setup)
  - [How to Run](#how-to-run)
    - [Development](#development)
    - [Production](#production)
  - [API Documentation](#api-documentation)
  - [Usage](#usage)
    - [For Admins (Quản trị viên)](#for-admins-quản-trị-viên)
    - [For User Accounts (Người dùng thuê bao)](#for-user-accounts-người-dùng-thuê-bao)
  - [License](#license)

## Setup

Install dependencies:

```sh
cd $PROJECT_ROOT
npm i
```

## How to Run

### Development

Run the development server:

```sh
npm run dev
```

### Production

Build for production:

```sh
npm run build
```

Then, run production code:

```sh
npm run start
```

## API Documentation

is available at `${BACKEND_URL}/docs`.

For example if you are running on port 8000 at localhost:

<http://localhost:8000/docs>

## Usage

### For Admins (Quản trị viên)

Suppose that `${BACKEND_URL}` is <http://localhost:8000>.

1. Register a new admin user at <http://localhost:8000/admin/register> using secret key (mã bí mật) `admin`.

2. Login with that new admin user.
3. ??

### For User Accounts (Người dùng thuê bao)

## License

Copyright (C) 2025 Vu Tung Lam et. al.
Licensed under the terms of the [3-clause BSD license](./LICENSE.txt)
