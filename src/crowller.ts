import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import NbaAnalyzer from './nbaAnalyzer';

export interface Analyzer {
	analyze: (html: string, filePath: string) => string;
}

class Crowller {
	// 寫入 target
	private filePath = path.resolve(__dirname, '../data/info.json');

	constructor(private url: string, private analyzer: Analyzer) {
		this.initSpiderProcess();
	}
	async initSpiderProcess() {
		const html = await this.getRawHtml();
		const writeInfos = this.analyzer.analyze(html, this.filePath);
		this.writeFile(writeInfos);
	}
	async getRawHtml() {
		const result = await superagent.get(this.url);
		return result.text;
	}
	writeFile(content: string) {
		fs.writeFileSync(this.filePath, content);
	}
}
// 爬蟲 source
const url = 'https://www.nba.com';

const analyzer = new NbaAnalyzer();
new Crowller(url, analyzer);
