import xml2js from 'xml2js';
import fs from 'fs';

/**
 * Simple wrapper to allow async when reading files.
 * @param file the path to file
 */
function readContent(file: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err: any, data: string) => {
            return err ? reject(err + '') : resolve(data);
        });
    });
}

/**
 * Utility method to wrap XML parser with Promise to allow async work!
 * This method is intended to maintain some level segregation from XML
 * parser library.
 * @param content XML definition to be parsed
 */
function parseXml(content: string): Promise<object> {
    const parser = new xml2js.Parser({
        explicitChildren: true,
        preserveChildrenOrder: true
    });

    return new Promise<object>((resolve, reject) => {
        parser.parseString(content, (err: any, result: object) => {
            return err ? reject(err + '') : resolve(result);
        })
    });
}

export { readContent, parseXml };