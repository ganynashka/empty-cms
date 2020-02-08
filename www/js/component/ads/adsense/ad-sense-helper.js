// @flow

import {googleAdSenseId, isGoogleAdSenseInTestMode} from '../../../const';

export function getAdSenseAdsBlockHtml(adSlotId: number): string {
    // return '';

    return `
        <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        <ins
         class="adsbygoogle"
         style="display:block"
          data-ad-format="fluid"
           data-ad-layout-key="-fn+4o+1n-cz+i5"
             data-ad-client="${googleAdSenseId}"
             data-ad-slot="${adSlotId}"
            ></ins>
        <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
`;
}
