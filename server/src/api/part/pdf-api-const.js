// @flow

export const pdfApiImageToPdfReplaceImageSrc = '{{imageSrc}}';
export const pdfApiImageToPdfHeaderImageSrc = '{{header}}';

export const pdfApiImageToPdfTemplate = `
    <!doctype html>
    <html>
        <head>
            <style>
                html,
                head,
                body,
                img {
                    height: 100%;
                    margin: 0;
                    padding: 0;
                    width: 100%;
                }

                body {
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: contain;
                    min-height: 100%;
                    width: 100%;
                }

                img {
                    box-sizing: border-box;
                    display: block;
                    max-height: 100%;
                    width: 100%;
                }

                h1 {
                    display: block;
                    font-family: 'Lucida Console', Monaco, monospace;
                    font-size: 10px;
                    margin: 0;
                    padding: 0;
                    text-align: center;
                    text-transform: capitalize;
                }

            </style>
        </head>
        <body style="background-image: url('${pdfApiImageToPdfReplaceImageSrc}')">
            <h1>${pdfApiImageToPdfHeaderImageSrc}</h1>
        </body>
    </html>
`;
