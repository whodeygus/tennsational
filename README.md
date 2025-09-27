# TENNsational Restaurant Directory

Your trusted guide to authentic local flavors and hidden gems across East Tennessee.

## 🍽️ About

TENNsational is a comprehensive restaurant directory covering 6 counties in East Tennessee:
- **Jefferson County** (25 restaurants)
- **Knox County** (40 restaurants) 
- **Sevier County** (35 restaurants)
- **Blount County** (20 restaurants)
- **Hamblen County** (15 restaurants)
- **Cocke County** (15 restaurants)

**Total: 150+ restaurants with 103,696+ reviews**

## 🚀 Deployment Instructions for GitHub + Render

### Step 1: Update Your GitHub Repository

1. **Backup your current repository** (optional but recommended)
2. **Delete all existing files** in your GitHub repository
3. **Upload all files from this folder** to your GitHub repository:
   - Drag and drop all files and folders from this directory
   - Or use Git commands if you're comfortable with them

### Step 2: Configure Render Deployment

1. **Go to your Render dashboard** (render.com)
2. **Find your existing TENNsational service**
3. **Verify these settings:**
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Node Version:** 18 or higher

### Step 3: Deploy

1. **Trigger a new deployment** in Render
2. **Wait for build to complete** (usually 2-3 minutes)
3. **Your site will be live** at www.tennsational.com

## 📁 Project Structure

```
tennsational/
├── src/
│   ├── components/          # React components
│   │   ├── HomePage.jsx     # Homepage component
│   │   ├── RestaurantsPage.jsx  # Restaurant listings
│   │   ├── AboutPage.jsx    # About page
│   │   └── Header.jsx       # Navigation header
│   ├── data/
│   │   ├── restaurants.js   # Restaurant data functions
│   │   └── allRestaurants.json  # 150 real restaurants
│   ├── App.jsx             # Main app component
│   ├── App.css             # Styles
│   └── main.jsx            # App entry point
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
├── vite.config.js         # Build configuration
├── render.yaml            # Render deployment config
└── README.md              # This file
```

## 🛠️ Local Development (Optional)

If you want to run the site locally for testing:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## ✨ Features

- **Responsive Design** - Works on desktop and mobile
- **Search Functionality** - Find restaurants by name, location, or cuisine
- **County Filtering** - Filter restaurants by county
- **Cuisine Filtering** - Filter by cuisine type
- **Rich Restaurant Data** - Addresses, phones, websites, hours, amenities
- **Real Reviews** - Authentic review counts and ratings

## 🔧 Technical Details

- **Framework:** React 19 with Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **UI Components:** Radix UI + shadcn/ui
- **Icons:** Lucide React

## 📞 Support

If you encounter any issues during deployment:
1. Check that all files were uploaded to GitHub
2. Verify Render build settings match the instructions above
3. Check the Render build logs for any error messages
4. Ensure your custom domain (www.tennsational.com) is properly configured in Render

## 🎯 What's Fixed

This version resolves:
- ✅ Blank page issues when clicking "Restaurants" or "Explore Restaurants"
- ✅ Missing restaurant data (now includes all 150 real restaurants)
- ✅ Broken navigation and routing
- ✅ API connectivity issues
- ✅ Mobile responsiveness problems 

Your restaurant directory is now fully functional and ready for your community!
Updated 8/31/2025
