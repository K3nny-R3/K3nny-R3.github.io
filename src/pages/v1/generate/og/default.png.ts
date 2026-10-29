import { Resvg, type ResvgRenderOptions } from '@resvg/resvg-js';
import type { APIRoute } from 'astro';
import satori from 'satori';
import { html as toReactElement } from 'satori-html';

const fontFile = await fetch('https://og-playground.vercel.app/inter-latin-ext-700-normal.woff');

const fontData: ArrayBuffer = await fontFile.arrayBuffer();

const height = 630;
const width = 1200;

export const GET: APIRoute = async () => {
  const link = 'Steam Noticias';
  const html = toReactElement(`
  <div style="background-color: #101822; display: flex; flex-direction: column; height: 100%; padding: 3rem; width: 100%">
    <div style="display:flex; height: 100%; width: 100%; background-color: #1b2838; color: #c7d5e0; border: 6px solid #66c0f4; border-radius: 0.5rem; padding: 2rem;">
      <div style="display: flex; flex-direction: column; justify-content: space-between; width: 100%">
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">  
          <p style="font-size: 56px; color: #66c0f4;">Steam Noticias</p>
          <p style="font-size: 38px;">Las últimas noticias de Steam y Valve</p>
          <p style="font-size: 38px;">Hardware, SteamOS, eventos y más</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; padding-top: -2rem;">
          <p style="font-size: 32px">${link}</p>
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
      mode: 'width',
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
