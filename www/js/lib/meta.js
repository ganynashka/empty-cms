// @flow

/* global document */

type SetMetaInputType = {|
    +title: string,
    // +description: string,
|};

export function setMeta(metaData: SetMetaInputType) {
    const {head} = document;

    if (!head) {
        return;
    }

    const title = head.querySelector('title');
    const description = head.querySelector('meta[name="description"]');

    if (!title || !description) {
        return;
    }

    title.innerHTML = metaData.title;
    // description.setAttribute('content', metaData.description);
}
