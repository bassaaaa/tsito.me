'use client';

import { useEffect } from 'react';

export default function CodeCopyButton() {
	useEffect(() => {
		const pres = document.querySelectorAll('.prose pre');

		pres.forEach((pre) => {
			if (pre.querySelector('.code-copy-btn')) return;

			const wrapper = document.createElement('div');
			wrapper.className = 'code-block-wrapper';

			pre.parentNode?.insertBefore(wrapper, pre);
			wrapper.appendChild(pre);

			const btn = document.createElement('button');
			btn.className = 'code-copy-btn';
			btn.setAttribute('aria-label', 'Copy code');
			btn.innerHTML = copySvg;

			btn.addEventListener('click', async () => {
				const code = pre.querySelector('code');
				const text = code?.textContent ?? '';
				await navigator.clipboard.writeText(text);

				btn.innerHTML = checkSvg;
				btn.classList.add('copied');
				setTimeout(() => {
					btn.innerHTML = copySvg;
					btn.classList.remove('copied');
				}, 2000);
			});

			wrapper.appendChild(btn);
		});
	}, []);

	return null;
}

const copySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;

const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
