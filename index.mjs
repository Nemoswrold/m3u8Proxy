import express from 'express';
import fetch from 'node-fetch';
const port = process.env.PORT || 3000;

const app = express();

app.get('/', async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const refererUrl = decodeURIComponent(url.searchParams.get("referer") || "");
    const targetUrl = decodeURIComponent(url.searchParams.get("url") || "");
    const originUrl = decodeURIComponent(url.searchParams.get("origin") || "");
    const proxyAll = decodeURIComponent(url.searchParams.get("all") || "");

    if (!targetUrl) {
      return res.status(400).send("Invalid URL");
    }

    const response = await fetch(targetUrl, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Referer": refererUrl || "",
        "Origin": originUrl || "",
      },
      redirect: 'follow'
    });

    let modifiedM3u8;
    if (targetUrl.includes(".m3u8")) {
      const text = await response.text();
      const targetUrlTrimmed = `${encodeURIComponent(
        targetUrl.replace(/([^/]+\.m3u8)$/, "").trim()
      )}`;
      const encodedUrl = encodeURIComponent(refererUrl);
      const encodedOrigin = encodeURIComponent(originUrl);
      modifiedM3u8 = text.split("\n").map((line) => {
        if (line.startsWith("#") || line.trim() === '') {
          return line;

          //If ?all=yes is passed, proxy all requests by prepending all target URLs
        } else if (proxyAll === 'yes' && (line.startsWith('http') || line.startsWith('https'))) {
          return `${url.origin}?url=${line}`;
        }
        return `?url=${targetUrlTrimmed}${line}${originUrl ? `&origin=${encodedOrigin}` : ""
        }${refererUrl ? `&referer=${encodedUrl}` : ""
          }`;
      }).join("\n");
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", response.headers.get("Content-Type") || "application/vnd.apple.mpegurl");
    res.status(response.status).send(modifiedM3u8 || Buffer.from(await response.arrayBuffer()));
  } catch (e) {
    console.error('Error processing request:', e);
    res.status(500).send(e.message);
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
