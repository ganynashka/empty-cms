// @flow

declare module 'html-pdf' {
    declare type HtmlPdfConfigType = {
        format: 'A3' | 'A4' | 'A5' | 'Legal' | 'Letter' | 'Tabloid', // allowed units: A3, A4, A5, Legal, Letter, Tabloid
        orientation: 'portrait' | 'landscape', // portrait or landscape
        border: string, // default is 0, units: mm, cm, in, px, example - '0.2in'
        type: 'pdf' | 'png' | 'jpeg', // allowed file types: png, jpeg, pdf
        quality: '75' | '100', // only used for types png & jpeg
    };

    // eslint-disable-next-line id-match
    declare type HtmlPdfInstanceToStreamType = (error: Error | null, stream: stream$Readable | null) => mixed;

    declare type HtmlPdfInstanceType = {
        toStream: (streamProcessor: HtmlPdfInstanceToStreamType) => mixed,
    };

    declare type HtmlPdfType = {
        create: (html: string, config: HtmlPdfConfigType) => HtmlPdfInstanceType,
    };

    declare export default HtmlPdfType;
}
