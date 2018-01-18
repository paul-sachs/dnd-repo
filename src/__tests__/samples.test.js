import puppeteer from 'puppeteer';

const setup = async () => {
	return puppeteer.launch({ headless: false, devtools: true, args: ['--enable-logging=stderr', '--v=2'] });
};

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

let browser;

beforeAll(async () => { browser = await setup(); });

test('sample', async () => {
	const page = await browser.newPage();
	
	await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

	await page.waitFor(10000);
	const source = await page.$('#drag-source-yo1');
	const target = await page.$('#drop-target');
	
	await dragFromTo(source, target)(page);

	await page.waitFor(1000);
	const droppedItems = await page.$$('.copy-of-drag-source-yo1');
	expect(droppedItems).toHaveLength(1);
});

export const dragFromTo = (source, target) => async page => {
	//await page.evaluate('window.monitorEvents(window, "dragstart"); window.monitorEvents(window, "dragend");');
	await source.hover();
	const sourceBox = await source.boundingBox();
	if (!sourceBox) {
		throw new Error();
	}
	page.waitFor(1000);
	console.log(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
	await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
	await page.mouse.down();
	
	//await dest.hover();
	await page.waitFor(1000);
	
	const destBox = await target.boundingBox();
	
	if (!destBox) {
		throw new Error();
	}

	console.log(destBox.x + destBox.width / 2, destBox.y + destBox.height / 2);
	await target.hover();
	await page.mouse.move(destBox.x + destBox.width / 2 - 79, destBox.y + destBox.height / 2 - 400);
	await page.mouse.up();
};