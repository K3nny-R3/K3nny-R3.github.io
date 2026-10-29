import { getCollection } from 'astro:content';
import { Resvg, type ResvgRenderOptions } from '@resvg/resvg-js';
import type { APIRoute } from 'astro';
import satori from 'satori';
import { html as toReactElement } from 'satori-html';

const fontFile = await fetch('https://og-playground.vercel.app/inter-latin-ext-700-normal.woff');
const fontData: ArrayBuffer = await fontFile.arrayBuffer();

const height = 630;
const width = 1200;

const posts = await getCollection('blog');

export function getStaticPaths() {
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { title: post.data.title, description: post.data.description },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const title = props.title.trim() ?? 'Blogpost';
  const description = props.description ?? null;
  const html = toReactElement(`
  <div style="background-color: #101822; display: flex; flex-direction: column; height: 100%; padding: 3rem; width: 100%">
    <div style="display:flex; height: 100%; width: 100%; background-color: #1b2838; color: #c7d5e0; border: 6px solid #66c0f4; border-radius: 0.5rem; padding: 2rem;">
      <div style="display: flex; flex-direction: column; justify-content: space-between; width: 100%">
        <div style="display: flex; justify-content: space-between;">
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <p style="font-size: 40px; color: #66c0f4;">Steam Noticias</p>
            <p style="font-size: 44px; color: #ffffff;">${title}</p>
          </div>
        </div>
        <div style="display: flex;">
          <p style="font-size: 24px;">${description}</p>
        </div>
      </div>
    </div>
  </div>
  `);

  const svg = await satori(html, {
    fonts: [
      {
        name: 'Inter Latin',
        data: fontData,
        style: 'normal',
      },
    ],
    height,
    width,
  });

  const opts: ResvgRenderOptions = {
    fitTo: {
      mode: 'width', // If you need to change the size
      value: width,
    },
  };
  const resvg = new Resvg(svg, opts);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  const body = new Uint8Array(pngBuffer);

  return new Response(body, {
    headers: {
      'content-type': 'image/png',
    },
  });
};
