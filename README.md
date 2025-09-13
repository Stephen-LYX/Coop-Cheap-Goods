# capstone-project

Senior Capstone Project. Making an online marketplace for communities. Rain or snow ruining your yard sale? Fear not, take it online.

# Coop-Cheap-Goods  

A cooperative web application designed to help users find, share, and manage affordable goods within their community. Built with **Next.js (React + Node.js)** and powered by **Supabase** for authentication, database, and backend services.  

---

## Tech Stack  
- **Frontend Framework:** [Next.js](https://nextjs.org/) (React + Node.js)  
- **Backend Services:** [Supabase](https://supabase.com/)  
- **Deployment Platform:** [Vercel](https://vercel.com/)  
- **CI/CD Pipeline:** GitHub Actions  

---

## Getting Started  

### Prerequisites  
Before running the project, ensure you have the following installed:  
- [Node.js](https://nodejs.org/) (v18 or later recommended)  
- [npm](https://www.npmjs.com/) (comes with Node.js)  

### Installation & Setup  
1. Clone the repository:  
   ```bash
   git clone https://github.com/your-username/coop-cheap-goods.git
   cd coop-cheap-goods

2. Install dependencies:
   ```bash
   npm install

3. In the root directory, create a .env.local file and paste your Supabase credentials:
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

4. Run the development server:
   npm run dev

5. Open http://localhost:3000 in your browser to view the app.
   (by default it will redirect you to http://localhost:3000/login) 
