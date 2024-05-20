# m3u8 NodeJS Proxy

Some places block Cloudflare IPs, so I forked the m3u8 Cloudflare worker proxy. This runs using NodeJS and Express rather than Cloudflare workers. 

### Install Method 1:
```bash
git clone https://github.com/joshholly/m3u8Proxy.git m3u8proxy
cd m3u8proxy
npm run start
```

### Install Method 2: 

Deploy with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/joshholly/m3u8Proxy)


Then use NGINX to reverse proxy to your domain from localhost:3000 

### Example:
```js
const url = 'https://example.url.example/?url=Link.m3u8&origin=url.example'

// If either your url or link has parameter's, encode via encodeURIComponent(link)
const encodedUrl = `https://m3u8.proxy.example/
?url=${encodeURIComponent("https://thisdomain.works/file.m3u8")}
&referer=${encodeURIComponent("https://thisdomain.works")}
&origin=${encodeURIComponent("https://thisdomain.works")}
`
```

