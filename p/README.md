# Aanya Rao Atelier — portfolio site

Files: index.html · style.css · script.js · api/chat.js

## 1. Live form submission (Web3Forms, free)
1. Go to https://web3forms.com, enter your client's email and get an Access Key.
2. In script.js set:  WEB3FORMS_KEY:'your-key-here'
3. Every appointment request is now emailed to that address. Includes a spam honeypot.

## 2. AI chat bot
The bot calls /api/chat, a serverless function, so the AI key is never exposed in the browser.
1. Push this folder to GitHub and import it into Vercel (vercel.com, free plan).
2. In Vercel → Project → Settings → Environment Variables add:
   ANTHROPIC_API_KEY = your key from https://console.anthropic.com
3. Redeploy. The bot now answers with AI.
Edit the SYSTEM text in api/chat.js to change what the bot knows (prices, hours, policies).

Until the API is deployed (or when opening index.html locally) the bot falls back to built-in FAQ answers.

## Replace sample content
Name, address, email, prices in the bot's FAQ and the lookbook items are placeholders.
