import fs from 'fs';
import cheerio from 'cheerio';
import { Analyzer } from './crowller';

interface TitleInfo {
	title: string;
	href: string;
}

interface Result {
	time: number;
	data: TitleInfo[];
}

interface Content {
	[propName: number]: TitleInfo[];
}

export default class NbaAnalyer implements Analyzer {
	private getInfo(html: string) {
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
	generateJsonContent(crowllerInfo: Result, filePath: string) {
		let fileContent: Content = {};
		if (fs.existsSync(filePath)) {
			fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
		}
		fileContent[crowllerInfo.time] = crowllerInfo.data;
		return fileContent;
	}
	analyze(html: string, filePath: string) {
		const crowllerInfos = this.getInfo(html);
		const writeInfos = this.generateJsonContent(crowllerInfos, filePath);
		return JSON.stringify(writeInfos);
	}
}
