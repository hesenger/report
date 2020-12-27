import { parseXml, readContent } from '../tools';

test('should fail on file not exist', () => {
    expect.assertions(1);
    return expect(readContent(__dirname + '/file-not-exist.xml'))
        .rejects
        .toMatch('no such file');
});

test('should return content from file', () => {
    expect.assertions(1);
    return expect(readContent(__dirname + '/report.xml'))
        .resolves
        .toMatch('report');
});

test('should fail on invalid xml', () => {
    expect.assertions(1);
    return expect(parseXml('<tag></no-close-tag>'))
        .rejects
        .toMatch('Unexpected close tag');
});

test('should return content from file', () => {
    expect.assertions(1);
    return expect(parseXml('<report><detail><sql>SELECT 1</sql></detail></report>'))
        .resolves
        .toMatchObject({ report: { detail: [{ sql: ['SELECT 1'] }] } });
});