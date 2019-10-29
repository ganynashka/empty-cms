// @flow

export function stringToIntNumber(likeNumberString: string): number | null {
    const intNumber = likeNumberString.replace(/\D+/, '');

    if (intNumber.length > 0) {
        return parseInt(intNumber, 10);
    }

    return null;
}
