# Jobword
## Installation
Create .env file
```
cp .env.example .env
```
Install dependencies
```
npm install
```
Migrate database
```
npx prisma db push
```
Seed data
```
npx prisma db seed
```
Start
```
npm run dev
```