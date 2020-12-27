import { rejects } from 'assert';
import Report from '../report';

test('should fail on file not exist', async () => {
    expect.assertions(1);
    return expect(new Report(__dirname + '/file-not-exist.xml').parse())
        .rejects
        .toMatch('no such file');
});

test('should return parsed definition as object', async () => {
    expect.assertions(1);
    return expect(new Report(__dirname + '/report.xml').parse())
        .resolves
        .toMatchObject({
            report: {
                $: { // attributes
                    id: 'test-report',
                    orientation: 'landscape'
                }
            }
        });
});