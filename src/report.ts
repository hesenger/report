import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { readContent, parseXml } from './tools';

class Report {
    private file: string

    constructor(file: string) {
        this.file = file;
    }

    async parse(): Promise<object> {
        const content = await readContent(this.file);
        return await parseXml(content);
    }

    async getDefinition(): Promise<TDocumentDefinitions> {
        return {
            content: [
                {
                    table: {
                        body: [
                            ['col1', 'col2'],
                            ['col1', 'col2']
                        ]
                    }
                }
            ]
        };
    }

    async generate(stream: NodeJS.WritableStream) {
        const def = await this.getDefinition();

        const fonts = {
            Roboto: {
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
    }
}

export default Report;