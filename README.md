# FamilyVoices AI

## Stripe setup

For each plan do the following:

1.  Create new product
2.  Set the price of the product to the wanted plan cost (per month)
3.  Create a new price for the product (per year) (optional)
4.  Create metadata for the product

    - `features` - array of strings which represent the features of the plan, this will be displayed as bullet points in the billing page

      - possible values: "Family Trivia Game", "Social sharing", "Import of GBED ancestry files", "Access to online genealogy research via Family Heritage"

    - `custom_cloned_voice_limit` - number of custom cloned voices the plan includes
    - `conversation_credit_limit` - number of conversation credits the plan includes (in seconds)
    - `interview_question_limit` - number of interview questions the plan includes

    - `custom_voice_topup_cost` - cost of an additional custom voice (if omitted, will not be possible to buy additional custom voices)
    - `custom_voice_topup_unit_amount` - amount of units in a single transaction of topping up custom voices
    - `conversation_credit_topup_cost` - cost of an additional conversation credit (if omitted, will not be possible to buy additional conversation credits)
    - `conversation_credit_topup_unit_amount` - amount of units in a single transaction of topping up conversation credits (in seconds)

    - `product_plan_invite_discounts`

      - discount for plans for invited family members
      - array of objects with the following properties:
        - product_id - id of the product to which the discount applies
        - discount_percentage - percentage of the discount

    - `referral_credits_earn_amount`

      - amount of conversation credits earned for each referral for both inviter and invitee
      - array of objects with the following properties:
        - product_id - id of the product to which the discount applies
        - conversation_credit_amount - amount of conversation credits earned for the inviter

    - `customer_features`
      - array of strings which represent the features of the plan, this will be displayed as bullet points in the billing page
      - the value is an array of strings

5.  Create a product which will be a free plan
    - This product will have the following metadata:
      - features - array of strings which represent the features of the plan, this will be displayed as bullet points in the billing page
      - chat_seconds_limit - number of chat seconds the plan includes
      - family_members_limit - number of family members the plan includes
    - Set the price of the free plan to 0 USD

# Event Photos App

A monorepo application for managing event photos with React frontend, Node.js backend, and database management.

## Architecture

This project uses pnpm workspaces to manage multiple packages:

- **`web/`** - React frontend application with Vite
- **`server/`** - Node.js backend API server
- **`db/`** - Database management, migrations, and type generation

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v10.11.0 or higher)

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Development

Start both frontend and backend in development mode:

```bash
pnpm dev
```

This will run:

- React dev server (typically on http://localhost:5173)
- Node.js server in watch mode

### Individual Package Commands

Run commands in specific workspaces:

```bash
# Frontend only
pnpm --filter web dev
pnpm --filter web build

# Backend only
pnpm --filter server dev
pnpm --filter server build

# Database operations
pnpm --filter db db:migrate:up
pnpm --filter db db:seed
pnpm --filter db db:types
```

### Build

Build all packages:

```bash
pnpm build
```

### Other Commands

```bash
# Run tests across all packages
pnpm test

# Lint all packages
pnpm lint

# Clean all build artifacts and node_modules
pnpm clean

# Install dependencies for all workspaces
pnpm install:all
```

## Workspace Structure

```
event-photos-app/
├── web/                 # React frontend
├── server/              # Node.js backend
├── db/                  # Database management
├── package.json         # Root workspace configuration
├── pnpm-workspace.yaml  # Workspace definition
└── README.md
```

## Docker Support

Each package includes Docker configuration for containerized deployment.

### Services

- **PostgreSQL** - Main database (port 5432)
- **LocalStack** - AWS S3 emulation for local development (port 4566)

### LocalStack S3 Setup

LocalStack provides a local AWS S3 emulation. After starting with `docker-compose up`, you can:

```bash
# Create a bucket (example)
aws --endpoint-url=http://localhost:4566 s3 mb s3://my-bucket

# List buckets
aws --endpoint-url=http://localhost:4566 s3 ls
```

## Database

The database package handles:

- Kysely migrations and queries
- Type generation for TypeScript
- Database seeding
- Schema management
