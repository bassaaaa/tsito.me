import ogs from 'open-graph-scraper';

export type OgpData = {
	url: string;
	title: string;
	description: string;
	image: string | null;
	siteName: string;
};

export async function fetchOgp(url: string): Promise<OgpData> {
	const hostname = new URL(url).hostname;
	try {
		const { result } = await ogs({ url });
		return {
			url,
			title: result.ogTitle || url,
			description: result.ogDescription || '',
			image: result.ogImage?.[0]?.url || null,
			siteName: result.ogSiteName || hostname,
		};
	} catch {
		return {
			url,
			title: url,
			description: '',
			image: null,
			siteName: hostname,
		};
	}
}
