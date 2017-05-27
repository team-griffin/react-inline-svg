import React from 'react';
import { lifecycle, withState, compose, withProps } from 'recompose';
import axios from 'axios';

const fetchSVGContent = (src) => axios.get(src);

export default compose(
  withState(
    'rawSrc',
    'setRawSrc',
    null,
  ),
  lifecycle({
    componentDidMount: function() {
      fetchSVGContent(this.props.src).then((response) => this.props.setRawSrc(response.data));
    },

    componentWillReceiveProps: function(nextProps) {
      if(nextProps.src !== this.props.src) {
        fetchSVGContent(nextProps.src).then((response) => nextProps.setRawSrc(response.data));
      }
    },
  }),
  withProps((ownerProps) => ({
    src: ownerProps.rawSrc,
  })),
);
