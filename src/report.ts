import { readContent, parseXml } from './tools';

class Report {
    file: string

    constructor(file: string) {
        this.file = file;
    }

    async parse(): Promise<object> {
        const content = await readContent(this.file);
        return await parseXml(content);
    }
}

export default Report;