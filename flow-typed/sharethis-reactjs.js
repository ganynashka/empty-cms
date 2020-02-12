// @flow

declare module 'sharethis-reactjs' {
    // eslint-disable-next-line id-match
    declare export var InlineShareButtons: React$ComponentType<{
        +config: {
            alignment: 'left' | 'center' | 'right', // alignment of buttons (left, center, right)
            color: 'social' | 'white', // set the color of buttons (social, white)
            enabled: boolean, // show/hide buttons (true, false)
            font_size: number, // font size for the buttons
            labels: null | 'cta' | 'counts', // button labels (cta, counts, null)
            language: 'en' | 'ru', // which language to use (see LANGUAGES)
            networks: Array<string>,
            padding: number, // padding within buttons (INTEGER)
            radius: number, // the corner radius on each button (INTEGER)
            show_total: boolean,
            size: number, // the size of each button (INTEGER)
        },
    }>;
}
