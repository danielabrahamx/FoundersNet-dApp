# Netlify Deployment Guide for FoundersNet

## 📋 Prerequisites

Before deploying, ensure you have:
- [ ] A Netlify account (free tier works perfectly)
- [ ] Your project pushed to GitHub/GitLab/Bitbucket
- [ ] Your Solana program deployed and the Program ID ready
- [ ] Your admin wallet address

---

## 🚀 Deployment Methods

### Method 1: Netlify Dashboard (Recommended)

1. **Go to [https://app.netlify.com/](https://app.netlify.com/)**

2. **Click "Add new site" → "Import an existing project"**

3. **Connect your Git repository**
   - Choose GitHub, GitLab, or Bitbucket
   - Authorize Netlify to access your repository
   - Select your FoundersNet repository

4. **Configure build settings** (should auto-detect from `netlify.toml`):
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`

5. **Add environment variables**:
   - Click "Show advanced" → "New variable"
   - Add the following:
     ```
     VITE_SOLANA_NETWORK=devnet (or mainnet-beta)
     VITE_PROGRAM_ID=<your-solana-program-id>
     VITE_ADMIN_WALLET=<your-admin-wallet-address>
     ```

6. **Click "Deploy site"**
   - Netlify will build and deploy your site
   - You'll get a random URL like `random-name-12345.netlify.app`

7. **Configure custom domain** (optional):
   - Go to "Site settings" → "Domain management"
   - Add your custom domain
   - Update DNS records as instructed

---

### Method 2: Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Navigate to your project root (not client directory)
cd /path/to/FoundersNet-Sol

# Initialize Netlify site
netlify init

# Follow the prompts:
# - Create & configure a new site
# - Build command: npm run build
# - Publish directory: client/dist
# - Base directory: client

# Set environment variables
netlify env:set VITE_SOLANA_NETWORK devnet
netlify env:set VITE_PROGRAM_ID your-program-id-here
netlify env:set VITE_ADMIN_WALLET your-admin-wallet-here

# Deploy to production
netlify deploy --prod
```

---

### Method 3: Drag & Drop (One-time Deploy)

```bash
# Build locally
cd client
npm install
npm run build

# Go to https://app.netlify.com/drop
# Drag the 'dist' folder to the drop zone
```

⚠️ **Note**: This method doesn't support continuous deployment or environment variables easily.

---

## 🔐 Environment Variables Setup

In Netlify Dashboard:

1. Go to **Site settings** → **Environment variables**
2. Click **Add a variable**
3. Add each variable:

| Variable Name | Example Value | Description |
|---------------|---------------|-------------|
| `VITE_SOLANA_NETWORK` | `devnet` or `mainnet-beta` | Solana network to connect to |
| `VITE_PROGRAM_ID` | `EEZJxm2YmPHxH2VfqPXaS2k3qSmRhvKHEFMxjbzNxNfQ` | Your deployed Solana program address |
| `VITE_ADMIN_WALLET` | `78BDAjB4oTdjS4S734Ge2sRWWnHGDDJmPigbp27bSQ7g` | Admin wallet for creating/resolving markets |

---

## ✅ Post-Deployment Checklist

After deployment:

- [ ] Visit your Netlify URL and verify the site loads
- [ ] Test wallet connection (Phantom/Solflare)
- [ ] Verify markets are loading from the blockchain
- [ ] Test placing a bet (use devnet first!)
- [ ] Check admin functions work (if you're the admin)
- [ ] Test all routes (/, /markets, /portfolio, /admin)
- [ ] Check browser console for errors
- [ ] Test on mobile devices

---

## 🔄 Continuous Deployment

Once connected to Git, Netlify will automatically:
- **Build and deploy** on every push to main branch
- **Create preview deployments** for pull requests
- **Notify you** of build failures

To configure:
1. Go to **Site settings** → **Build & deploy**
2. Set **Branch deploys**: `main` (or your preferred branch)
3. Enable **Deploy previews** for pull requests

---

## 🐛 Troubleshooting

### Build Fails

**Error: "Command failed: npm run build"**
- Check that `client/package.json` has the build script
- Verify Node version (Netlify uses Node 18 by default)
- Check build logs for specific errors

**Error: "Module not found"**
- Run `npm install` in the `client` directory
- Make sure `package-lock.json` is committed

### Site Loads But Doesn't Work

**Wallet won't connect**
- Check environment variables are set correctly
- Verify `VITE_SOLANA_NETWORK` matches your program deployment

**Markets don't load**
- Verify `VITE_PROGRAM_ID` is correct
- Check browser console for RPC errors
- Ensure your Solana program is deployed to the correct network

**Routes show 404**
- Verify `_redirects` file is in `client/public/`
- Check Netlify's redirect rules in dashboard

---

## 🎯 Custom Domain Setup

1. **Purchase a domain** (from Namecheap, GoDaddy, etc.)

2. **In Netlify**:
   - Go to **Site settings** → **Domain management**
   - Click **Add custom domain**
   - Enter your domain (e.g., `foundersnet.app`)

3. **Update DNS records** at your domain registrar:

   For apex domain (`foundersnet.app`):
   ```
   A record: @ → 75.2.60.5
   ```

   For www subdomain:
   ```
   CNAME: www → your-site.netlify.app
   ```

4. **Enable HTTPS** (automatic via Let's Encrypt)
   - Netlify auto-provisions SSL certificates
   - Forces HTTPS redirects

---

## 🔍 Monitoring & Analytics

### Netlify Analytics (Paid)
- **Site settings** → **Analytics** → Enable

### Google Analytics (Free)
Add to `client/index.html` in `<head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 📊 Build Optimization

The `netlify.toml` file already includes optimizations:
- ✅ CSS/JS minification
- ✅ Image compression
- ✅ Asset bundling

To further optimize:

### 1. Enable Build Plugins
In Netlify Dashboard: **Plugins** → Install:
- **Lighthouse** - Performance audits
- **Next SEO** - SEO checks
- **Checkly** - Uptime monitoring

### 2. Optimize Images
Use WebP format for images:
```bash
npm install --save-dev @netlify/plugin-image-optimizer
```

Update `netlify.toml`:
```toml
[[plugins]]
  package = "@netlify/plugin-image-optimizer"
```

---

## 🛡️ Security Best Practices

### Environment Variables
- ✅ Never commit `.env` files to Git
- ✅ Use Netlify's environment variable UI
- ✅ Separate dev/prod variables using different Netlify sites

### Admin Wallet
- ✅ Use hardware wallet (Ledger) for admin functions
- ✅ Never paste private keys in environment variables
- ✅ Only use public wallet address in `VITE_ADMIN_WALLET`

### HTTPS
- ✅ Enabled by default on Netlify
- ✅ Forces SSL redirect
- ✅ HTTP Strict Transport Security (HSTS) enabled

---

## 📞 Need Help?

- **Netlify Docs**: https://docs.netlify.com/
- **Netlify Community**: https://answers.netlify.com/
- **Solana Discord**: https://discord.gg/solana

---

## 🎉 You're Live!

Once deployed, share your site:
- **Production URL**: `https://your-site.netlify.app`
- **Custom Domain**: `https://foundersnet.app` (if configured)

Happy deploying! 🚀
