import PdfPrinter from 'pdfmake';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { readContent, parseXml } from './tools';

interface DataDriver {
    load(detail: any, parameters: any[]): Promise<any[]>;
}

class Report {
    private file: string;
    private driver: DataDriver;

    constructor(file: string, driver?: DataDriver) {
        this.file = file;
        this.driver = driver;
    }

    async parse(): Promise<any> {
        const content = await readContent(this.file);
        return await parseXml(content);
    }

    tableFromDetail(detail: any, data: any[]): Content {
        const content = {
            table: {
                headerRows: detail.row.length,
                body: new Array()
            }
        };

        // headers
        detail.row.forEach((row: any) => {
            const vals = new Array();
            row.$$.forEach((col: any) => {
                const attrs = col.$;
                vals.push(attrs.header || attrs.text || attrs.field);
            });

            content.table.body.push(vals);
        });

        // data
        data.forEach((obj: any) => {

        });

        console.log(content.table.body)
        return content;
    }

    async generate(stream: NodeJS.WritableStream, parameters?: any[]): Promise<boolean> {
        const rpt = (await this.parse()).report;
        const def = { content: new Array() };

        for (let i = 0; i < rpt.detail.length; i++) {
            const dt = rpt.detail[i];
            const data = this.driver
                ? await this.driver.load(dt, parameters)
                : [{}];

            def.content.push(this.tableFromDetail(dt, data));
        }

        const fonts = {
            Roboto: {
                normal: 'Helvetica',
                bold: 'Helvetica-Bold',
                italics: 'Helvetica-Oblique',
                bolditalics: 'Helvetica-BoldOblique'
            },
            Helvetica: {
                normal: 'Helvetica',
                bold: 'Helvetica-Bold',
                italics: 'Helvetica-Oblique',
                bolditalics: 'Helvetica-BoldOblique'
            }
        };

        const printer = new PdfPrinter(fonts);
        const pdf = printer.createPdfKitDocument(def);
        pdf.pipe(stream);
        pdf.end();

        return true;
    }
}

export default Report;