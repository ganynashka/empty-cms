// @flow

import {googleAdSenseId, isGoogleAdSenseInTestMode} from '../../../const';

export function getAdSenseAdsBlockHtml(adSlotId: number): string {
    // return '';

    return `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<!-- bottom-ads -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="${googleAdSenseId}"
     data-ad-slot="${adSlotId}"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;
}
