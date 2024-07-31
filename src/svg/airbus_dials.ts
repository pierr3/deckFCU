export const GenericSvgDial = `<svg width="100%" height="100%" viewBox="0 0 200 100" version="1.1"
    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
    xml:space="preserve" xmlns:serif="http://www.serif.com/"
    style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
    <g id="spd" transform="matrix(1,0,0,1,-5.24295,-5.55525)" visibility="{{show_type_one}}">
        <g transform="matrix(16,0,0,16,46.0256,23.7058)">
        </g>
        <text x="16px" y="30px" style="font-family:'B612Mono-Bold', 'B612 Mono', monospace;font-weight:700;font-size:22px;fill:{{font_color}};">{{value_type_one}}</text>
    </g>
    <g id="mach" transform="matrix(1,0,0,1,31.36,-5.55525)" visibility="{{show_type_two}}">
        <g transform="matrix(16,0,0,16,56.4256,23.7058)">
        </g>
        <text x="16px" y="30px" style="font-family:'B612Mono-Bold', 'B612 Mono', monospace;font-weight:700;font-size:18px;fill:{{font_color}};">{{value_type_two}}</text>
    </g>
    <g id="inactive_dash" transform="matrix(1,0,0,1,9.53468,49.8578)" visibility="{{show_inactive}}">
        <g transform="matrix(72,0,0,72,140.498,23.7058)">
        </g>
        <text x="14.826px" y="28.706px" style="font-family:'Digital-7 Mono';font-size:58px;fill:{{font_color}};">- - -</text>
    </g>
    <g id="inactive_circle" transform="matrix(0.986505,0,0,0.986505,3.25936,-0.177673)" visibility="{{show_dot}}">
        <circle cx="167.618" cy="58.864" r="12.671" style="fill:{{font_color}};stroke:black;stroke-opacity:0;stroke-width:1.01px;"/>
    </g>
    <g id="active_speed" transform="matrix(1,0,0,1,22.3739,49.8578)" visibility="{{show_main_value}}">
        <g transform="matrix(72,0,0,72,128.717,23.7058)">
        </g>
        <text x="14.826px" y="28.706px" style="font-family:'Digital-7 Mono';font-size:58px;fill:{{font_color}};">{{main_value}}</text>
    </g>
</svg>`;

export const AirbusAltDial = `<svg width="100%" height="100%" viewBox="0 0 200 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
    <g id="mach" transform="matrix(1,0,0,1,63.9476,-3.58582)">
        <g transform="matrix(22,0,0,22,57.7256,23.7058)">
        </g>
        <text x="14.826px" y="23.706px" style="font-family:'B612Mono-Bold', 'B612 Mono', monospace;font-weight:700;font-size:22px;fill:rgb(209, 183, 77);">ALT</text>
    </g>
    <g id="mach1" serif:id="mach" transform="matrix(1,0,0,1,135.164,-3.58582)">
        <g transform="matrix(22,0,0,22,72.0256,23.7058)">
        </g>
        <text x="14.826px" y="23.706px" style="font-family:'B612Mono-Bold', 'B612 Mono', monospace;font-weight:700;font-size:22px;fill:rgb(209, 183, 77);">LVL/</text>
    </g>
    <g id="inactive_circle" transform="matrix(0.986505,0,0,0.986505,19.2595,6.50245)" visibility="{{show_dot}}">
        <circle cx="167.618" cy="50.864" r="12.671" style="fill:rgb(209, 183, 77);stroke:black;stroke-opacity:0;stroke-width:1.01px;"/>
    </g>
    <g id="active_speed" transform="matrix(1,0,0,1,-8.41529,51.8215)">
        <g transform="matrix(58,0,0,58,179.335,23.7058)">
        </g>
        <text x="14.826px" y="23.706px" style="font-family:'Digital-7 Mono';font-size:58px;fill:rgb(209, 183, 77);">{{main_value}}</text>
    </g>
    <g transform="matrix(1,0,0,6.29319,0,-183.838)">
        <rect x="124.039" y="31.715" width="3.016" height="3.016" style="fill:rgb(209, 183, 77);"/>
    </g>
    <g transform="matrix(6.12323e-17,-1,6.29319,3.85346e-16,-75.2798,143)">
        <rect x="124.039" y="31.715" width="3.016" height="3.016" style="fill:rgb(209, 183, 77);"/>
    </g>
    <g transform="matrix(6.12323e-17,-1,8.52354,5.21916e-16,-146.303,142.824)">
        <rect x="124.039" y="31.715" width="3.016" height="3.016" style="fill:rgb(209, 183, 77);"/>
    </g>
</svg>
`;

export const AirbusVsDial = `
<svg width="100%" height="100%" viewBox="0 0 200 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <g id="mach" transform="matrix(1,0,0,1,63.9476,-3.58582)">
        <g transform="matrix(22,0,0,22,57.7256,23.7058)">
        </g>
        <text x="14.826px" y="23.706px" style="font-family:'B612Mono-Bold', 'B612 Mono', monospace;font-weight:700;font-size:22px;fill:rgb(209, 183, 77);">V/S</text>
    </g>
    <g id="mach1" serif:id="mach" transform="matrix(1,0,0,1,-21.4066,-3.58582)">
        <g transform="matrix(22,0,0,22,57.7256,23.7058)">
        </g>
        <text x="14.826px" y="23.706px" style="font-family:'B612Mono-Bold', 'B612 Mono', monospace;font-weight:700;font-size:22px;fill:rgb(209, 183, 77);">/CH</text>
    </g>
    <g id="active_speed" transform="matrix(1,0,0,1,-8.41529,51.8215)">
        <g transform="matrix(58,0,0,58,179.335,23.7058)">
        </g>
        <text x="14.826px" y="23.706px" style="font-family:'Digital-7 Mono';font-size:58px;fill:rgb(234,205,91);">{{main_value}}</text>
    </g>
    <g transform="matrix(-1,0,0,1,188.506,0)">
        <g transform="matrix(1,0,0,6.29319,0,-183.838)">
            <rect x="124.039" y="31.715" width="3.016" height="3.016" style="fill:rgb(209, 183, 77);"/>
        </g>
        <g transform="matrix(6.12323e-17,-1,8.52354,5.21916e-16,-146.303,142.824)">
            <rect x="124.039" y="31.715" width="3.016" height="3.016" style="fill:rgb(209, 183, 77);"/>
        </g>
    </g>
</svg>`;
