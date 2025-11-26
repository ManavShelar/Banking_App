This is a banking system I built using React for the frontend and Node.js with MongoDB for the backend. The app has two types of users—customers and bankers. Customers can log in, check their balance, deposit or withdraw money, and view all their transactions. Bankers have their own login where they can see every customer’s account and their transaction history. I followed the MVC pattern and used token-based authentication to keep everything secure. The whole project is deployed on Render.

- Features
-  Customer
    - Login using username/email and password
    - View balance
    - Deposit money 
    - Withdraw money (with insufficient balance check)
    - View transaction history

- Banker
    - Login
    - View all customer accounts
    - View a customer’s full transaction history

- Tech Stack
    - Frontend
      - React (Vite)
      - React Router
      - TailwindCSS
    - Backend
      - Node.js
      - Express
      - MongoDB

- Deployment
    - Render (Frontend + Backend)

- Link - https://banking-app-2-0bb6.onrender.com/
