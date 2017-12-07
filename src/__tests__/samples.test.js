import puppeteer from 'puppeteer';

const setup = async () => {
	return puppeteer.launch({ headless: false, devtools: true, args: ['--enable-logging=stderr', '--v=1'] });
};

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

let browser;

beforeAll(async () => { browser = await setup(); });

test.only('sample', async () => {
	const page = await browser.newPage();
	
	await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });

	//await page.waitFor(20000);
	const source = await page.$('#drag-source-yo1');
	const target = await page.$('#drop-target');
	
	await source.hover();
	await page.mouse.down();

	await target.hover();
	await page.mouse.up();
	await page.waitFor(1000);
	const droppedItems = await page.$$('.copy-of-drag-source-yo1');
	expect(droppedItems).toHaveLength(1);
});
