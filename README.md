# Trusted Cleaners Association (TCA) Website

A professional Next.js website for the Trusted Cleaners Association, designed to establish credibility for professional cleaners through memberships, awards, and training programs.

## 🚀 Features

- **Public Pages**: Home, About, Membership, Training, Awards, Contact
- **Secure Dashboard**: Logo upload, business link submission, TCA seal download, training library access
- **Stripe Integration**: Membership signup, award nomination fees, training subscriptions
- **Award System**: Google review score integration & public winners page
- **Training Materials**: Videos & PDFs with member-only access
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Static Export**: Optimized for AWS S3 + CloudFront deployment

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Authentication**: Supabase (planned)
- **Payments**: Stripe (planned)
- **Database**: Supabase (planned)
- **File Storage**: Supabase Storage (planned)
- **Deployment**: Static export to AWS S3 + CloudFront

## 📁 Project Structure

```
TCA/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Header.tsx      # Navigation header
│   └── Footer.tsx      # Site footer
├── pages/              # Next.js pages
│   ├── index.tsx       # Home page
│   ├── about.tsx       # About page
│   ├── membership.tsx  # Membership plans
│   ├── login.tsx       # Authentication
│   ├── dashboard.tsx   # Member dashboard
│   ├── training.tsx    # Training library
│   ├── awards.tsx      # Awards & nominations
│   └── contact.tsx     # Contact form
├── styles/             # Global styles
│   └── globals.css     # Tailwind + custom CSS
├── package.json        # Dependencies
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TCA
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Build & Deployment

### Development Build
```bash
npm run build
npm start
```

### Static Export (for AWS S3)
```bash
npm run export
```
This creates a `out/` directory with static files ready for S3 deployment.

### Production Deployment

1. **Build and export**
   ```bash
   npm run export
   ```

2. **Upload to AWS S3**
   ```bash
   aws s3 sync out/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront** (optional)
   - Set up CloudFront distribution pointing to S3 bucket
   - Configure custom domain and SSL certificate

## 🎨 Customization

### Brand Colors
Update colors in `tailwind.config.js`:
```javascript
colors: {
  primary: '#1E88E5',      // Main brand blue
  secondary: '#43A047',    // Accent green
  'primary-dark': '#1565C0',
  'secondary-dark': '#2E7D32',
}
```

### Content Updates
- **Home page**: Edit `pages/index.tsx` for hero text and featured members
- **Membership**: Modify pricing tiers in `pages/membership.tsx`
- **Training**: Update course content in `pages/training.tsx`
- **Awards**: Edit categories and winners in `pages/awards.tsx`

## 🔧 Configuration

### Environment Variables
Create `.env.local` for development:
```bash
# Supabase (when implementing auth)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe (when implementing payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
```

### Next.js Configuration
Modify `next.config.js` for different export options:
```javascript
const nextConfig = {
  output: 'export',        // Static export
  trailingSlash: true,     // S3-friendly URLs
  images: {
    unoptimized: true      // Required for static export
  }
}
```

## 📱 Responsive Design

The website is built with a mobile-first approach:
- **Mobile**: Single column layout, collapsible navigation
- **Tablet**: Two-column grid layouts
- **Desktop**: Full multi-column layouts with enhanced navigation

## 🔒 Security Features

- Form validation and sanitization
- Secure authentication (when implemented)
- Protected member-only routes
- Secure file upload handling

## 🚀 Performance Optimizations

- Static site generation
- Optimized images and assets
- Lazy loading for components
- Minimal JavaScript bundle
- CDN-ready static assets

## 📊 Analytics & SEO

- Meta tags for all pages
- Structured data markup
- SEO-friendly URLs
- Performance monitoring ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software for the Trusted Cleaners Association.

## 🆘 Support

For technical support or questions:
- Email: info@trustedcleaners.org
- Phone: (555) 123-4567
- Office: 123 Cleaning Ave, Suite 100, Professional City, PC 12345

## 🔮 Future Enhancements

- **Phase 2**: Supabase authentication and database
- **Phase 3**: Stripe payment integration
- **Phase 4**: Google Places API integration
- **Phase 5**: Advanced training platform
- **Phase 6**: Member directory and networking features

---

**Built with ❤️ for the Trusted Cleaners Association**
