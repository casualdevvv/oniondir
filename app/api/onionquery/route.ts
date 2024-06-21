import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import cheerio from 'cheerio';

export async function POST(request: NextRequest) {
  if (request.method !== 'POST') return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });

  const body = await request.json();
  const searchKeywords = body.search;

  if (!searchKeywords) {
    return NextResponse.json({ error: 'No search keywords provided' }, { status: 400 });
  }

  try {
    const formData = new URLSearchParams();
    formData.append('query', searchKeywords);

    const response = await fetch('https://traxoniondirectory.vercel.app/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-GB,en;q=0.9,en-US;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Referer': 'https://touched-easily-louse.ngrok-free.app/',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36 Edg/126.0.0.0',
      },
      body: formData,
    });

    const html = await response.text();

    const $ = cheerio.load(html);
    const links: { link: string; title: string }[] = [];
    $('a').each((i, link) => {
      const href = $(link).attr('href');
      const title = $(link).text().trim(); // Remove leading/trailing whitespace
      if (href) {
        links.push({ link: href, title: title });
      }
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
