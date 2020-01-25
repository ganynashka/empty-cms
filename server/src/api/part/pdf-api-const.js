// @flow

export const pdfApiImageToPdfReplaceImageSrc = '{{imageSrc}}';

export const pdfApiImageToPdfTemplate = `
    <style type="text/css">
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
            display: block;
            object-fit: contain;
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

    <img
        onload="(function (image) {
            const {naturalWidth, naturalHeight} = image;
            const style = document.querySelector('style');
            const positionType = naturalWidth > naturalHeight ? 'landscape' : 'portrait';

            style.innerText += '@page { size: ' + positionType + '; }';

            window.print();
        }(this))"
        src="${pdfApiImageToPdfReplaceImageSrc}"
    />
`;
