# Database Schema

Tables:

users
id
email
created_at

accounts
id
user_id
name
balance

transactions
id
user_id
merchant
amount
category
date
description

categories
id
name

insights
id
user_id
type
content
created_at