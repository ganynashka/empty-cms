// @flow

import {googleAdSenseId, isGoogleAdSenseInTestMode} from '../../../const';

export function getAdSenseAdsBlockHtml(adSlotId: number): string {
    return `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        <!-- bottom-ads -->
        <ins
            class="adsbygoogle"
            style="display:inline-block;width:288px;height:258px"
            data-ad-client="${googleAdSenseId}"
            data-ad-slot="${adSlotId}"
            ${isGoogleAdSenseInTestMode ? 'data-adtest="on"' : ''}
        ></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>`;
}
