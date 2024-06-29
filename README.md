
# P2P Marketplace

Welcome to the P2P Marketplace, a platform enabling direct buying and selling between individuals without third-party involvement.

## Installation Guide

### Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/bibekoli/p2p-marketplace
```

### Install Dependencies

Navigate into the project directory and install necessary dependencies using npm:

```bash
cd p2p-marketplace
npm install
```

### Setup Environment Variables

Create a `.env.local` file in the root directory of the project and configure the following environment variables:

```plaintext
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

IMGBB_API_KEY=your_imgbb_api_key

MONGODB_NAME=your_database_name
MONGODB_URL=your_mongodb_connection_url

NEXT_PUBLIC_URL=your_public_url
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=your_nextauth_url
```

**Note:** Replace `your_google_client_id`, `your_google_client_secret`, `your_imgbb_api_key`, `your_database_name`, `your_mongodb_connection_url`, `your_public_url`, `your_nextauth_secret`, and `your_nextauth_url` with your actual values. 

Ensure `NEXT_PUBLIC_URL` and `NEXTAUTH_URL` are set according to your environment (e.g., `http://localhost:3000` for local development or `https://www.example.com` for production).
