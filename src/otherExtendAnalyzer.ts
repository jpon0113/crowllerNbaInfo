import { Analyzer } from './crowller';

export default class OtherAnalyzer implements Analyzer {
	public analyze(html: string, filePath: string) {
		return html;
	}
}
