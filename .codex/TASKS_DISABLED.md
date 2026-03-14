# TASKS.md — Build Plan

Follow these tasks sequentially.

## Task 1 — Project Setup
- Create Next.js 14 project using App Router
- Configure TypeScript
- Install and configure Tailwind CSS
- Ensure project runs with `npm run dev`
- Ensure project builds with `npm run build`

## Task 2 — Supabase Integration
- Install supabase-js
- Create Supabase client helpers:

src/lib/supabase/client.ts  
src/lib/supabase/server.ts  

- Configure environment variables

## Task 3 — Database Schema
Create tables defined in ARCHITECTURE.md:

users  
accounts  
transactions  
categories  
insights  

Enable Row Level Security on all tables.

## Task 4 — Seed Data
Create seed endpoint:

POST /api/seed

Insert:
- 3 demo users
- 5 accounts
- 100 transactions
- realistic merchants and categories

## Task 5 — Authentication
Implement Supabase Auth.

Pages:
- /login
- /signup

Protect dashboard routes.

## Task 6 — Accounts Feature
Create accounts page:

/accounts

Features:
- list accounts
- show balances
- connect transactions to accounts

## Task 7 — Transactions Feature
Create transactions page:

/transactions

Features:
- transaction list
- search
- category filters
- date filters

## Task 8 — Insights Engine
Compute monthly insights:

- total income
- total expenses
- top category

Store results in insights table.

## Task 9 — Dashboard
Create dashboard page:

/dashboard

Include:
- account summary cards
- income vs expense chart
- spending by category chart
- recent transactions list

## Task 10 — UI Polish
Improve UI using Tailwind:

- responsive layout
- loading states
- empty states
- charts for insights

## Task 11 — Deployment Readiness
Verify:

- npm run build works
- environment variables configured
- project deploys to Vercel