#!/usr/bin/env node
/**
 * Submit sitemap and individual URLs to Google Search Console / Indexing API.
 *
 * Usage:
 *   node scripts/submit-to-google.mjs                    # submit sitemap
 *   node scripts/submit-to-google.mjs --urls             # submit all article URLs via Indexing API
 *   node scripts/submit-to-google.mjs --url=/articles/x  # submit single URL
 */
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KEY_FILE = path.resolve(__dirname, '..', 'google-service-account.json');
const SITE_URL = 'https://starkami.com';
const SITEMAP_URL = `${SITE_URL}/sitemap-index.xml`;

const args = process.argv.slice(2);
const submitUrls = args.includes('--urls');
const singleUrl = args.find(a => a.startsWith('--url='))?.split('=')[1];

async function getAuthClient(scopes) {
  const keyData = JSON.parse(fs.readFileSync(KEY_FILE, 'utf8'));
  const auth = new google.auth.JWT({
    email: keyData.client_email,
    key: keyData.private_key,
    scopes,
  });
  await auth.authorize();
  return auth;
}

async function submitSitemap() {
  console.log('Submitting sitemap to Google Search Console...');
  const auth = await getAuthClient(['https://www.googleapis.com/auth/webmasters']);
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  try {
    const sites = await searchconsole.sites.list();
    console.log('Verified sites:', sites.data.siteEntry?.map(s => s.siteUrl) || 'none');

    const siteEntry = sites.data.siteEntry?.find(s =>
      s.siteUrl === SITE_URL || s.siteUrl === `sc-domain:starkami.com`
    );

    if (!siteEntry) {
      console.log(`\nSite ${SITE_URL} not found in Search Console.`);
      console.log('Attempting to add site...');
      try {
        await searchconsole.sites.add({ siteUrl: `sc-domain:starkami.com` });
        console.log('Added sc-domain:starkami.com to Search Console!');
      } catch (addErr) {
        console.log(`Could not add site: ${addErr.message}`);
        console.log('\nYou need to manually:');
        console.log('1. Go to https://search.google.com/search-console');
        console.log('2. Add property "starkami.com" (domain)');
        console.log('3. Verify via DNS TXT record');
        console.log(`4. Add ${JSON.parse(fs.readFileSync(KEY_FILE, 'utf8')).client_email} as owner`);
        return;
      }
    }

    const webmasters = google.webmasters({ version: 'v3', auth });
    await webmasters.sitemaps.submit({
      siteUrl: siteEntry.siteUrl,
      feedpath: SITEMAP_URL,
    });
    console.log(`Sitemap submitted: ${SITEMAP_URL}`);

    const sitemaps = await webmasters.sitemaps.list({ siteUrl: siteEntry.siteUrl });
    console.log('\nExisting sitemaps:');
    sitemaps.data.sitemap?.forEach(s => {
      console.log(`  ${s.path} - ${s.lastSubmitted || 'never'} (${s.contents?.[0]?.submitted || 0} URLs)`);
    });
  } catch (err) {
    console.error('Error:', err.message);
    if (err.code === 403) {
      const keyData = JSON.parse(fs.readFileSync(KEY_FILE, 'utf8'));
      console.log('\nPermission denied. Add this service account as owner in Search Console:');
      console.log(`  ${keyData.client_email}`);
    }
  }
}

async function submitIndexingUrls(urls) {
  console.log(`Submitting ${urls.length} URLs to Google Indexing API...`);
  const auth = await getAuthClient(['https://www.googleapis.com/auth/indexing']);
  const indexing = google.indexing({ version: 'v3', auth });

  let success = 0;
  let failed = 0;

  for (const url of urls) {
    try {
      await indexing.urlNotifications.publish({
        requestBody: { url, type: 'URL_UPDATED' },
      });
      console.log(`  OK ${url}`);
      success++;
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.log(`  FAIL ${url} - ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone: ${success} succeeded, ${failed} failed`);
}

function getAllArticleUrls() {
  const articlesDir = path.resolve(__dirname, '..', 'src', 'pages', 'articles');
  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.astro'));
  const urls = files.map(f => `${SITE_URL}/articles/${f.replace('.astro', '')}`);

  urls.unshift(
    `${SITE_URL}/`,
    `${SITE_URL}/articles`,
    `${SITE_URL}/tools`,
    `${SITE_URL}/tools/chart-calculator`,
    `${SITE_URL}/tools/compatibility`,
    `${SITE_URL}/tools/star-lookup`,
    `${SITE_URL}/tools/decade-year`,
    `${SITE_URL}/about`,
    `${SITE_URL}/booking`,
  );
  return urls;
}

async function verifySite() {
  console.log('Attempting to verify starkami.com via Site Verification API...');
  const auth = await getAuthClient(['https://www.googleapis.com/auth/siteverification']);
  const siteVerification = google.siteVerification({ version: 'v1', auth });

  try {
    const tokenRes = await siteVerification.webResource.getToken({
      requestBody: {
        site: { type: 'INET_DOMAIN', identifier: 'starkami.com' },
        verificationMethod: 'DNS_TXT',
      },
    });
    console.log('Verification token:', tokenRes.data.token);

    const verifyRes = await siteVerification.webResource.insert({
      verificationMethod: 'DNS_TXT',
      requestBody: {
        site: { type: 'INET_DOMAIN', identifier: 'starkami.com' },
      },
    });
    console.log('Site verified:', verifyRes.data);
  } catch (err) {
    console.error('Verification error:', err.message);
    if (err.errors) console.error('Details:', JSON.stringify(err.errors, null, 2));
  }
}

if (args.includes('--verify')) {
  await verifySite();
} else if (singleUrl) {
  const fullUrl = singleUrl.startsWith('http') ? singleUrl : `${SITE_URL}${singleUrl}`;
  await submitIndexingUrls([fullUrl]);
} else if (submitUrls) {
  const urls = getAllArticleUrls();
  console.log(`Found ${urls.length} URLs to submit\n`);
  await submitIndexingUrls(urls);
} else {
  await submitSitemap();
}
