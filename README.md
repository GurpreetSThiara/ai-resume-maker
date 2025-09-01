# AI-Powered Resume Builder

<div align="center">
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#development">Development</a> •
    <a href="#contributing">Contributing</a> •
    <a href="#license">License</a>
  </p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
</div>

## 🚀 Features

- **AI-Powered Resume Building** - Create professional, ATS-optimized resumes with AI assistance
- **Multiple Templates** - Choose from various modern and professional resume templates
- **Real-time Preview** - See changes instantly as you build your resume
- **Export Options** - Download your resume in PDF or DOCX format
- **Cover Letter Generator** - Create matching cover letters for your applications
- **Cloud Storage** - Save and manage multiple resume versions securely
- **Mobile-Friendly** - Fully responsive design works on all devices
- **Dark Mode** - Built-in dark theme for comfortable viewing

## 🛠 Tech Stack

- **Frontend**: Next.js 13+ (App Router), React 18+
- **Styling**: Tailwind CSS, Radix UI
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Document Generation**: docx, PDFKit
- **Form Handling**: React Hook Form, Zod
- **State Management**: React Context, React Query
- **Deployment**: Vercel (Recommended)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account (for authentication and database)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/resume-builder-next.git
   cd resume-builder-next
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add the following variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 📦 Project Structure

```
.
├── app/                    # App router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── create/            # Resume creation flow
│   └── ...
├── components/            # Reusable UI components
│   ├── auth/              # Auth components
│   ├── cover-letters/     # Cover letter components
│   ├── resumes/           # Resume components
│   └── ui/                # Base UI components
├── lib/                   # Utility functions
│   ├── docx-generators/   # DOCX generation logic
│   ├── pdf-generators/    # PDF generation logic
│   └── supabase/          # Supabase client
└── public/                # Static assets
```

## 🔧 Development

### Available Scripts

- `dev` - Start development server
- `build` - Build for production
- `start` - Start production server
- `lint` - Run ESLint
- `format` - Format code with Prettier

### Code Style

- We use ESLint and Prettier for code formatting
- Follow the Airbnb JavaScript Style Guide
- Use TypeScript for type safety
- Write meaningful commit messages

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Supabase](https://supabase.com/) - Open Source Firebase Alternative
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components

---

<div align="center">
  Made with ❤️ and Next.js
</div>
