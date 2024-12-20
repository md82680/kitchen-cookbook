# Family Kitchen Cookbook

A modern, accessible recipe collection website specifically designed for families managing food allergies and dietary restrictions. This digital cookbook features gluten-free, nut-free, and egg-free recipes that have been tested and enjoyed by our family.

![Kitchen Cookbook Screenshot](public/images/kitchen.jpg)

## 🌟 Features

- **Allergy-Friendly Recipes**: All recipes are gluten-free, nut-free, and egg-free
- **Category Organization**: Browse recipes by:
  - Breakfast
  - Dinner
  - Appetizers/Snacks
  - Dessert
- **Interactive Recipe Cards**: 
  - Front: Image, title, and brief description
  - Back: Detailed ingredients and cooking instructions
- **Recipe Carousel**: Smooth browsing experience within each category
- **User Authentication**: Family members can log in to contribute recipes
- **Responsive Design**: Modern, clean interface that works on all devices

## 🛠 Technology Stack

- **Frontend**:
  - Next.js
  - SCSS Modules
  - TailwindCSS
  - React

- **Backend**:
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL Database

- **Authentication**:
  - NextAuth.js
  - Bcrypt for password hashing

- **Deployment**:
  - Vercel Platform

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:

git clone [repository-url]

2. Install dependencies:

npm install

3. Set up environment variables:

```env
POSTGRES_PRISMA_URL=your_database_url
POSTGRES_URL_NON_POOLING=your_non_pooling_url
NEXTAUTH_SECRET=your_secret
```

4. Run database migrations:

npx prisma migrate dev

5. Start the development server:

npm run dev

## 📁 Project Structure

```
├── pages/              # Next.js pages and API routes
├── components/         # React components
├── styles/            # SCSS modules and global styles
├── prisma/            # Database schema and migrations
├── public/            # Static assets
└── lib/              # Utility functions and configurations
```

## 🔐 Authentication

- Family members can register with a username and password
- Secure authentication using NextAuth.js
- Protected routes for adding new recipes
- Role-based access control (Admin/User)

## 🎨 Design Features

- Clean, modern interface
- Interactive flip cards for recipe details
- Responsive design for all screen sizes
- Category-based navigation
- Image-rich recipe presentations

## 🌐 Deployment

The application is deployed on Vercel and can be accessed at [your-url-here].

## 🤝 Contributing

This is a private family cookbook. Only invited family members can contribute recipes through the authenticated interface.

## 📝 License

Private - All Rights Reserved

## 🙏 Acknowledgments

- Family members who contributed their special recipes
- The allergy-aware cooking community

