# DawaiSetu (Medicine Bridge) 💊🌉

DawaiSetu is a comprehensive **MedCycle Medicine Platform** designed to streamline and manage the lifecycle, distribution, and analytics of medicines. Built with modern web technologies, it provides a robust interface for administrators and recipients alike, ensuring efficient medicine management.

## ✨ Features

- **Admin Dashboard**: Manage inventory, track transfers, and oversee operations.
- **Recipient Analytics**: Detailed insights and visualizations for medicine recipients.
- **Secure Authentication**: Built-in authentication using JWT (`jose`) and secure password hashing (`bcryptjs`).
- **Responsive UI**: A highly responsive, accessible, and beautifully designed user interface.
- **Data Visualizations**: Interactive charts and graphs powered by Recharts.
- **Database Management**: Robust database schema and migrations managed via Prisma ORM.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Charts**: [Recharts](https://recharts.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Make sure you have Node.js and npm (or yarn/pnpm/bun) installed on your machine.

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repo-url>
   cd dawaisetu
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory based on `.env.example` and add your environment variables (Database URL, Secret Keys, etc.).
   ```bash
   cp .env.example .env
   ```

4. **Database Setup**:
   Push the schema to your database and run the seed script to populate initial data.
   ```bash
   npm run db:reset
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📜 Available Scripts

In the project directory, you can run the following commands:

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to catch linting errors.
- `npm run db:push`: Pushes the Prisma schema state to the database.
- `npm run db:seed`: Seeds the database with initial test data.
- `npm run db:reset`: Resets the database and runs the seed script.
- `npm run prisma:studio`: Opens Prisma Studio to view and edit database records visually.

## 🤝 Contributors

We welcome contributions! A huge thanks to the following people who have contributed to DawaiSetu:

| Contributor | GitHub Profile | Role / Contribution |
| :--- | :--- | :--- |
| **Devansh Mishra** | [@dvm-sh](https://github.com/dvm-sh) | Project Lead / Developer |
| **Vaibhav Goel** | [@ArthurNoob69](https://github.com/ArthurNoob69) | UI/UX & Frontend |
| **Vaibhav Goel** | [@ArthurNoob69](https://github.com/ArthurNoob69) | Backend & Database |

*(Want to be on this list? Check out our [Contributing Guidelines](CONTRIBUTING.md) and submit a pull request!)*

---
*Built with ❤️ for a better healthcare future.*
