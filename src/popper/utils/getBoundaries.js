import getScrollParent from './getScrollParent';
import getParentNode from './getParentNode';
import findCommonOffsetParent from './findCommonOffsetParent';
import getOffsetRectRelativeToArbitraryNode from './getOffsetRectRelativeToArbitraryNode';
import getViewportOffsetRectRelativeToArtbitraryNode from './getViewportOffsetRectRelativeToArtbitraryNode';
import getWindowSizes from './getWindowSizes';
import isFixed from './isFixed';

/**
 * Computed the boundaries limits and return them
 * @method
 * @memberof Popper.Utils
 * @param {Object} data - Object containing the property "offsets" generated by `_getOffsets`
 * @param {Number} padding - Boundaries padding
 * @param {Element} boundariesElement - Element used to define the boundaries
 * @returns {Object} Coordinates of the boundaries
 */
export default function getBoundaries(popper, reference, padding, boundariesElement) {
    // NOTE: 1 DOM access here
    let boundaries = { top: 0, left: 0 };
    const offsetParent = findCommonOffsetParent(popper, reference);

    // Handle viewport case
    if (boundariesElement === 'viewport') {
        boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent);
    }
    // Handle other cases based on DOM element used as boundaries
    else {
        let boundariesNode;
        if (boundariesElement === 'scrollParent') {
            boundariesNode = getScrollParent(getParentNode(popper));
            if (boundariesNode.nodeName === 'BODY') {
                boundariesNode = window.document.documentElement;
            }
        } else if (boundariesElement === 'window') {
            boundariesNode = window.document.documentElement;
        } else {
            boundariesNode = boundariesElement;
        }

        // In case of HTML, we need a different computation
        if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
            const { height, width } = getWindowSizes();
            boundaries.right = width;
            boundaries.bottom = height;

            const offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent);

            boundaries.top += offsets.top;
            boundaries.bottom += offsets.top;
            boundaries.left += offsets.left;
            boundaries.right += offsets.left;
        }
        // for all the other DOM elements, this one is good
        else {
            boundaries = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent);
        }
    }

    // Add paddings
    boundaries.left += padding;
    boundaries.top += padding;
    boundaries.right -= padding;
    boundaries.bottom -= padding;

    return boundaries;
}
