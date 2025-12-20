// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightOpenAPI, { openAPISidebarGroups } from 'starlight-openapi';
import starlightLlmsTxt from 'starlight-llms-txt';

export default defineConfig({
	site: 'https://docs.visionfusen.org',
	integrations: [
		starlight({
			title: 'VisionFusen Docs',
			description: 'Universal Content Signing mit NIP-94 auf Nostr',
			lastUpdated: true,
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/visionfusen' },
			],
			defaultLocale: 'root',
			locales: {
				root: { label: 'Deutsch', lang: 'de' },
			},
			plugins: [
				starlightOpenAPI([
					{
						base: 'api',
						label: 'API Reference',
						schema: './src/schemas/visionfusen-api.yaml',
					},
				]),
				starlightLlmsTxt({
					projectName: 'VisionFusen API',
					description: 'Kryptografische Urheberschaftsnachweise für Bilder mit NIP-94 auf Nostr',
				}),
			],
			sidebar: [
				{
					label: 'Erste Schritte',
					items: [
						{ label: 'Einführung', slug: 'guides/introduction' },
						{ label: 'Schnellstart', slug: 'guides/quickstart' },
					],
				},
				{
					label: 'Konzepte',
					items: [
						{ label: 'Übersicht', slug: 'concepts/overview' },
						{ label: 'NIP-94', slug: 'concepts/nip94' },
						{ label: 'Hash & Signatur', slug: 'concepts/hash-signature' },
						{ label: 'XMP Metadaten', slug: 'concepts/xmp-metadata' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'Bild signieren', slug: 'guides/sign-image' },
						{ label: 'Signatur verifizieren', slug: 'guides/verify-signature' },
						{ label: 'Badge einbinden', slug: 'guides/embed-badge' },
						{ label: 'Auto-Sign Script', slug: 'guides/auto-sign' },
					],
				},
				{
					label: 'Referenz',
					items: [
						{ label: 'VF-1064 Spec', slug: 'reference/vf-1064' },
					],
				},
				...openAPISidebarGroups,
			],
		}),
	],
});
