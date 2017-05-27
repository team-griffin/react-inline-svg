import React from 'react';
import { string, bool } from 'prop-types';
import {
  switchSVGAttrToReactProp,
  getSVGFromSource,
  extractSVGProps,
  stripSVG
} from './util';
import {
  compose,
  mapProps,
  withProps,
  setDisplayName,
  defaultProps,
  setPropTypes
} from 'recompose';
import { ifElse, propEq } from 'ramda';
import template from 'lodash.template';

export const PureInlineSVG = ({
  Element,
  __html,
  ...rest
}) => (
  <Element
    {...rest}
    src={null}
    children={null}
    dangerouslySetInnerHTML={{ __html }}
  />
);

export const enhance = compose(
  setDisplayName('InlineSVG'),
  defaultProps({
    element: 'i',
    raw: false,
    src: ''
  }),
  setPropTypes({
    src: string.isRequired,
    element: string,
    raw: bool
  }),
  withProps((ownerProps) => ({
    src: template(
      ownerProps.src,
      { variable: 'd' },
    )(ownerProps),
  })),
  mapProps(ifElse(
    propEq('raw', true),
    ({ src }) => ({
      Element: 'svg',
      __html: getSVGFromSource(src).innerHTML,
      ...extractSVGProps(src),
    }),
    ({ element, src }) => ({
      Element: element,
      __html: src,
    })
  )),
);

export default enhance(PureInlineSVG);
