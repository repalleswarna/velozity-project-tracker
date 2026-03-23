# Deployment Guide

## Vercel Deployment (Recommended)

### Quick Deploy

1. Push your code to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. Go to [Vercel](https://vercel.com) and sign in

3. Click "New Project" and import your GitHub repository

4. Vercel will auto-detect the Vite configuration

5. Click "Deploy"

### Manual Configuration (if needed)

If auto-detection doesn't work, use these settings:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Environment Variables

No environment variables are required for this project.

## Other Deployment Options

### Netlify

1. Push to GitHub
2. Connect repository to Netlify
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

### GitHub Pages

1. Install gh-pages:

```bash
npm install -D gh-pages
```

2. Add to package.json:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://<username>.github.io/<repo-name>"
}
```

3. Update vite.config.ts:

```typescript
export default defineConfig({
  base: "/<repo-name>/",
  plugins: [react(), tailwindcss()],
});
```

4. Deploy:

```bash
npm run deploy
```

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Build and run:

```bash
docker build -t project-management-ui .
docker run -p 8080:80 project-management-ui
```

## Performance Optimization

### Pre-deployment Checklist

- [x] TypeScript strict mode enabled
- [x] No console.logs in production code
- [x] Components memoized with React.memo
- [x] Expensive computations wrapped in useMemo
- [x] Event handlers wrapped in useCallback
- [x] Virtual scrolling for large lists
- [x] Code splitting via dynamic imports (if needed)

### Expected Lighthouse Scores

- **Performance**: 85-95
- **Accessibility**: 90-100
- **Best Practices**: 90-100
- **SEO**: 90-100

### Build Optimization

The production build includes:

- Tree shaking (removes unused code)
- Minification (reduces file size)
- Code splitting (loads code on demand)
- Asset optimization (compresses images/CSS)

### Monitoring

After deployment, monitor:

- Page load time
- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)

Use tools like:

- Google Lighthouse
- WebPageTest
- Chrome DevTools Performance tab

## Troubleshooting

### Build Fails

1. Clear node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

2. Check Node version (requires Node 18+):

```bash
node --version
```

### Styles Not Loading

1. Verify Tailwind CSS is installed:

```bash
npm list tailwindcss @tailwindcss/vite
```

2. Check vite.config.ts includes the Tailwind plugin

3. Verify index.css has `@import "tailwindcss";`

### URL Routing Issues

If direct URLs don't work after deployment, ensure your hosting platform is configured for SPA routing:

- **Vercel**: Handled automatically
- **Netlify**: Add `_redirects` file with `/* /index.html 200`
- **Nginx**: Use `try_files $uri $uri/ /index.html;`

## Post-Deployment

1. Test all three views (Kanban, List, Timeline)
2. Verify filters work and sync to URL
3. Test drag and drop functionality
4. Check virtual scrolling performance
5. Verify collaboration simulation
6. Test on mobile devices
7. Run Lighthouse audit
8. Check browser console for errors

## Support

For issues or questions:

- Check the main README.md
- Review component documentation
- Check browser console for errors
- Verify all dependencies are installed
