import PdfPrinter from 'pdfmake';
import { Content, ContextPageSize, Margins, PageSize, TDocumentDefinitions } from 'pdfmake/interfaces';
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
                widths: detail.row[0].$$.map(() => '*'),
                body: new Array(),
            },

            layout: 'noBorders'
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
            detail.row.forEach((row: any) => {
                const vals = new Array();
                row.$$.forEach((col: any) => {
                    const attrs = col.$;
                    const val = attrs.field ? obj[attrs.field] : attrs.text;
                    vals.push(val || '');
                });

                content.table.body.push(vals);
            });
        });

        return content;
    }

    async generate(stream: NodeJS.WritableStream, parameters?: any[]): Promise<boolean> {
        const rpt = (await this.parse()).report;
        const def = {
            pageSize: 'A4' as PageSize,
            pageOrientation: rpt.$.orientation || 'portrait',
            pageMargins: [30, 80, 30, 30] as Margins,
            content: new Array(),
            defaultStyle: {
                font: 'Helvetica',
                fontSize: 10
            },

            header: function(currentPage: number, pageCount: number, pageSize: ContextPageSize): Content {          
                return [{ 
                    text: 'simple text', 
                    alignment: (currentPage % 2) ? 'left' : 'right' ,
                    margin: 30
                }];
              }
        };

        for (const dt of rpt.detail) {
            const data = this.driver
                ? await this.driver.load(dt, parameters)
                : [{}];

            def.content.push(this.tableFromDetail(dt, data));
        }

        const fonts = {
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