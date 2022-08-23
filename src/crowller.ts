import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import cheerio from 'cheerio';

interface TitleInfo {
	title: string;
	href: string;
}

interface CourseResult {
	time: number;
	data: TitleInfo[];
}

interface Content {
	[propName: number]: TitleInfo[];
}

class Crowller {
	private url = 'https://www.nba.com';

	constructor() {
		this.initSpiderProcess();
	}
	async initSpiderProcess() {
		const filePath = path.resolve(__dirname, '../data/info.json');
		const html = await this.getRawHtml();
		const crowllerInfos = this.getCourseInfo(html);
		const writeInfos = this.generateJsonContent(crowllerInfos);
		fs.writeFileSync(filePath, JSON.stringify(writeInfos));
	}
	async getRawHtml() {
		const result = await superagent.get(this.url);
		return result.text;
	}
	getCourseInfo(html: string) {
		const $ = cheerio.load(html);
		const title = $('.youtube');
		const titleInfos: TitleInfo[] = [];
		title.map((index, element) => {
			const title = element.attribs.title;
			const href = element.attribs.href;
			titleInfos.push({ title, href });
		});
		return {
			time: new Date().getTime(),
			data: titleInfos,
		};
	}
	generateJsonContent(crowllerInfo: CourseResult) {
		const filePath = path.resolve(__dirname, '../data/info.json');
		let fileContent: Content = {};
		if (fs.existsSync(filePath)) {
			fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
		}
		fileContent[crowllerInfo.time] = crowllerInfo.data;
		return fileContent;
	}
}

const crowller = new Crowller();
