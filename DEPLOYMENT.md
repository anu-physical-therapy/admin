# Deployment Guide

## GitHub Pages Setup

This application is configured to deploy automatically to GitHub Pages using GitHub Actions.

### Prerequisites

1. Create a new GitHub repository for this admin site
2. Push this code to the repository
3. Enable GitHub Pages in your repository settings

### Setup Steps

1. **Create Repository**
   ```bash
   # Create a new repository on GitHub (e.g., "aine-admin" or "anu-admin")
   # Then push this code:
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Under "Source", select "GitHub Actions"
   - The workflow will automatically deploy when you push to the `main` branch

3. **Custom Domain (Optional)**
   - Edit the `CNAME` file to set your desired domain
   - Common options:
     - `admin.anuphysiotherapy.com`
     - `invoices.anuphysiotherapy.com`
     - `admin.anuphysio.com`
   - Configure DNS settings with your domain provider

### Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will:
- Trigger on pushes to the `main` branch
- Install Node.js dependencies
- Build the React application
- Deploy to GitHub Pages

### Manual Deployment

You can also trigger deployment manually:
- Go to Actions tab in your repository
- Select "Deploy to GitHub Pages" workflow
- Click "Run workflow"

### Local Testing

Before deploying, test the build locally:
```bash
npm run build
npm run preview
```

### Troubleshooting

- **Build fails**: Check the Actions tab for error details
- **Page not loading**: Ensure the base path is correct in `vite.config.js`
- **404 errors**: This is a single-page app, so all routes should serve `index.html` 