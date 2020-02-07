// @flow

import {googleAdSenseId, isGoogleAdSenseInTestMode} from '../../../const';

export function getAdSenseAdsBlockHtml(adSlotId: number): string {
    return `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<!-- bottom-ads -->
<ins class="adsbygoogle"
     style="display:inline-block;width:288px;height:258px"
     data-ad-client="ca-pub-8997870404482178"
     data-ad-slot="2979854461"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;
}
